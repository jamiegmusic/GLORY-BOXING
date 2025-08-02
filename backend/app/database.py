from supabase import create_client, Client
from app.config import settings
import asyncio
from typing import Optional, Dict, Any, List
import json
from datetime import datetime, date
from uuid import UUID

class DatabaseManager:
    def __init__(self):
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_anon_key
        )
    
    async def get_fighters(self, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Get all fighters with pagination"""
        try:
            response = self.supabase.table("fighters").select("*").range(offset, offset + limit - 1).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching fighters: {e}")
            return []
    
    async def get_fighter_by_id(self, fighter_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific fighter by ID"""
        try:
            response = self.supabase.table("fighters").select("*").eq("id", fighter_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error fetching fighter {fighter_id}: {e}")
            return None
    
    async def create_fighter(self, fighter_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new fighter"""
        try:
            response = self.supabase.table("fighters").insert(fighter_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating fighter: {e}")
            return None
    
    async def update_fighter(self, fighter_id: str, fighter_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing fighter"""
        try:
            response = self.supabase.table("fighters").update(fighter_data).eq("id", fighter_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating fighter {fighter_id}: {e}")
            return None
    
    async def get_matches(self, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Get all matches with pagination"""
        try:
            response = self.supabase.table("fights").select("*").range(offset, offset + limit - 1).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching matches: {e}")
            return []
    
    async def get_match_by_id(self, match_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific match by ID"""
        try:
            response = self.supabase.table("fights").select("*").eq("id", match_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error fetching match {match_id}: {e}")
            return None
    
    async def create_match(self, match_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new match"""
        try:
            response = self.supabase.table("fights").insert(match_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating match: {e}")
            return None
    
    async def update_match(self, match_id: str, match_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing match"""
        try:
            response = self.supabase.table("fights").update(match_data).eq("id", match_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating match {match_id}: {e}")
            return None
    
    async def get_rankings(self, weight_class: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get rankings, optionally filtered by weight class"""
        try:
            query = self.supabase.table("rankings").select("*")
            if weight_class:
                query = query.eq("weight_class", weight_class)
            response = query.execute()
            return response.data
        except Exception as e:
            print(f"Error fetching rankings: {e}")
            return []
    
    async def get_titles(self) -> List[Dict[str, Any]]:
        """Get all titles"""
        try:
            response = self.supabase.table("titles").select("*").execute()
            return response.data
        except Exception as e:
            print(f"Error fetching titles: {e}")
            return []
    
    async def get_press_conferences(self, match_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get press conferences, optionally filtered by match"""
        try:
            query = self.supabase.table("press_conferences").select("*")
            if match_id:
                query = query.eq("match_id", match_id)
            response = query.execute()
            return response.data
        except Exception as e:
            print(f"Error fetching press conferences: {e}")
            return []
    
    async def create_press_conference(self, press_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new press conference"""
        try:
            response = self.supabase.table("press_conferences").insert(press_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating press conference: {e}")
            return None
    
    async def get_venues(self) -> List[Dict[str, Any]]:
        """Get all venues"""
        try:
            response = self.supabase.table("venues").select("*").execute()
            return response.data
        except Exception as e:
            print(f"Error fetching venues: {e}")
            return []
    
    async def get_promoters(self) -> List[Dict[str, Any]]:
        """Get all promoters"""
        try:
            response = self.supabase.table("promoters").select("*").execute()
            return response.data
        except Exception as e:
            print(f"Error fetching promoters: {e}")
            return []
    
    async def get_health_monitoring(self, fighter_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get health monitoring data, optionally filtered by fighter"""
        try:
            query = self.supabase.table("health_monitoring").select("*")
            if fighter_id:
                query = query.eq("fighter_id", fighter_id)
            response = query.execute()
            return response.data
        except Exception as e:
            print(f"Error fetching health monitoring: {e}")
            return []
    
    async def create_health_monitoring(self, health_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new health monitoring record"""
        try:
            response = self.supabase.table("health_monitoring").insert(health_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating health monitoring: {e}")
            return None

# Global database instance
db = DatabaseManager() 