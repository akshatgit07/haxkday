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
}
