"""The core Planner -> Research -> Market -> Valuation -> Memo pipeline, shared
by every entry point that can trigger an analysis (the /analyze HTTP route,
the /tools/analyze webhook the ElevenLabs voice agent calls, etc.).
"""

import asyncio

import httpx

from .agents.market_data_agent import MarketDataAgent
from .agents.memo_agent import InvestmentMemoAgent
from .agents.planner import PlannerAgent
from .agents.research_agent import ResearchAgent
from .agents.valuation_agent import ValuationAgent
from .config import Settings
from .integrations.alpha_vantage_client import AlphaVantageClient
from .integrations.braintrust_client import BraintrustClient
from .integrations.daytona_client import DaytonaSandboxClient
from .integrations.fireworks_client import FireworksClient
from .integrations.firecrawl_client import FirecrawlClient
from .integrations.polygon_client import PolygonClient
from .integrations.sec_edgar_client import SecEdgarClient
from .memory import format_for_prompt, recall_context, remember_analysis, remember_turn
from .models.schemas import AnalysisRequest, FilingExcerpt, InvestmentMemo, MarketSnapshot, ValuationResult


def _safe_error_summary(exc: Exception) -> str:
    """A short, diagnosable error description safe to put in an HTTP response.

    The raw exception text from an httpx error embeds the full request URL —
    and Alpha Vantage and Polygon both authenticate via an `apikey`/`apiKey`
    query parameter, so `str(exc)` would leak the key straight into the
    memo's data_gaps. This reports the host and status/error class instead,
    which is enough to diagnose "wrong key" vs "rate limited" vs "network
    error" without ever touching the query string.
    """
    if isinstance(exc, httpx.HTTPStatusError):
        return f"HTTP {exc.response.status_code} from {exc.request.url.host}"
    if isinstance(exc, httpx.RequestError):
        host = exc.request.url.host if exc.request is not None else "the data source"
        return f"{exc.__class__.__name__} contacting {host}"
    # ValueErrors raised by our own clients carry the response body, not the
    # request URL, so they're already safe to surface as-is.
    return str(exc)


async def run_analysis(request: AnalysisRequest, settings: Settings) -> InvestmentMemo:
    """Run the pipeline for a request, tracing every step to Braintrust.

    Research pulls real 10-K/10-Q filings from SEC EDGAR, Market pulls a real
    price/market-cap/news snapshot from Polygon, and Valuation runs a real DCF
    (inside Daytona) on fundamentals pulled from Alpha Vantage, when a ticker
    is given. The Risk agent isn't wired to a live data source yet.
    """
    braintrust = BraintrustClient(api_key=settings.braintrust_api_key, project=settings.braintrust_project)
    trace_id = braintrust.start_trace("analyze")

    try:
        ctx = await recall_context(request.query, request.session_id, request.user_id)
        context_block = format_for_prompt(ctx)
        braintrust.log_span(
            trace_id,
            name="memory_recall",
            input={"query": request.query, "session_id": request.session_id, "user_id": request.user_id},
            output={
                "turns_recalled": len(ctx["turns"]),
                "memories_recalled": [m["text"][:160] for m in ctx["memories"]],
            },
        )

        fireworks = FireworksClient(api_key=settings.fireworks_api_key, model=settings.fireworks_model)

        planner = PlannerAgent(fireworks)
        plan = await planner.run(request.query, context=context_block)
        braintrust.log_span(trace_id, name="planner", input={"query": request.query}, output=plan)

        # An explicit ticker from the caller always wins; otherwise fall back to
        # what the planner resolved from the question text (and conversation
        # context) so "optional" ticker actually means optional, not "skipped".
        resolved_ticker = request.ticker or plan["ticker"]

        filings: list[FilingExcerpt] = []
        market: MarketSnapshot | None = None
        valuation: ValuationResult | None = None
        web_research: list[dict[str, str]] = []
        research_error: str | None = None
        market_error: str | None = None
        valuation_error: str | None = None
        if resolved_ticker:
            # Kicked off now, awaited later — runs concurrently with
            # research/market/valuation below rather than waiting on any of
            # them. Every request with a ticker gets this, not just ones
            # where EDGAR/Polygon/Alpha Vantage come back empty, so the memo
            # agent always has some current web context to draw on for
            # whatever ends up missing.
            firecrawl_task = asyncio.create_task(
                FirecrawlClient(
                    api_key=settings.firecrawl_api_key, api_url=settings.firecrawl_api_url
                ).search_company(resolved_ticker, request.query)
            )

            research = ResearchAgent(SecEdgarClient(user_agent=settings.sec_edgar_user_agent))
            try:
                filings = await research.run(resolved_ticker)
            except httpx.HTTPError as exc:
                # A SEC EDGAR outage or a missing/rejected User-Agent shouldn't
                # crash the whole request — degrade like market/valuation do.
                research_error = _safe_error_summary(exc)
                braintrust.log_span(
                    trace_id, name="research", input={"ticker": resolved_ticker}, output={"error": research_error}
                )
            else:
                braintrust.log_span(
                    trace_id,
                    name="research",
                    input={"ticker": resolved_ticker},
                    output={"filing_types": [f.filing_type for f in filings]},
                )

            market_agent = MarketDataAgent(PolygonClient(api_key=settings.polygon_api_key))
            try:
                market = await market_agent.run(resolved_ticker)
            except (httpx.HTTPError, ValueError) as exc:
                market_error = _safe_error_summary(exc)
                braintrust.log_span(
                    trace_id, name="market", input={"ticker": resolved_ticker}, output={"error": market_error}
                )
            else:
                braintrust.log_span(
                    trace_id, name="market", input={"ticker": resolved_ticker}, output=market.model_dump()
                )

            valuation_agent = ValuationAgent(
                AlphaVantageClient(api_key=settings.alpha_vantage_api_key),
                DaytonaSandboxClient(api_key=settings.daytona_api_key),
            )
            try:
                valuation = await valuation_agent.run(resolved_ticker)
            except (httpx.HTTPError, ValueError, RuntimeError) as exc:
                # Data source unavailable/rate-limited/unknown ticker — proceed without it.
                valuation_error = _safe_error_summary(exc)
                braintrust.log_span(
                    trace_id, name="valuation", input={"ticker": resolved_ticker}, output={"error": valuation_error}
                )
            else:
                braintrust.log_span(
                    trace_id, name="valuation", input={"ticker": resolved_ticker}, output=valuation.model_dump()
                )

            try:
                web_research = await firecrawl_task
            except Exception as exc:  # noqa: BLE001 - Firecrawl must never itself take the request down
                braintrust.log_span(
                    trace_id, name="web_research", input={"ticker": resolved_ticker}, output={"error": str(exc)}
                )
            else:
                braintrust.log_span(
                    trace_id,
                    name="web_research",
                    input={"ticker": resolved_ticker},
                    output={"sources": [item["url"] for item in web_research]},
                )

        ticker = resolved_ticker or request.company_name or request.query
        memo_agent = InvestmentMemoAgent(fireworks)
        memo = await memo_agent.run(
            ticker=ticker,
            filings=filings,
            market=market,
            valuation=valuation,
            context=context_block,
            research_error=research_error,
            market_error=market_error,
            valuation_error=valuation_error,
            web_research=web_research,
        )
        # Attach the raw structured data the memo was written from, so a
        # caller can render real numbers/a real chart instead of only the
        # LLM's prose summary of them.
        memo = memo.model_copy(update={"market": market, "valuation": valuation})
        braintrust.log_span(trace_id, name="memo", input={"ticker": ticker}, output=memo.model_dump())

        braintrust.score(trace_id, confidence=memo.confidence_pct / 100)

        # Writes happen after the response is built, so a slow Atlas write
        # never sits between the caller's question and Morgan's answer.
        asyncio.create_task(_persist_memory(request, memo))
        return memo
    except Exception:
        braintrust.score(trace_id, confidence=0.0)
        raise


async def _persist_memory(request: AnalysisRequest, memo: InvestmentMemo) -> None:
    await remember_turn(request.session_id, request.user_id, "user", request.query)
    await remember_turn(request.session_id, request.user_id, "assistant", memo.executive_summary)
    await remember_analysis(request.user_id, memo)
