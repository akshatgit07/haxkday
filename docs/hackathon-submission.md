# Morgan AI — Autonomous Financial Analyst

**One-liner:** A voice-first financial analyst you can interrupt. Ask a question out loud, and Morgan reads the actual SEC filings, runs the actual valuation math in an isolated sandbox, and gives you a recommendation it can defend — with sources, confidence, and memory of what it told you last time.

## Inspiration

Every real investment desk runs the same loop: read the filing, run the numbers, form a view, defend it in conversation. Most "AI financial assistants" skip straight to the last step — they generate plausible-sounding analysis without ever touching a real filing or running real math, and they forget the conversation the moment it ends. We wanted to build the version that doesn't cut corners: an analyst that shows its work, says "I don't have that data" instead of guessing, and remembers what it told you.

## What it does

You ask Morgan a question by voice — "Should I invest in Nvidia?" or "What happens to margin if logistics costs rise 8 percent?" — and it:

1. **Plans** the request into concrete research tasks.
2. **Pulls real SEC 10-K/10-Q filings** from EDGAR and a **live market snapshot** (price, market cap, news) from Polygon.
3. **Runs the actual valuation math — a DCF — inside an isolated Daytona sandbox**, never in-process, because model-written or model-influenced numeric code shouldn't run on the host.
4. **Synthesizes a memo**: bull case, bear case, key risks, a BUY/HOLD/SELL recommendation, and a confidence score — with every figure traced back to the source that produced it, and every missing data point named instead of papered over.
5. **Speaks the answer back**, and you can interrupt it mid-sentence to redirect — it drops what it was saying and listens.
6. **Remembers.** Ask a follow-up in the same conversation ("how does it compare to AMD?") and short-term memory resolves the reference. Come back in a new session next week and ask "what did you tell me about Nvidia?" — long-term semantic memory, scoped per user, still knows.

Every step of every request is traced end-to-end — every agent call, every tool call, every sandbox execution — so nothing about the answer is a black box.

## How we built it

- **Fireworks AI** — the reasoning core. A planner model breaks the request into tasks; a memo-synthesis model turns filings + market data + valuation output into the final investment memo, with an explicit sourcing rule baked into its prompt: never imply data you weren't given.
- **Daytona** — every numeric computation (DCF, margin scenarios, Monte Carlo simulation) runs inside an ephemeral sandbox, not the host process. The "what if costs rise 8%" scenario tool is a live example: the model never computes the answer itself, it ships real Python into Daytona and reports back what actually ran.
- **ElevenLabs Conversational AI** — owns voice I/O directly (not the usual reverse setup). The agent calls our backend as an authenticated webhook tool mid-conversation, gets back a structured result, and speaks it — with barge-in support so you can cut it off.
- **Braintrust** — full observability. Every pipeline run is a trace with a child span per agent step (planner, research, market, valuation, memo, memory recall) and a confidence score attached at the end; failures are logged as error spans instead of disappearing.
- **MongoDB Atlas Vector Search + Voyage (`voyage-finance-2`)** — the memory layer. Short-term conversation turns (TTL-expired after 24h) resolve pronouns and references; long-term memory stores *distilled* analyses — never raw transcripts — embedded with a finance-domain model and searched with `user_id` as a hard security filter on the vector index itself, not a post-filter.
- **SEC EDGAR, Polygon, Alpha Vantage** — real filings, real prices, real fundamentals. No mock data in the pipeline.
- **FastAPI + Next.js** — backend and dashboard, both calling the same shared pipeline whether the request comes from voice or the web.

## Challenges we ran into

Getting the ElevenLabs architecture right required a pivot: our first instinct was to have our backend drive ElevenLabs, but the correct pattern is the reverse — the voice agent owns the conversation and calls us as a tool. Rebuilding around that made the whole system simpler, not harder. Memory was the other hard part: a single log of everything fails both jobs a conversational memory needs to do — recent turns need to be complete and ordered (you can't resolve "compare it to AMD" from a semantic match), while old analyses need to be searchable and distilled (nobody wants March's literal transcript). Splitting it into two collections on two different lifetimes — one that expires, one that doesn't — is what made both work.

## Accomplishments we're proud of

Nothing in the pipeline is faked to make the demo look better. If a data source is unavailable, the memo says so and confidence drops — it doesn't quietly smooth over the gap. Every claim about what the system did (which filing it read, what math it ran, what it remembered) is independently verifiable in a Braintrust trace, not just asserted.

## What's next

Voice-biometric authentication and a live internal GL/budget integration for variance commentary are the two pieces still gated on a vendor decision we haven't made. A Risk Agent and a News Agent are scaffolded but not yet wired to a live data source. And we'd like to close the loop on memory by mining full post-call transcripts for durable facts (stated risk tolerance, sector interests), not just the outcome of each analysis.
