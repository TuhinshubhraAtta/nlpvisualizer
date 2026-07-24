try:
    from backend.models import PipelineStep
except ModuleNotFoundError:
    from models import PipelineStep


class EmbeddingStep:
    def __init__(self, tokens: list[str]) -> None:
        self.tokens = tokens
        self.output = self._embed(tokens)

    @staticmethod
    def _embed(tokens: list[str]) -> list[dict[str, float | str]]:
        return [
            {"token": token, "vector": [float(len(token)) / 10, float(len(token)) / 20]}
            for token in tokens
        ]

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Embeddings",
            description="Project tokens into a simple vector space for semantic similarity exploration.",
            code="vector = [len(token)/10, len(token)/20]",
            input=self.tokens,
            output=self.output,
            explanation="Represented each token as a compact vector embedding.",
        )
