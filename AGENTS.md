# Agent instructions — Morgan AI (haxkday)

This file is for coding agents (Codex, Claude Code, etc.) working in this
repo. Read this before making changes — it covers what's real, what's
stubbed, and conventions already in use so you don't redo or contradict
existing work.

## What this project is

Morgan AI: a voice-first autonomous financial analyst. Ask a question by
voice or through a web dashboard, get back an investment memo backed by
real SEC filings, live market data, and a sandboxed DCF calculation —
every step traced to Braintrust.

Full architecture and layout: see `README.md`. Don't duplicate that here —
this file is about how to work in the repo, not what it is.

## Current integration status (check before claiming something works)

| Integration | Code wired? | Live/verified? |
|---|---|---|
| Fireworks (LLM reasoning) | Yes — `PlannerAgent`, `InvestmentMemoAgent` | Depends on `FIREWORKS_API_KEY` being set wherever it's deployed |
| SEC EDGAR (filings) | Yes — `ResearchAgent` | No key needed, just a `SEC_EDGAR_USER_AGENT` string |
| Alpha Vantage (fundamentals) | Yes — feeds `ValuationAgent` | Depends on `ALPHA_VANTAGE_API_KEY` |
| Polygon (market data) | Yes — `MarketDataAgent` | Depends on `POLYGON_API_KEY` |
| Daytona (sandboxed compute) | Yes — DCF in `ValuationAgent`, margin scenarios in `/tools/scenario` | Depends on `DAYTONA_API_KEY` |
| Braintrust (tracing) | Yes — full trace on `/analyze` + `/tools/analyze`, and on `/tools/scenario` | Depends on `BRAINTRUST_API_KEY` / `BRAINTRUST_PROJECT` |
| ElevenLabs (voice) | Partially — signed-URL session endpoint (`/voice/session`) and both webhook tools (`/tools/analyze`, `/tools/scenario`) are built | **No agent has been provisioned yet.** `scripts/provision_elevenlabs_agent.py` must be run manually (needs real network access to `api.elevenlabs.io`) to get a real `ELEVENLABS_AGENT_ID`. Until that's set, the voice flow can't actually connect. |
| Risk Agent, News Agent | Stubs only | Never wired to a live data source — no vendor chosen |
| FMP, Yahoo Finance clients | Stubs only | Not used by the pipeline yet |

Don't assume any of the "depends on API key" rows are actually live —
verify by checking the deployment's env vars or hitting the deployed
`/analyze` endpoint, not by reading the code alone.

## Network access

Sandboxed coding agents often run behind an egress allowlist. If yours
does, `api.fireworks.ai`, `app.daytona.io`, `api.braintrust.dev`,
`api.elevenlabs.io`, `www.sec.gov`, `www.alphavantage.co`, `api.polygon.io`,
and `haxkday.onrender.com` are very likely **not** reachable. That's
expected, not a bug to work around — verify integration *logic* by mocking
the network call (every `examples/hello_*.py` script does this), and be
explicit in your output about which parts you could and couldn't verify
live. Don't silently claim something "works" when you only proved the code
compiles.

## Running things locally

```bash
pip install -e .
cp .env.example .env   # fill in real keys
uvicorn haxkday.api.main:app --reload
```

```bash
cd frontend
npm install
npm run dev            # port 3000 — check for a stale process first:
                        # lsof -ti:3000 -sTCP:LISTEN | xargs -r kill -9
```

Before reporting a frontend change as done, actually load it in a browser
(Playwright is fine for a sandboxed agent) — `npm run build` only proves
it type-checks, not that it renders correctly.

## Conventions already in use

- **Backend**: FastAPI + Pydantic v2 + pydantic-settings. All config lives
  in `config.py` as `Settings` fields with explicit env-var aliases — add
  new keys there and to both `.env.example` and `render.yaml`, not just one.
- **Every agent step in the pipeline is traced to Braintrust** —
  `start_trace` → `log_span` per step → `score` (if there's a real
  confidence number) or `end_trace` (if not — e.g. deterministic math has
  nothing to "score"). Don't invent a confidence/hallucination number to
  satisfy the API; leave it out when there's no real evaluator behind it.
- **`sources` / `data_gaps` on `InvestmentMemo` are computed
  deterministically** from what data actually went into the memo — never
  trust the model to self-report what it was or wasn't given.
- **Frontend design systems are theme-scoped CSS, not Tailwind config**:
  `styles/organic-theme.css` (cream/terracotta/olive, used by `/voice` and
  `/voice/live`) and `styles/editorial-theme.css` (warm ink/cream/mint,
  used by the landing page `/`). Wrap new pages in the right theme class
  rather than inventing new colors inline.
- **Honesty in copy**: never add compliance claims (SOC2, ISO27001, GDPR,
  etc.), fabricated benchmark stats, or capabilities the code doesn't
  actually have — to marketing copy, code comments, or status reports back
  to the user.

## Git workflow

- Active branch: `claude/pip-install-daytona-sboib2`. If you're a second
  agent working alongside another one, use a separate branch or
  `git worktree add` rather than committing to the same branch at the same
  time — two agents editing concurrently is how work gets silently lost.
- Commit messages: explain *why*, not what (the diff already shows what).
- Don't force-push, don't amend commits other than your own most recent
  one, don't rewrite history on a branch someone else might have pulled.

## Deploying

Backend: Render (`render.yaml` Blueprint, Dockerfile-based, builds from
just `pyproject.toml` + `src/`). Frontend: Vercel, Root Directory =
`frontend`, needs `NEXT_PUBLIC_BACKEND_URL` set to the backend's public
URL. Both require env vars set in their respective dashboards — never
commit real keys to `.env` in git (it's gitignored; don't change that).
