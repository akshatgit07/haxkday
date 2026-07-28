"""Wraps the Daytona SDK sandbox lifecycle used to run all financial-model Python code.

See examples/hello_sandbox.py for the underlying create/run/delete pattern this builds on.
"""

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
