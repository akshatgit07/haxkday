"""Provisions the ElevenLabs Conversational AI voice agent for Morgan AI.

Creates an agent that answers financial questions by voice and calls this
backend's POST /tools/analyze as a server tool whenever the user asks for a
real investment analysis, sending the shared webhook secret as a static
header.

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
    "continuing to explain unprompted.\n\n"
    "Numbers: say large sums the way you'd say them aloud — \"four point "
    "two billion dollars,\" never digit-by-digit or reading a dollar sign. "
    "If you have several figures to give, cap it at three at a time; offer "
    "to continue rather than listing more.\n\n"
    "When the user asks you to analyze a company, evaluate an investment, "
    "or compare companies, call the analyze_company tool rather than "
    "answering from memory — it runs a real pipeline against SEC filings "
    "and financial data. Lead with the tool's recommendation and "
    "confidence, then the executive summary; don't read the bull/bear "
    "case or risks as a verbatim list unless asked."
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


def build_conversation_config(backend_url: str, webhook_secret: str, voice_id: str) -> dict:
    config: dict = {
        "agent": {
            "first_message": FIRST_MESSAGE,
            "language": "en",
            "prompt": {
                "prompt": SYSTEM_PROMPT,
                "tools": [build_analyze_tool(backend_url, webhook_secret)],
            },
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


if __name__ == "__main__":
    main()
