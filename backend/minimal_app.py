from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from minimal_schema import schema

app = FastAPI(title="Glory Boxing Manager API")
graphql_app = GraphQLRouter(schema)

app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
async def root():
    return {"msg": "Glory Boxing Manager API running..."}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "API is running"}

@app.get("/api/fighters")
async def get_fighters():
    """REST endpoint to get all fighters"""
    from minimal_schema import fighters
    return {"data": fighters, "total": len(fighters)}

@app.get("/api/matches")
async def get_matches():
    """REST endpoint to get all matches"""
    from minimal_schema import matches
    return {"data": matches, "total": len(matches)} 