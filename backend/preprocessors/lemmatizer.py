from __future__ import annotations

try:
    from backend.models import PipelineStep
except ModuleNotFoundError:
    from models import PipelineStep


class LemmatizerStep:
    def __init__(self, tokens: list[str], doc: object | None = None) -> None:
        self.tokens = tokens
        self.doc = doc
        self.output = self._lemmatize(tokens, doc)

    @staticmethod
    def _lemmatize(tokens: list[str], doc: object | None = None) -> list[str]:
        if doc is not None:
            return [token.lemma_ for token in doc]
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
