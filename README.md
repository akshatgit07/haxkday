# Morgan AI — Autonomous Financial Analyst

Voice-first autonomous financial analyst: ask a question by voice, get back
an investment-grade memo backed by real SEC filings, market data, and
sandboxed financial calculations.

**Live pipeline:** Planner → Research (SEC EDGAR) → Valuation (Alpha Vantage
+ Daytona) → Investment Memo (Fireworks), traced end-to-end to Braintrust,
callable from a web dashboard (`/analyze`) or an ElevenLabs Conversational AI
voice agent (`/tools/analyze`). Market/Risk agents aren't wired to a live
data source yet (need a Polygon or FMP key).

## Architecture

```
User -> ElevenLabs voice agent -> POST /tools/analyze (shared-secret webhook)
User -> web dashboard           -> POST /analyze
                                       |
                                  Planner Agent (Fireworks)
                                       |
                                  Research Agent (SEC EDGAR: 10-K/10-Q)
                                       |
                                  Valuation Agent (Alpha Vantage fundamentals
                                       |           -> DCF run inside Daytona)
                                       |
                                  Investment Memo Agent (Fireworks)
                                       |
                                  Braintrust (full trace + eval)
```

## Layout

```
src/haxkday/
  agents/         Planner, Research, News, Market Data, Valuation, Risk, Memo agents
  integrations/   Fireworks, ElevenLabs, Braintrust, Daytona, SEC EDGAR,
                  Yahoo Finance, Alpha Vantage, Polygon, FMP clients
  sandbox/        Financial model functions executed inside Daytona (ratios, DCF, CAGR, ...)
  models/         Pydantic schemas shared across agents (FinancialSnapshot, InvestmentMemo, ...)
  api/            FastAPI app: routes/analyze.py, routes/tools.py (voice-agent webhook), routes/voice.py
  pipeline.py     The Planner -> Research -> Valuation -> Memo orchestration, shared by every route
  config.py       Settings loaded from environment / .env

frontend/         Next.js + Tailwind dashboard, calling POST /analyze
scripts/          One-off provisioning (ElevenLabs voice agent)
examples/         Standalone integration usage/demo scripts
```

## Setup

```bash
pip install -e .
cp .env.example .env   # fill in API keys
uvicorn haxkday.api.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Required API keys

See `.env.example` for the full list: Fireworks, ElevenLabs, Daytona,
Braintrust, SEC EDGAR (user agent string, no key needed), Alpha Vantage,
Polygon, FMP.

## Deploying the backend

`Dockerfile` builds a standalone image from just `pyproject.toml` + `src/`
(the frontend isn't included). `render.yaml` is a Render Blueprint for it.

1. Push this repo to GitHub, connect it in the Render dashboard, and apply
   the Blueprint (or create a Web Service manually pointed at the
   Dockerfile).
2. Set every env var listed in `render.yaml` (marked `sync: false`) from
   your local `.env` — Render's dashboard, never committed.
3. Set `CORS_ALLOWED_ORIGINS` to the deployed frontend's real URL once you
   know it (comma-separated if there's more than one).
4. Once live, run `scripts/provision_elevenlabs_agent.py` with
   `MORGAN_BACKEND_URL` set to the deployed backend's public URL, so the
   ElevenLabs agent's webhook tool points at it.
5. Set the frontend's `NEXT_PUBLIC_BACKEND_URL` to the same deployed URL.
