from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from backend.pipeline import NLPVisualizerPipeline
except ModuleNotFoundError:
    from pipeline import NLPVisualizerPipeline

app = FastAPI(title="NLP Pipeline Visualizer", version="1.0.0")

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
    pipeline = NLPVisualizerPipeline(payload.text)
    steps = pipeline.run()
    return {"steps": [step.model_dump() for step in steps]}
