#!/usr/bin/env python3
"""
Test script for enhanced FastAPI + GraphQL backend with authentication
"""

import asyncio
import httpx
import json

async def test_api():
    """Test the enhanced API with authentication"""
    print("🚀 Testing Enhanced Glory Boxing Manager API")
    print("=" * 50)
    
    # Test token for authentication
    headers = {"Authorization": "Bearer dev-token"}
    
    async with httpx.AsyncClient() as client:
        # Test root endpoint
        print("\n1. Testing root endpoint...")
        try:
            response = await client.get("http://localhost:8000/")
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
            response = await client.get("http://localhost:8000/health")
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
            response = await client.get("http://localhost:8000/api/fighters")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ REST fighters: {data['total']} fighters found")
                for fighter in data['data'][:2]:
                    print(f"   - {fighter['name']} ({fighter['weight_class']})")
            else:
                print(f"❌ REST fighters failed: {response.status_code}")
        except Exception as e:
            print(f"❌ REST fighters error: {e}")
        
        # Test GraphQL endpoint with authentication
        print("\n4. Testing GraphQL endpoint with authentication...")
        try:
            query = """
            query {
                getFighters {
                    id
                    name
                    weightClass
                    record
                    nationality
                    age
                }
            }
            """
            response = await client.post(
                "http://localhost:8000/graphql",
                json={"query": query},
                headers=headers
            )
            if response.status_code == 200:
                data = response.json()
                if "errors" not in data:
                    fighters = data["data"]["getFighters"]
                    print(f"✅ GraphQL fighters: {len(fighters)} fighters found")
                    for fighter in fighters[:2]:
                        print(f"   - {fighter['name']} ({fighter['weightClass']})")
                else:
                    print(f"❌ GraphQL query failed: {data['errors']}")
            else:
                print(f"❌ GraphQL endpoint failed: {response.status_code}")
        except Exception as e:
            print(f"❌ GraphQL endpoint error: {e}")
        
        # Test GraphQL mutation with authentication
        print("\n5. Testing GraphQL mutation with authentication...")
        try:
            mutation = """
            mutation {
                createFighter(name: "Test Fighter", weightClass: "Welterweight", record: "5-0-0", nationality: "USA", age: 26) {
                    id
                    name
                    weightClass
                    record
                }
            }
            """
            response = await client.post(
                "http://localhost:8000/graphql",
                json={"query": mutation},
                headers=headers
            )
            if response.status_code == 200:
                data = response.json()
                if "errors" not in data:
                    fighter = data["data"]["createFighter"]
                    print(f"✅ GraphQL mutation: Created fighter {fighter['name']}")
                else:
                    print(f"❌ GraphQL mutation failed: {data['errors']}")
            else:
                print(f"❌ GraphQL mutation failed: {response.status_code}")
        except Exception as e:
            print(f"❌ GraphQL mutation error: {e}")
        
        # Test GraphQL without authentication (should fail)
        print("\n6. Testing GraphQL without authentication (should fail)...")
        try:
            query = """
            query {
                getFighters {
                    id
                    name
                }
            }
            """
            response = await client.post(
                "http://localhost:8000/graphql",
                json={"query": query}
            )
            if response.status_code == 403:
                print("✅ Authentication working: Request properly rejected")
            else:
                print(f"❌ Authentication not working: {response.status_code}")
        except Exception as e:
            print(f"❌ Authentication test error: {e}")

async def main():
    """Main test function"""
    await test_api()
    
    print("\n" + "=" * 50)
    print("✅ Enhanced API test completed!")
    print("\n📚 Available endpoints:")
    print("- http://localhost:8000/ (root)")
    print("- http://localhost:8000/health (health check)")
    print("- http://localhost:8000/api/fighters (REST)")
    print("- http://localhost:8000/api/matches (REST)")
    print("- http://localhost:8000/graphql (GraphQL playground)")
    print("- http://localhost:8000/docs (API documentation)")
    print("\n🔐 Authentication:")
    print("- Use 'Bearer dev-token' in Authorization header for GraphQL")
    print("- REST endpoints don't require authentication")

if __name__ == "__main__":
    asyncio.run(main()) 