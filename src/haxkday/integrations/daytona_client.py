"""Wraps the Daytona SDK sandbox lifecycle used to run all financial-model Python code.

See examples/hello_sandbox.py for the underlying create/run/delete pattern this builds on.
"""


class DaytonaSandboxClient:
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    def run_code(self, code: str) -> str:
        """Create a sandbox, execute the given Python snippet, return stdout, then clean up."""
        raise NotImplementedError
