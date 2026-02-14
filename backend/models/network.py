from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid
from typing import Optional

class NetworkMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str
    sender_name: str
    sender_type: str = "lawyer" # lawyer, admin
    state: str # Delhi, Haryana, Uttar Pradesh
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
class NetworkMessageCreate(BaseModel):
    content: str
