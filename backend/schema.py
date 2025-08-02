import strawberry
from typing import List, Optional
from datetime import datetime
import uuid

@strawberry.type
class Fighter:
    id: int
    name: str
    weight_class: str
    record: str
    nationality: Optional[str] = None
    age: Optional[int] = None
    mugshot_url: Optional[str] = None
    voice_profile: Optional[str] = None
    ai_generated: bool = False
    created_at: str

@strawberry.type
class Match:
    id: int
    fighter_a_id: int
    fighter_b_id: int
    venue: str
    date: str
    result: Optional[str] = None
    scorecard: Optional[str] = None
    scheduled_rounds: int = 12
    title_fight: bool = False
    status: str = "scheduled"
    created_at: str

@strawberry.type
class PressConference:
    id: int
    match_id: int
    questions: List[str]
    transcript: Optional[str] = None
    ai_generated_quotes: List[str] = []
    public_sentiment_score: Optional[float] = None
    created_at: str

@strawberry.type
class Title:
    id: int
    organization: str
    weight_class: str
    current_champion_id: Optional[int] = None
    updated_at: str

@strawberry.type
class Ranking:
    id: int
    fighter_id: int
    organization: str
    weight_class: str
    rank: int
    updated_at: str

@strawberry.type
class AIGenerationResult:
    success: bool
    mugshot_url: Optional[str] = None
    voice_profile: Optional[str] = None
    error_message: Optional[str] = None

# Sample data store with enhanced structure
fighters = [
    Fighter(
        id=1, 
        name="Mike Tyson", 
        weight_class="Heavyweight", 
        record="50-6-0", 
        nationality="USA", 
        age=57,
        mugshot_url="https://via.placeholder.com/150/FF6B6B/FFFFFF?text=MT",
        voice_profile="deep_aggressive",
        ai_generated=True,
        created_at="2024-01-01T00:00:00Z"
    ),
    Fighter(
        id=2, 
        name="Muhammad Ali", 
        weight_class="Heavyweight", 
        record="56-5-0", 
        nationality="USA", 
        age=74,
        mugshot_url="https://via.placeholder.com/150/4ECDC4/FFFFFF?text=MA",
        voice_profile="charismatic_confident",
        ai_generated=True,
        created_at="2024-01-01T00:00:00Z"
    ),
    Fighter(
        id=3, 
        name="Floyd Mayweather", 
        weight_class="Welterweight", 
        record="50-0-0", 
        nationality="USA", 
        age=46,
        mugshot_url="https://via.placeholder.com/150/45B7D1/FFFFFF?text=FM",
        voice_profile="smooth_technical",
        ai_generated=True,
        created_at="2024-01-01T00:00:00Z"
    ),
]

matches = []
press_conferences = []
titles = [
    Title(id=1, organization="WBC", weight_class="Heavyweight", current_champion_id=1, updated_at="2024-01-01T00:00:00Z"),
    Title(id=2, organization="WBA", weight_class="Heavyweight", current_champion_id=1, updated_at="2024-01-01T00:00:00Z"),
    Title(id=3, organization="IBF", weight_class="Welterweight", current_champion_id=3, updated_at="2024-01-01T00:00:00Z"),
]

rankings = [
    Ranking(id=1, fighter_id=1, organization="WBC", weight_class="Heavyweight", rank=1, updated_at="2024-01-01T00:00:00Z"),
    Ranking(id=2, fighter_id=2, organization="WBC", weight_class="Heavyweight", rank=2, updated_at="2024-01-01T00:00:00Z"),
    Ranking(id=3, fighter_id=3, organization="IBF", weight_class="Welterweight", rank=1, updated_at="2024-01-01T00:00:00Z"),
]

@strawberry.type
class Query:
    @strawberry.field
    def get_fighters(self) -> List[Fighter]:
        return fighters

    @strawberry.field
    def get_fighter(self, fighter_id: int) -> Optional[Fighter]:
        for fighter in fighters:
            if fighter.id == fighter_id:
                return fighter
        return None

    @strawberry.field
    def get_matches(self) -> List[Match]:
        return matches

    @strawberry.field
    def get_match(self, match_id: int) -> Optional[Match]:
        for match in matches:
            if match.id == match_id:
                return match
        return None

    @strawberry.field
    def get_press_conferences(self) -> List[PressConference]:
        return press_conferences

    @strawberry.field
    def get_press_conference(self, match_id: int) -> Optional[PressConference]:
        for pc in press_conferences:
            if pc.match_id == match_id:
                return pc
        return None

    @strawberry.field
    def get_titles(self) -> List[Title]:
        return titles

    @strawberry.field
    def get_rankings(self) -> List[Ranking]:
        return rankings

    @strawberry.field
    def get_rankings_by_weight_class(self, weight_class: str) -> List[Ranking]:
        return [r for r in rankings if r.weight_class == weight_class]

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_fighter(
        self, 
        name: str, 
        weight_class: str, 
        record: str = "0-0-0", 
        nationality: Optional[str] = None, 
        age: Optional[int] = None,
        mugshot_url: Optional[str] = None,
        voice_profile: Optional[str] = None
    ) -> Fighter:
        fighter = Fighter(
            id=len(fighters) + 1,
            name=name,
            weight_class=weight_class,
            record=record,
            nationality=nationality,
            age=age,
            mugshot_url=mugshot_url,
            voice_profile=voice_profile,
            ai_generated=False,
            created_at=datetime.now().isoformat()
        )
        fighters.append(fighter)
        return fighter

    @strawberry.mutation
    def schedule_match(
        self, 
        fighter_a_id: int, 
        fighter_b_id: int, 
        venue: str, 
        date: str,
        scheduled_rounds: int = 12,
        title_fight: bool = False
    ) -> Match:
        match = Match(
            id=len(matches) + 1,
            fighter_a_id=fighter_a_id,
            fighter_b_id=fighter_b_id,
            venue=venue,
            date=date,
            scheduled_rounds=scheduled_rounds,
            title_fight=title_fight,
            status="scheduled",
            created_at=datetime.now().isoformat()
        )
        matches.append(match)
        return match

    @strawberry.mutation
    def submit_press_question(
        self, 
        match_id: int, 
        question: str,
        category: str = "general",
        importance: int = 5
    ) -> PressConference:
        for pc in press_conferences:
            if pc.match_id == match_id:
                pc.questions.append(question)
                return pc
        
        new_pc = PressConference(
            id=len(press_conferences) + 1,
            match_id=match_id,
            questions=[question],
            ai_generated_quotes=[],
            created_at=datetime.now().isoformat()
        )
        press_conferences.append(new_pc)
        return new_pc

    @strawberry.mutation
    def generate_ai_mugshot(self, fighter_id: int, style: str = "professional") -> AIGenerationResult:
        # Simulate AI mugshot generation
        try:
            # In real implementation, call AI service here
            mugshot_url = f"https://via.placeholder.com/150/random/FFFFFF?text=AI_{fighter_id}"
            
            # Update fighter with AI-generated mugshot
            for fighter in fighters:
                if fighter.id == fighter_id:
                    fighter.mugshot_url = mugshot_url
                    fighter.ai_generated = True
                    break
            
            return AIGenerationResult(
                success=True,
                mugshot_url=mugshot_url,
                error_message=None
            )
        except Exception as e:
            return AIGenerationResult(
                success=False,
                error_message=str(e)
            )

    @strawberry.mutation
    def generate_ai_voice(self, fighter_id: int, voice_type: str = "neutral") -> AIGenerationResult:
        # Simulate AI voice generation
        try:
            # In real implementation, call AI voice service here
            voice_profile = f"{voice_type}_{fighter_id}"
            
            # Update fighter with AI-generated voice profile
            for fighter in fighters:
                if fighter.id == fighter_id:
                    fighter.voice_profile = voice_profile
                    fighter.ai_generated = True
                    break
            
            return AIGenerationResult(
                success=True,
                voice_profile=voice_profile,
                error_message=None
            )
        except Exception as e:
            return AIGenerationResult(
                success=False,
                error_message=str(e)
            )

    @strawberry.mutation
    def update_fighter_ranking(
        self, 
        fighter_id: int, 
        organization: str, 
        weight_class: str, 
        rank: int
    ) -> Ranking:
        # Remove existing ranking for this fighter/organization/weight_class
        rankings[:] = [r for r in rankings if not (
            r.fighter_id == fighter_id and 
            r.organization == organization and 
            r.weight_class == weight_class
        )]
        
        new_ranking = Ranking(
            id=len(rankings) + 1,
            fighter_id=fighter_id,
            organization=organization,
            weight_class=weight_class,
            rank=rank,
            updated_at=datetime.now().isoformat()
        )
        rankings.append(new_ranking)
        return new_ranking

    @strawberry.mutation
    def update_match_result(
        self, 
        match_id: int, 
        result: str, 
        scorecard: Optional[str] = None
    ) -> Match:
        for match in matches:
            if match.id == match_id:
                match.result = result
                match.scorecard = scorecard
                match.status = "completed"
                return match
        raise Exception("Match not found")

schema = strawberry.Schema(query=Query, mutation=Mutation) 