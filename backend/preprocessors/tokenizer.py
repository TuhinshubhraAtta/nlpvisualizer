from __future__ import annotations
from typing import TYPE_CHECKING

try:
    from backend.models import PipelineStep
except ModuleNotFoundError:
    from models import PipelineStep

if TYPE_CHECKING:
    from spacy.tokens import Doc
    from transformers import PreTrainedTokenizerBase


class WordTokenizerStep:
    def __init__(self, text: str, doc: "Doc | None" = None) -> None:
        self.text = text
        self.doc = doc
        self.output = self._tokenize(text, doc)

    @staticmethod
    def _tokenize(text: str, doc: "Doc | None" = None) -> list[str]:
        if doc is not None:
            return [token.text for token in doc]
        return text.split()

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Word Tokenization",
            description="Use spaCy's linguistic rules to split the sentence into word-level tokens.",
            code="doc = nlp(text)\ntokens = [token.text for token in doc]",
            input=self.text,
            output=self.output,
            explanation="Split the sentence into word tokens using spaCy's model.",
        )


class SubwordTokenizerStep:
    def __init__(self, text: str, tokenizer: "PreTrainedTokenizerBase | None" = None) -> None:
        self.text = text
        self.tokenizer = tokenizer
        self.output = self._tokenize(text, tokenizer)

    @staticmethod
    def _tokenize(text: str, tokenizer: "PreTrainedTokenizerBase | None" = None) -> list[str]:
        if tokenizer is not None:
            # Use the __call__ method of the tokenizer and then decode
            return tokenizer.tokenize(text)
        return ["Subword", "tokenizer", "not", "available", "."]

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Subword Tokenization",
            description="Use a subword tokenizer (like BPE) to split text into sub-word units, common in transformer models.",
            code="tokens = tokenizer.tokenize(text)",
            input=self.text,
            output=self.output,
            explanation="Split the sentence into subword tokens, which can handle out-of-vocabulary words.",
        )


class POSStep:
    def __init__(self, tokens: list[str], doc: "Doc | None" = None) -> None:
        self.tokens = tokens
        self.doc = doc
        self.output = self._pos(doc, tokens)

    @staticmethod
    def _pos(doc: "Doc | None", tokens: list[str]) -> list[dict[str, str]]:
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
    def __init__(self, tokens: list[str], doc: "Doc | None" = None) -> None:
        self.tokens = tokens
        self.doc = doc
        self.output = self._entities(doc, tokens)

    @staticmethod
    def _entities(doc: "Doc | None", tokens: list[str]) -> list[dict[str, str | int]]:
        if doc is not None:
            return [
                {"text": entity.text, "label": entity.label_, "start": entity.start_char, "end": entity.end_char}
                for entity in doc.ents
            ]
        return []

    def step(self) -> PipelineStep:
        return PipelineStep(
            name="Named Entity Recognition",
            description="Extract real-world entities such as people, organizations, and locations from the sentence.",
            code="entities = [(entity.text, entity.label_) for entity in doc.ents]",
            input=self.tokens,
            output=self.output,
            explanation="Identified entities in the text to reveal meaningful named structures.",
        )
