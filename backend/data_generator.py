import random
import uuid
from datetime import datetime, timedelta
import pandas as pd
from typing import List, Dict, Any
import json

# Enhanced weight classes with proper boxing divisions
weight_classes = [
    "Strawweight", "Flyweight", "Bantamweight", "Super Bantamweight", 
    "Featherweight", "Super Featherweight", "Lightweight", "Super Lightweight",
    "Welterweight", "Super Welterweight", "Middleweight", "Super Middleweight",
    "Light Heavyweight", "Cruiserweight", "Heavyweight"
]

# Comprehensive nationalities with realistic boxing countries
nationalities = [
    "USA", "UK", "Mexico", "Philippines", "Japan", "Cuba", "Ukraine", 
    "Kazakhstan", "Russia", "Brazil", "Argentina", "Puerto Rico", 
    "Dominican Republic", "Colombia", "Venezuela", "Canada", "Australia",
    "South Africa", "Ghana", "Nigeria", "Thailand", "South Korea", "China"
]

# Fighter type mapping with realistic age ranges
divisions = {
    "Junior": range(16, 18),
    "Amateur": range(18, 22),
    "Pro": range(22, 36),
    "Veteran": range(36, 45)
}

# Comprehensive name generation
first_names = [
    "James", "Miguel", "Tyson", "Vasyl", "Ryan", "Amir", "Naoya", "Oleksandr",
    "Floyd", "Manny", "Canelo", "Anthony", "Deontay", "Tyson", "Mike", "Evander",
    "Lennox", "Wladimir", "Vitali", "Gennady", "Sergey", "Dmitry", "Artur",
    "Juan", "Carlos", "Roberto", "Jorge", "Luis", "Fernando", "Ricardo",
    "Kazuto", "Takashi", "Yoshihiro", "Hozumi", "Shinsuke", "Kosei", "Ryo",
    "Viktor", "Oleksandr", "Vasyl", "Serhiy", "Vitaliy", "Andriy", "Ihor",
    "Amir", "Khan", "Naseem", "Ricky", "Carl", "Nigel", "Lennox", "Frank",
    "Joe", "Jack", "Rocky", "Sugar", "Marvelous", "Iron", "Smokin", "Boom Boom"
]

last_names = [
    "Johnson", "Gonzalez", "Ali", "Lomachenko", "Garcia", "Khan", "Inoue", "Usyk",
    "Mayweather", "Pacquiao", "Alvarez", "Joshua", "Wilder", "Fury", "Tyson", "Holyfield",
    "Lewis", "Klitschko", "Golovkin", "Kovalev", "Beterbiev", "Bivol", "Beterbiev",
    "Marquez", "Barrera", "Morales", "Castillo", "Corrales", "Vargas", "Mayorga",
    "Ioka", "Tanaka", "Nakatani", "Hasegawa", "Takahashi", "Tanaka", "Matsumoto",
    "Postol", "Usyk", "Lomachenko", "Kovalev", "Klitschko", "Beterbiev", "Bivol",
    "Khan", "Hamed", "Hatton", "Bruno", "Lewis", "Benn", "Eubank", "Calzaghe",
    "Frazier", "Louis", "Marciano", "Robinson", "Leonard", "Hagler", "Hearns", "Duran"
]

# Voice profile types for AI generation
voice_types = [
    "neutral", "deep_aggressive", "charismatic_confident", "smooth_technical",
    "intense_focused", "calm_analytical", "energetic_exciting", "serious_determined",
    "booming_powerful", "smooth_charismatic", "rough_intimidating", "precise_technical"
]

# Mugshot styles for AI generation
mugshot_styles = [
    "professional", "intense", "confident", "aggressive", "charismatic",
    "technical", "classic", "modern", "intimidating", "heroic", "determined"
]

# Venues for match generation
venues = [
    "Madison Square Garden, New York", "MGM Grand Garden Arena, Las Vegas",
    "T-Mobile Arena, Las Vegas", "Staples Center, Los Angeles",
    "Barclays Center, Brooklyn", "O2 Arena, London", "Wembley Stadium, London",
    "Saitama Super Arena, Japan", "Yokohama Arena, Japan", "Arena Mexico, Mexico City",
    "Estadio Azteca, Mexico City", "Olimpiyskiy, Moscow", "Palace of Sports, Kyiv",
    "Astana Arena, Kazakhstan", "Maracanãzinho, Rio de Janeiro", "Luna Park, Buenos Aires"
]

# Organizations for rankings and titles
organizations = ["WBC", "WBA", "IBF", "WBO", "The Ring", "Lineal"]

def generate_realistic_record(age: int, division: str) -> str:
    """Generate realistic boxing records based on age and division"""
    if division == "Junior":
        wins = random.randint(0, 5)
        losses = random.randint(0, 2)
        draws = random.randint(0, 1)
    elif division == "Amateur":
        wins = random.randint(0, 15)
        losses = random.randint(0, 8)
        draws = random.randint(0, 3)
    elif division == "Pro":
        wins = random.randint(5, 50)
        losses = random.randint(0, 10)
        draws = random.randint(0, 5)
    else:  # Veteran
        wins = random.randint(20, 60)
        losses = random.randint(5, 20)
        draws = random.randint(0, 8)
    
    return f"{wins}-{losses}-{draws}"

def generate_ai_content(fighter_id: str, name: str) -> Dict[str, str]:
    """Generate AI content URLs for mugshots and voice samples"""
    # Simulate AI-generated content
    mugshot_style = random.choice(mugshot_styles)
    voice_type = random.choice(voice_types)
    
    return {
        "mugshot_url": f"https://api.fakeimages.com/fighters/{fighter_id}_{mugshot_style}.png",
        "voice_profile": voice_type,
        "ai_generated": random.choice([True, False])  # 50% chance of AI generation
    }

def generate_fighter_data(n: int = 50) -> List[Dict[str, Any]]:
    """Generate comprehensive fighter data"""
    fighters = []
    
    for i in range(n):
        fighter_id = str(uuid.uuid4())
        age_group = random.choice(list(divisions.keys()))
        age = random.choice(divisions[age_group])
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        
        # Generate AI content
        ai_content = generate_ai_content(fighter_id, name)
        
        fighter = {
            "id": i + 1,  # Sequential ID for GraphQL compatibility
            "name": name,
            "age": age,
            "division": age_group,
            "weight_class": random.choice(weight_classes),
            "nationality": random.choice(nationalities),
            "record": generate_realistic_record(age, age_group),
            "mugshot_url": ai_content["mugshot_url"],
            "voice_profile": ai_content["voice_profile"],
            "ai_generated": ai_content["ai_generated"],
            "created_at": datetime.now().isoformat()
        }
        fighters.append(fighter)
    
    return fighters

def generate_rankings_data(fighters: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate realistic rankings data"""
    rankings = []
    
    for fighter in fighters:
        # Each fighter can have multiple rankings
        num_rankings = random.randint(0, 3)  # 0-3 rankings per fighter
        
        for _ in range(num_rankings):
            organization = random.choice(organizations)
            weight_class = fighter["weight_class"]
            rank = random.randint(1, 15)
            
            ranking = {
                "id": len(rankings) + 1,
                "fighter_id": fighter["id"],
                "organization": organization,
                "weight_class": weight_class,
                "rank": rank,
                "updated_at": datetime.now().isoformat()
            }
            rankings.append(ranking)
    
    return rankings

def generate_titles_data(fighters: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate championship titles data"""
    titles = []
    
    # Create titles for each weight class
    for weight_class in weight_classes:
        # Each weight class can have multiple organizations
        for organization in organizations[:4]:  # WBC, WBA, IBF, WBO
            # Find a fighter in this weight class
            weight_class_fighters = [f for f in fighters if f["weight_class"] == weight_class]
            
            if weight_class_fighters:
                champion = random.choice(weight_class_fighters)
                
                title = {
                    "id": len(titles) + 1,
                    "organization": organization,
                    "weight_class": weight_class,
                    "current_champion_id": champion["id"],
                    "updated_at": datetime.now().isoformat()
                }
                titles.append(title)
    
    return titles

def generate_matches_data(fighters: List[Dict[str, Any]], num_matches: int = 20) -> List[Dict[str, Any]]:
    """Generate realistic match data"""
    matches = []
    
    for i in range(num_matches):
        # Select two different fighters
        fighter_a = random.choice(fighters)
        fighter_b = random.choice([f for f in fighters if f["id"] != fighter_a["id"]])
        
        # Generate realistic match date (past and future)
        days_ago = random.randint(-365, 365)  # Past year to next year
        match_date = datetime.now() + timedelta(days=days_ago)
        
        # Determine match status based on date
        if match_date < datetime.now():
            status = "completed"
            result = random.choice(["KO", "TKO", "UD", "SD", "MD", "DQ"])
            scorecard = json.dumps({
                "rounds": random.randint(1, 12),
                "method": result,
                "judges": ["Judge 1", "Judge 2", "Judge 3"]
            })
        else:
            status = "scheduled"
            result = None
            scorecard = None
        
        match = {
            "id": i + 1,
            "fighter_a_id": fighter_a["id"],
            "fighter_b_id": fighter_b["id"],
            "venue": random.choice(venues),
            "date": match_date.isoformat(),
            "result": result,
            "scorecard": scorecard,
            "scheduled_rounds": random.choice([4, 6, 8, 10, 12]),
            "title_fight": random.choice([True, False]),
            "status": status,
            "created_at": datetime.now().isoformat()
        }
        matches.append(match)
    
    return matches

def generate_press_conferences_data(matches: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate press conference data"""
    press_conferences = []
    
    for match in matches:
        # 30% chance of having a press conference
        if random.random() < 0.3:
            num_questions = random.randint(1, 5)
            questions = [
                f"Question {i + 1} about the upcoming fight"
                for i in range(num_questions)
            ]
            
            pc = {
                "id": len(press_conferences) + 1,
                "match_id": match["id"],
                "questions": questions,
                "transcript": f"Press conference transcript for match {match['id']}",
                "ai_generated_quotes": [
                    "AI generated quote 1",
                    "AI generated quote 2"
                ],
                "public_sentiment_score": round(random.uniform(0.1, 1.0), 2),
                "created_at": datetime.now().isoformat()
            }
            press_conferences.append(pc)
    
    return press_conferences

def generate_complete_dataset(num_fighters: int = 100, num_matches: int = 50) -> Dict[str, Any]:
    """Generate complete dataset for Glory Boxing Manager"""
    
    print(f"Generating {num_fighters} fighters...")
    fighters = generate_fighter_data(num_fighters)
    
    print(f"Generating rankings...")
    rankings = generate_rankings_data(fighters)
    
    print(f"Generating titles...")
    titles = generate_titles_data(fighters)
    
    print(f"Generating {num_matches} matches...")
    matches = generate_matches_data(fighters, num_matches)
    
    print(f"Generating press conferences...")
    press_conferences = generate_press_conferences_data(matches)
    
    return {
        "fighters": fighters,
        "rankings": rankings,
        "titles": titles,
        "matches": matches,
        "press_conferences": press_conferences
    }

def export_to_json(data: Dict[str, Any], filename: str = "glory_boxing_data.json"):
    """Export data to JSON file"""
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Data exported to {filename}")

def export_to_csv(data: Dict[str, Any], prefix: str = "glory_boxing"):
    """Export data to CSV files"""
    for key, value in data.items():
        if value:  # Only export non-empty data
            df = pd.DataFrame(value)
            filename = f"{prefix}_{key}.csv"
            df.to_csv(filename, index=False)
            print(f"Exported {key} to {filename}")

def display_summary(data: Dict[str, Any]):
    """Display summary of generated data"""
    print("\n" + "="*50)
    print("GLORY BOXING MANAGER - DATA GENERATION SUMMARY")
    print("="*50)
    
    for key, value in data.items():
        print(f"{key.title()}: {len(value)} records")
    
    print("\nSample Fighter:")
    if data["fighters"]:
        sample_fighter = data["fighters"][0]
        for key, value in sample_fighter.items():
            print(f"  {key}: {value}")
    
    print("\nWeight Class Distribution:")
    weight_class_counts = {}
    for fighter in data["fighters"]:
        weight_class = fighter["weight_class"]
        weight_class_counts[weight_class] = weight_class_counts.get(weight_class, 0) + 1
    
    for weight_class, count in sorted(weight_class_counts.items()):
        print(f"  {weight_class}: {count} fighters")

if __name__ == "__main__":
    # Generate complete dataset
    data = generate_complete_dataset(num_fighters=100, num_matches=50)
    
    # Display summary
    display_summary(data)
    
    # Export data
    export_to_json(data)
    export_to_csv(data)
    
    print("\nData generation complete! Use the JSON file to populate your GraphQL backend.") 