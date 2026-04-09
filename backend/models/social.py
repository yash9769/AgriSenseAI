from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

# Association table for User-Guild membership
user_guilds = Table(
    'user_guilds',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('guild_id', Integer, ForeignKey('guilds.id'))
)

class Guild(Base):
    __tablename__ = "guilds"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, unique=True, index=True)
    description = Column(Text)
    members_count = Column(Integer, default=0)
    activity    = Column(String, default="Medium")
    area        = Column(String)
    image       = Column(String)
    created_at  = Column(DateTime, default=datetime.utcnow)

class Post(Base):
    __tablename__ = "posts"
    id          = Column(Integer, primary_key=True, index=True)
    author_id   = Column(Integer, ForeignKey('users.id'))
    title       = Column(String)
    content     = Column(Text)
    category    = Column(String) # e.g., 'Crops', 'Technique'
    likes       = Column(Integer, default=0)
    created_at  = Column(DateTime, default=datetime.utcnow)
    
    comments = relationship("Comment", back_populates="post")

class Comment(Base):
    __tablename__ = "comments"
    id          = Column(Integer, primary_key=True, index=True)
    post_id     = Column(Integer, ForeignKey('posts.id'))
    author_id   = Column(Integer, ForeignKey('users.id'))
    content     = Column(Text)
    created_at  = Column(DateTime, default=datetime.utcnow)
    
    post = relationship("Post", back_populates="comments")
