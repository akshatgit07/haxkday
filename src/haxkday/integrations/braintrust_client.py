"""Wraps Braintrust tracing/eval so every agent step, tool call, and Daytona execution is logged."""

import uuid

import braintrust
from braintrust.logger import Span


class BraintrustClient:
    def __init__(self, api_key: str, project: str) -> None:
        self.api_key = api_key
        self.project = project
        self._logger = braintrust.init_logger(project=project, api_key=api_key)
        self._spans: dict[str, Span] = {}

    def start_trace(self, name: str) -> str:
        """Start a trace for one end-to-end user request; returns a trace id."""
        span = self._logger.start_span(name=name)
        trace_id = str(uuid.uuid4())
        self._spans[trace_id] = span
        return trace_id

    def log_span(self, trace_id: str, name: str, input: dict, output: dict, metadata: dict | None = None) -> None:
        """Record a single step (agent call, tool call, sandbox execution) within a trace."""
        parent = self._spans[trace_id]
        with parent.start_span(name=name) as child:
            child.log(input=input, output=output, metadata=metadata or {})

    def score(self, trace_id: str, hallucination_score: float, confidence: float) -> None:
        """Attach evaluation scores to a completed trace, then close it."""
        span = self._spans.pop(trace_id)
        span.log(scores={"hallucination": hallucination_score, "confidence": confidence})
        span.end()
