#!/usr/bin/env python3
"""
Example usage scripts for Glory Boxing Manager FastAPI Backend
Demonstrates how to use the REST and GraphQL APIs
"""

import asyncio
import httpx
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8000"

async def example_rest_api():
    """Example REST API usage"""
    print("🔍 REST API Examples")
    print("=" * 40)
    
    async with httpx.AsyncClient() as client:
        # Get all fighters
        print("\n1. Getting all fighters...")
        response = await client.get(f"{BASE_URL}/api/fighters")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {data['total']} fighters")
            for fighter in data['data'][:3]:  # Show first 3
                print(f"   - {fighter['name']} ({fighter['nationality']})")
        else:
            print(f"❌ Failed: {response.status_code}")
        
        # Get specific fighter
        print("\n2. Getting specific fighter...")
        if response.status_code == 200 and data['data']:
            fighter_id = data['data'][0]['id']
            response = await client.get(f"{BASE_URL}/api/fighters/{fighter_id}")
            if response.status_code == 200:
                fighter = response.json()['data']
                print(f"✅ Fighter: {fighter['name']} - {fighter['weight_class']}")
            else:
                print(f"❌ Failed: {response.status_code}")
        
        # Get matches
        print("\n3. Getting matches...")
        response = await client.get(f"{BASE_URL}/api/matches")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {data['total']} matches")
        else:
            print(f"❌ Failed: {response.status_code}")
        
        # Get rankings
        print("\n4. Getting rankings...")
        response = await client.get(f"{BASE_URL}/api/rankings")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {data['total']} rankings")
        else:
            print(f"❌ Failed: {response.status_code}")

async def example_graphql_api():
    """Example GraphQL API usage"""
    print("\n🔍 GraphQL API Examples")
    print("=" * 40)
    
    async with httpx.AsyncClient() as client:
        # Get fighters with GraphQL
        print("\n1. Getting fighters with GraphQL...")
        query = """
        query {
            fighters(limit: 5) {
                id
                name
                age
                nationality
                weightClass
                stance
                promoter
                proRecord
                realWorldRanking
            }
        }
        """
        response = await client.post(
            f"{BASE_URL}/graphql",
            json={"query": query}
        )
        if response.status_code == 200:
            data = response.json()
            if "errors" not in data:
                fighters = data["data"]["fighters"]
                print(f"✅ Found {len(fighters)} fighters")
                for fighter in fighters[:3]:
                    print(f"   - {fighter['name']} ({fighter['weightClass']})")
            else:
                print(f"❌ GraphQL errors: {data['errors']}")
        else:
            print(f"❌ Failed: {response.status_code}")
        
        # Get matches with GraphQL
        print("\n2. Getting matches with GraphQL...")
        query = """
        query {
            matches(limit: 5) {
                id
                fighterA
                fighterB
                venue
                scheduledRounds
                result
                winner
                titleFight
                fightDate
            }
        }
        """
        response = await client.post(
            f"{BASE_URL}/graphql",
            json={"query": query}
        )
        if response.status_code == 200:
            data = response.json()
            if "errors" not in data:
                matches = data["data"]["matches"]
                print(f"✅ Found {len(matches)} matches")
            else:
                print(f"❌ GraphQL errors: {data['errors']}")
        else:
            print(f"❌ Failed: {response.status_code}")
        
        # Get rankings with GraphQL
        print("\n3. Getting rankings with GraphQL...")
        query = """
        query {
            rankings(weightClass: "heavyweight") {
                id
                weightClass
                rankPosition
                fighterId
                points
                realWorldRanking
                organization
                winStreak
            }
        }
        """
        response = await client.post(
            f"{BASE_URL}/graphql",
            json={"query": query}
        )
        if response.status_code == 200:
            data = response.json()
            if "errors" not in data:
                rankings = data["data"]["rankings"]
                print(f"✅ Found {len(rankings)} heavyweight rankings")
            else:
                print(f"❌ GraphQL errors: {data['errors']}")
        else:
            print(f"❌ Failed: {response.status_code}")

async def example_create_data():
    """Example of creating data via API"""
    print("\n🔍 Creating Data Examples")
    print("=" * 40)
    
    async with httpx.AsyncClient() as client:
        # Create a new fighter via REST
        print("\n1. Creating a new fighter via REST...")
        fighter_data = {
            "name": "Example Fighter",
            "age": 28,
            "nationality": "USA",
            "weight_class": "welterweight",
            "stance": "orthodox",
            "promoter": "Example Promotions",
            "amateur_record": "15-2-0",
            "pro_record": "8-0-0"
        }
        response = await client.post(
            f"{BASE_URL}/api/fighters",
            json=fighter_data
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Fighter created: {data['data']['name']}")
            fighter_id = data['data']['id']
        else:
            print(f"❌ Failed to create fighter: {response.status_code}")
            fighter_id = None
        
        # Create a match via GraphQL
        if fighter_id:
            print("\n2. Creating a match via GraphQL...")
            mutation = """
            mutation {
                createMatch(match: {
                    fighterA: "%s"
                    fighterB: "%s"
                    venue: "Example Arena"
                    scheduledRounds: 10
                    titleFight: false
                }) {
                    id
                    fighterA
                    fighterB
                    venue
                    scheduledRounds
                    titleFight
                }
            }
            """ % (fighter_id, fighter_id)  # Using same fighter for demo
            
            response = await client.post(
                f"{BASE_URL}/graphql",
                json={"query": mutation}
            )
            if response.status_code == 200:
                data = response.json()
                if "errors" not in data:
                    match = data["data"]["createMatch"]
                    print(f"✅ Match created: {match['venue']}")
                else:
                    print(f"❌ GraphQL errors: {data['errors']}")
            else:
                print(f"❌ Failed: {response.status_code}")

async def example_health_check():
    """Example health check"""
    print("\n🔍 Health Check")
    print("=" * 40)
    
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API Status: {data['status']}")
            print(f"✅ Database: {data['database']}")
            print(f"✅ Fighters Count: {data['fighters_count']}")
        else:
            print(f"❌ Health check failed: {response.status_code}")

async def main():
    """Main example function"""
    print("🚀 Glory Boxing Manager API Examples")
    print("=" * 50)
    
    # Health check
    await example_health_check()
    
    # REST API examples
    await example_rest_api()
    
    # GraphQL API examples
    await example_graphql_api()
    
    # Create data examples
    await example_create_data()
    
    print("\n" + "=" * 50)
    print("✅ Examples completed!")
    print("\n📚 More examples:")
    print("- Visit http://localhost:8000/docs for interactive API docs")
    print("- Visit http://localhost:8000/graphql for GraphQL playground")
    print("- Check the README.md for more detailed examples")

if __name__ == "__main__":
    asyncio.run(main()) 