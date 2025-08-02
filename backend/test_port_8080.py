#!/usr/bin/env python3
"""
Test script for port 8080
"""

import asyncio
import httpx

async def test_api():
    """Test the API on port 8080"""
    print("🚀 Testing API on port 8080")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        # Test root endpoint
        print("\n1. Testing root endpoint...")
        try:
            response = await client.get("http://localhost:8080/")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Root endpoint: {data}")
            else:
                print(f"❌ Root endpoint failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Root endpoint error: {e}")
        
        # Test health endpoint
        print("\n2. Testing health endpoint...")
        try:
            response = await client.get("http://localhost:8080/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health endpoint: {data}")
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Health endpoint error: {e}")

async def main():
    """Main test function"""
    await test_api()

if __name__ == "__main__":
    asyncio.run(main()) 