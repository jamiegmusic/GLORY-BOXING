import strawberry
from typing import List, Optional

@strawberry.type
class Fighter:
    id: int
    name: str
    weight_class: str
    record: str
    nationality: Optional[str] = None
    age: Optional[int] = None

@strawberry.type
class Match:
    id: int
    fighter_a: Fighter
    fighter_b: Fighter
    venue: str
    date: str
    result: Optional[str] = None
    scheduled_rounds: int = 12

# Sample data store
fighters = [
    Fighter(id=1, name="John Doe", weight_class="Lightweight", record="12-1-0", nationality="USA", age=25),
    Fighter(id=2, name="Jake Smith", weight_class="Lightweight", record="10-0-2", nationality="UK", age=28),
    Fighter(id=3, name="Mike Johnson", weight_class="Heavyweight", record="15-2-1", nationality="Canada", age=30),
]

matches = []

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

@strawberry.type
class Mutation:
    @strawberry.mutation
    def schedule_match(self, fighter_a_id: int, fighter_b_id: int, venue: str, date: str, scheduled_rounds: int = 12) -> Match:
        fighter_a = next(f for f in fighters if f.id == fighter_a_id)
        fighter_b = next(f for f in fighters if f.id == fighter_b_id)
        match = Match(
            id=len(matches)+1, 
            fighter_a=fighter_a, 
            fighter_b=fighter_b, 
            venue=venue, 
            date=date,
            scheduled_rounds=scheduled_rounds
        )
        matches.append(match)
        return match

    @strawberry.mutation
    def create_fighter(self, name: str, weight_class: str, record: str, nationality: str = None, age: int = None) -> Fighter:
        fighter = Fighter(
            id=len(fighters)+1,
            name=name,
            weight_class=weight_class,
            record=record,
            nationality=nationality,
            age=age
        )
        fighters.append(fighter)
        return fighter

schema = strawberry.Schema(query=Query, mutation=Mutation) 