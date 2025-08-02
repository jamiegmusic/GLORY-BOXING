# Glory Boxing Manager - Commentary, Rankings & Press System
## Deep Fight Commentary, Rankings, Titles, and Press Systems

### Complete Commentary and Press System
This document provides a comprehensive system for fight commentary, dynamic rankings, championship management, and press conference generation.

---

## 🎙️ ADVANCED FIGHT COMMENTARY SYSTEM

### Enhanced Commentary Generator
```python
# services/commentary_system.py
import random
from datetime import datetime
from typing import List, Dict, Tuple
from dataclasses import dataclass

@dataclass
class CommentaryLine:
    round_number: int
    timestamp: str
    commentator: str
    line: str
    emotion: str  # "excited", "calm", "surprised", "analytical"
    importance: int  # 1-10 scale

@dataclass
class FightCommentary:
    pre_fight: List[str]
    round_by_round: List[CommentaryLine]
    post_fight: List[str]
    highlights: List[str]
    statistics: Dict

class AdvancedFightCommentaryGenerator:
    def __init__(self):
        self.commentators = {
            "jim_lampley": {
                "name": "Jim Lampley",
                "style": "analytical",
                "signature_phrases": [
                    "It's happening!",
                    "The sweet science at its finest!",
                    "What a moment in boxing history!"
                ]
            },
            "max_kellerman": {
                "name": "Max Kellerman",
                "style": "technical",
                "signature_phrases": [
                    "The fundamentals are everything",
                    "That's textbook boxing",
                    "You can't teach that kind of timing"
                ]
            },
            "roy_jones_jr": {
                "name": "Roy Jones Jr.",
                "style": "expert_analysis",
                "signature_phrases": [
                    "I've been there, I know what it's like",
                    "That's championship level stuff",
                    "The speed is the key here"
                ]
            }
        }
        
        self.commentary_templates = {
            "opening": [
                "The atmosphere here at {venue} is absolutely electric!",
                "We're about to witness something special tonight!",
                "The crowd is on their feet as we get ready for this main event!"
            ],
            "round_start": [
                "Round {round} begins and {fighter} comes out aggressive!",
                "Here we go in round {round}, {fighter} looking to establish control!",
                "The bell sounds for round {round} and both fighters are ready!"
            ],
            "punch_landed": [
                "Beautiful shot by {fighter}!",
                "That's a clean connection from {fighter}!",
                "What a punch! {fighter} found the target!"
            ],
            "knockdown": [
                "DOWN GOES {fighter}! The crowd erupts!",
                "OH MY! {fighter} is on the canvas!",
                "The referee is counting! {fighter} is in trouble!"
            ],
            "round_end": [
                "That's the end of round {round}, {fighter} may have edged it!",
                "The bell sounds and {fighter} looks confident!",
                "Round {round} is in the books, {fighter} controlled the action!"
            ],
            "fight_end": [
                "What a fight! {winner} gets the victory!",
                "The crowd is on their feet! {winner} is the winner!",
                "Incredible performance by {winner}!"
            ]
        }

    def generate_pre_fight_commentary(self, match) -> List[str]:
        """Generate pre-fight commentary and analysis"""
        commentary = []
        
        # Venue and atmosphere
        commentary.append(f"The atmosphere here at {match.venue['name']} is absolutely electric!")
        commentary.append(f"We have a capacity crowd of {match.venue['capacity']:,} fans ready for action!")
        
        # Fighter introductions
        commentary.append(f"In the blue corner, we have {match.fighter_a['name']} with a record of {match.fighter_a.get('record', '0-0-0')}!")
        commentary.append(f"In the red corner, we have {match.fighter_b['name']} with a record of {match.fighter_b.get('record', '0-0-0')}!")
        
        # Fight analysis
        if match.title_fight:
            commentary.append("This is a championship fight! The stakes couldn't be higher!")
        
        commentary.append(f"Both fighters are in excellent condition and ready to go {match.rounds} rounds!")
        commentary.append("The referee is giving final instructions... and here we go!")
        
        return commentary

    def generate_round_commentary(self, match, round_result: 'RoundResult') -> List[CommentaryLine]:
        """Generate round-by-round commentary"""
        commentary_lines = []
        round_num = round_result.round_number
        
        # Round opening
        opening_line = random.choice(self.commentary_templates["round_start"]).format(
            round=round_num,
            fighter=match.fighter_a['name'] if round_result.fighter_a_punches_landed > round_result.fighter_b_punches_landed else match.fighter_b['name']
        )
        commentary_lines.append(CommentaryLine(
            round_number=round_num,
            timestamp=f"{round_num}:00",
            commentator="Jim Lampley",
            line=opening_line,
            emotion="excited",
            importance=5
        ))
        
        # Mid-round action
        if round_result.fighter_a_punches_landed > round_result.fighter_b_punches_landed + 3:
            commentary_lines.append(CommentaryLine(
                round_number=round_num,
                timestamp=f"{round_num}:30",
                commentator="Max Kellerman",
                line=f"{match.fighter_a['name']} is controlling the pace and landing the cleaner shots!",
                emotion="analytical",
                importance=7
            ))
        
        if round_result.fighter_b_punches_landed > round_result.fighter_a_punches_landed + 3:
            commentary_lines.append(CommentaryLine(
                round_number=round_num,
                timestamp=f"{round_num}:45",
                commentator="Roy Jones Jr.",
                line=f"{match.fighter_b['name']} is finding his rhythm and landing some good shots!",
                emotion="expert_analysis",
                importance=7
            ))
        
        # Power shots commentary
        if round_result.fighter_a_power_shots > 3:
            commentary_lines.append(CommentaryLine(
                round_number=round_num,
                timestamp=f"{round_num}:50",
                commentator="Jim Lampley",
                line=f"BIG SHOT by {match.fighter_a['name']}! That had to hurt!",
                emotion="excited",
                importance=8
            ))
        
        if round_result.fighter_b_power_shots > 3:
            commentary_lines.append(CommentaryLine(
                round_number=round_num,
                timestamp=f"{round_num}:55",
                commentator="Max Kellerman",
                line=f"{match.fighter_b['name']} with a powerful combination!",
                emotion="surprised",
                importance=8
            ))
        
        # Knockdown commentary
        for kd in round_result.knockdowns:
            fighter_name = match.fighter_a['name'] if kd == "A" else match.fighter_b['name']
            commentary_lines.append(CommentaryLine(
                round_number=round_num,
                timestamp=f"{round_num}:58",
                commentator="Jim Lampley",
                line=f"DOWN GOES {fighter_name}! THE CROWD ERUPTS!",
                emotion="excited",
                importance=10
            ))
        
        # Round ending
        round_winner = match.fighter_a['name'] if round_result.round_winner == "A" else match.fighter_b['name']
        ending_line = random.choice(self.commentary_templates["round_end"]).format(
            round=round_num,
            fighter=round_winner
        )
        commentary_lines.append(CommentaryLine(
            round_number=round_num,
            timestamp=f"{round_num}:59",
            commentator="Max Kellerman",
            line=ending_line,
            emotion="analytical",
            importance=6
        ))
        
        return commentary_lines

    def generate_post_fight_commentary(self, match, result: 'FightResult') -> List[str]:
        """Generate post-fight commentary and analysis"""
        commentary = []
        
        winner_name = match.fighter_a['name'] if result.winner == "A" else match.fighter_b['name']
        loser_name = match.fighter_b['name'] if result.winner == "A" else match.fighter_a['name']
        
        # Result announcement
        if result.method == "KO":
            commentary.append(f"INCREDIBLE! {winner_name} gets the knockout victory!")
            commentary.append("The crowd is absolutely stunned by that finish!")
        elif result.method == "TKO":
            commentary.append(f"The referee has seen enough! {winner_name} wins by TKO!")
            commentary.append(f"{loser_name} was taking too much punishment!")
        else:
            commentary.append(f"After {result.rounds} rounds, {winner_name} gets the decision victory!")
            commentary.append("What a competitive fight that was!")
        
        # Statistics commentary
        total_punches = result.punches_landed["A"] + result.punches_landed["B"]
        commentary.append(f"Total punches thrown: {total_punches} in this fight!")
        
        if result.knockdowns["A"] > 0 or result.knockdowns["B"] > 0:
            commentary.append(f"We saw {result.knockdowns['A'] + result.knockdowns['B']} knockdowns in this fight!")
        
        # Future implications
        if match.title_fight:
            commentary.append(f"{winner_name} is the new champion! What a moment!")
        else:
            commentary.append(f"This win puts {winner_name} in a great position for a title shot!")
        
        return commentary

    def generate_full_commentary(self, match, result: 'FightResult') -> FightCommentary:
        """Generate complete fight commentary"""
        pre_fight = self.generate_pre_fight_commentary(match)
        
        round_commentary = []
        for round_result in match.scorecard:
            round_lines = self.generate_round_commentary(match, round_result)
            round_commentary.extend(round_lines)
        
        post_fight = self.generate_post_fight_commentary(match, result)
        
        # Generate highlights
        highlights = []
        for round_result in match.scorecard:
            if round_result.knockdowns:
                highlights.append(f"Round {round_result.round_number}: Knockdown scored!")
            if round_result.fighter_a_power_shots > 4 or round_result.fighter_b_power_shots > 4:
                highlights.append(f"Round {round_result.round_number}: Heavy shots landed!")
        
        # Compile statistics
        statistics = {
            "total_rounds": len(match.scorecard),
            "total_punches": result.punches_landed["A"] + result.punches_landed["B"],
            "total_knockdowns": result.knockdowns["A"] + result.knockdowns["B"],
            "method": result.method,
            "duration": f"{result.rounds} rounds"
        }
        
        return FightCommentary(
            pre_fight=pre_fight,
            round_by_round=round_commentary,
            post_fight=post_fight,
            highlights=highlights,
            statistics=statistics
        )
```

---

## 🏆 ADVANCED RANKINGS SYSTEM

### Dynamic Rankings Manager
```python
# services/rankings_system.py
from typing import List, Dict, Optional
import math
from dataclasses import dataclass

@dataclass
class RankingEntry:
    fighter: Dict
    rank: int
    points: float
    previous_rank: int
    movement: str  # "up", "down", "new", "unchanged"
    last_fight: str
    win_streak: int
    quality_wins: int

class AdvancedRankingsManager:
    def __init__(self):
        self.rankings = {}  # weight_class -> List[RankingEntry]
        self.weight_classes = [
            "heavyweight", "cruiserweight", "light_heavyweight", "super_middleweight",
            "middleweight", "super_welterweight", "welterweight", "super_lightweight",
            "lightweight", "super_featherweight", "featherweight", "super_bantamweight",
            "bantamweight", "super_flyweight", "flyweight"
        ]
        
        # Initialize rankings for each weight class
        for weight_class in self.weight_classes:
            self.rankings[weight_class] = []

    def calculate_fighter_points(self, fighter: Dict, opponent: Dict, result: str, 
                               method: str, rounds: int) -> float:
        """Calculate ranking points for a fighter based on fight result"""
        base_points = 0
        
        # Result points
        if result == "win":
            base_points += 100
        elif result == "loss":
            base_points += 10
        elif result == "draw":
            base_points += 50
        
        # Method bonus
        if method == "KO":
            base_points += 50
        elif method == "TKO":
            base_points += 30
        elif method == "DECISION":
            base_points += 20
        
        # Opponent quality bonus
        opponent_rank = self.get_fighter_rank(opponent)
        if opponent_rank <= 5:
            base_points += 100
        elif opponent_rank <= 10:
            base_points += 50
        elif opponent_rank <= 15:
            base_points += 25
        
        # Round bonus (longer fights = more points)
        if rounds >= 10:
            base_points += 20
        elif rounds >= 6:
            base_points += 10
        
        # Activity bonus (fights in last 6 months)
        if fighter.get('last_fight_date'):
            months_since_fight = (datetime.now() - fighter['last_fight_date']).days / 30
            if months_since_fight <= 6:
                base_points += 25
            elif months_since_fight <= 12:
                base_points += 10
        
        return base_points

    def update_rankings(self, winner: Dict, loser: Dict, weight_class: str, 
                       method: str, rounds: int):
        """Update rankings after a fight"""
        print(f"[Rankings] Updating {weight_class} rankings after {winner['name']} vs {loser['name']}")
        
        # Calculate points
        winner_points = self.calculate_fighter_points(winner, loser, "win", method, rounds)
        loser_points = self.calculate_fighter_points(loser, winner, "loss", method, rounds)
        
        # Get current rankings
        current_rankings = self.rankings[weight_class]
        
        # Find fighters in current rankings
        winner_entry = None
        loser_entry = None
        
        for entry in current_rankings:
            if entry.fighter['id'] == winner['id']:
                winner_entry = entry
            if entry.fighter['id'] == loser['id']:
                loser_entry = entry
        
        # Update or create winner entry
        if winner_entry:
            winner_entry.points += winner_points
            winner_entry.last_fight = f"W vs {loser['name']} ({method})"
            winner_entry.win_streak += 1
        else:
            winner_entry = RankingEntry(
                fighter=winner,
                rank=0,
                points=winner_points,
                previous_rank=0,
                movement="new",
                last_fight=f"W vs {loser['name']} ({method})",
                win_streak=1,
                quality_wins=1 if self.get_fighter_rank(loser) <= 10 else 0
            )
            current_rankings.append(winner_entry)
        
        # Update or create loser entry
        if loser_entry:
            loser_entry.points += loser_points
            loser_entry.last_fight = f"L vs {winner['name']} ({method})"
            loser_entry.win_streak = 0
        else:
            loser_entry = RankingEntry(
                fighter=loser,
                rank=0,
                points=loser_points,
                previous_rank=0,
                movement="new",
                last_fight=f"L vs {winner['name']} ({method})",
                win_streak=0,
                quality_wins=0
            )
            current_rankings.append(loser_entry)
        
        # Sort rankings by points
        current_rankings.sort(key=lambda x: x.points, reverse=True)
        
        # Update ranks and movement
        for i, entry in enumerate(current_rankings):
            previous_rank = entry.rank
            entry.rank = i + 1
            
            if previous_rank == 0:
                entry.movement = "new"
            elif entry.rank < previous_rank:
                entry.movement = "up"
            elif entry.rank > previous_rank:
                entry.movement = "down"
            else:
                entry.movement = "unchanged"
            
            entry.previous_rank = previous_rank

    def get_fighter_rank(self, fighter: Dict, weight_class: str = None) -> int:
        """Get current rank of a fighter"""
        if not weight_class:
            weight_class = fighter.get('weight_class', 'heavyweight')
        
        for entry in self.rankings[weight_class]:
            if entry.fighter['id'] == fighter['id']:
                return entry.rank
        
        return 999  # Unranked

    def get_top_rankings(self, weight_class: str, limit: int = 15) -> List[RankingEntry]:
        """Get top N rankings for a weight class"""
        return self.rankings[weight_class][:limit]

    def get_rankings_report(self, weight_class: str) -> Dict:
        """Generate comprehensive rankings report"""
        rankings = self.get_top_rankings(weight_class)
        
        report = {
            "weight_class": weight_class,
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "rankings": []
        }
        
        for entry in rankings:
            report["rankings"].append({
                "rank": entry.rank,
                "fighter": entry.fighter['name'],
                "record": entry.fighter.get('record', '0-0-0'),
                "points": entry.points,
                "movement": entry.movement,
                "last_fight": entry.last_fight,
                "win_streak": entry.win_streak,
                "quality_wins": entry.quality_wins
            })
        
        return report
```

---

## 👑 CHAMPIONSHIP SYSTEM

### Advanced Championship Management
```python
# services/championship_system.py
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class Championship:
    organization: str  # "WBC", "WBA", "IBF", "WBO"
    weight_class: str
    champion: Dict
    date_won: datetime
    defenses: int
    mandatory_challenger: Optional[Dict]
    mandatory_due_date: Optional[datetime]
    status: str  # "active", "vacant", "interim"

@dataclass
class TitleFight:
    organization: str
    weight_class: str
    champion: Dict
    challenger: Dict
    date: datetime
    venue: Dict
    status: str  # "scheduled", "completed", "cancelled"

class AdvancedChampionshipSystem:
    def __init__(self):
        self.championships = {}  # org_weight_class -> Championship
        self.title_fights = []
        self.organizations = ["WBC", "WBA", "IBF", "WBO"]
        
        # Initialize championships
        self._initialize_championships()

    def _initialize_championships(self):
        """Initialize championship belts for all weight classes"""
        weight_classes = [
            "heavyweight", "cruiserweight", "light_heavyweight", "super_middleweight",
            "middleweight", "super_welterweight", "welterweight", "super_lightweight",
            "lightweight", "super_featherweight", "featherweight", "super_bantamweight",
            "bantamweight", "super_flyweight", "flyweight"
        ]
        
        for org in self.organizations:
            for weight_class in weight_classes:
                key = f"{org}_{weight_class}"
                self.championships[key] = Championship(
                    organization=org,
                    weight_class=weight_class,
                    champion=None,
                    date_won=None,
                    defenses=0,
                    mandatory_challenger=None,
                    mandatory_due_date=None,
                    status="vacant"
                )

    def assign_championship(self, organization: str, weight_class: str, fighter: Dict):
        """Assign a championship to a fighter"""
        key = f"{organization}_{weight_class}"
        
        if key in self.championships:
            self.championships[key].champion = fighter
            self.championships[key].date_won = datetime.now()
            self.championships[key].defenses = 0
            self.championships[key].status = "active"
            
            print(f"[Championship] {fighter['name']} is now the {organization} {weight_class} Champion!")
            
            # Set mandatory challenger due date (9 months from now)
            self.championships[key].mandatory_due_date = datetime.now() + timedelta(days=270)

    def check_title_fight(self, match) -> Optional[str]:
        """Check if a match is a title fight"""
        weight_class = match.weight_class
        
        for org in self.organizations:
            key = f"{org}_{weight_class}"
            championship = self.championships[key]
            
            if championship.status == "active" and championship.champion:
                if (championship.champion['id'] == match.fighter_a['id'] or 
                    championship.champion['id'] == match.fighter_b['id']):
                    return org
        
        return None

    def handle_title_fight_result(self, organization: str, weight_class: str, 
                                winner: Dict, loser: Dict, method: str):
        """Handle the result of a title fight"""
        key = f"{organization}_{weight_class}"
        championship = self.championships[key]
        
        if championship.champion and championship.champion['id'] == winner['id']:
            # Champion retains title
            championship.defenses += 1
            print(f"[Championship] {winner['name']} successfully defends the {organization} title!")
        else:
            # New champion
            self.assign_championship(organization, weight_class, winner)
        
        # Update mandatory challenger
        self._update_mandatory_challenger(organization, weight_class, loser)

    def _update_mandatory_challenger(self, organization: str, weight_class: str, fighter: Dict):
        """Update mandatory challenger for a championship"""
        key = f"{organization}_{weight_class}"
        championship = self.championships[key]
        
        # Simple logic: if fighter is ranked in top 5, they become mandatory
        if self._get_fighter_ranking(fighter, weight_class) <= 5:
            championship.mandatory_challenger = fighter
            championship.mandatory_due_date = datetime.now() + timedelta(days=180)
            print(f"[Championship] {fighter['name']} is now the mandatory challenger for {organization} {weight_class}!")

    def get_championship_status(self, organization: str, weight_class: str) -> Dict:
        """Get current championship status"""
        key = f"{organization}_{weight_class}"
        championship = self.championships[key]
        
        return {
            "organization": championship.organization,
            "weight_class": championship.weight_class,
            "champion": championship.champion['name'] if championship.champion else "Vacant",
            "date_won": championship.date_won.strftime("%Y-%m-%d") if championship.date_won else None,
            "defenses": championship.defenses,
            "mandatory_challenger": championship.mandatory_challenger['name'] if championship.mandatory_challenger else None,
            "mandatory_due_date": championship.mandatory_due_date.strftime("%Y-%m-%d") if championship.mandatory_due_date else None,
            "status": championship.status
        }

    def get_all_championships(self) -> Dict:
        """Get status of all championships"""
        all_championships = {}
        
        for key, championship in self.championships.items():
            org, weight_class = key.split('_', 1)
            if org not in all_championships:
                all_championships[org] = {}
            
            all_championships[org][weight_class] = self.get_championship_status(org, weight_class)
        
        return all_championships

    def _get_fighter_ranking(self, fighter: Dict, weight_class: str) -> int:
        """Get fighter's ranking (placeholder - would integrate with rankings system)"""
        # This would integrate with the rankings system
        return 5  # Placeholder
```

---

## 📰 PRESS CONFERENCE SYSTEM

### Advanced Press Conference Generator
```python
# services/press_conference_system.py
import random
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class PressQuestion:
    question: str
    target: str  # "winner", "loser", "both", "promoter", "trainer"
    category: str  # "fight_analysis", "future_plans", "controversy", "technical"
    importance: int  # 1-10 scale

@dataclass
class PressConference:
    event_name: str
    date: datetime
    participants: List[Dict]
    questions: List[PressQuestion]
    highlights: List[str]
    controversies: List[str]

class AdvancedPressConferenceGenerator:
    def __init__(self):
        self.journalists = [
            "Dan Rafael", "Mike Coppinger", "Chris Mannix", "Brian Campbell",
            "Steve Kim", "Doug Fischer", "Lance Pugmire", "Keith Idec"
        ]
        
        self.question_templates = {
            "fight_analysis": [
                "What was your strategy going into this fight?",
                "How did you prepare for {opponent}'s style?",
                "What was the key to your victory tonight?",
                "Did the fight go according to plan?",
                "What surprised you most about {opponent}?"
            ],
            "future_plans": [
                "Who would you like to fight next?",
                "Are you looking for a title shot?",
                "Do you see a rematch happening?",
                "What's your timeline for your next fight?",
                "Are you considering moving up in weight?"
            ],
            "controversy": [
                "What do you think about the judging?",
                "Do you feel the referee made the right call?",
                "Were there any issues with the fight?",
                "What's your response to the criticism?",
                "Do you think the fight was stopped too early?"
            ],
            "technical": [
                "How did you handle {opponent}'s power?",
                "What adjustments did you make during the fight?",
                "How did your training camp prepare you?",
                "What was the most challenging aspect?",
                "How did you deal with the pressure?"
            ]
        }

    def generate_press_conference(self, match, result: 'FightResult') -> PressConference:
        """Generate a complete press conference"""
        winner_name = match.fighter_a['name'] if result.winner == "A" else match.fighter_b['name']
        loser_name = match.fighter_b['name'] if result.winner == "A" else match.fighter_a['name']
        
        # Determine participants
        participants = [
            {"name": winner_name, "role": "winner", "record": match.fighter_a.get('record', '0-0-0') if result.winner == "A" else match.fighter_b.get('record', '0-0-0')},
            {"name": loser_name, "role": "loser", "record": match.fighter_b.get('record', '0-0-0') if result.winner == "A" else match.fighter_a.get('record', '0-0-0')}
        ]
        
        # Add promoter if available
        if hasattr(match, 'promoter'):
            participants.append({"name": match.promoter, "role": "promoter"})
        
        # Generate questions
        questions = self._generate_questions(winner_name, loser_name, result)
        
        # Generate highlights and controversies
        highlights = self._generate_highlights(match, result)
        controversies = self._generate_controversies(match, result)
        
        return PressConference(
            event_name=f"{winner_name} vs {loser_name} Post-Fight Press Conference",
            date=datetime.now(),
            participants=participants,
            questions=questions,
            highlights=highlights,
            controversies=controversies
        )

    def _generate_questions(self, winner: str, loser: str, result: 'FightResult') -> List[PressQuestion]:
        """Generate press conference questions"""
        questions = []
        
        # Winner questions
        winner_questions = [
            f"To {winner}: Congratulations on the victory. What was your strategy going into this fight?",
            f"To {winner}: How did you prepare for {loser}'s style?",
            f"To {winner}: What was the key to your victory tonight?",
            f"To {winner}: Who would you like to fight next?",
            f"To {winner}: Are you looking for a title shot?"
        ]
        
        for question in winner_questions:
            questions.append(PressQuestion(
                question=question,
                target="winner",
                category="fight_analysis",
                importance=random.randint(7, 10)
            ))
        
        # Loser questions
        loser_questions = [
            f"To {loser}: What went wrong in there tonight?",
            f"To {loser}: Do you think the fight was stopped too early?",
            f"To {loser}: What adjustments would you make in a rematch?",
            f"To {loser}: How do you bounce back from this loss?",
            f"To {loser}: Do you see a rematch happening?"
        ]
        
        for question in loser_questions:
            questions.append(PressQuestion(
                question=question,
                target="loser",
                category="fight_analysis",
                importance=random.randint(5, 8)
            ))
        
        # Both fighters questions
        both_questions = [
            f"To both fighters: Do you see a rematch happening down the line?",
            f"To both fighters: What did you learn about each other tonight?",
            f"To both fighters: How do you rate each other's performance?"
        ]
        
        for question in both_questions:
            questions.append(PressQuestion(
                question=question,
                target="both",
                category="future_plans",
                importance=random.randint(6, 9)
            ))
        
        return questions

    def _generate_highlights(self, match, result: 'FightResult') -> List[str]:
        """Generate press conference highlights"""
        highlights = []
        
        winner_name = match.fighter_a['name'] if result.winner == "A" else match.fighter_b['name']
        
        highlights.append(f"{winner_name} expressed confidence in his performance")
        
        if result.method == "KO":
            highlights.append(f"{winner_name} called it 'the perfect shot'")
        elif result.method == "TKO":
            highlights.append(f"{winner_name} said he could see {result.loser} was hurt")
        
        if result.knockdowns["A"] > 0 or result.knockdowns["B"] > 0:
            highlights.append("Both fighters discussed the knockdowns")
        
        highlights.append(f"{winner_name} thanked his team and fans")
        
        return highlights

    def _generate_controversies(self, match, result: 'FightResult') -> List[str]:
        """Generate potential controversies"""
        controversies = []
        
        loser_name = match.fighter_b['name'] if result.winner == "A" else match.fighter_a['name']
        
        if result.method == "TKO":
            controversies.append(f"{loser_name} questioned the referee's stoppage")
        
        if result.rounds < 6:
            controversies.append("Fans expressed disappointment with the early finish")
        
        if result.knockdowns["A"] > 2 or result.knockdowns["B"] > 2:
            controversies.append("Questions about fighter safety were raised")
        
        return controversies

    def generate_press_report(self, press_conference: PressConference) -> Dict:
        """Generate a press conference report"""
        return {
            "event": press_conference.event_name,
            "date": press_conference.date.strftime("%Y-%m-%d %H:%M"),
            "participants": [p['name'] for p in press_conference.participants],
            "key_questions": [q.question for q in press_conference.questions[:5]],
            "highlights": press_conference.highlights,
            "controversies": press_conference.controversies,
            "summary": f"Press conference featured {len(press_conference.questions)} questions with {len(press_conference.highlights)} key highlights"
        }
```

---

## 🎮 FOOTBALL MANAGER-STYLE UI INTEGRATION

### Commentary Display Component
```typescript
// components/Commentary/FightCommentary.tsx
import React, { useState, useEffect } from 'react'
import { AdvancedFightCommentaryGenerator } from '../../services/commentary_system'

export const FightCommentary: React.FC<{ match: any, result: any }> = ({ match, result }) => {
  const [commentary, setCommentary] = useState<any>(null)
  const [currentRound, setCurrentRound] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (match && result) {
      const generator = new AdvancedFightCommentaryGenerator()
      const fullCommentary = generator.generate_full_commentary(match, result)
      setCommentary(fullCommentary)
    }
  }, [match, result])

  const playCommentary = () => {
    setIsPlaying(true)
    setCurrentRound(0)
    
    const interval = setInterval(() => {
      setCurrentRound(prev => {
        if (prev >= commentary.round_by_round.length) {
          setIsPlaying(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  if (!commentary) return <div>Loading commentary...</div>

  return (
    <div className="fight-commentary">
      <div className="commentary-header">
        <h3>Fight Commentary</h3>
        <button 
          className="play-btn"
          onClick={playCommentary}
          disabled={isPlaying}
        >
          {isPlaying ? 'Playing...' : 'Play Commentary'}
        </button>
      </div>

      <div className="commentary-content">
        {/* Pre-fight commentary */}
        <div className="commentary-section">
          <h4>Pre-Fight</h4>
          {commentary.pre_fight.map((line: string, index: number) => (
            <p key={index} className="commentary-line">{line}</p>
          ))}
        </div>

        {/* Round-by-round commentary */}
        <div className="commentary-section">
          <h4>Round-by-Round</h4>
          <div className="round-commentary">
            {commentary.round_by_round.slice(0, currentRound + 1).map((line: any, index: number) => (
              <div key={index} className={`commentary-line ${line.emotion}`}>
                <span className="timestamp">{line.timestamp}</span>
                <span className="commentator">{line.commentator}:</span>
                <span className="text">{line.line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Post-fight commentary */}
        {currentRound >= commentary.round_by_round.length && (
          <div className="commentary-section">
            <h4>Post-Fight</h4>
            {commentary.post_fight.map((line: string, index: number) => (
              <p key={index} className="commentary-line">{line}</p>
            ))}
          </div>
        )}

        {/* Highlights */}
        <div className="commentary-section">
          <h4>Highlights</h4>
          <ul>
            {commentary.highlights.map((highlight: string, index: number) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Statistics */}
        <div className="commentary-section">
          <h4>Fight Statistics</h4>
          <div className="stats-grid">
            {Object.entries(commentary.statistics).map(([key, value]) => (
              <div key={key} className="stat">
                <span className="label">{key.replace('_', ' ').toUpperCase()}:</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

This comprehensive system provides:

1. **Advanced Commentary**: Realistic fight commentary with multiple commentators and emotional delivery
2. **Dynamic Rankings**: Sophisticated ranking system with points calculation and movement tracking
3. **Championship Management**: Complete championship system with mandatory challengers and title defenses
4. **Press Conferences**: Detailed press conference generation with questions, highlights, and controversies
5. **Football Manager UI**: Professional interface for displaying all commentary and press content

The system is ready for development with professional boxing management features!

**The complete Commentary, Rankings & Press System is ready for development!** 🥊 