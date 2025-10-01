from bson import ObjectId

def convert_objectid(doc):
    if not doc:
        return None
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

    new_doc = {}
    for key, value in doc.items():
        if key == "_id":  
            new_doc["_id"] = str(value)
            new_doc["id"] = str(value)   
        else:
            new_doc[key] = value

    return new_doc