"""Provisions the ElevenLabs Conversational AI voice agent for Morgan AI.

Creates an agent that answers financial questions by voice and calls this
backend's tool webhooks (POST /tools/analyze, POST /tools/scenario) whenever
the user asks for a real investment analysis or a quick "what if" scenario,
sending the shared webhook secret as a static header.

Requires MORGAN_BACKEND_URL to be a public HTTPS URL ElevenLabs' servers can
reach — a localhost/sandbox address won't work. Deploy the FastAPI app
somewhere reachable first, then run this once against that URL.
"""

import os

from elevenlabs.client import ElevenLabs
from elevenlabs.types import ConversationalConfig

SYSTEM_PROMPT = (
    "You are Morgan, an autonomous financial analyst speaking with a "
    "managing director.\n\n"
    "Tone and pace: professional, calm, authoritative, concise. Avoid "
    "conversational filler — no \"great question,\" no throat-clearing, no "
    "restating what was asked.\n\n"
    "Delivery: lead with the core metric or variance immediately, in your "
    "first sentence. Then stop and let the user ask a follow-up rather than "
    "continuing to explain unprompted. The user can interrupt you mid-"
    "sentence at any time — if they do, drop what you were saying and "
    "address what they just asked.\n\n"
    "Numbers: say large sums the way you'd say them aloud — \"four point "
    "two billion dollars,\" never digit-by-digit or reading a dollar sign. "
    "If you have several figures to give, cap it at three at a time; offer "
    "to continue rather than listing more.\n\n"
    "When the user asks you to analyze a company, evaluate an investment, "
    "or compare companies, call the analyze_company tool rather than "
    "answering from memory — it runs a real pipeline against SEC filings "
    "and financial data. Lead with the tool's recommendation and "
    "confidence, then the executive summary; don't read the bull/bear "
    "case or risks as a verbatim list unless asked. Always mention the "
    "source it cites, and say plainly if it flags missing or low-"
    "confidence data — never smooth that over.\n\n"
    "When the user asks a quick hypothetical like \"what happens to margin "
    "if logistics costs rise 8 percent,\" call the model_scenario tool with "
    "the revenue, total costs, and the specific cost category's current "
    "amount and percentage change. If you don't have the baseline figures, "
    "ask for them rather than guessing."
)

FIRST_MESSAGE = "Morgan. What would you like reviewed?"


def build_analyze_tool(backend_url: str, webhook_secret: str) -> dict:
    return {
        "type": "webhook",
        "name": "analyze_company",
        "description": (
            "Runs a full investment analysis for a company: pulls SEC filings, "
            "computes a DCF valuation, and returns a recommendation with "
            "confidence. Call this whenever the user asks you to analyze, "
            "value, or give an opinion on a specific company."
        ),
        "response_timeout_secs": 30,
        "interruption_mode": "allow",
        "api_schema": {
            "url": f"{backend_url.rstrip('/')}/tools/analyze",
            "method": "POST",
            "request_headers": {"X-Webhook-Secret": webhook_secret},
            "request_body_schema": {
                "type": "object",
                "required": ["query"],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The user's question, verbatim.",
                    },
                    "ticker": {
                        "type": "string",
                        "description": "Stock ticker symbol, if known (e.g. NVDA). Omit if unknown.",
                    },
                    "company_name": {
                        "type": "string",
                        "description": "Company name, if the ticker isn't known.",
                    },
                },
            },
        },
    }


def build_scenario_tool(backend_url: str, webhook_secret: str) -> dict:
    return {
        "type": "webhook",
        "name": "model_scenario",
        "description": (
            "Quick 'what if' cost-shock scenario modeling: given current revenue, "
            "total costs, and one cost category's current amount, computes the net "
            "margin impact of that category changing by a given percentage. Call "
            "this for hypothetical questions like 'what happens to margin if "
            "logistics costs rise 8 percent?'."
        ),
        "response_timeout_secs": 15,
        "interruption_mode": "allow",
        "api_schema": {
            "url": f"{backend_url.rstrip('/')}/tools/scenario",
            "method": "POST",
            "request_headers": {"X-Webhook-Secret": webhook_secret},
            "request_body_schema": {
                "type": "object",
                "required": ["revenue", "total_costs", "cost_category_amount", "cost_category_pct_change"],
                "properties": {
                    "revenue": {"type": "number", "description": "Current total revenue."},
                    "total_costs": {"type": "number", "description": "Current total costs."},
                    "cost_category_amount": {
                        "type": "number",
                        "description": "Current amount of the specific cost category being shocked.",
                    },
                    "cost_category_pct_change": {
                        "type": "number",
                        "description": "Fractional change to that category, e.g. 0.08 for +8%, -0.05 for -5%.",
                    },
                    "cost_category_label": {
                        "type": "string",
                        "description": "Name of the cost category, e.g. 'logistics costs'.",
                    },
                },
            },
        },
    }


def build_conversation_config(backend_url: str, webhook_secret: str, voice_id: str) -> dict:
    config: dict = {
        "agent": {
            "first_message": FIRST_MESSAGE,
            "language": "en",
            "prompt": {
                "prompt": SYSTEM_PROMPT,
                "tools": [
                    build_analyze_tool(backend_url, webhook_secret),
                    build_scenario_tool(backend_url, webhook_secret),
                ],
            },
        },
        "turn": {
            # Barge-in: users can interrupt mid-sentence. These are brief spoken
            # acknowledgments that shouldn't themselves be treated as an
            # interruption (the user is just signaling they're listening).
            "interruption_ignore_terms": ["mmhmm", "uh huh", "okay", "yeah", "right", "got it"],
        },
    }
    if voice_id:
        config["tts"] = {"voice_id": voice_id}
    return config


def main() -> None:
    backend_url = os.environ["MORGAN_BACKEND_URL"]
    webhook_secret = os.environ["ELEVENLABS_WEBHOOK_SECRET"]
    voice_id = os.environ.get("ELEVENLABS_VOICE_ID", "")

    conversation_config = build_conversation_config(backend_url, webhook_secret, voice_id)
    ConversationalConfig.model_validate(conversation_config)  # fail fast on a malformed payload

    client = ElevenLabs(api_key=os.environ["ELEVENLABS_API_KEY"])
    response = client.conversational_ai.agents.create(
        name="Morgan AI",
        conversation_config=conversation_config,
    )
    print(f"Created agent: {response.agent_id}")
    print(f"\nSet ELEVENLABS_AGENT_ID={response.agent_id} in the backend's environment")
    print("(needed by GET /voice/session, which the frontend uses to start a live conversation)")


if __name__ == "__main__":
    main()
