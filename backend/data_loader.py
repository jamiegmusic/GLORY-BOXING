import json
from datetime import datetime
from typing import Dict, Any, List
from schema import Fighter, Match, PressConference, Title, Ranking, fighters, matches, press_conferences, titles, rankings

def load_fighters_from_json(data: List[Dict[str, Any]]) -> List[Fighter]:
    """Load fighters from JSON data into GraphQL schema format"""
    loaded_fighters = []
    
    for fighter_data in data:
        fighter = Fighter(
            id=fighter_data["id"],
            name=fighter_data["name"],
            weight_class=fighter_data["weight_class"],
            record=fighter_data["record"],
            nationality=fighter_data.get("nationality"),
            age=fighter_data.get("age"),
            mugshot_url=fighter_data.get("mugshot_url"),
            voice_profile=fighter_data.get("voice_profile"),
            ai_generated=fighter_data.get("ai_generated", False),
            created_at=fighter_data.get("created_at", datetime.now().isoformat())
        )
        loaded_fighters.append(fighter)
    
    return loaded_fighters

def load_matches_from_json(data: List[Dict[str, Any]]) -> List[Match]:
    """Load matches from JSON data into GraphQL schema format"""
    loaded_matches = []
    
    for match_data in data:
        match = Match(
            id=match_data["id"],
            fighter_a_id=match_data["fighter_a_id"],
            fighter_b_id=match_data["fighter_b_id"],
            venue=match_data["venue"],
            date=match_data["date"],
            result=match_data.get("result"),
            scorecard=match_data.get("scorecard"),
            scheduled_rounds=match_data.get("scheduled_rounds", 12),
            title_fight=match_data.get("title_fight", False),
            status=match_data.get("status", "scheduled"),
            created_at=match_data.get("created_at", datetime.now().isoformat())
        )
        loaded_matches.append(match)
    
    return loaded_matches

def load_press_conferences_from_json(data: List[Dict[str, Any]]) -> List[PressConference]:
    """Load press conferences from JSON data into GraphQL schema format"""
    loaded_pcs = []
    
    for pc_data in data:
        pc = PressConference(
            id=pc_data["id"],
            match_id=pc_data["match_id"],
            questions=pc_data.get("questions", []),
            transcript=pc_data.get("transcript"),
            ai_generated_quotes=pc_data.get("ai_generated_quotes", []),
            public_sentiment_score=pc_data.get("public_sentiment_score"),
            created_at=pc_data.get("created_at", datetime.now().isoformat())
        )
        loaded_pcs.append(pc)
    
    return loaded_pcs

def load_titles_from_json(data: List[Dict[str, Any]]) -> List[Title]:
    """Load titles from JSON data into GraphQL schema format"""
    loaded_titles = []
    
    for title_data in data:
        title = Title(
            id=title_data["id"],
            organization=title_data["organization"],
            weight_class=title_data["weight_class"],
            current_champion_id=title_data.get("current_champion_id"),
            updated_at=title_data.get("updated_at", datetime.now().isoformat())
        )
        loaded_titles.append(title)
    
    return loaded_titles

def load_rankings_from_json(data: List[Dict[str, Any]]) -> List[Ranking]:
    """Load rankings from JSON data into GraphQL schema format"""
    loaded_rankings = []
    
    for ranking_data in data:
        ranking = Ranking(
            id=ranking_data["id"],
            fighter_id=ranking_data["fighter_id"],
            organization=ranking_data["organization"],
            weight_class=ranking_data["weight_class"],
            rank=ranking_data["rank"],
            updated_at=ranking_data.get("updated_at", datetime.now().isoformat())
        )
        loaded_rankings.append(ranking)
    
    return loaded_rankings

def populate_backend_from_json(filename: str = "glory_boxing_data.json"):
    """Populate the GraphQL backend with data from JSON file"""
    
    print(f"Loading data from {filename}...")
    
    try:
        with open(filename, 'r') as f:
            data = json.load(f)
        
        # Clear existing data
        fighters.clear()
        matches.clear()
        press_conferences.clear()
        titles.clear()
        rankings.clear()
        
        # Load fighters
        if "fighters" in data:
            loaded_fighters = load_fighters_from_json(data["fighters"])
            fighters.extend(loaded_fighters)
            print(f"Loaded {len(loaded_fighters)} fighters")
        
        # Load matches
        if "matches" in data:
            loaded_matches = load_matches_from_json(data["matches"])
            matches.extend(loaded_matches)
            print(f"Loaded {len(loaded_matches)} matches")
        
        # Load press conferences
        if "press_conferences" in data:
            loaded_pcs = load_press_conferences_from_json(data["press_conferences"])
            press_conferences.extend(loaded_pcs)
            print(f"Loaded {len(loaded_pcs)} press conferences")
        
        # Load titles
        if "titles" in data:
            loaded_titles = load_titles_from_json(data["titles"])
            titles.extend(loaded_titles)
            print(f"Loaded {len(loaded_titles)} titles")
        
        # Load rankings
        if "rankings" in data:
            loaded_rankings = load_rankings_from_json(data["rankings"])
            rankings.extend(loaded_rankings)
            print(f"Loaded {len(loaded_rankings)} rankings")
        
        print("Backend populated successfully!")
        
        # Display summary
        display_backend_summary()
        
    except FileNotFoundError:
        print(f"Error: {filename} not found. Please run the data generator first.")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {filename}")
    except Exception as e:
        print(f"Error loading data: {e}")

def display_backend_summary():
    """Display summary of data in the backend"""
    print("\n" + "="*50)
    print("BACKEND DATA SUMMARY")
    print("="*50)
    
    print(f"Fighters: {len(fighters)}")
    print(f"Matches: {len(matches)}")
    print(f"Press Conferences: {len(press_conferences)}")
    print(f"Titles: {len(titles)}")
    print(f"Rankings: {len(rankings)}")
    
    if fighters:
        print("\nSample Fighter:")
        sample_fighter = fighters[0]
        print(f"  Name: {sample_fighter.name}")
        print(f"  Weight Class: {sample_fighter.weight_class}")
        print(f"  Record: {sample_fighter.record}")
        print(f"  Nationality: {sample_fighter.nationality}")
        print(f"  Age: {sample_fighter.age}")
        print(f"  AI Generated: {sample_fighter.ai_generated}")
    
    if matches:
        print(f"\nSample Match:")
        sample_match = matches[0]
        print(f"  Fighter A ID: {sample_match.fighter_a_id}")
        print(f"  Fighter B ID: {sample_match.fighter_b_id}")
        print(f"  Venue: {sample_match.venue}")
        print(f"  Date: {sample_match.date}")
        print(f"  Status: {sample_match.status}")
        print(f"  Title Fight: {sample_match.title_fight}")

def generate_and_populate(num_fighters: int = 100, num_matches: int = 50):
    """Generate data and populate backend in one step"""
    
    print("Generating data and populating backend...")
    
    # Import the data generator
    from data_generator import generate_complete_dataset
    
    # Generate data
    data = generate_complete_dataset(num_fighters, num_matches)
    
    # Export to JSON
    with open("glory_boxing_data.json", 'w') as f:
        json.dump(data, f, indent=2)
    
    # Populate backend
    populate_backend_from_json("glory_boxing_data.json")

def test_graphql_queries():
    """Test GraphQL queries after populating data"""
    
    print("\n" + "="*50)
    print("TESTING GRAPHQL QUERIES")
    print("="*50)
    
    # Test queries
    print(f"Total fighters: {len(fighters)}")
    print(f"Total matches: {len(matches)}")
    print(f"Total press conferences: {len(press_conferences)}")
    print(f"Total titles: {len(titles)}")
    print(f"Total rankings: {len(rankings)}")
    
    # Test specific queries
    if fighters:
        print(f"\nFirst fighter: {fighters[0].name} ({fighters[0].weight_class})")
    
    if matches:
        print(f"First match: {matches[0].venue} on {matches[0].date}")
    
    if titles:
        print(f"First title: {titles[0].organization} {titles[0].weight_class}")
    
    print("\nGraphQL queries ready for testing!")

if __name__ == "__main__":
    # Generate and populate data
    generate_and_populate(num_fighters=100, num_matches=50)
    
    # Test queries
    test_graphql_queries()
    
    print("\nBackend ready for Glory Boxing Manager!") 