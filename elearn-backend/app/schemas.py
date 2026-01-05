from pydantic import BaseModel
from typing import Optional
import datetime



class InformalPostCreate(BaseModel):
    title: str
    body: str
    tags: Optional[str] = None
    topic: str
    type: str
    media_url: Optional[str] = None



class InformalPostOut(BaseModel):
    id: int
    title: str
    body: str
    tags: Optional[str]
    topic: str
    type: str
    media_url: Optional[str]
    creator: str
    author_id: int
    role: str
    created_at: datetime.datetime
