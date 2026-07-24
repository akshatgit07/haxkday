import os

import braintrust

from haxkday.integrations.braintrust_client import BraintrustClient


def main() -> None:
    client = BraintrustClient(
        api_key=os.environ["BRAINTRUST_API_KEY"],
        project=os.environ.get("BRAINTRUST_PROJECT", "morgan-ai"),
    )
    trace_id = client.start_trace("hello-world")
    client.log_span(
        trace_id,
        name="fireworks-call",
        input={"prompt": "In one sentence, what is a DCF valuation?"},
        output={"text": "..."},
    )
    client.score(trace_id, hallucination_score=0.0, confidence=0.92)
    braintrust.flush()
    print("Trace logged.")


if __name__ == "__main__":
    main()
