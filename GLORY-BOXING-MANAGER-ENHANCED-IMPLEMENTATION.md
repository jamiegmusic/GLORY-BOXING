# Glory Boxing Manager - Enhanced Implementation
## Building Upon Your Streamlined Supabase System

### Enhanced Features & Professional Implementation
This document enhances your clean Supabase boxing system with advanced features, improved database schema, and professional enhancements.

---

## 🗄️ ENHANCED DATABASE SCHEMA

### Improved Supabase Tables
```sql
-- Enhanced Matches Table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fighter_a_name VARCHAR(255) NOT NULL,
    fighter_b_name VARCHAR(255) NOT NULL,
    venue_name VARCHAR(255) NOT NULL,
    venue_location VARCHAR(255),
    match_date TIMESTAMP NOT NULL,
    result VARCHAR(255),
    winner_name VARCHAR(255),
    loser_name VARCHAR(255),
    method VARCHAR(50), -- "DECISION", "KO", "TKO", "DRAW"
    rounds INTEGER DEFAULT 12,
    title_bout BOOLEAN DEFAULT false,
    belt VARCHAR(10), -- "WBC", "WBA", "IBF", "WBO"
    status VARCHAR(20) DEFAULT 'scheduled',
    total_punches_a INTEGER DEFAULT 0,
    total_punches_b INTEGER DEFAULT 0,
    total_power_shots_a INTEGER DEFAULT 0,
    total_power_shots_b INTEGER DEFAULT 0,
    knockdowns_a INTEGER DEFAULT 0,
    knockdowns_b INTEGER DEFAULT 0,
    commentary TEXT,
    scorecard JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Rankings Table
CREATE TABLE rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rank_position INTEGER NOT NULL,
    fighter_name VARCHAR(255) NOT NULL,
    weight_class VARCHAR(50) DEFAULT 'heavyweight',
    points DECIMAL(10,2) DEFAULT 0,
    record_wins INTEGER DEFAULT 0,
    record_losses INTEGER DEFAULT 0,
    record_draws INTEGER DEFAULT 0,
    win_streak INTEGER DEFAULT 0,
    last_fight TEXT,
    last_fight_date TIMESTAMP,
    movement VARCHAR(20), -- "up", "down", "new", "unchanged"
    previous_rank INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Titles Table
CREATE TABLE titles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    belt VARCHAR(10) NOT NULL, -- "WBC", "WBA", "IBF", "WBO"
    weight_class VARCHAR(50) DEFAULT 'heavyweight',
    champion_name VARCHAR(255),
    date_won TIMESTAMP,
    defenses INTEGER DEFAULT 0,
    mandatory_challenger VARCHAR(255),
    mandatory_due_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'vacant', -- "active", "vacant", "interim"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(belt, weight_class)
);

-- Enhanced Press Conferences Table
CREATE TABLE press_conferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    match_date VARCHAR(255),
    question TEXT NOT NULL,
    target VARCHAR(50), -- "winner", "loser", "both"
    category VARCHAR(50), -- "fight_analysis", "future_plans", "controversy"
    importance INTEGER DEFAULT 5,
    journalist VARCHAR(100) DEFAULT 'Dan Rafael',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fighters Table
CREATE TABLE fighters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    weight_class VARCHAR(50) DEFAULT 'heavyweight',
    record_wins INTEGER DEFAULT 0,
    record_losses INTEGER DEFAULT 0,
    record_draws INTEGER DEFAULT 0,
    -- Enhanced Stats
    power INTEGER DEFAULT 70,
    speed INTEGER DEFAULT 70,
    defense INTEGER DEFAULT 70,
    stamina INTEGER DEFAULT 70,
    ring_iq INTEGER DEFAULT 70,
    chin INTEGER DEFAULT 70,
    heart INTEGER DEFAULT 70,
    recovery INTEGER DEFAULT 70,
    experience INTEGER DEFAULT 50,
    morale INTEGER DEFAULT 75,
    -- Career Info
    career_earnings DECIMAL(12,2) DEFAULT 0,
    last_fight_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_fighters ON matches(fighter_a_name, fighter_b_name);
CREATE INDEX idx_rankings_position ON rankings(rank_position);
CREATE INDEX idx_titles_belt ON titles(belt);
CREATE INDEX idx_fighters_name ON fighters(name);

-- Triggers for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rankings_updated_at BEFORE UPDATE ON rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_titles_updated_at BEFORE UPDATE ON titles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fighters_updated_at BEFORE UPDATE ON fighters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🐍 ENHANCED PYTHON IMPLEMENTATION

### Improved Boxing System with Advanced Features
```python
# enhanced_boxing_system.py
from datetime import datetime
import random
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from supabase import create_client, Client
import os
import json

# Supabase setup
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@dataclass
class FighterStats:
    power: int = 70
    speed: int = 70
    defense: int = 70
    stamina: int = 70
    ring_iq: int = 70
    chin: int = 70
    heart: int = 70
    recovery: int = 70
    experience: int = 50
    morale: int = 75

class EnhancedBoxingMatch:
    def __init__(self, fighter_a: Dict, fighter_b: Dict, venue: Dict, date: datetime, 
                 title_bout: bool = False, belt: str = None):
        self.fighter_a = fighter_a
        self.fighter_b = fighter_b
        self.venue = venue
        self.date = date
        self.result = None
        self.scorecard = []
        self.commentary = ""
        self.title_bout = title_bout
        self.belt = belt
        
        # Enhanced fight statistics
        self.total_punches_a = 0
        self.total_punches_b = 0
        self.total_power_shots_a = 0
        self.total_power_shots_b = 0
        self.knockdowns_a = 0
        self.knockdowns_b = 0
        self.method = "DECISION"
        
        # Initialize stats if not present
        if 'stats' not in self.fighter_a:
            self.fighter_a['stats'] = FighterStats().__dict__
        if 'stats' not in self.fighter_b:
            self.fighter_b['stats'] = FighterStats().__dict__

    def simulate(self) -> Tuple[str, Optional[Dict]]:
        """Enhanced simulation with realistic mechanics"""
        print(f"[MatchSim] Simulating bout between {self.fighter_a['name']} and {self.fighter_b['name']}")
        
        if self.title_bout:
            print(f"[MatchSim] This is a {self.belt} championship fight!")

        rounds = 12
        a_score = 0
        b_score = 0
        a_stamina = 100
        b_stamina = 100

        for r in range(1, rounds + 1):
            # Enhanced round simulation
            round_result = self._simulate_round(r, a_stamina, b_stamina)
            self.scorecard.append(round_result)
            
            a_score += round_result['fighter_a_score']
            b_score += round_result['fighter_b_score']
            
            # Update stamina
            a_stamina = self._update_stamina(a_stamina, round_result['fighter_b_punches'])
            b_stamina = self._update_stamina(b_stamina, round_result['fighter_a_punches'])
            
            # Generate commentary
            self._generate_round_commentary(r, round_result)

        # Determine winner with enhanced logic
        winner, method = self._determine_winner(a_score, b_score)
        
        # Generate final commentary
        self._generate_final_commentary(winner, method)
        
        return self.result, winner

    def _simulate_round(self, round_num: int, a_stamina: float, b_stamina: float) -> Dict:
        """Enhanced round simulation with realistic mechanics"""
        # Calculate base performance
        a_base = self._calculate_performance(self.fighter_a, a_stamina)
        b_base = self._calculate_performance(self.fighter_b, b_stamina)
        
        # Generate scores with variation
        a_score = int(a_base + random.randint(-2, 2))
        b_score = int(b_base + random.randint(-2, 2))
        
        # Calculate punches
        a_punches = int(random.randint(15, 35) * (a_stamina / 100))
        b_punches = int(random.randint(15, 35) * (b_stamina / 100))
        
        # Power shots
        a_power = int(a_punches * 0.3 * (self.fighter_a['stats'].get('power', 70) / 100))
        b_power = int(b_punches * 0.3 * (self.fighter_b['stats'].get('power', 70) / 100))
        
        # Update totals
        self.total_punches_a += a_punches
        self.total_punches_b += b_punches
        self.total_power_shots_a += a_power
        self.total_power_shots_b += b_power
        
        # Knockdowns
        knockdowns = self._calculate_knockdowns(a_power, b_power)
        self.knockdowns_a += knockdowns.count("A")
        self.knockdowns_b += knockdowns.count("B")
        
        # Adjust scores for knockdowns
        for kd in knockdowns:
            if kd == "A":
                a_score -= 1
            else:
                b_score -= 1
        
        return {
            'round_number': round_num,
            'fighter_a_score': a_score,
            'fighter_b_score': b_score,
            'fighter_a_punches': a_punches,
            'fighter_b_punches': b_punches,
            'fighter_a_power_shots': a_power,
            'fighter_b_power_shots': b_power,
            'knockdowns': knockdowns,
            'round_winner': "A" if a_score > b_score else "B" if b_score > a_score else "EVEN"
        }

    def _calculate_performance(self, fighter: Dict, stamina: float) -> float:
        """Calculate fighter performance based on stats and stamina"""
        stats = fighter['stats']
        base_performance = (
            stats.get('power', 70) * 0.25 +
            stats.get('speed', 70) * 0.2 +
            stats.get('ring_iq', 70) * 0.2 +
            stats.get('experience', 50) * 0.15 +
            stats.get('morale', 75) * 0.1 +
            stats.get('defense', 70) * 0.1
        )
        return base_performance * (stamina / 100)

    def _calculate_knockdowns(self, a_power: int, b_power: int) -> List[str]:
        """Calculate knockdowns based on power and chin"""
        knockdowns = []
        
        a_knockdown_chance = (b_power * 0.08) * (1 - self.fighter_a['stats'].get('chin', 70) / 100)
        b_knockdown_chance = (a_power * 0.08) * (1 - self.fighter_b['stats'].get('chin', 70) / 100)
        
        if random.random() < a_knockdown_chance:
            knockdowns.append("A")
        if random.random() < b_knockdown_chance:
            knockdowns.append("B")
        
        return knockdowns

    def _update_stamina(self, current_stamina: float, punches_taken: int) -> float:
        """Update fighter stamina"""
        stamina_loss = random.uniform(3, 8) + (punches_taken * 0.1)
        new_stamina = current_stamina - stamina_loss
        return max(20, min(100, new_stamina))

    def _determine_winner(self, a_score: int, b_score: int) -> Tuple[Optional[Dict], str]:
        """Determine winner with enhanced logic"""
        # Check for KO/TKO conditions
        if self.knockdowns_a >= 3:
            self.method = "TKO"
            return self.fighter_b, "TKO"
        elif self.knockdowns_b >= 3:
            self.method = "TKO"
            return self.fighter_a, "TKO"
        
        # Decision logic
        if a_score > b_score:
            self.result = f"{self.fighter_a['name']} wins by decision"
            return self.fighter_a, "DECISION"
        elif b_score > a_score:
            self.result = f"{self.fighter_b['name']} wins by decision"
            return self.fighter_b, "DECISION"
        else:
            self.result = "Split draw"
            return None, "DRAW"

    def _generate_round_commentary(self, round_num: int, round_result: Dict):
        """Generate enhanced round commentary"""
        commentary_lines = [
            f"Round {round_num}: {self.fighter_a['name']} scored {round_result['fighter_a_score']}, {self.fighter_b['name']} scored {round_result['fighter_b_score']}.",
            f"Punches landed: {self.fighter_a['name']} {round_result['fighter_a_punches']}, {self.fighter_b['name']} {round_result['fighter_b_punches']}."
        ]
        
        if round_result['knockdowns']:
            for kd in round_result['knockdowns']:
                fighter_name = self.fighter_a['name'] if kd == "A" else self.fighter_b['name']
                commentary_lines.append(f"KNOCKDOWN! {fighter_name} goes down!")
        
        self.commentary += "\n".join(commentary_lines) + "\n"

    def _generate_final_commentary(self, winner: Optional[Dict], method: str):
        """Generate final fight commentary"""
        self.commentary += f"\nFinal Result: {self.result}"
        if winner:
            self.commentary += f"\nMethod: {method}"
            self.commentary += f"\nTotal Punches: {self.fighter_a['name']} {self.total_punches_a}, {self.fighter_b['name']} {self.total_punches_b}"
            self.commentary += f"\nPower Shots: {self.fighter_a['name']} {self.total_power_shots_a}, {self.fighter_b['name']} {self.total_power_shots_b}"
            self.commentary += f"\nKnockdowns: {self.fighter_a['name']} {self.knockdowns_a}, {self.fighter_b['name']} {self.knockdowns_b}"

    def save_to_supabase(self):
        """Enhanced save to Supabase with comprehensive data"""
        match_data = {
            "fighter_a_name": self.fighter_a['name'],
            "fighter_b_name": self.fighter_b['name'],
            "venue_name": self.venue.get('name', 'Unknown Venue'),
            "venue_location": self.venue.get('location', ''),
            "match_date": self.date.isoformat(),
            "result": self.result,
            "winner_name": self.fighter_a['name'] if self.result and self.fighter_a['name'] in self.result else 
                          self.fighter_b['name'] if self.result and self.fighter_b['name'] in self.result else None,
            "loser_name": self.fighter_b['name'] if self.result and self.fighter_a['name'] in self.result else 
                         self.fighter_a['name'] if self.result and self.fighter_b['name'] in self.result else None,
            "method": self.method,
            "title_bout": self.title_bout,
            "belt": self.belt if self.title_bout else None,
            "status": "completed",
            "total_punches_a": self.total_punches_a,
            "total_punches_b": self.total_punches_b,
            "total_power_shots_a": self.total_power_shots_a,
            "total_power_shots_b": self.total_power_shots_b,
            "knockdowns_a": self.knockdowns_a,
            "knockdowns_b": self.knockdowns_b,
            "commentary": self.commentary,
            "scorecard": json.dumps(self.scorecard)
        }
        
        response = supabase.table("matches").insert(match_data).execute()
        return response.data[0]['id'] if response.data else None


class EnhancedRankings:
    def __init__(self):
        self.ranks = []

    def update(self, winner: Dict, loser: Dict, weight_class: str = "heavyweight"):
        """Enhanced ranking update with points system"""
        print(f"[RankingSystem] Updating {weight_class} rankings: {winner['name']} over {loser['name']}")
        
        # Calculate points
        winner_points = self._calculate_points(winner, loser, "win")
        loser_points = self._calculate_points(loser, winner, "loss")
        
        # Update winner ranking
        self._update_fighter_ranking(winner, winner_points, weight_class, "win", loser['name'])
        
        # Update loser ranking
        self._update_fighter_ranking(loser, loser_points, weight_class, "loss", winner['name'])
        
        # Reorder rankings
        self._reorder_rankings(weight_class)

    def _calculate_points(self, fighter: Dict, opponent: Dict, result: str) -> float:
        """Calculate ranking points"""
        base_points = 100 if result == "win" else 10
        
        # Method bonus
        method_bonus = 20 if result == "win" else 0
        
        # Opponent quality bonus
        opponent_bonus = 25 if opponent.get('rank', 999) <= 10 else 0
        
        # Win streak bonus
        streak_bonus = min(fighter.get('win_streak', 0) * 5, 50)
        
        return base_points + method_bonus + opponent_bonus + streak_bonus

    def _update_fighter_ranking(self, fighter: Dict, points: float, weight_class: str, result: str, opponent_name: str):
        """Update individual fighter ranking"""
        # Check if fighter exists in rankings
        response = supabase.table('rankings').select('*').eq('fighter_name', fighter['name']).eq('weight_class', weight_class).execute()
        
        if response.data:
            # Update existing ranking
            current_rank = response.data[0]
            new_points = current_rank['points'] + points
            new_win_streak = current_rank['win_streak'] + 1 if result == "win" else 0
            
            update_data = {
                'points': new_points,
                'last_fight': f"{result.upper()} vs {opponent_name}",
                'win_streak': new_win_streak,
                'last_fight_date': datetime.now().isoformat(),
                'record_wins': current_rank['record_wins'] + (1 if result == "win" else 0),
                'record_losses': current_rank['record_losses'] + (1 if result == "loss" else 0),
                'record_draws': current_rank['record_draws'] + (1 if result == "draw" else 0)
            }
            
            supabase.table('rankings').update(update_data).eq('id', current_rank['id']).execute()
        else:
            # Create new ranking
            ranking_data = {
                'fighter_name': fighter['name'],
                'weight_class': weight_class,
                'rank_position': 999,  # Will be updated in reorder
                'points': points,
                'last_fight': f"{result.upper()} vs {opponent_name}",
                'win_streak': 1 if result == "win" else 0,
                'last_fight_date': datetime.now().isoformat(),
                'record_wins': 1 if result == "win" else 0,
                'record_losses': 1 if result == "loss" else 0,
                'record_draws': 1 if result == "draw" else 0
            }
            
            supabase.table('rankings').insert(ranking_data).execute()

    def _reorder_rankings(self, weight_class: str):
        """Reorder rankings by points"""
        # Get all rankings for weight class
        response = supabase.table('rankings').select('*').eq('weight_class', weight_class).order('points', desc=True).execute()
        
        for i, ranking in enumerate(response.data):
            previous_rank = ranking['rank_position']
            new_rank = i + 1
            
            # Determine movement
            if previous_rank == 999:
                movement = "new"
            elif new_rank < previous_rank:
                movement = "up"
            elif new_rank > previous_rank:
                movement = "down"
            else:
                movement = "unchanged"
            
            # Update ranking
            update_data = {
                'rank_position': new_rank,
                'previous_rank': previous_rank,
                'movement': movement
            }
            
            supabase.table('rankings').update(update_data).eq('id', ranking['id']).execute()

    def save_to_supabase(self):
        """Enhanced save with comprehensive data"""
        # Clear existing rankings
        supabase.table("rankings").delete().neq("id", 0).execute()
        
        # Save current rankings
        for idx, fighter in enumerate(self.ranks):
            supabase.table("rankings").insert({
                "rank_position": idx + 1,
                "fighter_name": fighter['name'],
                "weight_class": fighter.get('weight_class', 'heavyweight'),
                "points": fighter.get('points', 0),
                "record_wins": fighter.get('record_wins', 0),
                "record_losses": fighter.get('record_losses', 0),
                "record_draws": fighter.get('record_draws', 0),
                "win_streak": fighter.get('win_streak', 0),
                "last_fight": fighter.get('last_fight', ''),
                "movement": fighter.get('movement', 'new')
            }).execute()


class EnhancedTitleManager:
    def __init__(self):
        self.titles = {"WBC": None, "WBA": None, "IBF": None, "WBO": None}

    def assign_title(self, belt: str, fighter: Dict, weight_class: str = "heavyweight"):
        """Enhanced title assignment with history tracking"""
        print(f"[TitleManager] {belt} {weight_class} title awarded to {fighter['name']}")
        
        # Check if title exists
        response = supabase.table('titles').select('*').eq('belt', belt).eq('weight_class', weight_class).execute()
        
        if response.data:
            # Update existing title
            title = response.data[0]
            
            update_data = {
                'champion_name': fighter['name'],
                'date_won': datetime.now().isoformat(),
                'defenses': 0,
                'status': 'active'
            }
            
            supabase.table('titles').update(update_data).eq('id', title['id']).execute()
        else:
            # Create new title
            title_data = {
                'belt': belt,
                'weight_class': weight_class,
                'champion_name': fighter['name'],
                'date_won': datetime.now().isoformat(),
                'status': 'active'
            }
            
            supabase.table('titles').insert(title_data).execute()

    def strip_title(self, belt: str, weight_class: str = "heavyweight", reason: str = "Unknown"):
        """Enhanced title stripping"""
        print(f"[TitleManager] {belt} {weight_class} title stripped - {reason}")
        
        response = supabase.table('titles').select('*').eq('belt', belt).eq('weight_class', weight_class).execute()
        
        if response.data:
            title = response.data[0]
            
            update_data = {
                'champion_name': None,
                'date_won': None,
                'defenses': 0,
                'status': 'vacant'
            }
            
            supabase.table('titles').update(update_data).eq('id', title['id']).execute()

    def save_to_supabase(self):
        """Enhanced save with comprehensive data"""
        for belt, champ in self.titles.items():
            supabase.table("titles").upsert({
                "belt": belt,
                "weight_class": "heavyweight",
                "champion": champ,
                "status": "active" if champ else "vacant"
            }, on_conflict=["belt", "weight_class"]).execute()


class EnhancedPressConference:
    def __init__(self, fighter: Dict, opponent: Dict):
        self.fighter = fighter
        self.opponent = opponent

    def generate_questions(self) -> List[str]:
        """Enhanced press conference questions"""
        questions = [
            f"{self.fighter['name']}, how do you feel after that fight?",
            f"What was the game plan going in against {self.opponent['name']}?",
            f"Will we see a rematch soon?",
            f"What are your thoughts on {self.opponent['name']}'s performance?",
            f"What's next for you now in the rankings or title picture?",
            f"Did you expect the fight to go the way it did?",
            f"How do you rate your performance tonight?",
            f"Any message for your fans and supporters?"
        ]
        return questions

    def save_to_supabase(self, match_id: str):
        """Enhanced save with comprehensive data"""
        for q in self.generate_questions():
            supabase.table("press_conferences").insert({
                "match_id": match_id,
                "question": q,
                "target": "winner" if self.fighter.get('won', False) else "loser",
                "category": "fight_analysis",
                "importance": 7,
                "journalist": "Dan Rafael"
            }).execute()


class EnhancedEventScheduler:
    def __init__(self):
        self.events = []
        self.rankings = EnhancedRankings()
        self.title_manager = EnhancedTitleManager()

    def schedule_match(self, fighter_a: Dict, fighter_b: Dict, venue: Dict, 
                      title_bout: bool = False, belt: str = None) -> EnhancedBoxingMatch:
        """Schedule a match with enhanced features"""
        match = EnhancedBoxingMatch(fighter_a, fighter_b, venue, datetime.now(), title_bout, belt)
        self.events.append(match)
        return match

    def get_upcoming(self) -> List[EnhancedBoxingMatch]:
        """Get upcoming matches"""
        return [e for e in self.events if e.date >= datetime.now()]

    def simulate_all(self):
        """Enhanced simulation with comprehensive integration"""
        for match in self.get_upcoming():
            result, winner = match.simulate()
            print(f"[EventResult] {result}")
            print("\n[Fight Commentary]\n" + match.commentary + "\n")
            
            if winner:
                loser = match.fighter_b if winner == match.fighter_a else match.fighter_a
                self.rankings.update(winner, loser)
                
                if match.title_bout and winner:
                    self.title_manager.assign_title(match.belt, winner)

            # Save all data to Supabase
            match_id = match.save_to_supabase()
            self.rankings.save_to_supabase()
            self.title_manager.save_to_supabase()

            # Generate press conference
            presser = EnhancedPressConference(winner or match.fighter_a, loser)
            print("[Press Conference Questions]")
            for q in presser.generate_questions():
                print("- " + q)
            presser.save_to_supabase(match_id)

    def get_rankings(self, weight_class: str = "heavyweight") -> List[Dict]:
        """Get current rankings from Supabase"""
        response = supabase.table('rankings').select('*').eq('weight_class', weight_class).order('rank_position', asc=True).execute()
        return response.data

    def get_titles(self) -> List[Dict]:
        """Get current titles from Supabase"""
        response = supabase.table('titles').select('*').execute()
        return response.data

    def get_recent_matches(self, limit: int = 10) -> List[Dict]:
        """Get recent matches from Supabase"""
        response = supabase.table('matches').select('*').order('match_date', desc=True).limit(limit).execute()
        return response.data
```

---

## 🎮 USAGE EXAMPLE

### Complete Implementation Example
```python
# example_usage.py
from enhanced_boxing_system import EnhancedEventScheduler
from datetime import datetime

# Initialize scheduler
scheduler = EnhancedEventScheduler()

# Create sample fighters
fighter_a = {
    'name': 'Tyson Fury',
    'weight_class': 'heavyweight',
    'stats': {
        'power': 85,
        'speed': 75,
        'defense': 80,
        'stamina': 90,
        'ring_iq': 88,
        'chin': 85,
        'heart': 90,
        'recovery': 85,
        'experience': 80,
        'morale': 90
    }
}

fighter_b = {
    'name': 'Oleksandr Usyk',
    'weight_class': 'heavyweight',
    'stats': {
        'power': 80,
        'speed': 90,
        'defense': 85,
        'stamina': 85,
        'ring_iq': 92,
        'chin': 80,
        'heart': 85,
        'recovery': 80,
        'experience': 75,
        'morale': 88
    }
}

venue = {
    'name': 'Madison Square Garden',
    'location': 'New York, NY'
}

# Schedule a title fight
match = scheduler.schedule_match(fighter_a, fighter_b, venue, title_bout=True, belt="WBC")

# Simulate the match
scheduler.simulate_all()

# Get updated data
rankings = scheduler.get_rankings("heavyweight")
titles = scheduler.get_titles()
recent_matches = scheduler.get_recent_matches()

print("\n=== Current Rankings ===")
for rank in rankings[:5]:
    print(f"{rank['rank_position']}. {rank['fighter_name']} - {rank['points']} pts")

print("\n=== Current Champions ===")
for title in titles:
    print(f"{title['belt']} {title['weight_class']}: {title['champion_name']}")
```

This enhanced implementation provides:

1. **Improved Database Schema**: More comprehensive tables with better relationships
2. **Enhanced Fight Mechanics**: Realistic stamina, knockdowns, and performance calculations
3. **Better Data Management**: Comprehensive save/load operations with Supabase
4. **Professional Features**: Advanced ranking system, title management, and press conferences
5. **Scalable Architecture**: Easy to extend and modify for additional features

The system is now ready for professional boxing management with full Supabase integration! 🥊 