from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from strawberry.fastapi import GraphQLRouter
from app.config import settings
from app.schema import schema
from app.database import db
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Glory Boxing Manager API - Professional Boxing Management System",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create GraphQL router
graphql_app = GraphQLRouter(schema)

# Include GraphQL routes
app.include_router(graphql_app, prefix="/graphql")

# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Glory Boxing Manager API",
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs",
        "graphql": "/graphql"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        fighters = await db.get_fighters(limit=1)
        return {
            "status": "healthy",
            "database": "connected",
            "fighters_count": len(fighters)
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

# API endpoints for REST operations
@app.get("/api/fighters")
async def get_fighters(limit: int = 50, offset: int = 0):
    """Get all fighters with pagination"""
    try:
        fighters = await db.get_fighters(limit=limit, offset=offset)
        return {
            "data": fighters,
            "total": len(fighters),
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        logger.error(f"Error fetching fighters: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch fighters")

@app.get("/api/fighters/{fighter_id}")
async def get_fighter(fighter_id: str):
    """Get a specific fighter by ID"""
    try:
        fighter = await db.get_fighter_by_id(fighter_id)
        if not fighter:
            raise HTTPException(status_code=404, detail="Fighter not found")
        return {"data": fighter}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching fighter {fighter_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch fighter")

@app.post("/api/fighters")
async def create_fighter(fighter_data: dict):
    """Create a new fighter"""
    try:
        created_fighter = await db.create_fighter(fighter_data)
        if not created_fighter:
            raise HTTPException(status_code=400, detail="Failed to create fighter")
        return {"data": created_fighter, "message": "Fighter created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating fighter: {e}")
        raise HTTPException(status_code=500, detail="Failed to create fighter")

@app.get("/api/matches")
async def get_matches(limit: int = 50, offset: int = 0):
    """Get all matches with pagination"""
    try:
        matches = await db.get_matches(limit=limit, offset=offset)
        return {
            "data": matches,
            "total": len(matches),
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        logger.error(f"Error fetching matches: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch matches")

@app.get("/api/matches/{match_id}")
async def get_match(match_id: str):
    """Get a specific match by ID"""
    try:
        match = await db.get_match_by_id(match_id)
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")
        return {"data": match}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching match {match_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch match")

@app.post("/api/matches")
async def create_match(match_data: dict):
    """Create a new match"""
    try:
        created_match = await db.create_match(match_data)
        if not created_match:
            raise HTTPException(status_code=400, detail="Failed to create match")
        return {"data": created_match, "message": "Match created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating match: {e}")
        raise HTTPException(status_code=500, detail="Failed to create match")

@app.get("/api/rankings")
async def get_rankings(weight_class: str = None):
    """Get rankings, optionally filtered by weight class"""
    try:
        rankings = await db.get_rankings(weight_class=weight_class)
        return {
            "data": rankings,
            "total": len(rankings),
            "weight_class": weight_class
        }
    except Exception as e:
        logger.error(f"Error fetching rankings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch rankings")

@app.get("/api/titles")
async def get_titles():
    """Get all titles"""
    try:
        titles = await db.get_titles()
        return {
            "data": titles,
            "total": len(titles)
        }
    except Exception as e:
        logger.error(f"Error fetching titles: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch titles")

@app.get("/api/venues")
async def get_venues():
    """Get all venues"""
    try:
        venues = await db.get_venues()
        return {
            "data": venues,
            "total": len(venues)
        }
    except Exception as e:
        logger.error(f"Error fetching venues: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch venues")

@app.get("/api/press-conferences")
async def get_press_conferences(match_id: str = None):
    """Get press conferences, optionally filtered by match"""
    try:
        press_conferences = await db.get_press_conferences(match_id=match_id)
        return {
            "data": press_conferences,
            "total": len(press_conferences),
            "match_id": match_id
        }
    except Exception as e:
        logger.error(f"Error fetching press conferences: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch press conferences")

@app.post("/api/press-conferences")
async def create_press_conference(press_data: dict):
    """Create a new press conference"""
    try:
        created_press = await db.create_press_conference(press_data)
        if not created_press:
            raise HTTPException(status_code=400, detail="Failed to create press conference")
        return {"data": created_press, "message": "Press conference created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating press conference: {e}")
        raise HTTPException(status_code=500, detail="Failed to create press conference")

@app.get("/api/health-monitoring")
async def get_health_monitoring(fighter_id: str = None):
    """Get health monitoring data, optionally filtered by fighter"""
    try:
        health_data = await db.get_health_monitoring(fighter_id=fighter_id)
        return {
            "data": health_data,
            "total": len(health_data),
            "fighter_id": fighter_id
        }
    except Exception as e:
        logger.error(f"Error fetching health monitoring: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch health monitoring")

@app.post("/api/health-monitoring")
async def create_health_monitoring(health_data: dict):
    """Create a new health monitoring record"""
    try:
        created_health = await db.create_health_monitoring(health_data)
        if not created_health:
            raise HTTPException(status_code=400, detail="Failed to create health monitoring record")
        return {"data": created_health, "message": "Health monitoring record created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating health monitoring record: {e}")
        raise HTTPException(status_code=500, detail="Failed to create health monitoring record")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Resource not found", "detail": str(exc)}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Application startup event"""
    logger.info("Glory Boxing Manager API starting up...")
    logger.info(f"Environment: {'Development' if settings.debug else 'Production'}")
    logger.info(f"Supabase URL: {settings.supabase_url}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event"""
    logger.info("Glory Boxing Manager API shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    ) 