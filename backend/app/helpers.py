from bson import ObjectId

def convert_objectid(doc: dict) -> dict:
    if not doc:
        return None

    new_doc = {}
    for key, value in doc.items():
        if key == "_id":  
            new_doc["_id"] = str(value)
            new_doc["id"] = str(value)   
        else:
            new_doc[key] = value

    return new_doc
