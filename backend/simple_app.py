from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from simple_schema import schema

app = FastAPI(title="Glory Boxing Manager API")
graphql_app = GraphQLRouter(schema)

app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
async def root():
    return {"msg": "Glory Boxing Manager API running..."}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "API is running"} 