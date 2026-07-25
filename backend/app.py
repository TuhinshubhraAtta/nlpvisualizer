from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pipeline import NLPVisualizerPipeline

try:
    import spacy
except ImportError:
    spacy = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the NLP model on startup and share it across requests."""
    nlp_model = None
    if spacy:
        try:
            nlp_model = spacy.load("en_core_web_sm")
        except OSError:
            logging.warning("Spacy model 'en_core_web_sm' not found. NLP features will be limited.")
    app.state.nlp = nlp_model
    yield


app = FastAPI(title="NLP Pipeline Visualizer", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PreprocessRequest(BaseModel):
    text: str


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/preprocess")
def preprocess(payload: PreprocessRequest) -> dict:
    pipeline = NLPVisualizerPipeline(payload.text, nlp_model=app.state.nlp)
    steps = pipeline.run()
    return {"steps": [step.model_dump() for step in steps]}
