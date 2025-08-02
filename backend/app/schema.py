import strawberry
from typing import List, Optional
from datetime import datetime, date
from app.database import db
from app.models import (
    WeightClass, Stance, ResultType, VenueTier, RivalryType,
    Fighter, FighterCreate, FighterUpdate,
    Match, MatchCreate, MatchUpdate,
    Title, TitleCreate, TitleUpdate,
    Ranking, RankingCreate, RankingUpdate,
    PressConference, PressConferenceCreate, PressConferenceUpdate,
    Venue, VenueCreate, VenueUpdate,
    HealthMonitoring, HealthMonitoringCreate, HealthMonitoringUpdate
)

# GraphQL Types
@strawberry.type
class FighterType:
    id: str
    name: str
    age: int
    nationality: str
    weight_class: str
    stance: str
    promoter: Optional[str]
    amateur_record: Optional[str]
    pro_record: Optional[str]
    debut_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    ai_portrait_url: Optional[str]
    ai_voice_profile: Optional[str]  # JSON string
    ai_lore_background: Optional[str]
    ai_personality_traits: Optional[str]  # JSON string
    real_world_ranking: Optional[int]
    real_world_record: Optional[str]
    licensing_status: Optional[str]
    official_fighter_id: Optional[str]
    health_risk_assessment: Optional[int]
    concussion_protocol_active: Optional[bool]
    cumulative_damage: Optional[str]  # JSON string

@strawberry.type
class MatchType:
    id: str
    fighter_a: str
    fighter_b: str
    venue: str
    scheduled_rounds: int
    actual_rounds: Optional[int]
    result: Optional[str]
    scorecard: Optional[str]  # JSON string
    winner: Optional[str]
    title_fight: bool
    title_id: Optional[str]
    fight_date: datetime
    created_at: datetime
    updated_at: datetime
    round_by_round_data: Optional[str]  # JSON string
    punch_statistics: Optional[str]  # JSON string
    knockdowns: Optional[str]  # JSON string
    referee_decisions: Optional[str]  # JSON string
    ai_commentary: Optional[str]  # JSON string
    fight_rating: Optional[int]
    crowd_reaction: Optional[int]
    media_coverage_rating: Optional[int]

@strawberry.type
class TitleType:
    id: str
    name: str
    weight_class: str
    sanctioning_body: str
    current_holder: Optional[str]
    title_history: Optional[str]  # JSON string
    mandatory_challenger_id: Optional[str]
    mandatory_challenger_name: Optional[str]
    mandatory_due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

@strawberry.type
class RankingType:
    id: str
    weight_class: str
    rank_position: int
    fighter_id: str
    points: float
    real_world_ranking: Optional[int]
    real_world_points: Optional[float]
    organization: Optional[str]
    movement: Optional[str]
    win_streak: Optional[int]
    quality_wins: Optional[int]
    last_fight_date: Optional[datetime]
    activity_score: Optional[float]
    created_at: datetime
    updated_at: datetime

@strawberry.type
class PressConferenceType:
    id: str
    match_id: str
    event_name: str
    conference_date: datetime
    participants: Optional[str]  # JSON string
    highlights: Optional[str]  # JSON string
    controversies: Optional[str]  # JSON string
    ai_generated_quotes: Optional[str]  # JSON string
    media_reactions: Optional[str]  # JSON string
    public_sentiment_score: Optional[float]
    created_at: datetime

@strawberry.type
class VenueType:
    id: str
    name: str
    location: str
    capacity: int
    venue_tier: str
    base_rental_cost: float
    revenue_split: float
    amenities: Optional[str]  # JSON string
    coordinates: Optional[str]  # JSON string
    created_at: datetime

@strawberry.type
class HealthMonitoringType:
    id: str
    fighter_id: str
    assessment_date: date
    overall_health_score: int
    concussion_risk: int
    cumulative_damage_assessment: Optional[str]  # JSON string
    recommended_recovery_time: Optional[int]
    medical_clearance_status: str
    notes: Optional[str]
    created_at: datetime

# Input Types
@strawberry.input
class FighterInput:
    name: str
    age: int
    nationality: str
    weight_class: str
    stance: str
    promoter: Optional[str] = None
    amateur_record: Optional[str] = None
    pro_record: Optional[str] = None
    debut_date: Optional[datetime] = None

@strawberry.input
class MatchInput:
    fighter_a: str
    fighter_b: str
    venue: str
    scheduled_rounds: int = 12
    title_fight: bool = False
    title_id: Optional[str] = None

@strawberry.input
class TitleInput:
    name: str
    weight_class: str
    sanctioning_body: str
    current_holder: Optional[str] = None

@strawberry.input
class RankingInput:
    weight_class: str
    rank_position: int
    fighter_id: str
    points: float = 0.0

@strawberry.input
class PressConferenceInput:
    match_id: str
    event_name: str
    conference_date: datetime
    participants: Optional[str] = None  # JSON string
    highlights: Optional[str] = None  # JSON string
    controversies: Optional[str] = None  # JSON string
    ai_generated_quotes: Optional[str] = None  # JSON string
    media_reactions: Optional[str] = None  # JSON string
    public_sentiment_score: Optional[float] = None

@strawberry.input
class VenueInput:
    name: str
    location: str
    capacity: int
    venue_tier: str
    base_rental_cost: float
    revenue_split: float
    amenities: Optional[str] = None  # JSON string
    coordinates: Optional[str] = None  # JSON string

@strawberry.input
class HealthMonitoringInput:
    fighter_id: str
    overall_health_score: int
    concussion_risk: int = 0
    cumulative_damage_assessment: Optional[str] = None  # JSON string
    recommended_recovery_time: Optional[int] = None
    medical_clearance_status: str
    notes: Optional[str] = None

# Query Type
@strawberry.type
class Query:
    @strawberry.field
    async def fighters(self, limit: int = 50, offset: int = 0) -> List[FighterType]:
        """Get all fighters with pagination"""
        fighters_data = await db.get_fighters(limit=limit, offset=offset)
        return [
            FighterType(
                id=fighter["id"],
                name=fighter["name"],
                age=fighter["age"],
                nationality=fighter["nationality"],
                weight_class=fighter["weight_class"],
                stance=fighter["stance"],
                promoter=fighter.get("promoter"),
                amateur_record=fighter.get("amateur_record"),
                pro_record=fighter.get("pro_record"),
                debut_date=fighter.get("debut_date"),
                created_at=fighter["created_at"],
                updated_at=fighter["updated_at"],
                ai_portrait_url=fighter.get("ai_portrait_url"),
                ai_voice_profile=fighter.get("ai_voice_profile"),
                ai_lore_background=fighter.get("ai_lore_background"),
                ai_personality_traits=fighter.get("ai_personality_traits"),
                real_world_ranking=fighter.get("real_world_ranking"),
                real_world_record=fighter.get("real_world_record"),
                licensing_status=fighter.get("licensing_status"),
                official_fighter_id=fighter.get("official_fighter_id"),
                health_risk_assessment=fighter.get("health_risk_assessment"),
                concussion_protocol_active=fighter.get("concussion_protocol_active"),
                cumulative_damage=fighter.get("cumulative_damage")
            )
            for fighter in fighters_data
        ]

    @strawberry.field
    async def fighter(self, id: str) -> Optional[FighterType]:
        """Get a specific fighter by ID"""
        fighter_data = await db.get_fighter_by_id(id)
        if not fighter_data:
            return None
        
        return FighterType(
            id=fighter_data["id"],
            name=fighter_data["name"],
            age=fighter_data["age"],
            nationality=fighter_data["nationality"],
            weight_class=fighter_data["weight_class"],
            stance=fighter_data["stance"],
            promoter=fighter_data.get("promoter"),
            amateur_record=fighter_data.get("amateur_record"),
            pro_record=fighter_data.get("pro_record"),
            debut_date=fighter_data.get("debut_date"),
            created_at=fighter_data["created_at"],
            updated_at=fighter_data["updated_at"],
            ai_portrait_url=fighter_data.get("ai_portrait_url"),
            ai_voice_profile=fighter_data.get("ai_voice_profile"),
            ai_lore_background=fighter_data.get("ai_lore_background"),
            ai_personality_traits=fighter_data.get("ai_personality_traits"),
            real_world_ranking=fighter_data.get("real_world_ranking"),
            real_world_record=fighter_data.get("real_world_record"),
            licensing_status=fighter_data.get("licensing_status"),
            official_fighter_id=fighter_data.get("official_fighter_id"),
            health_risk_assessment=fighter_data.get("health_risk_assessment"),
            concussion_protocol_active=fighter_data.get("concussion_protocol_active"),
            cumulative_damage=fighter_data.get("cumulative_damage")
        )

    @strawberry.field
    async def matches(self, limit: int = 50, offset: int = 0) -> List[MatchType]:
        """Get all matches with pagination"""
        matches_data = await db.get_matches(limit=limit, offset=offset)
        return [
            MatchType(
                id=match["id"],
                fighter_a=match["fighter_a"],
                fighter_b=match["fighter_b"],
                venue=match["venue"],
                scheduled_rounds=match["scheduled_rounds"],
                actual_rounds=match.get("actual_rounds"),
                result=match.get("result"),
                scorecard=match.get("scorecard"),
                winner=match.get("winner"),
                title_fight=match.get("title_fight", False),
                title_id=match.get("title_id"),
                fight_date=match["fight_date"],
                created_at=match["created_at"],
                updated_at=match["updated_at"],
                round_by_round_data=match.get("round_by_round_data"),
                punch_statistics=match.get("punch_statistics"),
                knockdowns=match.get("knockdowns"),
                referee_decisions=match.get("referee_decisions"),
                ai_commentary=match.get("ai_commentary"),
                fight_rating=match.get("fight_rating"),
                crowd_reaction=match.get("crowd_reaction"),
                media_coverage_rating=match.get("media_coverage_rating")
            )
            for match in matches_data
        ]

    @strawberry.field
    async def match(self, id: str) -> Optional[MatchType]:
        """Get a specific match by ID"""
        match_data = await db.get_match_by_id(id)
        if not match_data:
            return None
        
        return MatchType(
            id=match_data["id"],
            fighter_a=match_data["fighter_a"],
            fighter_b=match_data["fighter_b"],
            venue=match_data["venue"],
            scheduled_rounds=match_data["scheduled_rounds"],
            actual_rounds=match_data.get("actual_rounds"),
            result=match_data.get("result"),
            scorecard=match_data.get("scorecard"),
            winner=match_data.get("winner"),
            title_fight=match_data.get("title_fight", False),
            title_id=match_data.get("title_id"),
            fight_date=match_data["fight_date"],
            created_at=match_data["created_at"],
            updated_at=match_data["updated_at"],
            round_by_round_data=match_data.get("round_by_round_data"),
            punch_statistics=match_data.get("punch_statistics"),
            knockdowns=match_data.get("knockdowns"),
            referee_decisions=match_data.get("referee_decisions"),
            ai_commentary=match_data.get("ai_commentary"),
            fight_rating=match_data.get("fight_rating"),
            crowd_reaction=match_data.get("crowd_reaction"),
            media_coverage_rating=match_data.get("media_coverage_rating")
        )

    @strawberry.field
    async def rankings(self, weight_class: Optional[str] = None) -> List[RankingType]:
        """Get rankings, optionally filtered by weight class"""
        rankings_data = await db.get_rankings(weight_class=weight_class)
        return [
            RankingType(
                id=ranking["id"],
                weight_class=ranking["weight_class"],
                rank_position=ranking["rank_position"],
                fighter_id=ranking["fighter_id"],
                points=ranking["points"],
                real_world_ranking=ranking.get("real_world_ranking"),
                real_world_points=ranking.get("real_world_points"),
                organization=ranking.get("organization"),
                movement=ranking.get("movement"),
                win_streak=ranking.get("win_streak"),
                quality_wins=ranking.get("quality_wins"),
                last_fight_date=ranking.get("last_fight_date"),
                activity_score=ranking.get("activity_score"),
                created_at=ranking["created_at"],
                updated_at=ranking["updated_at"]
            )
            for ranking in rankings_data
        ]

    @strawberry.field
    async def titles(self) -> List[TitleType]:
        """Get all titles"""
        titles_data = await db.get_titles()
        return [
            TitleType(
                id=title["id"],
                name=title["name"],
                weight_class=title["weight_class"],
                sanctioning_body=title["sanctioning_body"],
                current_holder=title.get("current_holder"),
                title_history=title.get("title_history"),
                mandatory_challenger_id=title.get("mandatory_challenger_id"),
                mandatory_challenger_name=title.get("mandatory_challenger_name"),
                mandatory_due_date=title.get("mandatory_due_date"),
                created_at=title["created_at"],
                updated_at=title["updated_at"]
            )
            for title in titles_data
        ]

    @strawberry.field
    async def press_conferences(self, match_id: Optional[str] = None) -> List[PressConferenceType]:
        """Get press conferences, optionally filtered by match"""
        press_data = await db.get_press_conferences(match_id=match_id)
        return [
            PressConferenceType(
                id=press["id"],
                match_id=press["match_id"],
                event_name=press["event_name"],
                conference_date=press["conference_date"],
                participants=press.get("participants"),
                highlights=press.get("highlights"),
                controversies=press.get("controversies"),
                ai_generated_quotes=press.get("ai_generated_quotes"),
                media_reactions=press.get("media_reactions"),
                public_sentiment_score=press.get("public_sentiment_score"),
                created_at=press["created_at"]
            )
            for press in press_data
        ]

    @strawberry.field
    async def venues(self) -> List[VenueType]:
        """Get all venues"""
        venues_data = await db.get_venues()
        return [
            VenueType(
                id=venue["id"],
                name=venue["name"],
                location=venue["location"],
                capacity=venue["capacity"],
                venue_tier=venue["venue_tier"],
                base_rental_cost=venue["base_rental_cost"],
                revenue_split=venue["revenue_split"],
                amenities=venue.get("amenities"),
                coordinates=venue.get("coordinates"),
                created_at=venue["created_at"]
            )
            for venue in venues_data
        ]

    @strawberry.field
    async def health_monitoring(self, fighter_id: Optional[str] = None) -> List[HealthMonitoringType]:
        """Get health monitoring data, optionally filtered by fighter"""
        health_data = await db.get_health_monitoring(fighter_id=fighter_id)
        return [
            HealthMonitoringType(
                id=health["id"],
                fighter_id=health["fighter_id"],
                assessment_date=health["assessment_date"],
                overall_health_score=health["overall_health_score"],
                concussion_risk=health["concussion_risk"],
                cumulative_damage_assessment=health.get("cumulative_damage_assessment"),
                recommended_recovery_time=health.get("recommended_recovery_time"),
                medical_clearance_status=health["medical_clearance_status"],
                notes=health.get("notes"),
                created_at=health["created_at"]
            )
            for health in health_data
        ]

# Mutation Type
@strawberry.type
class Mutation:
    @strawberry.mutation
    async def create_fighter(self, fighter: FighterInput) -> Optional[FighterType]:
        """Create a new fighter"""
        fighter_data = {
            "name": fighter.name,
            "age": fighter.age,
            "nationality": fighter.nationality,
            "weight_class": fighter.weight_class,
            "stance": fighter.stance,
            "promoter": fighter.promoter,
            "amateur_record": fighter.amateur_record,
            "pro_record": fighter.pro_record,
            "debut_date": fighter.debut_date.isoformat() if fighter.debut_date else None
        }
        
        created_fighter = await db.create_fighter(fighter_data)
        if not created_fighter:
            return None
        
        return FighterType(
            id=created_fighter["id"],
            name=created_fighter["name"],
            age=created_fighter["age"],
            nationality=created_fighter["nationality"],
            weight_class=created_fighter["weight_class"],
            stance=created_fighter["stance"],
            promoter=created_fighter.get("promoter"),
            amateur_record=created_fighter.get("amateur_record"),
            pro_record=created_fighter.get("pro_record"),
            debut_date=created_fighter.get("debut_date"),
            created_at=created_fighter["created_at"],
            updated_at=created_fighter["updated_at"],
            ai_portrait_url=created_fighter.get("ai_portrait_url"),
            ai_voice_profile=created_fighter.get("ai_voice_profile"),
            ai_lore_background=created_fighter.get("ai_lore_background"),
            ai_personality_traits=created_fighter.get("ai_personality_traits"),
            real_world_ranking=created_fighter.get("real_world_ranking"),
            real_world_record=created_fighter.get("real_world_record"),
            licensing_status=created_fighter.get("licensing_status"),
            official_fighter_id=created_fighter.get("official_fighter_id"),
            health_risk_assessment=created_fighter.get("health_risk_assessment"),
            concussion_protocol_active=created_fighter.get("concussion_protocol_active"),
            cumulative_damage=created_fighter.get("cumulative_damage")
        )

    @strawberry.mutation
    async def create_match(self, match: MatchInput) -> Optional[MatchType]:
        """Create a new match"""
        match_data = {
            "fighter_a": match.fighter_a,
            "fighter_b": match.fighter_b,
            "venue": match.venue,
            "scheduled_rounds": match.scheduled_rounds,
            "title_fight": match.title_fight,
            "title_id": match.title_id,
            "fight_date": datetime.now().isoformat()
        }
        
        created_match = await db.create_match(match_data)
        if not created_match:
            return None
        
        return MatchType(
            id=created_match["id"],
            fighter_a=created_match["fighter_a"],
            fighter_b=created_match["fighter_b"],
            venue=created_match["venue"],
            scheduled_rounds=created_match["scheduled_rounds"],
            actual_rounds=created_match.get("actual_rounds"),
            result=created_match.get("result"),
            scorecard=created_match.get("scorecard"),
            winner=created_match.get("winner"),
            title_fight=created_match.get("title_fight", False),
            title_id=created_match.get("title_id"),
            fight_date=created_match["fight_date"],
            created_at=created_match["created_at"],
            updated_at=created_match["updated_at"],
            round_by_round_data=created_match.get("round_by_round_data"),
            punch_statistics=created_match.get("punch_statistics"),
            knockdowns=created_match.get("knockdowns"),
            referee_decisions=created_match.get("referee_decisions"),
            ai_commentary=created_match.get("ai_commentary"),
            fight_rating=created_match.get("fight_rating"),
            crowd_reaction=created_match.get("crowd_reaction"),
            media_coverage_rating=created_match.get("media_coverage_rating")
        )

    @strawberry.mutation
    async def create_press_conference(self, press: PressConferenceInput) -> Optional[PressConferenceType]:
        """Create a new press conference"""
        press_data = {
            "match_id": press.match_id,
            "event_name": press.event_name,
            "conference_date": press.conference_date.isoformat(),
            "participants": press.participants,
            "highlights": press.highlights,
            "controversies": press.controversies,
            "ai_generated_quotes": press.ai_generated_quotes,
            "media_reactions": press.media_reactions,
            "public_sentiment_score": press.public_sentiment_score
        }
        
        created_press = await db.create_press_conference(press_data)
        if not created_press:
            return None
        
        return PressConferenceType(
            id=created_press["id"],
            match_id=created_press["match_id"],
            event_name=created_press["event_name"],
            conference_date=created_press["conference_date"],
            participants=created_press.get("participants"),
            highlights=created_press.get("highlights"),
            controversies=created_press.get("controversies"),
            ai_generated_quotes=created_press.get("ai_generated_quotes"),
            media_reactions=created_press.get("media_reactions"),
            public_sentiment_score=created_press.get("public_sentiment_score"),
            created_at=created_press["created_at"]
        )

    @strawberry.mutation
    async def create_health_monitoring(self, health: HealthMonitoringInput) -> Optional[HealthMonitoringType]:
        """Create a new health monitoring record"""
        health_data = {
            "fighter_id": health.fighter_id,
            "overall_health_score": health.overall_health_score,
            "concussion_risk": health.concussion_risk,
            "cumulative_damage_assessment": health.cumulative_damage_assessment,
            "recommended_recovery_time": health.recommended_recovery_time,
            "medical_clearance_status": health.medical_clearance_status,
            "notes": health.notes,
            "assessment_date": date.today().isoformat()
        }
        
        created_health = await db.create_health_monitoring(health_data)
        if not created_health:
            return None
        
        return HealthMonitoringType(
            id=created_health["id"],
            fighter_id=created_health["fighter_id"],
            assessment_date=created_health["assessment_date"],
            overall_health_score=created_health["overall_health_score"],
            concussion_risk=created_health["concussion_risk"],
            cumulative_damage_assessment=created_health.get("cumulative_damage_assessment"),
            recommended_recovery_time=created_health.get("recommended_recovery_time"),
            medical_clearance_status=created_health["medical_clearance_status"],
            notes=created_health.get("notes"),
            created_at=created_health["created_at"]
        )

# Create the schema
schema = strawberry.Schema(query=Query, mutation=Mutation) 