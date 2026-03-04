#!/usr/bin/env python
"""
Run the Token Risk Intelligence Engine API server.
"""
import uvicorn
import sys

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
