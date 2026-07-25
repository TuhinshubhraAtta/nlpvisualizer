from __future__ import annotations
from typing import Any, Callable, TYPE_CHECKING

if TYPE_CHECKING:
    from spacy.language import Language
    from transformers import PreTrainedTokenizerBase


try:
    from backend.models import PipelineStep
    from backend.preprocessors.cleaning import CleaningStep
    from backend.preprocessors.tokenizer import NERStep, POSStep, SubwordTokenizerStep, WordTokenizerStep
    from backend.preprocessors.stopwords import StopwordStep
    from backend.preprocessors.stemmer import StemmerStep
    from backend.preprocessors.lemmatizer import LemmatizerStep
    from backend.preprocessors.embeddings import EmbeddingStep
except ModuleNotFoundError:
    from models import PipelineStep
    from preprocessors.cleaning import CleaningStep
    from preprocessors.tokenizer import NERStep, POSStep, SubwordTokenizerStep, WordTokenizerStep
    from preprocessors.stopwords import StopwordStep
    from preprocessors.stemmer import StemmerStep
    from preprocessors.lemmatizer import LemmatizerStep
    from preprocessors.embeddings import EmbeddingStep


class NLPVisualizerPipeline:
    def __init__(
        self, text: str, nlp_model: "Language | None" = None, subword_tokenizer: "PreTrainedTokenizerBase | None" = None
    ) -> None:
        self.text = text
        self.nlp = nlp_model
        self.subword_tokenizer = subword_tokenizer

    def run(self) -> list[PipelineStep]:
        steps: list[PipelineStep] = []

        current = self.text
        cleaning = CleaningStep(current)
        steps.append(cleaning.step())
        current = cleaning.output

        lower = CleaningStep.lowercase(current)
        steps.append(lower)
        current = lower.output

        subword_step = SubwordTokenizerStep(current, self.subword_tokenizer)
        steps.append(subword_step.step())
        # Sub-word tokens are not passed down the pipeline as other steps are word-based.
        
        doc = self.nlp(current) if self.nlp is not None else None

        word_token_step = WordTokenizerStep(current, doc)
        steps.append(word_token_step.step())
        token_list = word_token_step.output

        pos = POSStep(token_list, doc) # POS tagging uses the original doc
        steps.append(pos.step())

        entities = NERStep(token_list, doc) # NER also uses the original doc
        steps.append(entities.step())

        # Stopword removal happens on the token list, but can use the doc for accuracy
        stopwords = StopwordStep(token_list, doc) 
        steps.append(stopwords.step())
        tokens_after_stopwords = stopwords.output

        stemmer = StemmerStep(tokens_after_stopwords)
        steps.append(stemmer.step())

        # Lemmatization should use the original doc to get lemmas for tokens *before* stopwords were removed.
        lemmatizer = LemmatizerStep(tokens_after_stopwords, doc)
        steps.append(lemmatizer.step())
        current = lemmatizer.output # Final list of tokens after lemmatization

        embedding = EmbeddingStep(current)
        steps.append(embedding.step())

        return steps
