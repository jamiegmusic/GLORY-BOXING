from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
from supabase import create_client, Client
import os

router = APIRouter(prefix="/api/dreamworld/quest", tags=["dreamworld_quest"])

# Supabase client
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL", ""),
    os.environ.get("SUPABASE_KEY", "")
)

# Pydantic models
class QuestChoice(BaseModel):
    choice_id: str
    choice_text: str
    choice_type: str  # "lucid" or "logic"
    lucid_cost: int
    consequence: Optional[str] = None

class QuestPhase(BaseModel):
    phase_id: str
    phase_name: str
    description: str
    choices: List[QuestChoice]
    clue_discovered: Optional[str] = None

class QuestStartRequest(BaseModel):
    player_id: str
    quest_id: str = "jazz_singers_secret"

class QuestChoiceRequest(BaseModel):
    player_id: str
    quest_id: str
    phase_id: str
    choice_id: str

class QuestState(BaseModel):
    quest_id: str
    player_id: str
    current_phase: str
    phases_completed: List[str]
    clues_discovered: List[str]
    lucid_used: int
    logic_used: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    reward_claimed: bool = False

# Quest definition
JAZZ_SINGERS_SECRET_QUEST = {
    "quest_id": "jazz_singers_secret",
    "name": "The Jazz Singer's Secret",
    "description": "Billie Holiday holds a secret that could change the dreamworld forever...",
    "phases": {
        "investigation": {
            "phase_id": "investigation",
            "phase_name": "The Mysterious Melody",
            "description": "You hear Billie Holiday humming a tune that hasn't been written yet. The notes seem to shimmer with otherworldly energy.",
            "choices": [
                {
                    "choice_id": "lucid_read_mind",
                    "choice_text": "Use lucid power to read her thoughts",
                    "choice_type": "lucid",
                    "lucid_cost": 20,
                    "consequence": "direct_revelation"
                },
                {
                    "choice_id": "logic_observe",
                    "choice_text": "Observe her patterns and deduce the secret",
                    "choice_type": "logic",
                    "lucid_cost": 0,
                    "consequence": "partial_clue"
                }
            ],
            "clue": "The melody contains a map to forgotten sheet music"
        },
        "confrontation": {
            "phase_id": "confrontation",
            "phase_name": "The Cotton Club Confrontation",
            "description": "You confront Billie at the Cotton Club. Duke Ellington watches from the shadows, his fingers tapping an unknown rhythm.",
            "choices": [
                {
                    "choice_id": "lucid_dreamwalk",
                    "choice_text": "Dreamwalk into her memories",
                    "choice_type": "lucid",
                    "lucid_cost": 30,
                    "consequence": "memory_access"
                },
                {
                    "choice_id": "logic_negotiate",
                    "choice_text": "Negotiate with charm and wit",
                    "choice_type": "logic",
                    "lucid_cost": 0,
                    "consequence": "trust_gained"
                }
            ],
            "clue": "The sheet music can bridge dreams and reality"
        },
        "revelation": {
            "phase_id": "revelation",
            "phase_name": "The Time-Lost Composition",
            "description": "The secret is revealed: sheet music from the future that can alter the past. But at what cost?",
            "choices": [
                {
                    "choice_id": "lucid_transcribe",
                    "choice_text": "Use lucid power to perfectly transcribe the music",
                    "choice_type": "lucid",
                    "lucid_cost": 40,
                    "consequence": "perfect_copy"
                },
                {
                    "choice_id": "logic_memorize",
                    "choice_text": "Memorize what you can through careful study",
                    "choice_type": "logic",
                    "lucid_cost": 0,
                    "consequence": "partial_copy"
                }
            ],
            "clue": "The music holds power over fate itself"
        }
    },
    "rewards": {
        "perfect_path": {
            "legacy_unlock": {
                "id": str(uuid.uuid4()),
                "unlock_type": "item",
                "name": "Temporal Jazz Manuscript",
                "description": "Complete sheet music that transcends time. Grants +15 to all musical talents.",
                "rarity": "legendary",
                "effects": {
                    "music_skill_bonus": 15,
                    "temporal_awareness": True,
                    "dream_music_mastery": True
                }
            }
        },
        "mixed_path": {
            "legacy_unlock": {
                "id": str(uuid.uuid4()),
                "unlock_type": "item",
                "name": "Faded Jazz Notes",
                "description": "Partial sheet music with mysterious power. Grants +8 to musical talents.",
                "rarity": "rare",
                "effects": {
                    "music_skill_bonus": 8,
                    "dream_music_affinity": True
                }
            }
        },
        "logic_path": {
            "legacy_unlock": {
                "id": str(uuid.uuid4()),
                "unlock_type": "knowledge",
                "name": "Jazz Era Wisdom",
                "description": "Deep understanding of 1920s musical innovation. Grants +5 to negotiation.",
                "rarity": "uncommon",
                "effects": {
                    "negotiation_bonus": 5,
                    "era_knowledge": "1920s"
                }
            }
        }
    }
}

@router.post("/start")
async def start_quest(request: QuestStartRequest):
    """Start the Jazz Singer's Secret quest"""
    try:
        # Check if quest already started
        existing = supabase.table("dreamworld_quests").select("*").eq(
            "player_id", request.player_id
        ).eq("quest_id", request.quest_id).execute()
        
        if existing.data:
            return {"error": "Quest already started", "quest_state": existing.data[0]}
        
        # Get player's current lucid meter
        player_state = supabase.table("dreamworld_player_state").select("*").eq(
            "player_id", request.player_id
        ).single().execute()
        
        if not player_state.data:
            raise HTTPException(status_code=404, detail="Player dreamworld state not found")
        
        # Create quest state
        quest_state = {
            "quest_id": request.quest_id,
            "player_id": request.player_id,
            "current_phase": "investigation",
            "phases_completed": [],
            "clues_discovered": [],
            "lucid_used": 0,
            "logic_used": 0,
            "started_at": datetime.utcnow().isoformat(),
            "completed_at": None,
            "reward_claimed": False
        }
        
        result = supabase.table("dreamworld_quests").insert(quest_state).execute()
        
        # Return first phase
        first_phase = JAZZ_SINGERS_SECRET_QUEST["phases"]["investigation"]
        
        return {
            "quest_state": result.data[0],
            "current_phase": first_phase,
            "player_lucid_meter": player_state.data["lucid_meter"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/choice")
async def make_quest_choice(request: QuestChoiceRequest):
    """Make a choice in the quest"""
    try:
        # Get quest state
        quest_state = supabase.table("dreamworld_quests").select("*").eq(
            "player_id", request.player_id
        ).eq("quest_id", request.quest_id).single().execute()
        
        if not quest_state.data:
            raise HTTPException(status_code=404, detail="Quest not found")
        
        state = quest_state.data
        
        # Validate phase
        if state["current_phase"] != request.phase_id:
            raise HTTPException(status_code=400, detail="Invalid phase")
        
        # Get phase and choice
        phase = JAZZ_SINGERS_SECRET_QUEST["phases"][request.phase_id]
        choice = next((c for c in phase["choices"] if c["choice_id"] == request.choice_id), None)
        
        if not choice:
            raise HTTPException(status_code=400, detail="Invalid choice")
        
        # Check lucid meter if lucid choice
        if choice["choice_type"] == "lucid" and choice["lucid_cost"] > 0:
            player_state = supabase.table("dreamworld_player_state").select("*").eq(
                "player_id", request.player_id
            ).single().execute()
            
            if player_state.data["lucid_meter"] < choice["lucid_cost"]:
                raise HTTPException(status_code=400, detail="Insufficient lucid power")
            
            # Deduct lucid cost
            new_lucid = player_state.data["lucid_meter"] - choice["lucid_cost"]
            supabase.table("dreamworld_player_state").update({
                "lucid_meter": new_lucid
            }).eq("player_id", request.player_id).execute()
            
            state["lucid_used"] += choice["lucid_cost"]
        else:
            state["logic_used"] += 1
        
        # Add clue
        if phase.get("clue"):
            state["clues_discovered"].append(phase["clue"])
        
        # Progress to next phase
        state["phases_completed"].append(request.phase_id)
        
        # Determine next phase
        phase_order = ["investigation", "confrontation", "revelation"]
        current_index = phase_order.index(request.phase_id)
        
        if current_index < len(phase_order) - 1:
            # Move to next phase
            next_phase_id = phase_order[current_index + 1]
            state["current_phase"] = next_phase_id
            next_phase = JAZZ_SINGERS_SECRET_QUEST["phases"][next_phase_id]
            
            # Update quest state
            supabase.table("dreamworld_quests").update(state).eq(
                "id", quest_state.data["id"]
            ).execute()
            
            return {
                "quest_state": state,
                "choice_made": choice,
                "next_phase": next_phase,
                "consequence": choice["consequence"]
            }
        else:
            # Quest complete!
            state["completed_at"] = datetime.utcnow().isoformat()
            state["current_phase"] = "completed"
            
            # Determine reward based on choices
            if state["lucid_used"] >= 60:
                reward_type = "perfect_path"
            elif state["lucid_used"] > 0:
                reward_type = "mixed_path"
            else:
                reward_type = "logic_path"
            
            reward = JAZZ_SINGERS_SECRET_QUEST["rewards"][reward_type]["legacy_unlock"]
            
            # Create legacy unlock
            legacy_unlock = {
                "player_id": request.player_id,
                "unlock_type": reward["unlock_type"],
                "unlock_name": reward["name"],
                "unlock_data": {
                    "description": reward["description"],
                    "rarity": reward["rarity"],
                    "effects": reward["effects"],
                    "from_quest": request.quest_id
                },
                "dreamworld_source": request.quest_id,
                "applied_to_main": False
            }
            
            unlock_result = supabase.table("legacy_unlocks").insert(legacy_unlock).execute()
            
            # Update quest state
            state["reward_id"] = unlock_result.data[0]["id"]
            supabase.table("dreamworld_quests").update(state).eq(
                "id", quest_state.data["id"]
            ).execute()
            
            return {
                "quest_state": state,
                "choice_made": choice,
                "quest_complete": True,
                "reward": reward,
                "legacy_unlock_id": unlock_result.data[0]["id"]
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/state/{player_id}/{quest_id}")
async def get_quest_state(player_id: str, quest_id: str):
    """Get current quest state"""
    try:
        quest_state = supabase.table("dreamworld_quests").select("*").eq(
            "player_id", player_id
        ).eq("quest_id", quest_id).single().execute()
        
        if not quest_state.data:
            return {"exists": False}
        
        state = quest_state.data
        
        # Get current phase if not completed
        current_phase = None
        if state["current_phase"] != "completed":
            current_phase = JAZZ_SINGERS_SECRET_QUEST["phases"].get(state["current_phase"])
        
        # Get reward if completed
        reward = None
        if state.get("reward_id"):
            unlock = supabase.table("legacy_unlocks").select("*").eq(
                "id", state["reward_id"]
            ).single().execute()
            if unlock.data:
                reward = unlock.data
        
        return {
            "exists": True,
            "quest_state": state,
            "current_phase": current_phase,
            "reward": reward,
            "quest_info": {
                "name": JAZZ_SINGERS_SECRET_QUEST["name"],
                "description": JAZZ_SINGERS_SECRET_QUEST["description"]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/apply-reward/{player_id}/{quest_id}")
async def apply_quest_reward(player_id: str, quest_id: str):
    """Apply quest reward to main game"""
    try:
        # Get quest state
        quest_state = supabase.table("dreamworld_quests").select("*").eq(
            "player_id", player_id
        ).eq("quest_id", quest_id).single().execute()
        
        if not quest_state.data:
            raise HTTPException(status_code=404, detail="Quest not found")
        
        if not quest_state.data.get("reward_id"):
            raise HTTPException(status_code=400, detail="No reward to claim")
        
        # Update legacy unlock as applied
        supabase.table("legacy_unlocks").update({
            "applied_to_main": True,
            "applied_at": datetime.utcnow().isoformat()
        }).eq("id", quest_state.data["reward_id"]).execute()
        
        # Update quest
        supabase.table("dreamworld_quests").update({
            "reward_claimed": True
        }).eq("id", quest_state.data["id"]).execute()
        
        return {
            "success": True,
            "message": "Reward applied to main game",
            "reward_id": quest_state.data["reward_id"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))