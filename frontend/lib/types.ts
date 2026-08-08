export interface AnalysisRequest {
  query: string;
  ticker?: string;
  company_name?: string;
}

export type Recommendation = "BUY" | "HOLD" | "SELL";

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
