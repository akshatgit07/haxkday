"""Shared decorator for memory functions: skip and degrade rather than crash.

Memory is a nice-to-have, not a dependency. A missing MONGODB_URI, a cold
Atlas cluster, or a slow network should never take down an analysis
request — stateless-but-working beats a 500.
"""

import functools
import logging

log = logging.getLogger(__name__)


def optional(flag_getter, default=None):
    def deco(fn):
        @functools.wraps(fn)
        async def wrapper(*args, **kwargs):
            if not flag_getter():
                return default() if callable(default) else default
            try:
                return await fn(*args, **kwargs)
            except Exception:  # noqa: BLE001 - memory must never break the request
                log.warning("%s failed, continuing without memory", fn.__name__, exc_info=True)
                return default() if callable(default) else default

        return wrapper

    return deco
