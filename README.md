# NLP Visualizer

This project is a web-based tool for visualizing Natural Language Processing (NLP) pipelines. It provides a user-friendly interface to understand the various stages of NLP, from text preprocessing to embeddings and model analysis.

## Features

- **Interactive Diagram:** Visualize the entire NLP pipeline as a directed graph.
- **Step-by-step Analysis:** Inspect the output of each processing stage.
- **Customizable Pipelines:** (Coming Soon) Build and modify your own NLP pipelines.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Python](https://www.python.org/) (v3.9 or newer) and `pip`

### Backend Setup

1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the development server: `uvicorn app:app --reload`

The backend will be available at `http://127.0.0.1:8000`.

### Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Tech Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Python, FastAPI
