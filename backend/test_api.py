#!/usr/bin/env python3
"""
Test script for Glory Boxing Manager FastAPI Backend
Verifies API setup and database connection
"""

import asyncio
import httpx
import json
from app.database import db

async def test_database_connection():
    """Test database connection"""
    print("🔍 Testing database connection...")
    try:
        fighters = await db.get_fighters(limit=1)
        print(f"✅ Database connected successfully! Found {len(fighters)} fighters")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

async def test_api_endpoints():
    """Test API endpoints"""
    print("\n🔍 Testing API endpoints...")
    
    async with httpx.AsyncClient() as client:
        # Test root endpoint
        try:
            response = await client.get("http://localhost:8000/")
            if response.status_code == 200:
                print("✅ Root endpoint working")
            else:
                print(f"❌ Root endpoint failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Root endpoint error: {e}")
        
        # Test health endpoint
        try:
            response = await client.get("http://localhost:8000/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health endpoint working: {data}")
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Health endpoint error: {e}")
        
        # Test fighters endpoint
        try:
            response = await client.get("http://localhost:8000/api/fighters")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Fighters endpoint working: {data['total']} fighters found")
            else:
                print(f"❌ Fighters endpoint failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Fighters endpoint error: {e}")
        
        # Test GraphQL endpoint
        try:
            query = """
            query {
                fighters(limit: 1) {
                    id
                    name
                    age
                    nationality
                    weightClass
                }
            }
            """
            response = await client.post(
                "http://localhost:8000/graphql",
                json={"query": query}
            )
            if response.status_code == 200:
                data = response.json()
                if "errors" not in data:
                    print("✅ GraphQL endpoint working")
                else:
                    print(f"❌ GraphQL query failed: {data['errors']}")
            else:
                print(f"❌ GraphQL endpoint failed: {response.status_code}")
        except Exception as e:
            print(f"❌ GraphQL endpoint error: {e}")

async def test_graphql_schema():
    """Test GraphQL schema introspection"""
    print("\n🔍 Testing GraphQL schema...")
    
    async with httpx.AsyncClient() as client:
        try:
            introspection_query = """
            query IntrospectionQuery {
                __schema {
                    types {
                        name
                        kind
                    }
                }
            }
            """
            response = await client.post(
                "http://localhost:8000/graphql",
                json={"query": introspection_query}
            )
            if response.status_code == 200:
                data = response.json()
                if "errors" not in data:
                    types = data["data"]["__schema"]["types"]
                    type_names = [t["name"] for t in types if t["kind"] == "OBJECT"]
                    print(f"✅ GraphQL schema loaded with {len(type_names)} types")
                    print(f"   Available types: {', '.join(type_names[:10])}...")
                else:
                    print(f"❌ GraphQL introspection failed: {data['errors']}")
            else:
                print(f"❌ GraphQL introspection failed: {response.status_code}")
        except Exception as e:
            print(f"❌ GraphQL introspection error: {e}")

async def main():
    """Main test function"""
    print("🚀 Glory Boxing Manager API Test Suite")
    print("=" * 50)
    
    # Test database connection
    db_ok = await test_database_connection()
    
    if not db_ok:
        print("\n❌ Database connection failed. Please check your Supabase configuration.")
        return
    
    # Test API endpoints
    await test_api_endpoints()
    
    # Test GraphQL schema
    await test_graphql_schema()
    
    print("\n" + "=" * 50)
    print("✅ Test suite completed!")
    print("\n📚 Next steps:")
    print("1. Visit http://localhost:8000/docs for API documentation")
    print("2. Visit http://localhost:8000/graphql for GraphQL playground")
    print("3. Test the API with your frontend application")

if __name__ == "__main__":
    asyncio.run(main()) 