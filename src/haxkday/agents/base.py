from abc import ABC, abstractmethod
from typing import Any


class Agent(ABC):
    """Common interface every AI employee in the pipeline implements."""

    name: str

    @abstractmethod
    async def run(self, *args: Any, **kwargs: Any) -> Any:
        """Execute this agent's piece of work and return its result."""
        raise NotImplementedError
