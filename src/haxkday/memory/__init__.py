"""Memory layer: short-term conversation buffer + long-term semantic recall,
backed by MongoDB Atlas. Import `recall_context` / `remember_*` — the rest
is plumbing. Everything here degrades to a no-op when MONGODB_URI isn't
set, so the pipeline still runs stateless without it.
"""

from .recall import format_for_prompt, recall_context
from .remember import remember_analysis, remember_turn

__all__ = ["format_for_prompt", "recall_context", "remember_analysis", "remember_turn"]
