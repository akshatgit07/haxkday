import asyncio
import os

from haxkday.integrations.fireworks_client import FireworksClient

DEFAULT_MODEL = "accounts/fireworks/models/llama-v3p1-70b-instruct"


async def main() -> None:
    client = FireworksClient(
        api_key=os.environ["FIREWORKS_API_KEY"],
        model=os.environ.get("FIREWORKS_MODEL", DEFAULT_MODEL),
    )
    reply = await client.complete(
        system_prompt="You are a concise financial analyst.",
        user_prompt="In one sentence, what is a DCF valuation?",
    )
    print(reply)


if __name__ == "__main__":
    asyncio.run(main())
