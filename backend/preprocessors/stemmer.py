try:
    from backend.models import PipelineStep
except ModuleNotFoundError:
    from models import PipelineStep


class StemmerStep:
    def __init__(self, tokens: list[str]) -> None:
        self.tokens = tokens
        self.output = self._stem(tokens)

    @staticmethod
    def _stem(tokens: list[str]) -> list[str]:
        return [token.rstrip("ing") or token for token in tokens]

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Stemming",
            description="Reduce words to their root form by trimming suffixes.",
            code="token = token.rstrip('ing') or token",
            input=self.tokens,
            output=self.output,
            explanation="Reduced inflected words to their stem for normalization.",
        )
