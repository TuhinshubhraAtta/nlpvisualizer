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


class NLPVisualizerPipeline:
    def __init__(self, text: str, nlp_model: object | None = None) -> None:
        self.text = text
        self.nlp = nlp_model

    def run(self) -> list[PipelineStep]:
        steps: list[PipelineStep] = []

        current = self.text
        cleaning = CleaningStep(current)
        steps.append(cleaning.step())
        current = cleaning.output

        lower = CleaningStep.lowercase(current)
        steps.append(lower)
        current = lower.output

        doc = self.nlp(current) if self.nlp is not None else None

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

        stemmer = StemmerStep(current) # current is a list of tokens
        steps.append(stemmer.step())

        # Re-run spacy on the post-stopword text for accurate lemmatization
        doc_after_stopwords = self.nlp(" ".join(current)) if self.nlp is not None else None
        lemmatizer = LemmatizerStep(current, doc_after_stopwords)
        steps.append(lemmatizer.step())
        current = lemmatizer.output

        embedding = EmbeddingStep(current)
        steps.append(embedding.step())

        return steps
