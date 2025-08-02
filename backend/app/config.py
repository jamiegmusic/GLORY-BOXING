from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Supabase Configuration
    supabase_url: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://yutwoddmzgntofygfdve.supabase.co")
    supabase_anon_key: str = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    supabase_service_role_key: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    # FastAPI Configuration
    app_name: str = "Glory Boxing Manager API"
    app_version: str = "1.0.0"
    debug: bool = os.getenv("NODE_ENV", "development") == "development"
    
    # Database Configuration
    database_url: Optional[str] = os.getenv("DATABASE_URL")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-domain.com"
    ]
    
    # Redis (for caching and background tasks)
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # AI Configuration
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    class Config:
        env_file = ".env"

settings = Settings() 