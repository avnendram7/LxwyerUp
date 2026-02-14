from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


class BookingCreate(BaseModel):
    lawyer_id: str
    date: str
    time: str
    description: str
    price: float = 0.0
    duration_minutes: int = 30 # Default to 30 mins
    consultation_type: str = "video" # video, audio, in_person



class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    lawyer_id: str
    date: str
    date: str
    time: str
    description: str
    price: float = 0.0
    meet_link: str = ""
    duration_minutes: int = 30
    is_free_trial: bool = False
    consultation_type: str = "video"
    location: str = ""

    status: str = 'pending'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
