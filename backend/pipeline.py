from __future__ import annotations

try:
    from backend.models import PipelineStep
    from backend.preprocessors.cleaning import CleaningStep
    from backend.preprocessors.tokenizer import NERStep, POSStep, TokenizerStep
    from backend.preprocessors.stopwords import StopwordStep
    from backend.preprocessors.stemmer import StemmerStep
    from backend.preprocessors.lemmatizer import LemmatizerStep
    from backend.preprocessors.embeddings import EmbeddingStep
except ModuleNotFoundError:
    from models import PipelineStep
    from preprocessors.cleaning import CleaningStep
    from preprocessors.tokenizer import NERStep, POSStep, TokenizerStep
    from preprocessors.stopwords import StopwordStep
    from preprocessors.stemmer import StemmerStep
    from preprocessors.lemmatizer import LemmatizerStep
    from preprocessors.embeddings import EmbeddingStep

try:
    import spacy
except ImportError:  # pragma: no cover - environment fallback
    spacy = None


class NLPVisualizerPipeline:
    def __init__(self, text: str) -> None:
        self.text = text

    def _load_nlp(self):
        if spacy is None:
            return None
        try:
            return spacy.load("en_core_web_sm")
        except OSError:
            try:
                return spacy.blank("en")
            except Exception:
                return None

    def run(self) -> list[PipelineStep]:
        steps: list[PipelineStep] = []

        current = self.text
        cleaning = CleaningStep(current)
        steps.append(cleaning.step())
        current = cleaning.output

        lower = CleaningStep.lowercase(current)
        steps.append(lower)
        current = lower.output

        nlp = self._load_nlp()
        doc = nlp(current) if nlp is not None else None

        token_step = TokenizerStep(current, doc)
        steps.append(token_step.step())
        token_list = token_step.output

        pos = POSStep(token_list, doc)
        steps.append(pos.step())

        entities = NERStep(token_list, doc)
        steps.append(entities.step())

        stopwords = StopwordStep(token_list, doc)
        steps.append(stopwords.step())
        current = stopwords.output

        stemmer = StemmerStep(current)
        steps.append(stemmer.step())
        current = stemmer.output

        lemmatizer = LemmatizerStep(current, doc)
        steps.append(lemmatizer.step())
        current = lemmatizer.output

        embedding = EmbeddingStep(current)
        steps.append(embedding.step())

        return steps
