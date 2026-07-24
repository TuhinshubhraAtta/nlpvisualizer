from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from backend.pipeline import NLPVisualizerPipeline
except ModuleNotFoundError:
    from pipeline import NLPVisualizerPipeline

pipeline: NLPVisualizerPipeline | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipeline
    pipeline = NLPVisualizerPipeline()
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
    if pipeline is None:
        # This would indicate a startup error.
        return {"error": "Pipeline not initialized"}
    steps = pipeline.run(payload.text)
    return {"steps": [step.model_dump() for step in steps]}
