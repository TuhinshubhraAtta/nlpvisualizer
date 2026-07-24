export type DiagramNode = {
  id: string;
  label: string;
  file: string;
  kind: "file" | "class" | "function" | "route";
  description: string;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label: string;
};

export const nodes: DiagramNode[] = [
  {
    id: "frontend-app",
    label: "App.tsx",
    file: "frontend/src/App.tsx",
    kind: "file",
    description:
      "Main React UI that renders the pipeline runner, timeline, inspector, export, and playback controls.",
  },
  {
    id: "run-pipeline",
    label: "runPipeline()",
    file: "frontend/src/App.tsx",
    kind: "function",
    description:
      "Submits the user text to the backend and stores the step-by-step payload from the /preprocess response.",
  },
  {
    id: "export-json",
    label: "exportJson()",
    file: "frontend/src/App.tsx",
    kind: "function",
    description:
      "Exports the current text and pipeline steps as a JSON artifact for inspection or demos.",
  },
  {
    id: "backend-app",
    label: "app.py",
    file: "backend/app.py",
    kind: "file",
    description:
      "FastAPI entrypoint that exposes the healthcheck and preprocess routes.",
  },
  {
    id: "preprocess-route",
    label: "POST /preprocess",
    file: "backend/app.py",
    kind: "route",
    description:
      "Creates the NLPVisualizerPipeline, runs it, and returns serialized PipelineStep payloads.",
  },
  {
    id: "health-route",
    label: "GET /health",
    file: "backend/app.py",
    kind: "route",
    description:
      "Simple status endpoint that confirms the backend is available.",
  },
  {
    id: "pipeline-class",
    label: "NLPVisualizerPipeline",
    file: "backend/pipeline.py",
    kind: "class",
    description:
      "Pipeline orchestrator that loads spaCy, runs every step, and passes data from one transformer to the next.",
  },
  {
    id: "pipeline-run",
    label: "run()",
    file: "backend/pipeline.py",
    kind: "function",
    description:
      "Builds the ordered list of preprocessing outputs: cleaning, lowercasing, tokenization, POS, NER, stopword removal, stemming, lemmatization, and embeddings.",
  },
  {
    id: "pipeline-step-model",
    label: "PipelineStep",
    file: "backend/models.py",
    kind: "class",
    description:
      "Shared JSON-serializable dataclass contract for every pipeline stage.",
  },
  {
    id: "cleaning-step",
    label: "CleaningStep",
    file: "backend/preprocessors/cleaning.py",
    kind: "class",
    description:
      "Removes HTML, links, punctuation, emojis, and whitespace noise before any NLP processing.",
  },
  {
    id: "tokenizer-step",
    label: "TokenizerStep",
    file: "backend/preprocessors/tokenizer.py",
    kind: "class",
    description:
      "Splits the cleaned text into tokens using spaCy when available.",
  },
  {
    id: "pos-step",
    label: "POSStep",
    file: "backend/preprocessors/tokenizer.py",
    kind: "class",
    description:
      "Adds part-of-speech metadata to each token for grammar-aware inspection.",
  },
  {
    id: "ner-step",
    label: "NERStep",
    file: "backend/preprocessors/tokenizer.py",
    kind: "class",
    description:
      "Extracts named entities such as organizations, locations, and people.",
  },
  {
    id: "stopword-step",
    label: "StopwordStep",
    file: "backend/preprocessors/stopwords.py",
    kind: "class",
    description:
      "Removes semantically low-signal stopwords from the token stream.",
  },
  {
    id: "stemmer-step",
    label: "StemmerStep",
    file: "backend/preprocessors/stemmer.py",
    kind: "class",
    description:
      "Trims common suffixes to generate a simple stemmed form of each token.",
  },
  {
    id: "lemmatizer-step",
    label: "LemmatizerStep",
    file: "backend/preprocessors/lemmatizer.py",
    kind: "class",
    description:
      "Normalizes tokens to their canonical lemma forms using spaCy lemmas when available.",
  },
  {
    id: "embedding-step",
    label: "EmbeddingStep",
    file: "backend/preprocessors/embeddings.py",
    kind: "class",
    description:
      "Represents tokens as lightweight vector-like metadata for downstream similarity exploration.",
  },
];

export const edges: DiagramEdge[] = [
  { from: "frontend-app", to: "run-pipeline", label: "calls" },
  { from: "frontend-app", to: "export-json", label: "exports" },
  { from: "run-pipeline", to: "preprocess-route", label: "POST JSON" },
  { from: "backend-app", to: "preprocess-route", label: "hosts" },
  { from: "preprocess-route", to: "pipeline-class", label: "instantiates" },
  { from: "pipeline-class", to: "pipeline-run", label: "executes" },
  { from: "pipeline-run", to: "cleaning-step", label: "creates" },
  { from: "pipeline-run", to: "tokenizer-step", label: "creates" },
  { from: "pipeline-run", to: "pos-step", label: "creates" },
  { from: "pipeline-run", to: "ner-step", label: "creates" },
  { from: "pipeline-run", to: "stopword-step", label: "creates" },
  { from: "pipeline-run", to: "stemmer-step", label: "creates" },
  { from: "pipeline-run", to: "lemmatizer-step", label: "creates" },
  { from: "pipeline-run", to: "embedding-step", label: "creates" },
  { from: "pipeline-step-model", to: "pipeline-run", label: "shape" },
  { from: "cleaning-step", to: "pipeline-step-model", label: "returns" },
  { from: "tokenizer-step", to: "pipeline-step-model", label: "returns" },
  { from: "pos-step", to: "pipeline-step-model", label: "returns" },
  { from: "ner-step", to: "pipeline-step-model", label: "returns" },
  { from: "stopword-step", to: "pipeline-step-model", label: "returns" },
  { from: "stemmer-step", to: "pipeline-step-model", label: "returns" },
  { from: "lemmatizer-step", to: "pipeline-step-model", label: "returns" },
  { from: "embedding-step", to: "pipeline-step-model", label: "returns" },
];

export const codeMap: Record<string, string> = {
  "cleaning-step": "CleaningStep",
  "tokenizer-step": "TokenizerStep",
  "pos-step": "POSStep",
  "ner-step": "NERStep",
  "stopword-step": "StopwordStep",
  "stemmer-step": "StemmerStep",
  "lemmatizer-step": "LemmatizerStep",
  "embedding-step": "EmbeddingStep",
};
