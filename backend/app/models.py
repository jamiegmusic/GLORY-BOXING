from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from uuid import UUID
from enum import Enum

class WeightClass(str, Enum):
    STRAWWEIGHT = "strawweight"
    FLYWEIGHT = "flyweight"
    BANTAMWEIGHT = "bantamweight"
    FEATHERWEIGHT = "featherweight"
    LIGHTWEIGHT = "lightweight"
    WELTERWEIGHT = "welterweight"
    MIDDLEWEIGHT = "middleweight"
    LIGHT_HEAVYWEIGHT = "light_heavyweight"
    HEAVYWEIGHT = "heavyweight"

class Stance(str, Enum):
    ORTHODOX = "orthodox"
    SOUTHPAW = "southpaw"
    SWITCH = "switch"

class ResultType(str, Enum):
    DECISION = "decision"
    KO = "ko"
    TKO = "tko"
    SUBMISSION = "submission"
    DQ = "dq"
    DRAW = "draw"
    NO_CONTEST = "no_contest"

class VenueTier(str, Enum):
    SMALL_CLUB = "small_club"
    MEDIUM_ARENA = "medium_arena"
    LARGE_STADIUM = "large_stadium"
    PREMIUM_VENUE = "premium_venue"

class RivalryType(str, Enum):
    PERSONAL = "personal"
    PROFESSIONAL = "professional"
    TERRITORIAL = "territorial"
    CHAMPIONSHIP = "championship"

# Base Models
class FighterBase(BaseModel):
    name: str = Field(..., description="Fighter's full name")
    age: int = Field(..., ge=16, le=60, description="Fighter's age")
    nationality: str = Field(..., description="Fighter's nationality")
    weight_class: WeightClass = Field(..., description="Fighter's weight class")
    stance: Stance = Field(..., description="Fighter's stance")
    promoter: Optional[str] = Field(None, description="Fighter's promoter")
    amateur_record: Optional[str] = Field(None, description="Amateur record (W-L-D)")
    pro_record: Optional[str] = Field(None, description="Professional record (W-L-D)")
    debut_date: Optional[datetime] = Field(None, description="Professional debut date")

class FighterCreate(FighterBase):
    pass

class FighterUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = Field(None, ge=16, le=60)
    nationality: Optional[str] = None
    weight_class: Optional[WeightClass] = None
    stance: Optional[Stance] = None
    promoter: Optional[str] = None
    amateur_record: Optional[str] = None
    pro_record: Optional[str] = None
    ai_portrait_url: Optional[str] = None
    ai_voice_profile: Optional[Dict[str, Any]] = None
    ai_lore_background: Optional[str] = None
    ai_personality_traits: Optional[Dict[str, Any]] = None
    real_world_ranking: Optional[int] = None
    real_world_record: Optional[str] = None
    licensing_status: Optional[str] = None
    official_fighter_id: Optional[str] = None
    health_risk_assessment: Optional[int] = Field(None, ge=0, le=100)
    concussion_protocol_active: Optional[bool] = None
    cumulative_damage: Optional[Dict[str, Any]] = None

class Fighter(FighterBase):
    id: str
    created_at: datetime
    updated_at: datetime
    ai_portrait_url: Optional[str] = None
    ai_voice_profile: Optional[Dict[str, Any]] = None
    ai_lore_background: Optional[str] = None
    ai_personality_traits: Optional[Dict[str, Any]] = None
    real_world_ranking: Optional[int] = None
    real_world_record: Optional[str] = None
    licensing_status: Optional[str] = None
    official_fighter_id: Optional[str] = None
    health_risk_assessment: Optional[int] = None
    concussion_protocol_active: Optional[bool] = None
    cumulative_damage: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# Match Models
class MatchBase(BaseModel):
    fighter_a: str = Field(..., description="Fighter A ID")
    fighter_b: str = Field(..., description="Fighter B ID")
    venue: str = Field(..., description="Venue name")
    scheduled_rounds: int = Field(12, ge=1, le=15, description="Scheduled rounds")
    title_fight: bool = Field(False, description="Is this a title fight?")
    title_id: Optional[str] = Field(None, description="Title ID if title fight")

class MatchCreate(MatchBase):
    pass

class MatchUpdate(BaseModel):
    fighter_a: Optional[str] = None
    fighter_b: Optional[str] = None
    venue: Optional[str] = None
    scheduled_rounds: Optional[int] = Field(None, ge=1, le=15)
    actual_rounds: Optional[int] = Field(None, ge=1, le=15)
    result: Optional[ResultType] = None
    scorecard: Optional[List[Dict[str, Any]]] = None
    winner: Optional[str] = None
    title_fight: Optional[bool] = None
    title_id: Optional[str] = None
    round_by_round_data: Optional[Dict[str, Any]] = None
    punch_statistics: Optional[Dict[str, Any]] = None
    knockdowns: Optional[List[Dict[str, Any]]] = None
    referee_decisions: Optional[Dict[str, Any]] = None
    ai_commentary: Optional[List[Dict[str, Any]]] = None
    fight_rating: Optional[int] = Field(None, ge=1, le=10)
    crowd_reaction: Optional[int] = Field(None, ge=1, le=10)
    media_coverage_rating: Optional[int] = Field(None, ge=1, le=10)

class Match(MatchBase):
    id: str
    actual_rounds: Optional[int] = None
    result: Optional[ResultType] = None
    scorecard: Optional[List[Dict[str, Any]]] = None
    winner: Optional[str] = None
    fight_date: datetime
    created_at: datetime
    updated_at: datetime
    round_by_round_data: Optional[Dict[str, Any]] = None
    punch_statistics: Optional[Dict[str, Any]] = None
    knockdowns: Optional[List[Dict[str, Any]]] = None
    referee_decisions: Optional[Dict[str, Any]] = None
    ai_commentary: Optional[List[Dict[str, Any]]] = None
    fight_rating: Optional[int] = None
    crowd_reaction: Optional[int] = None
    media_coverage_rating: Optional[int] = None

    class Config:
        from_attributes = True

# Title Models
class TitleBase(BaseModel):
    name: str = Field(..., description="Title name")
    weight_class: WeightClass = Field(..., description="Weight class")
    sanctioning_body: str = Field(..., description="Sanctioning body")
    current_holder: Optional[str] = Field(None, description="Current title holder ID")

class TitleCreate(TitleBase):
    pass

class TitleUpdate(BaseModel):
    name: Optional[str] = None
    weight_class: Optional[WeightClass] = None
    sanctioning_body: Optional[str] = None
    current_holder: Optional[str] = None
    title_history: Optional[List[Dict[str, Any]]] = None
    mandatory_challenger_id: Optional[str] = None
    mandatory_challenger_name: Optional[str] = None
    mandatory_due_date: Optional[datetime] = None

class Title(TitleBase):
    id: str
    title_history: Optional[List[Dict[str, Any]]] = None
    mandatory_challenger_id: Optional[str] = None
    mandatory_challenger_name: Optional[str] = None
    mandatory_due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Ranking Models
class RankingBase(BaseModel):
    weight_class: WeightClass = Field(..., description="Weight class")
    rank_position: int = Field(..., ge=1, description="Ranking position")
    fighter_id: str = Field(..., description="Fighter ID")
    points: float = Field(0.0, description="Ranking points")

class RankingCreate(RankingBase):
    pass

class RankingUpdate(BaseModel):
    weight_class: Optional[WeightClass] = None
    rank_position: Optional[int] = Field(None, ge=1)
    fighter_id: Optional[str] = None
    points: Optional[float] = None
    real_world_ranking: Optional[int] = None
    real_world_points: Optional[float] = None
    organization: Optional[str] = None
    movement: Optional[str] = None
    win_streak: Optional[int] = Field(None, ge=0)
    quality_wins: Optional[int] = Field(None, ge=0)
    last_fight_date: Optional[datetime] = None
    activity_score: Optional[float] = Field(None, ge=0, le=100)

class Ranking(RankingBase):
    id: str
    real_world_ranking: Optional[int] = None
    real_world_points: Optional[float] = None
    organization: Optional[str] = None
    movement: Optional[str] = None
    win_streak: Optional[int] = None
    quality_wins: Optional[int] = None
    last_fight_date: Optional[datetime] = None
    activity_score: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Press Conference Models
class PressConferenceBase(BaseModel):
    match_id: str = Field(..., description="Associated match ID")
    event_name: str = Field(..., description="Press conference name")
    conference_date: datetime = Field(..., description="Conference date")

class PressConferenceCreate(PressConferenceBase):
    participants: Optional[List[Dict[str, Any]]] = Field([], description="Conference participants")
    highlights: Optional[List[str]] = Field([], description="Conference highlights")
    controversies: Optional[List[str]] = Field([], description="Conference controversies")
    ai_generated_quotes: Optional[List[Dict[str, Any]]] = Field([], description="AI generated quotes")
    media_reactions: Optional[List[Dict[str, Any]]] = Field([], description="Media reactions")
    public_sentiment_score: Optional[float] = Field(None, ge=0, le=1, description="Public sentiment score")

class PressConferenceUpdate(BaseModel):
    event_name: Optional[str] = None
    conference_date: Optional[datetime] = None
    participants: Optional[List[Dict[str, Any]]] = None
    highlights: Optional[List[str]] = None
    controversies: Optional[List[str]] = None
    ai_generated_quotes: Optional[List[Dict[str, Any]]] = None
    media_reactions: Optional[List[Dict[str, Any]]] = None
    public_sentiment_score: Optional[float] = Field(None, ge=0, le=1)

class PressConference(PressConferenceBase):
    id: str
    participants: Optional[List[Dict[str, Any]]] = None
    highlights: Optional[List[str]] = None
    controversies: Optional[List[str]] = None
    ai_generated_quotes: Optional[List[Dict[str, Any]]] = None
    media_reactions: Optional[List[Dict[str, Any]]] = None
    public_sentiment_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Venue Models
class VenueBase(BaseModel):
    name: str = Field(..., description="Venue name")
    location: str = Field(..., description="Venue location")
    capacity: int = Field(..., ge=1, description="Venue capacity")
    venue_tier: VenueTier = Field(..., description="Venue tier")
    base_rental_cost: float = Field(..., ge=0, description="Base rental cost")
    revenue_split: float = Field(..., ge=0, le=1, description="Revenue split percentage")

class VenueCreate(VenueBase):
    amenities: Optional[List[str]] = Field([], description="Venue amenities")
    coordinates: Optional[Dict[str, Any]] = Field(None, description="Venue coordinates")

class VenueUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = Field(None, ge=1)
    venue_tier: Optional[VenueTier] = None
    base_rental_cost: Optional[float] = Field(None, ge=0)
    revenue_split: Optional[float] = Field(None, ge=0, le=1)
    amenities: Optional[List[str]] = None
    coordinates: Optional[Dict[str, Any]] = None

class Venue(VenueBase):
    id: str
    amenities: Optional[List[str]] = None
    coordinates: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Health Monitoring Models
class HealthMonitoringBase(BaseModel):
    fighter_id: str = Field(..., description="Fighter ID")
    overall_health_score: int = Field(..., ge=1, le=100, description="Overall health score")
    concussion_risk: int = Field(0, ge=0, le=100, description="Concussion risk assessment")
    medical_clearance_status: str = Field(..., description="Medical clearance status")

class HealthMonitoringCreate(HealthMonitoringBase):
    cumulative_damage_assessment: Optional[Dict[str, Any]] = Field(None, description="Cumulative damage assessment")
    recommended_recovery_time: Optional[int] = Field(None, ge=0, description="Recommended recovery time in days")
    notes: Optional[str] = Field(None, description="Medical notes")

class HealthMonitoringUpdate(BaseModel):
    overall_health_score: Optional[int] = Field(None, ge=1, le=100)
    concussion_risk: Optional[int] = Field(None, ge=0, le=100)
    cumulative_damage_assessment: Optional[Dict[str, Any]] = None
    recommended_recovery_time: Optional[int] = Field(None, ge=0)
    medical_clearance_status: Optional[str] = None
    notes: Optional[str] = None

class HealthMonitoring(HealthMonitoringBase):
    id: str
    assessment_date: date
    cumulative_damage_assessment: Optional[Dict[str, Any]] = None
    recommended_recovery_time: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True 