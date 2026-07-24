import re

_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)


def strip_json_fence(text: str) -> str:
    """Strip optional markdown code fences some models wrap JSON responses in."""
    return _FENCE_RE.sub("", text.strip()).strip()
