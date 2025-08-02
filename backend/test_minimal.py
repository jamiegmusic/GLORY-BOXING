#!/usr/bin/env python3
"""
Test minimal server
"""

import asyncio
import httpx

async def test():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get('http://127.0.0.1:8000/')
            print(f"✅ Success: {response.json()}")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test()) 