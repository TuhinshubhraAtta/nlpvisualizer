from __future__ import annotations

try:
    from backend.models import PipelineStep
except ModuleNotFoundError:
    from models import PipelineStep


class StopwordStep:
    def __init__(self, tokens: list[str], doc: object | None = None) -> None:
        self.tokens = tokens
        self.doc = doc
        self.output = self._remove(tokens, doc)

    @staticmethod
    def _remove(tokens: list[str], doc: object | None = None) -> list[str]:
        if doc is not None:
            return [token.text for token in doc if not token.is_stop]
        return [token for token in tokens if token.lower() not in {"i", "am", "is", "are", "the", "a", "an", "and", "to", "of"}]

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Stopword Removal",
            description="Filter out common words that carry less semantic signal using spaCy stop-word detection.",
            code="tokens = [token for token in doc if not token.is_stop]",
            input=self.tokens,
            output=self.output,
            explanation="Removed stopwords that do not materially contribute to the sentence meaning.",
        )
