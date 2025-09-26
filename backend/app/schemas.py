from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str
    price: float

class User(BaseModel):
    username: str
    email: str
    role : str
