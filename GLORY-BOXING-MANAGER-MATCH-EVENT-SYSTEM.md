# Glory Boxing Manager - Match & Event System
## Advanced Fight Simulation & Event Management

### Complete Match and Event Logic System
This document provides a comprehensive match simulation system with realistic fight mechanics, event scheduling, and integration with the Football Manager-style UI.

---

## 🥊 ADVANCED MATCH SIMULATION SYSTEM

### Enhanced Boxing Match Class
```python
# services/match_simulation.py
from datetime import datetime, timedelta
import random
import math
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

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

@dataclass
class RoundResult:
    round_number: int
    fighter_a_score: int
    fighter_b_score: int
    fighter_a_punches_landed: int
    fighter_b_punches_landed: int
    fighter_a_power_shots: int
    fighter_b_power_shots: int
    knockdowns: List[str]  # ["A", "B", "A"] for multiple knockdowns
    round_winner: str  # "A", "B", or "EVEN"
    round_notes: List[str]

@dataclass
class FightResult:
    winner: str  # "A", "B", or "DRAW"
    method: str  # "DECISION", "KO", "TKO", "DRAW", "SPLIT_DRAW"
    rounds: int
    total_rounds: int
    scorecard: List[RoundResult]
    final_scores: Tuple[int, int]
    knockdowns: Dict[str, int]
    punches_landed: Dict[str, int]
    power_shots: Dict[str, int]
    fight_notes: List[str]

class AdvancedBoxingMatch:
    def __init__(self, fighter_a: Dict, fighter_b: Dict, venue: Dict, date: datetime, 
                 weight_class: str, title_fight: bool = False, rounds: int = 12):
        self.fighter_a = fighter_a
        self.fighter_b = fighter_b
        self.venue = venue
        self.date = date
        self.weight_class = weight_class
        self.title_fight = title_fight
        self.rounds = rounds
        self.result: Optional[FightResult] = None
        self.scorecard: List[RoundResult] = []
        self.fight_id = f"fight_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Initialize fighter stats if not present
        if 'stats' not in self.fighter_a:
            self.fighter_a['stats'] = FighterStats().__dict__
        if 'stats' not in self.fighter_b:
            self.fighter_b['stats'] = FighterStats().__dict__

    def calculate_round_score(self, fighter_a_stats: Dict, fighter_b_stats: Dict, 
                            round_num: int, a_stamina: float, b_stamina: float) -> RoundResult:
        """Calculate detailed round-by-round scoring with realistic mechanics"""
        
        # Base scores influenced by stats and stamina
        a_base = (fighter_a_stats['power'] * 0.3 + 
                 fighter_a_stats['speed'] * 0.2 + 
                 fighter_a_stats['ring_iq'] * 0.2) * (a_stamina / 100)
        
        b_base = (fighter_b_stats['power'] * 0.3 + 
                 fighter_b_stats['speed'] * 0.2 + 
                 fighter_b_stats['ring_iq'] * 0.2) * (b_stamina / 100)
        
        # Random variation
        a_variation = random.uniform(0.8, 1.2)
        b_variation = random.uniform(0.8, 1.2)
        
        # Calculate punches landed
        a_punches = int(random.randint(15, 35) * a_variation * (a_stamina / 100))
        b_punches = int(random.randint(15, 35) * b_variation * (b_stamina / 100))
        
        # Power shots (more impactful)
        a_power = int(a_punches * 0.3 * (fighter_a_stats['power'] / 100))
        b_power = int(b_punches * 0.3 * (fighter_b_stats['power'] / 100))
        
        # Knockdown calculation
        knockdowns = []
        a_knockdown_chance = (b_power * 0.1) * (1 - fighter_a_stats['chin'] / 100)
        b_knockdown_chance = (a_power * 0.1) * (1 - fighter_b_stats['chin'] / 100)
        
        if random.random() < a_knockdown_chance:
            knockdowns.append("A")
        if random.random() < b_knockdown_chance:
            knockdowns.append("B")
        
        # Round scoring (10-point must system)
        a_score = 10
        b_score = 10
        
        # Adjust scores based on performance
        if a_punches > b_punches:
            a_score += 1
        elif b_punches > a_punches:
            b_score += 1
        
        if a_power > b_power:
            a_score += 1
        elif b_power > a_power:
            b_score += 1
        
        # Knockdown penalties
        for kd in knockdowns:
            if kd == "A":
                a_score -= 1
            else:
                b_score -= 1
        
        # Determine round winner
        if a_score > b_score:
            round_winner = "A"
        elif b_score > a_score:
            round_winner = "B"
        else:
            round_winner = "EVEN"
        
        # Generate round notes
        notes = []
        if a_punches > b_punches + 5:
            notes.append(f"{self.fighter_a['name']} controlled the round")
        if b_punches > a_punches + 5:
            notes.append(f"{self.fighter_b['name']} controlled the round")
        if a_power > b_power + 2:
            notes.append(f"{self.fighter_a['name']} landed the harder shots")
        if b_power > a_power + 2:
            notes.append(f"{self.fighter_b['name']} landed the harder shots")
        if knockdowns:
            for kd in knockdowns:
                fighter_name = self.fighter_a['name'] if kd == "A" else self.fighter_b['name']
                notes.append(f"{fighter_name} scored a knockdown!")
        
        return RoundResult(
            round_number=round_num,
            fighter_a_score=a_score,
            fighter_b_score=b_score,
            fighter_a_punches_landed=a_punches,
            fighter_b_punches_landed=b_punches,
            fighter_a_power_shots=a_power,
            fighter_b_power_shots=b_power,
            knockdowns=knockdowns,
            round_winner=round_winner,
            round_notes=notes
        )

    def simulate_fight(self) -> FightResult:
        """Simulate complete fight with realistic mechanics"""
        print(f"[MatchSim] Simulating bout: {self.fighter_a['name']} vs {self.fighter_b['name']}")
        print(f"[MatchSim] Venue: {self.venue['name']}, Weight Class: {self.weight_class}")
        
        self.scorecard = []
        a_total_score = 0
        b_total_score = 0
        a_knockdowns = 0
        b_knockdowns = 0
        a_total_punches = 0
        b_total_punches = 0
        a_total_power = 0
        b_total_power = 0
        fight_notes = []
        
        # Initial stamina
        a_stamina = 100
        b_stamina = 100
        
        # Fight simulation
        for round_num in range(1, self.rounds + 1):
            # Calculate round
            round_result = self.calculate_round_score(
                self.fighter_a['stats'], 
                self.fighter_b['stats'], 
                round_num, 
                a_stamina, 
                b_stamina
            )
            
            self.scorecard.append(round_result)
            
            # Update totals
            a_total_score += round_result.fighter_a_score
            b_total_score += round_result.fighter_b_score
            a_total_punches += round_result.fighter_a_punches_landed
            b_total_punches += round_result.fighter_b_punches_landed
            a_total_power += round_result.fighter_a_power_shots
            b_total_power += round_result.fighter_b_power_shots
            
            # Count knockdowns
            for kd in round_result.knockdowns:
                if kd == "A":
                    a_knockdowns += 1
                else:
                    b_knockdowns += 1
            
            # Stamina drain
            a_stamina -= random.uniform(3, 8) + (round_result.fighter_b_punches_landed * 0.1)
            b_stamina -= random.uniform(3, 8) + (round_result.fighter_a_punches_landed * 0.1)
            
            # Recovery between rounds
            a_stamina += self.fighter_a['stats'].get('recovery', 70) * 0.05
            b_stamina += self.fighter_b['stats'].get('recovery', 70) * 0.05
            
            # Clamp stamina
            a_stamina = max(20, min(100, a_stamina))
            b_stamina = max(20, min(100, b_stamina))
            
            # Check for KO/TKO conditions
            if a_knockdowns >= 3 or a_stamina < 25:
                fight_notes.append(f"{self.fighter_a['name']} was stopped by referee")
                self.result = FightResult(
                    winner="B",
                    method="TKO",
                    rounds=round_num,
                    total_rounds=self.rounds,
                    scorecard=self.scorecard,
                    final_scores=(a_total_score, b_total_score),
                    knockdowns={"A": a_knockdowns, "B": b_knockdowns},
                    punches_landed={"A": a_total_punches, "B": b_total_punches},
                    power_shots={"A": a_total_power, "B": b_total_power},
                    fight_notes=fight_notes
                )
                return self.result
            
            if b_knockdowns >= 3 or b_stamina < 25:
                fight_notes.append(f"{self.fighter_b['name']} was stopped by referee")
                self.result = FightResult(
                    winner="A",
                    method="TKO",
                    rounds=round_num,
                    total_rounds=self.rounds,
                    scorecard=self.scorecard,
                    final_scores=(a_total_score, b_total_score),
                    knockdowns={"A": a_knockdowns, "B": b_knockdowns},
                    punches_landed={"A": a_total_punches, "B": b_total_punches},
                    power_shots={"A": a_total_power, "B": b_total_power},
                    fight_notes=fight_notes
                )
                return self.result
        
        # Decision calculation
        if a_total_score > b_total_score:
            winner = "A"
            method = "DECISION"
            fight_notes.append(f"{self.fighter_a['name']} wins by decision")
        elif b_total_score > a_total_score:
            winner = "B"
            method = "DECISION"
            fight_notes.append(f"{self.fighter_b['name']} wins by decision")
        else:
            winner = "DRAW"
            method = "DRAW"
            fight_notes.append("Fight ends in a draw")
        
        self.result = FightResult(
            winner=winner,
            method=method,
            rounds=self.rounds,
            total_rounds=self.rounds,
            scorecard=self.scorecard,
            final_scores=(a_total_score, b_total_score),
            knockdowns={"A": a_knockdowns, "B": b_knockdowns},
            punches_landed={"A": a_total_punches, "B": b_total_punches},
            power_shots={"A": a_total_power, "B": b_total_power},
            fight_notes=fight_notes
        )
        
        return self.result

    def get_fight_summary(self) -> Dict:
        """Get formatted fight summary for UI display"""
        if not self.result:
            return {"status": "Not simulated yet"}
        
        winner_name = self.fighter_a['name'] if self.result.winner == "A" else self.fighter_b['name']
        loser_name = self.fighter_b['name'] if self.result.winner == "A" else self.fighter_a['name']
        
        return {
            "fight_id": self.fight_id,
            "winner": winner_name,
            "loser": loser_name,
            "method": self.result.method,
            "rounds": self.result.rounds,
            "final_scores": self.result.final_scores,
            "knockdowns": self.result.knockdowns,
            "punches_landed": self.result.punches_landed,
            "power_shots": self.result.power_shots,
            "fight_notes": self.result.fight_notes,
            "venue": self.venue['name'],
            "date": self.date.strftime("%Y-%m-%d %H:%M"),
            "weight_class": self.weight_class,
            "title_fight": self.title_fight
        }
```

---

## 📅 ADVANCED EVENT SCHEDULING SYSTEM

### Event Scheduler with Realistic Logic
```python
# services/event_scheduler.py
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import random
from dataclasses import dataclass

@dataclass
class Event:
    event_id: str
    name: str
    date: datetime
    venue: Dict
    fights: List['BoxingMatch']
    event_type: str  # "PPV", "SHOWTIME", "ESPN", "UNDERCARD"
    promoter: str
    expected_attendance: int
    ticket_prices: Dict[str, float]
    status: str  # "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"

class AdvancedEventScheduler:
    def __init__(self):
        self.events: List[Event] = []
        self.venues = self._load_venues()
        self.promoters = self._load_promoters()
        
    def _load_venues(self) -> Dict:
        """Load available venues with capacity and location data"""
        return {
            "madison_square_garden": {
                "name": "Madison Square Garden",
                "location": "New York, NY",
                "capacity": 20789,
                "tier": "WORLD_CLASS",
                "rental_cost": 500000,
                "image_url": "/venues/msg.jpg"
            },
            "t_mobile_arena": {
                "name": "T-Mobile Arena",
                "location": "Las Vegas, NV",
                "capacity": 20000,
                "tier": "WORLD_CLASS",
                "rental_cost": 450000,
                "image_url": "/venues/tmobile.jpg"
            },
            "o2_arena": {
                "name": "The O2 Arena",
                "location": "London, UK",
                "capacity": 20000,
                "tier": "WORLD_CLASS",
                "rental_cost": 400000,
                "image_url": "/venues/o2.jpg"
            },
            "york_hall": {
                "name": "York Hall",
                "location": "London, UK",
                "capacity": 1200,
                "tier": "REGIONAL",
                "rental_cost": 15000,
                "image_url": "/venues/york_hall.jpg"
            },
            "beach_ballroom": {
                "name": "Beach Ballroom",
                "location": "Aberdeen, UK",
                "capacity": 1500,
                "tier": "REGIONAL",
                "rental_cost": 12000,
                "image_url": "/venues/beach_ballroom.jpg"
            }
        }
    
    def _load_promoters(self) -> Dict:
        """Load promoter information"""
        return {
            "eddie_hearn": {
                "name": "Eddie Hearn",
                "company": "Matchroom Boxing",
                "region": "UK",
                "reputation": 95,
                "network_deals": ["DAZN", "Sky Sports"]
            },
            "bob_arum": {
                "name": "Bob Arum",
                "company": "Top Rank",
                "region": "US",
                "reputation": 90,
                "network_deals": ["ESPN"]
            },
            "oscar_de_la_hoya": {
                "name": "Oscar De La Hoya",
                "company": "Golden Boy Promotions",
                "region": "US",
                "reputation": 85,
                "network_deals": ["DAZN"]
            }
        }

    def schedule_event(self, event_name: str, date: datetime, venue_id: str, 
                      promoter_id: str, event_type: str = "SHOWTIME") -> Event:
        """Schedule a new boxing event"""
        
        venue = self.venues[venue_id]
        promoter = self.promoters[promoter_id]
        
        # Calculate expected attendance based on venue and event type
        base_attendance = venue['capacity'] * 0.7
        if event_type == "PPV":
            base_attendance *= 0.9  # PPV events often have lower attendance
        elif event_type == "UNDERCARD":
            base_attendance *= 0.5
        
        # Calculate ticket prices based on venue tier
        if venue['tier'] == "WORLD_CLASS":
            ticket_prices = {
                "VIP": 2000,
                "Floor": 800,
                "Lower": 400,
                "Upper": 150,
                "General": 75
            }
        else:
            ticket_prices = {
                "VIP": 300,
                "Floor": 150,
                "Lower": 75,
                "Upper": 40,
                "General": 25
            }
        
        event = Event(
            event_id=f"event_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            name=event_name,
            date=date,
            venue=venue,
            fights=[],
            event_type=event_type,
            promoter=promoter['name'],
            expected_attendance=int(base_attendance),
            ticket_prices=ticket_prices,
            status="SCHEDULED"
        )
        
        self.events.append(event)
        return event

    def add_fight_to_event(self, event_id: str, fighter_a: Dict, fighter_b: Dict, 
                          weight_class: str, title_fight: bool = False, 
                          rounds: int = 12) -> Optional['BoxingMatch']:
        """Add a fight to an existing event"""
        
        event = self.get_event_by_id(event_id)
        if not event:
            return None
        
        match = AdvancedBoxingMatch(
            fighter_a=fighter_a,
            fighter_b=fighter_b,
            venue=event.venue,
            date=event.date,
            weight_class=weight_class,
            title_fight=title_fight,
            rounds=rounds
        )
        
        event.fights.append(match)
        return match

    def get_event_by_id(self, event_id: str) -> Optional[Event]:
        """Get event by ID"""
        for event in self.events:
            if event.event_id == event_id:
                return event
        return None

    def get_upcoming_events(self, days_ahead: int = 30) -> List[Event]:
        """Get events scheduled within the next N days"""
        cutoff_date = datetime.now() + timedelta(days=days_ahead)
        return [e for e in self.events if e.date <= cutoff_date and e.status == "SCHEDULED"]

    def simulate_event(self, event_id: str) -> Dict:
        """Simulate all fights in an event"""
        event = self.get_event_by_id(event_id)
        if not event:
            return {"error": "Event not found"}
        
        event.status = "IN_PROGRESS"
        results = []
        
        for fight in event.fights:
            result = fight.simulate_fight()
            results.append(fight.get_fight_summary())
        
        event.status = "COMPLETED"
        
        return {
            "event_id": event.event_id,
            "event_name": event.name,
            "results": results,
            "total_fights": len(event.fights),
            "attendance": self._calculate_actual_attendance(event),
            "revenue": self._calculate_event_revenue(event)
        }

    def _calculate_actual_attendance(self, event: Event) -> int:
        """Calculate actual attendance based on fight quality and venue"""
        base_attendance = event.expected_attendance
        
        # Adjust based on fight quality
        title_fights = sum(1 for fight in event.fights if fight.title_fight)
        if title_fights > 0:
            base_attendance *= 1.2
        
        # Add some randomness
        attendance = int(base_attendance * random.uniform(0.8, 1.1))
        return min(attendance, event.venue['capacity'])

    def _calculate_event_revenue(self, event: Event) -> Dict:
        """Calculate event revenue from tickets and other sources"""
        attendance = self._calculate_actual_attendance(event)
        
        # Ticket revenue
        avg_ticket_price = sum(event.ticket_prices.values()) / len(event.ticket_prices)
        ticket_revenue = attendance * avg_ticket_price * 0.7  # 70% of tickets sold
        
        # PPV revenue (if applicable)
        ppv_revenue = 0
        if event.event_type == "PPV":
            ppv_buys = random.randint(100000, 500000)
            ppv_price = 79.99
            ppv_revenue = ppv_buys * ppv_price * 0.6  # 60% to promoter
        
        # Sponsorship revenue
        sponsorship_revenue = random.randint(50000, 200000)
        
        total_revenue = ticket_revenue + ppv_revenue + sponsorship_revenue
        
        return {
            "ticket_revenue": ticket_revenue,
            "ppv_revenue": ppv_revenue,
            "sponsorship_revenue": sponsorship_revenue,
            "total_revenue": total_revenue,
            "attendance": attendance
        }
```

---

## 🎮 FOOTBALL MANAGER-STYLE UI INTEGRATION

### Event Management Component
```typescript
// components/Events/EventManager.tsx
import React, { useState, useEffect } from 'react'
import { AdvancedEventScheduler } from '../../services/event_scheduler'

export const EventManager: React.FC = () => {
  const [scheduler] = useState(new AdvancedEventScheduler())
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = () => {
    const upcomingEvents = scheduler.get_upcoming_events(90)
    setEvents(upcomingEvents)
  }

  const createEvent = (eventData: any) => {
    const newEvent = scheduler.schedule_event(
      eventData.name,
      new Date(eventData.date),
      eventData.venue_id,
      eventData.promoter_id,
      eventData.event_type
    )
    loadEvents()
    setShowCreateEvent(false)
  }

  const simulateEvent = async (eventId: string) => {
    const result = scheduler.simulate_event(eventId)
    console.log('Event simulation result:', result)
    loadEvents()
  }

  return (
    <div className="event-manager">
      <div className="event-manager-header">
        <h2>Event Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateEvent(true)}
        >
          Schedule New Event
        </button>
      </div>

      <div className="events-grid">
        {events.map(event => (
          <div key={event.event_id} className="event-card">
            <div className="event-header">
              <h3>{event.name}</h3>
              <span className={`event-type ${event.event_type.toLowerCase()}`}>
                {event.event_type}
              </span>
            </div>
            
            <div className="event-details">
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Venue:</strong> {event.venue.name}</p>
              <p><strong>Promoter:</strong> {event.promoter}</p>
              <p><strong>Fights:</strong> {event.fights.length}</p>
              <p><strong>Expected Attendance:</strong> {event.expected_attendance.toLocaleString()}</p>
            </div>

            <div className="event-actions">
              <button 
                className="btn-secondary"
                onClick={() => setSelectedEvent(event)}
              >
                View Details
              </button>
              <button 
                className="btn-primary"
                onClick={() => simulateEvent(event.event_id)}
                disabled={event.status !== 'SCHEDULED'}
              >
                {event.status === 'SCHEDULED' ? 'Simulate Event' : event.status}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateEvent && (
        <CreateEventModal 
          onClose={() => setShowCreateEvent(false)}
          onCreate={createEvent}
          venues={scheduler.venues}
          promoters={scheduler.promoters}
        />
      )}

      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSimulate={() => simulateEvent(selectedEvent.event_id)}
        />
      )}
    </div>
  )
}
```

### Create Event Modal
```typescript
// components/Events/CreateEventModal.tsx
import React, { useState } from 'react'

interface CreateEventModalProps {
  onClose: () => void
  onCreate: (eventData: any) => void
  venues: any
  promoters: any
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onCreate,
  venues,
  promoters
}) => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    venue_id: '',
    promoter_id: '',
    event_type: 'SHOWTIME'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate(eventData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Schedule New Event</h3>
          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              value={eventData.name}
              onChange={(e) => setEventData({...eventData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="datetime-local"
              value={eventData.date}
              onChange={(e) => setEventData({...eventData, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Venue</label>
            <select
              value={eventData.venue_id}
              onChange={(e) => setEventData({...eventData, venue_id: e.target.value})}
              required
            >
              <option value="">Select venue...</option>
              {Object.entries(venues).map(([id, venue]: [string, any]) => (
                <option key={id} value={id}>
                  {venue.name} - {venue.location}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Promoter</label>
            <select
              value={eventData.promoter_id}
              onChange={(e) => setEventData({...eventData, promoter_id: e.target.value})}
              required
            >
              <option value="">Select promoter...</option>
              {Object.entries(promoters).map(([id, promoter]: [string, any]) => (
                <option key={id} value={id}>
                  {promoter.name} - {promoter.company}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Event Type</label>
            <select
              value={eventData.event_type}
              onChange={(e) => setEventData({...eventData, event_type: e.target.value})}
            >
              <option value="UNDERCARD">Undercard</option>
              <option value="SHOWTIME">Showtime</option>
              <option value="ESPN">ESPN</option>
              <option value="PPV">Pay-Per-View</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Schedule Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

### Fight Simulation Component
```typescript
// components/Fights/FightSimulator.tsx
import React, { useState } from 'react'
import { AdvancedBoxingMatch } from '../../services/match_simulation'

export const FightSimulator: React.FC = () => {
  const [selectedFighterA, setSelectedFighterA] = useState<any>(null)
  const [selectedFighterB, setSelectedFighterB] = useState<any>(null)
  const [fightResult, setFightResult] = useState<any>(null)
  const [simulating, setSimulating] = useState(false)

  const simulateFight = async () => {
    if (!selectedFighterA || !selectedFighterB) return

    setSimulating(true)
    
    const match = new AdvancedBoxingMatch(
      selectedFighterA,
      selectedFighterB,
      { name: "Simulation Arena" },
      new Date(),
      "heavyweight"
    )
    
    const result = match.simulate_fight()
    setFightResult(match.get_fight_summary())
    setSimulating(false)
  }

  return (
    <div className="fight-simulator">
      <div className="simulator-header">
        <h2>Fight Simulator</h2>
        <p>Simulate realistic boxing matches with detailed statistics</p>
      </div>

      <div className="fighter-selection">
        <div className="fighter-selector">
          <h3>Fighter A</h3>
          <select 
            value={selectedFighterA?.name || ''} 
            onChange={(e) => {
              const fighter = REAL_WORLD_RANKINGS.heavyweight.find(f => f.name === e.target.value)
              setSelectedFighterA(fighter)
            }}
          >
            <option value="">Choose Fighter A...</option>
            {REAL_WORLD_RANKINGS.heavyweight.map(fighter => (
              <option key={fighter.name} value={fighter.name}>
                {fighter.name} ({fighter.record})
              </option>
            ))}
          </select>
        </div>

        <div className="vs-divider">VS</div>

        <div className="fighter-selector">
          <h3>Fighter B</h3>
          <select 
            value={selectedFighterB?.name || ''} 
            onChange={(e) => {
              const fighter = REAL_WORLD_RANKINGS.heavyweight.find(f => f.name === e.target.value)
              setSelectedFighterB(fighter)
            }}
          >
            <option value="">Choose Fighter B...</option>
            {REAL_WORLD_RANKINGS.heavyweight.map(fighter => (
              <option key={fighter.name} value={fighter.name}>
                {fighter.name} ({fighter.record})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedFighterA && selectedFighterB && (
        <div className="fight-preview">
          <div className="fighter-preview">
            <h4>{selectedFighterA.name}</h4>
            <p>Record: {selectedFighterA.record}</p>
            <p>Country: {selectedFighterA.country}</p>
          </div>

          <div className="fight-info">
            <h4>Fight Details</h4>
            <p>Weight Class: Heavyweight</p>
            <p>Rounds: 12</p>
            <p>Venue: Simulation Arena</p>
          </div>

          <div className="fighter-preview">
            <h4>{selectedFighterB.name}</h4>
            <p>Record: {selectedFighterB.record}</p>
            <p>Country: {selectedFighterB.country}</p>
          </div>
        </div>
      )}

      <button 
        className="simulate-btn"
        onClick={simulateFight}
        disabled={!selectedFighterA || !selectedFighterB || simulating}
      >
        {simulating ? 'Simulating Fight...' : 'Simulate Fight'}
      </button>

      {fightResult && (
        <div className="fight-result">
          <h3>Fight Result</h3>
          <div className="result-summary">
            <div className="winner">
              <h4>Winner: {fightResult.winner}</h4>
              <p>Method: {fightResult.method}</p>
              <p>Rounds: {fightResult.rounds}</p>
            </div>
            
            <div className="fight-stats">
              <h4>Fight Statistics</h4>
              <div className="stats-grid">
                <div className="stat">
                  <span className="label">Punches Landed:</span>
                  <span className="value">
                    {fightResult.punches_landed.A} - {fightResult.punches_landed.B}
                  </span>
                </div>
                <div className="stat">
                  <span className="label">Power Shots:</span>
                  <span className="value">
                    {fightResult.power_shots.A} - {fightResult.power_shots.B}
                  </span>
                </div>
                <div className="stat">
                  <span className="label">Knockdowns:</span>
                  <span className="value">
                    {fightResult.knockdowns.A} - {fightResult.knockdowns.B}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="fight-notes">
            <h4>Fight Notes</h4>
            <ul>
              {fightResult.fight_notes.map((note: string, index: number) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 🎨 FOOTBALL MANAGER STYLE CSS FOR EVENTS

```css
/* styles/EventManager.css */
.event-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.event-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.event-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.event-card:hover {
  transform: translateY(-2px);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.event-header h3 {
  margin: 0;
  color: #1e3c72;
}

.event-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.event-type.ppv {
  background: #ffd700;
  color: #333;
}

.event-type.showtime {
  background: #28a745;
  color: white;
}

.event-type.espn {
  background: #dc3545;
  color: white;
}

.event-type.undercard {
  background: #6c757d;
  color: white;
}

.event-details p {
  margin: 5px 0;
  font-size: 14px;
}

.event-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.event-form .form-group {
  margin-bottom: 20px;
}

.event-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.event-form input,
.event-form select {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

/* Fight Simulator Styles */
.fight-simulator {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.simulator-header {
  text-align: center;
  margin-bottom: 30px;
}

.fighter-selection {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
}

.fighter-selector {
  flex: 1;
  max-width: 300px;
}

.fighter-selector h3 {
  margin-bottom: 10px;
  color: #333;
}

.fighter-selector select {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.vs-divider {
  font-size: 24px;
  font-weight: bold;
  color: #1e3c72;
  padding: 0 20px;
}

.fight-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.fighter-preview {
  text-align: center;
  flex: 1;
}

.fighter-preview h4 {
  margin-bottom: 10px;
  color: #1e3c72;
}

.fight-info {
  text-align: center;
  flex: 1;
}

.simulate-btn {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  width: 100%;
  margin-bottom: 30px;
}

.simulate-btn:hover:not(:disabled) {
  background: #2a5298;
}

.simulate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.fight-result {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.winner h4 {
  color: #28a745;
  margin-bottom: 10px;
}

.stats-grid {
  display: grid;
  gap: 10px;
}

.stat {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.fight-notes ul {
  list-style: none;
  padding: 0;
}

.fight-notes li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  color: #666;
}
```

This comprehensive match and event system provides:

1. **Advanced Fight Simulation**: Realistic round-by-round scoring with knockdowns, stamina, and detailed statistics
2. **Event Scheduling**: Complete event management with venues, promoters, and revenue calculation
3. **Football Manager UI**: Professional interface with modals, cards, and interactive elements
4. **Real-World Integration**: Venues, promoters, and realistic boxing mechanics
5. **Detailed Statistics**: Punch counts, power shots, knockdowns, and fight notes

The system is ready for development with professional boxing management features!

**The complete Match & Event System is ready for development!** 🥊 