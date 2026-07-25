from __future__ import annotations
from typing import TYPE_CHECKING

try:
    from backend.models import PipelineStep
except ModuleNotFoundError:
    from models import PipelineStep

if TYPE_CHECKING:
    from spacy.tokens import Doc


class StopwordStep:
    def __init__(self, tokens: list[str], doc: "Doc | None" = None) -> None:
        self.tokens = tokens
        self.doc = doc
        self.output = self._remove(tokens, doc)

    @staticmethod
    def _remove(tokens: list[str], doc: "Doc | None" = None) -> list[str]:
        if doc is not None:
            # We need to filter the *input token list*, not regenerate from the doc,
            # because the input might already be filtered.
            # However, we can create a set of stopwords from the doc for an efficient lookup.
            stop_words = {token.text for token in doc if token.is_stop}
            return [token for token in tokens if token.lower() not in stop_words]
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
