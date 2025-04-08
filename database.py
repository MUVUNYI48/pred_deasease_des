from pymongo import MongoClient
from config import DATABASE

class Database:
    def __init__(self):
        self.client = MongoClient(
            host=DATABASE["HOST"],
            port=DATABASE["PORT"],
            username=DATABASE.get("USERNAME"),
            password=DATABASE.get("PASSWORD"),
        )
        self.db = self.client[DATABASE["NAME"]] if self.client else None

    def insert(self, collection_name, data):
        if self.db is not None:
            collection = self.db[collection_name]
            return collection.insert_one(data).inserted_id
        raise ConnectionError("Database connection is not established.")

    def find(self, collection_name, query):
        if self.db is not None:
            collection = self.db[collection_name]
            return collection.find(query)
        raise ConnectionError("Database connection is not established.")

    def update(self, collection_name, query, update_data):
        if self.db is not None:
            collection = self.db[collection_name]
            return collection.update_one(query, {"$set": update_data})
        raise ConnectionError("Database connection is not established.")

    def delete(self, collection_name, query):
        if self.db is not None:
            collection = self.db[collection_name]
            return collection.delete_one(query)
        raise ConnectionError("Database connection is not established.")