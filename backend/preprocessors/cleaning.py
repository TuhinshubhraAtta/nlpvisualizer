import re

try:
    from backend.models import PipelineStep
except ModuleNotFoundError:
    from models import PipelineStep


class CleaningStep:
    def __init__(self, text: str) -> None:
        self.text = text
        self.output = self._clean(text)

    @staticmethod
    def lowercase(text: str) -> PipelineStep:
        return PipelineStep(
            name="Lowercase",
            description="Normalize text to lowercase for consistent downstream processing.",
            code="text = text.lower()",
            input=text,
            output=text.lower(),
            explanation="Converted all characters to lowercase.",
        )

    @staticmethod
    def _clean(text: str) -> str:
        text = re.sub(r"<.*?>", "", text)
        text = re.sub(r"http\S+", "", text)
        text = re.sub(r"[^\w\s]", "", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Cleaning",
            description="Remove noise such as HTML tags, links, emojis, and repeated whitespace.",
            code="text = re.sub(r'<.*?>', '', text)\ntext = re.sub(r'http\\S+', '', text)\ntext = re.sub(r'[^\\w\\s]', '', text)\ntext = re.sub(r'\\s+', ' ', text)\nreturn text.strip()",
            input=self.text,
            output=self.output,
            explanation="Removed punctuation, emojis, repeated spaces, and HTML markup.",
        )
