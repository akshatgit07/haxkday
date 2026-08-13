from typing import Literal

from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    """Incoming request, e.g. a transcribed voice question."""

    query: str
    ticker: str | None = None
    company_name: str | None = None
    # Identify the conversation/user so the memory layer can recall and
    # persist context. Defaults keep every existing caller working unchanged.
    session_id: str = "adhoc"
    user_id: str = "demo"


class RecallRequest(BaseModel):
    """A pure memory lookup — no analysis pipeline behind it."""

    query: str
    session_id: str = "adhoc"
    user_id: str = "demo"


class FilingExcerpt(BaseModel):
    """A relevant chunk pulled from a 10-K/10-Q/earnings call by the Research Analyst."""

    source: str
    filing_type: str
    fiscal_period: str
    text: str


class MarketSnapshot(BaseModel):
    """Point-in-time market data gathered by the Market Analyst."""

    ticker: str
    price: float
    market_cap: float | None = None
    analyst_estimates: dict[str, float] = {}
    recent_news: list[str] = []


class FinancialSnapshot(BaseModel):
    """Core financials used as input to valuation/risk models."""

    ticker: str
    revenue_growth_pct: float | None = None
    gross_margin_pct: float | None = None
    operating_margin_pct: float | None = None
    cash_position: float | None = None
    total_debt: float | None = None
    free_cash_flow: float | None = None


class ValuationResult(BaseModel):
    """Output of the Valuation Analyst, computed inside the Daytona sandbox."""

    dcf_fair_value: float | None = None
    pe_ratio: float | None = None
    ev_ebitda: float | None = None
    peg_ratio: float | None = None
    comparable_companies: list[str] = []


class RiskAssessment(BaseModel):
    """Output of the Risk Analyst."""

    debt_risk: str | None = None
    liquidity_risk: str | None = None
    cash_flow_risk: str | None = None
    margin_risk: str | None = None
    credit_risk: str | None = None
    competitive_risk: str | None = None


class InvestmentMemo(BaseModel):
    """Final output produced by the Investment Memo Agent."""

    ticker: str
    executive_summary: str
    bull_case: list[str]
    bear_case: list[str]
    key_risks: list[str]
    recommendation: Literal["BUY", "HOLD", "SELL"]
    confidence_pct: float
    # Computed deterministically from what data actually went into this memo —
    # never trust the model to self-report what it was and wasn't given.
    sources: list[str] = []
    data_gaps: list[str] = []


class ScenarioRequest(BaseModel):
    """A hypothetical cost-shock question, e.g. "what if logistics costs rise 8%?"."""

    revenue: float
    total_costs: float
    cost_category_amount: float
    cost_category_pct_change: float
    cost_category_label: str = "the specified cost category"
