"""Wraps Braintrust tracing/eval so every agent step, tool call, and Daytona execution is logged."""


class BraintrustClient:
    def __init__(self, api_key: str, project: str) -> None:
        self.api_key = api_key
        self.project = project

    def start_trace(self, name: str) -> str:
        """Start a trace for one end-to-end user request; returns a trace id."""
        raise NotImplementedError

    def log_span(self, trace_id: str, name: str, input: dict, output: dict, metadata: dict | None = None) -> None:
        """Record a single step (agent call, tool call, sandbox execution) within a trace."""
        raise NotImplementedError

    def score(self, trace_id: str, hallucination_score: float, confidence: float) -> None:
        """Attach evaluation scores to a completed trace."""
        raise NotImplementedError
