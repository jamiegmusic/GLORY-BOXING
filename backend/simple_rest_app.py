from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="Glory Boxing Manager API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Fighter(BaseModel):
    id: int
    name: str
    weight_class: str
    record: str
    nationality: Optional[str] = None
    age: Optional[int] = None

class Match(BaseModel):
    id: int
    fighter_a: Fighter
    fighter_b: Fighter
    venue: str
    date: str
    result: Optional[str] = None

# Sample data
fighters = [
    Fighter(id=1, name="John Doe", weight_class="Lightweight", record="12-1-0", nationality="USA", age=28),
    Fighter(id=2, name="Jake Smith", weight_class="Lightweight", record="10-0-2", nationality="UK", age=26),
    Fighter(id=3, name="Mike Johnson", weight_class="Heavyweight", record="15-2-1", nationality="Canada", age=30),
]

matches = []

def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=403, detail="Invalid token format")
    token = authorization.split("Bearer ")[-1]
    if token != "dev-token":
        raise HTTPException(status_code=403, detail="Invalid token")
    return token

@app.get("/")
async def root():
    return {"msg": "Glory Boxing Manager API running..."}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "API is running"}

@app.get("/api/fighters")
async def get_fighters():
    """Get all fighters"""
    return {"data": fighters, "total": len(fighters)}

@app.get("/api/fighters/{fighter_id}")
async def get_fighter(fighter_id: int):
    """Get a specific fighter"""
    for fighter in fighters:
        if fighter.id == fighter_id:
            return fighter
    raise HTTPException(status_code=404, detail="Fighter not found")

@app.post("/api/fighters")
async def create_fighter(fighter: Fighter, token: str = Depends(verify_token)):
    """Create a new fighter"""
    new_fighter = Fighter(
        id=len(fighters) + 1,
        name=fighter.name,
        weight_class=fighter.weight_class,
        record=fighter.record,
        nationality=fighter.nationality,
        age=fighter.age
    )
    fighters.append(new_fighter)
    return new_fighter

@app.get("/api/matches")
async def get_matches():
    """Get all matches"""
    return {"data": matches, "total": len(matches)}

@app.get("/api/matches/{match_id}")
async def get_match(match_id: int):
    """Get a specific match"""
    for match in matches:
        if match.id == match_id:
            return match
    raise HTTPException(status_code=404, detail="Match not found")

@app.post("/api/matches")
async def create_match(match_data: dict, token: str = Depends(verify_token)):
    """Create a new match"""
    fighter_a = next((f for f in fighters if f.id == match_data["fighter_a_id"]), None)
    fighter_b = next((f for f in fighters if f.id == match_data["fighter_b_id"]), None)
    
    if not fighter_a or not fighter_b:
        raise HTTPException(status_code=400, detail="Invalid fighter IDs")
    
    new_match = Match(
        id=len(matches) + 1,
        fighter_a=fighter_a,
        fighter_b=fighter_b,
        venue=match_data["venue"],
        date=match_data["date"],
        result=match_data.get("result")
    )
    matches.append(new_match)
    return new_match

@app.put("/api/matches/{match_id}/result")
async def update_match_result(match_id: int, result: str, token: str = Depends(verify_token)):
    """Update match result"""
    for match in matches:
        if match.id == match_id:
            match.result = result
            return match
    raise HTTPException(status_code=404, detail="Match not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=True) 