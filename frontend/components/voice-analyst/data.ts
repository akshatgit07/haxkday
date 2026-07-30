export interface Kpi {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export interface ExtraRowItem {
  label: string;
  value: string;
}

export interface DonutLegendItem {
  label: string;
  pct: string;
  color: string;
}

export type IconGlyph = "pie" | "chat" | "trend" | "user";

export interface QueryDatum {
  id: string;
  label: string;
  iconGlyph: IconGlyph;
  summary: string;
  kpis: Kpi[];
  extraRow?: ExtraRowItem[];
  vizTitle: string;
  isDonut: boolean;
  isLine: boolean;
  donutLegend?: DonutLegendItem[];
  donutStops?: string;
  trendLinePath?: string;
  trendAreaPath?: string;
  linePath?: string;
  areaPath?: string;
  axisStart: string;
  axisEnd: string;
}

export const QUERY_DATA: QueryDatum[] = [
  {
    id: "portfolio",
    label: "How's my book doing today?",
    iconGlyph: "pie",
    summary:
      "Your book is up $X.XM today, led by strength in Technology and Financials. Overall risk exposure is within target bands.",
    kpis: [
      { label: "Total AUM", value: "$X28.4M", delta: "+0.9%", positive: true },
      { label: "Day change", value: "+$X.2M", delta: "today", positive: true },
      { label: "Best sector", value: "Technology", delta: "+X.1%", positive: true },
    ],
    vizTitle: "Portfolio allocation",
    isDonut: true,
    isLine: false,
    donutLegend: [
      { label: "Technology", pct: "32%", color: "var(--color-accent)" },
      { label: "Financials", pct: "24%", color: "var(--color-accent-2)" },
      { label: "Healthcare", pct: "18%", color: "var(--color-accent-700)" },
      { label: "Energy", pct: "14%", color: "var(--color-accent-2-700)" },
      { label: "Other", pct: "12%", color: "var(--color-neutral-300)" },
    ],
    donutStops:
      "var(--color-accent) 0% 32%, var(--color-accent-2) 32% 56%, var(--color-accent-700) 56% 74%, var(--color-accent-2-700) 74% 88%, var(--color-neutral-300) 88% 100%",
    trendLinePath: "M0,112 L45,102 L90,106 L135,82 L180,72 L225,62 L270,46 L320,36",
    trendAreaPath: "M0,112 L45,102 L90,106 L135,82 L180,72 L225,62 L270,46 L320,36 L320,140 L0,140 Z",
    axisStart: "30 days ago",
    axisEnd: "Today",
  },
  {
    id: "stock",
    label: "Give me Company A's latest earnings",
    iconGlyph: "chat",
    summary:
      "Company A beat on EPS by $X.XX, with revenue guidance raised for next quarter. Shares reacted positively after the print.",
    kpis: [
      { label: "EPS (actual vs est.)", value: "$X.XX / $X.XX", delta: "beat", positive: true },
      { label: "Revenue", value: "$XX.XB", delta: "+X%", positive: true },
      { label: "Price reaction", value: "+X.X%", delta: "after hours", positive: true },
    ],
    extraRow: [
      { label: "Day high", value: "$X82.43" },
      { label: "Day low", value: "$X76.25" },
      { label: "Bid", value: "$X79.50" },
      { label: "Ask", value: "$X81.85" },
    ],
    vizTitle: "Share price, last 6 months",
    isDonut: false,
    isLine: true,
    linePath: "M0,100 L45,92 L90,96 L135,70 L180,74 L225,48 L270,40 L320,18",
    areaPath: "M0,100 L45,92 L90,96 L135,70 L180,74 L225,48 L270,40 L320,18 L320,140 L0,140 Z",
    axisStart: "6mo ago",
    axisEnd: "Today",
  },
  {
    id: "macro",
    label: "How's the S&P doing?",
    iconGlyph: "trend",
    summary:
      "The S&P 500 is up X.X% today on broad-based gains, with X of 11 sectors higher. Breadth and volume both support the move.",
    kpis: [
      { label: "Index level", value: "X,XXX.XX", delta: "+X.X%", positive: true },
      { label: "Day change", value: "+X.X%", delta: "today", positive: true },
      { label: "Sector breadth", value: "X of 11", delta: "advancing", positive: true },
    ],
    vizTitle: "Index level, intraday",
    isDonut: false,
    isLine: true,
    linePath: "M0,80 L45,86 L90,70 L135,74 L180,55 L225,60 L270,35 L320,30",
    areaPath: "M0,80 L45,86 L90,70 L135,74 L180,55 L225,60 L270,35 L320,30 L320,140 L0,140 Z",
    axisStart: "9:30am",
    axisEnd: "Now",
  },
  {
    id: "account",
    label: "Summarize the Meridian account",
    iconGlyph: "user",
    summary:
      "The Meridian account is valued at $X.XM, up X.X% this quarter with no recent withdrawals. Allocation remains close to target.",
    kpis: [
      { label: "Account value", value: "$X.XM", delta: "+X.X%", positive: true },
      { label: "QTD return", value: "+X.X%", delta: "quarter", positive: true },
      { label: "Last activity", value: "X days ago", delta: "deposit", positive: true },
    ],
    vizTitle: "Account allocation",
    isDonut: true,
    isLine: false,
    donutLegend: [
      { label: "Equities", pct: "58%", color: "var(--color-accent)" },
      { label: "Fixed income", pct: "30%", color: "var(--color-accent-2)" },
      { label: "Cash", pct: "12%", color: "var(--color-neutral-300)" },
    ],
    donutStops:
      "var(--color-accent) 0% 58%, var(--color-accent-2) 58% 88%, var(--color-neutral-300) 88% 100%",
    trendLinePath: "M0,100 L45,95 L90,98 L135,90 L180,80 L225,72 L270,58 L320,50",
    trendAreaPath: "M0,100 L45,95 L90,98 L135,90 L180,80 L225,72 L270,58 L320,50 L320,140 L0,140 Z",
    axisStart: "Quarter start",
    axisEnd: "Today",
  },
];
