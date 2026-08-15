export interface AnalysisRequest {
  query: string;
  ticker?: string;
  company_name?: string;
}

export type Recommendation = "BUY" | "HOLD" | "SELL";

export interface MarketSnapshot {
  ticker: string;
  price: number;
  day_change_pct: number | null;
  market_cap: number | null;
  analyst_estimates: Record<string, number>;
  recent_news: string[];
  price_history: number[];
}

export interface ValuationResult {
  dcf_fair_value: number | null;
  pe_ratio: number | null;
  ev_ebitda: number | null;
  peg_ratio: number | null;
  comparable_companies: string[];
}

export interface InvestmentMemo {
  ticker: string;
  executive_summary: string;
  bull_case: string[];
  bear_case: string[];
  key_risks: string[];
  recommendation: Recommendation;
  confidence_pct: number;
  sources: string[];
  data_gaps: string[];
  market: MarketSnapshot | null;
  valuation: ValuationResult | null;
}

export interface ScenarioResult {
  base_margin_pct: number;
  new_margin_pct: number;
  margin_delta_pct: number;
  cost_delta: number;
}

export interface ScenarioInputs {
  revenue: number;
  total_costs: number;
  cost_category_label: string;
  cost_category_amount: number;
  cost_category_pct_change: number;
  new_total_costs: number;
}
