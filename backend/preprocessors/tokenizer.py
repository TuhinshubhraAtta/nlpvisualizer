from __future__ import annotations

try:
    from backend.models import PipelineStep
except ModuleNotFoundError:
    from models import PipelineStep

try:
    import spacy
except ImportError:  # pragma: no cover - environment fallback
    spacy = None


class TokenizerStep:
    def __init__(self, text: str, doc: object | None = None) -> None:
        self.text = text
        self.doc = doc
        self.output = self._tokenize(text, doc)

    @staticmethod
    def _tokenize(text: str, doc: object | None = None) -> list[str]:
        if doc is not None:
            return [token.text for token in doc]
        return text.split()

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Tokenization",
            description="Use spaCy tokenization to split the cleaned sentence into discrete tokens.",
            code="doc = nlp(text)\ntokens = [token.text for token in doc]",
            input=self.text,
            output=self.output,
            explanation="Split the sentence into authentic spaCy tokens.",
        )


class POSStep:
    def __init__(self, tokens: list[str], doc: object | None = None) -> None:
        self.tokens = tokens
        self.doc = doc
        self.output = self._pos(doc, tokens)

    @staticmethod
    def _pos(doc: object | None, tokens: list[str]) -> list[dict[str, str]]:
        if doc is not None:
            return [
                {"token": token.text, "pos": token.pos_, "tag": token.tag_}
                for token in doc
            ]
        return [{"token": token, "pos": "UNKNOWN", "tag": "UNKNOWN"} for token in tokens]

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="POS Tagging",
            description="Attach part-of-speech labels to each token using spaCy's linguistic model.",
            code="for token in doc:\n    print(token.text, token.pos_, token.tag_)",
            input=self.tokens,
            output=self.output,
            explanation="Assigned a grammatical part-of-speech label to each token.",
        )


class NERStep:
    def __init__(self, tokens: list[str], doc: object | None = None) -> None:
        self.tokens = tokens
        self.doc = doc
        self.output = self._entities(doc, tokens)

    @staticmethod
    def _entities(doc: object | None, tokens: list[str]) -> list[dict[str, str]]:
        if doc is not None:
            return [
                {"text": entity.text, "label": entity.label_, "start": entity.start_char, "end": entity.end_char}
                for entity in doc.ents
            ]
        return [{"text": token, "label": "UNKNOWN", "start": 0, "end": 0} for token in tokens]

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Named Entity Recognition",
            description="Extract real-world entities such as people, organizations, and locations from the sentence.",
            code="entities = [(entity.text, entity.label_) for entity in doc.ents]",
            input=self.tokens,
            output=self.output,
            explanation="Identified entities in the text to reveal meaningful named structures.",
        )
