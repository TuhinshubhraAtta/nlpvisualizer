from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any


@dataclass
class PipelineStep:
    name: str
    description: str
    code: str
    input: Any
    output: Any
    explanation: str

    def model_dump(self) -> dict[str, Any]:
        return asdict(self)
