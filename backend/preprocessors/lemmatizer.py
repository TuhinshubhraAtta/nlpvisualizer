from __future__ import annotations
from typing import TYPE_CHECKING

try:
    from backend.models import PipelineStep
except ModuleNotFoundError:
    from models import PipelineStep

if TYPE_CHECKING:
    from spacy.tokens import Doc


class LemmatizerStep:
    def __init__(self, tokens: list[str], doc: "Doc | None" = None) -> None:
        self.tokens = tokens
        self.doc = doc
        self.output = self._lemmatize(tokens, doc)

    @staticmethod
    def _lemmatize(tokens: list[str], doc: "Doc | None" = None) -> list[str]:
        if doc is not None:
            # Since the input `tokens` are the result of removing stopwords from the `doc`
            # (using the `is_stop` flag), we can reconstruct the lemmatized list by
            # iterating through the `doc` and taking the lemma of each non-stopword token.
            # This correctly handles words that might have different lemmas depending on
            # their context (e.g., "leaves" as a noun vs. "leaves" as a verb).
            return [token.lemma_ for token in doc if not token.is_stop]
        return tokens

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Lemmatization",
            description="Normalize words to their canonical dictionary form using spaCy lemmatization.",
            code="lemmas = [token.lemma_ for token in doc]",
            input=self.tokens,
            output=self.output,
            explanation="Converted words to their root lexeme so downstream analysis uses consistent terms.",
        )
