from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.social import Guild, Post, Comment, user_guilds
from backend.models.user import User
from typing import List
import json

router = APIRouter(prefix="/api/social", tags=["social"])

# --- GULIDS (COMMUNITIES) ---

@router.get("/guilds")
def get_guilds(user_id: int = 1, db: Session = Depends(get_db)):
    guilds = db.query(Guild).all()
    # Check if this user is a member of each guild
    # In a real app, you'd check the user_guilds table
    return guilds

@router.post("/guilds/{guild_id}/join")
def join_guild(guild_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    guild = db.query(Guild).filter(Guild.id == guild_id).first()
    if not guild:
        raise HTTPException(status_code=404, detail="Guild not found")
    
    guild.members_count += 1
    db.commit()
    return {"status": "success", "members": guild.members_count}

# --- FORUM (POSTS) ---

@router.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).order_by(Post.created_at.desc()).all()

@router.post("/posts")
def create_post(title: str, content: str, author_id: int = 1, db: Session = Depends(get_db)):
    post = Post(title=title, content=content, author_id=author_id, category="General")
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

# --- INITIALIZER (One-time setup for demo guilds) ---
@router.post("/init-demo")
def init_demo(db: Session = Depends(get_db)):
    if db.query(Guild).count() > 0:
        return {"msg": "Already initialized"}
    
    demo_guilds = [
        {"name": "Tomato Farmers Guild", "members_count": 450, "activity": "High", "area": "California", "image": "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=400"},
        {"name": "Wheat Growers Association", "members_count": 1200, "activity": "Medium", "area": "Midwest", "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400"},
        {"name": "Sustainable Farming Collective", "members_count": 85, "activity": "Very High", "area": "Global", "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400"}
    ]
    
    for g in demo_guilds:
        db.add(Guild(**g))
    
    # Add a demo post
    db.add(Post(title="Best irrigation for loamy soil?", content="I'm starting a new plot in Telangana...", author_id=1, category="Crops"))
    
    db.commit()
    return {"msg": "Demo data populated"}
