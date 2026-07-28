"""Financial calculations executed inside a Daytona sandbox via DaytonaSandboxClient.run_code.

Each function is dependency-free (stdlib only) so its source can be shipped into the
sandbox as-is (see agents/valuation_agent.py) and executed there rather than in-process,
per the architecture's "all numerical execution happens in Daytona" requirement.
"""

import random


def revenue_growth(current_revenue: float, prior_revenue: float) -> float:
    """Year-over-year revenue growth, as a percentage."""
    return (current_revenue - prior_revenue) / prior_revenue * 100


def gross_margin(revenue: float, cost_of_goods_sold: float) -> float:
    """Gross margin, as a percentage of revenue."""
    return (revenue - cost_of_goods_sold) / revenue * 100


def cagr(beginning_value: float, ending_value: float, years: float) -> float:
    """Compound annual growth rate between two values over a number of years."""
    return ((ending_value / beginning_value) ** (1 / years) - 1) * 100


def dcf_fair_value(
    free_cash_flows: list[float],
    discount_rate: float,
    terminal_growth_rate: float,
) -> float:
    """Discounted cash flow fair value estimate from a series of projected FCFs."""
    present_value = sum(fcf / (1 + discount_rate) ** year for year, fcf in enumerate(free_cash_flows, start=1))
    terminal_fcf = free_cash_flows[-1] * (1 + terminal_growth_rate)
    terminal_value = terminal_fcf / (discount_rate - terminal_growth_rate)
    discounted_terminal_value = terminal_value / (1 + discount_rate) ** len(free_cash_flows)
    return present_value + discounted_terminal_value


def monte_carlo_price_simulation(
    starting_price: float,
    expected_return: float,
    volatility: float,
    horizon_days: int,
    num_simulations: int,
) -> list[float]:
    """Simulate ending prices via geometric Brownian motion."""
    dt = 1 / 252
    results = []
    for _ in range(num_simulations):
        price = starting_price
        for _ in range(horizon_days):
            shock = random.gauss(0, 1)
            price *= 1 + expected_return * dt + volatility * (dt**0.5) * shock
        results.append(price)
    return results


def scenario_analysis(base_case: dict, bull_case: dict, bear_case: dict) -> dict:
    """Compare DCF fair value across bull/base/bear assumption sets.

    Each case dict must have "free_cash_flows", "discount_rate", and
    "terminal_growth_rate" keys.
    """
    return {
        name: dcf_fair_value(case["free_cash_flows"], case["discount_rate"], case["terminal_growth_rate"])
        for name, case in (("bull", bull_case), ("base", base_case), ("bear", bear_case))
    }
