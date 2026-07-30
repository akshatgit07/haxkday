"""Wraps the Daytona SDK sandbox lifecycle used to run all financial-model Python code.

See examples/hello_sandbox.py for the underlying create/run/delete pattern this builds on.
"""

import inspect
import json
from collections.abc import Callable
from typing import Any

from daytona import Daytona, DaytonaConfig


class DaytonaSandboxClient:
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    def run_code(self, code: str) -> str:
        """Create a sandbox, execute the given Python snippet, return stdout, then clean up."""
        daytona = Daytona(DaytonaConfig(api_key=self.api_key))
        sandbox = daytona.create()
        try:
            response = sandbox.process.code_run(code)
            if response.exit_code != 0:
                raise RuntimeError(f"Sandbox execution failed ({response.exit_code}): {response.result}")
            return response.result
        finally:
            sandbox.delete()

    def run_function(self, func: Callable[..., Any], *args: Any) -> Any:
        """Ship a dependency-free function's own source into the sandbox, call it with args,
        and return the JSON-decoded result. `func` must return a JSON-serializable value."""
        source = inspect.getsource(func)
        call_args = ", ".join(repr(a) for a in args)
        code = f"{source}\nimport json\nresult = {func.__name__}({call_args})\nprint(json.dumps(result))\n"
        return json.loads(self.run_code(code))
