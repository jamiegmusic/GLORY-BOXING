#!/usr/bin/env python3
"""
Minimal FastAPI + GraphQL server for Glory Boxing Manager
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "minimal_app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 