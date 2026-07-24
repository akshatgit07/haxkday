# Morgan AI — Autonomous Financial Analyst

Voice-first autonomous financial analyst: ask a question by voice, get back
an investment-grade memo backed by real SEC filings, market data, and
sandboxed financial calculations.

This repo currently contains the **project scaffold** — folder structure and
stub interfaces for the full architecture below. Business logic is not yet
implemented.

## Architecture

```
User -> ElevenLabs (voice) -> Planner Agent
                                 |-- Research Agent   (SEC filings)
                                 |-- News Agent        (market news)
                                 |-- Market Data Agent (prices/estimates)
                                 |-- Valuation Agent  --\
                                 |-- Risk Agent        --+-> Daytona sandbox (financial_models.py)
                                 |
                              Fireworks (reasoning) -> Investment Memo Agent
                                 |
                              ElevenLabs (voice response)
                                 |
                              Braintrust (trace + eval)
```

## Layout

```
src/haxkday/
  agents/         Planner, Research, News, Market Data, Valuation, Risk, Memo agents
  integrations/   Thin clients: Fireworks, ElevenLabs, Braintrust, Daytona, SEC EDGAR,
                  Yahoo Finance, Alpha Vantage, Polygon, FMP
  sandbox/        Financial model functions executed inside Daytona (ratios, DCF, CAGR, ...)
  models/         Pydantic schemas shared across agents (FinancialSnapshot, InvestmentMemo, ...)
  api/            FastAPI app (routes/analyze.py, routes/voice.py)
  config.py       Settings loaded from environment / .env

frontend/         Next.js + Tailwind executive dashboard (skeleton, not installed)
examples/         Standalone Daytona SDK usage examples
```

## Setup

```bash
pip install -e .
cp .env.example .env   # fill in API keys
uvicorn haxkday.api.main:app --reload
```

Frontend (once you're ready to build it out):

```bash
cd frontend
npm install
npm run dev
```

## Required API keys

See `.env.example` for the full list: Fireworks, ElevenLabs, Daytona,
Braintrust, SEC EDGAR (user agent string), Alpha Vantage, Polygon, FMP.
