#!/usr/bin/env python3
"""
Test script for working server
"""

import asyncio
import httpx
import json

async def test_api():
    """Test the working API"""
    print("🚀 Testing Working Glory Boxing Manager API")
    print("=" * 50)
    
    # Test token for authentication
    headers = {"Authorization": "Bearer dev-token"}
    
    async with httpx.AsyncClient() as client:
        # Test root endpoint
        print("\n1. Testing root endpoint...")
        try:
            response = await client.get("http://127.0.0.1:8000/")
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
            response = await client.get("http://127.0.0.1:8000/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health endpoint: {data}")
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Health endpoint error: {e}")
        
        # Test REST fighters endpoint
        print("\n3. Testing REST fighters endpoint...")
        try:
            response = await client.get("http://127.0.0.1:8000/api/fighters")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ REST fighters: {data['total']} fighters found")
                for fighter in data['data'][:2]:
                    print(f"   - {fighter['name']} ({fighter['weight_class']})")
            else:
                print(f"❌ REST fighters failed: {response.status_code}")
        except Exception as e:
            print(f"❌ REST fighters error: {e}")
        
        # Test create fighter with authentication
        print("\n4. Testing create fighter with authentication...")
        try:
            fighter_data = {
                "name": "Test Fighter",
                "weight_class": "Welterweight",
                "record": "5-0-0",
                "nationality": "USA",
                "age": 26
            }
            response = await client.post(
                "http://127.0.0.1:8000/api/fighters",
                json=fighter_data,
                headers=headers
            )
            if response.status_code == 200:
                fighter = response.json()
                print(f"✅ Created fighter: {fighter['name']}")
            else:
                print(f"❌ Create fighter failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Create fighter error: {e}")
        
        # Test create match with authentication
        print("\n5. Testing create match with authentication...")
        try:
            match_data = {
                "fighter_a_id": 1,
                "fighter_b_id": 2,
                "venue": "O2 Arena",
                "date": "2024-12-25"
            }
            response = await client.post(
                "http://127.0.0.1:8000/api/matches",
                json=match_data,
                headers=headers
            )
            if response.status_code == 200:
                match = response.json()
                print(f"✅ Created match: {match['fighter_a']['name']} vs {match['fighter_b']['name']}")
            else:
                print(f"❌ Create match failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Create match error: {e}")
        
        # Test REST matches endpoint
        print("\n6. Testing REST matches endpoint...")
        try:
            response = await client.get("http://127.0.0.1:8000/api/matches")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ REST matches: {data['total']} matches found")
                for match in data['data'][:2]:
                    print(f"   - {match['fighter_a']['name']} vs {match['fighter_b']['name']}")
            else:
                print(f"❌ REST matches failed: {response.status_code}")
        except Exception as e:
            print(f"❌ REST matches error: {e}")

async def main():
    """Main test function"""
    await test_api()
    
    print("\n" + "=" * 50)
    print("✅ Working API test completed!")
    print("\n📚 Available endpoints:")
    print("- http://127.0.0.1:8000/ (root)")
    print("- http://127.0.0.1:8000/health (health check)")
    print("- http://127.0.0.1:8000/api/fighters (REST)")
    print("- http://127.0.0.1:8000/api/matches (REST)")
    print("- http://127.0.0.1:8000/docs (API documentation)")
    print("\n🔐 Authentication:")
    print("- Use 'Bearer dev-token' in Authorization header for mutations")

if __name__ == "__main__":
    asyncio.run(main()) 