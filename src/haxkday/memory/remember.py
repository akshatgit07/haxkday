"""Write paths. Called after a response is assembled, never awaited in the
request path — a slow Atlas write should never sit between a question and
Morgan's answer.
"""

from ..models.schemas import InvestmentMemo
from . import long_term, short_term


async def remember_turn(session_id: str, user_id: str, role: str, text: str, **meta) -> None:
    await short_term.append(session_id, user_id, role, text, **meta)


async def remember_analysis(user_id: str, memo: InvestmentMemo) -> None:
    """Distil a completed memo into one durable, self-contained memory.

    Deliberately narrow: only the memo's conclusion, not raw filings or
    market data. Storing everything would fill long-term memory with noise
    and degrade every future vector search.
    """
    text = (
        f"Analysed {memo.ticker}. Rated {memo.recommendation} at "
        f"{memo.confidence_pct:.0f}% confidence. {memo.executive_summary} "
        f"Top risks: {'; '.join(memo.key_risks) or 'none noted'}."
    )
    await long_term.write(
        user_id,
        text,
        kind="analysis",
        tickers=[memo.ticker],
        metadata={"recommendation": memo.recommendation, "confidence_pct": memo.confidence_pct},
    )
