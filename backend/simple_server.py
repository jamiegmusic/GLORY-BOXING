#!/usr/bin/env python3
"""
Simple server for testing
"""

from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    print("Starting server on http://localhost:8000")
    uvicorn.run(app, host="localhost", port=8000) 