from fastapi import FastAPI, Depends, Header, HTTPException
from strawberry.fastapi import GraphQLRouter
from enhanced_schema import schema

app = FastAPI(title="Glory Boxing Manager API")

def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=403, detail="Invalid token format")
    token = authorization.split("Bearer ")[-1]
    # Add real Supabase token verification here
    if token != "dev-token":
        raise HTTPException(status_code=403, detail="Invalid Supabase token")
    return token

graphql_app = GraphQLRouter(schema, context_getter=verify_token)
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
    from enhanced_schema import fighters
    return {"data": fighters, "total": len(fighters)}

@app.get("/api/matches")
async def get_matches():
    """REST endpoint to get all matches"""
    from enhanced_schema import matches
    return {"data": matches, "total": len(matches)} 