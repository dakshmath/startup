from app.core.config import settings
from typing import List, Dict, Any
import pinecone
import weaviate

class VectorService:
    def __init__(self):
        self.pinecone_client = None
        self.weaviate_client = None
        
        # Initialize Pinecone if available
        if settings.PINECONE_API_KEY and settings.PINECONE_ENVIRONMENT:
            pinecone.init(
                api_key=settings.PINECONE_API_KEY,
                environment=settings.PINECONE_ENVIRONMENT
            )
            self.pinecone_client = pinecone
        
        # Initialize Weaviate if available
        if settings.WEAVIATE_URL:
            self.weaviate_client = weaviate.Client(settings.WEAVIATE_URL)
    
    async def store_idea_embedding(self, idea_id: int, text: str, embedding: List[float]):
        """Store idea embedding in vector database"""
        
        if self.pinecone_client:
            await self._store_in_pinecone(idea_id, text, embedding)
        elif self.weaviate_client:
            await self._store_in_weaviate(idea_id, text, embedding)
    
    async def _store_in_pinecone(self, idea_id: int, text: str, embedding: List[float]):
        """Store in Pinecone"""
        index_name = "ideas"
        
        # Create index if it doesn't exist
        if index_name not in self.pinecone_client.list_indexes():
            self.pinecone_client.create_index(
                name=index_name,
                dimension=len(embedding),
                metric="cosine"
            )
        
        index = self.pinecone_client.Index(index_name)
        
        # Store the embedding
        index.upsert(
            vectors=[{
                "id": str(idea_id),
                "values": embedding,
                "metadata": {"text": text, "idea_id": idea_id}
            }]
        )
    
    async def _store_in_weaviate(self, idea_id: int, text: str, embedding: List[float]):
        """Store in Weaviate"""
        # Create schema if it doesn't exist
        schema = {
            "class": "Idea",
            "description": "Startup ideas for similarity search",
            "properties": [
                {"name": "ideaId", "dataType": ["int"]},
                {"name": "text", "dataType": ["text"]},
                {"name": "embedding", "dataType": ["blob"]}
            ]
        }
        
        try:
            self.weaviate_client.schema.create_class(schema)
        except:
            pass  # Schema might already exist
        
        # Store the data object
        data_object = {
            "ideaId": idea_id,
            "text": text,
            "embedding": embedding
        }
        
        self.weaviate_client.data_object.create(
            data_object=data_object,
            class_name="Idea"
        )
    
    async def search_similar_ideas(self, query_embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """Search for similar ideas"""
        
        if self.pinecone_client:
            return await self._search_pinecone(query_embedding, limit)
        elif self.weaviate_client:
            return await self._search_weaviate(query_embedding, limit)
        
        return []
    
    async def _search_pinecone(self, query_embedding: List[float], limit: int) -> List[Dict[str, Any]]:
        """Search in Pinecone"""
        index = self.pinecone_client.Index("ideas")
        
        results = index.query(
            vector=query_embedding,
            top_k=limit,
            include_metadata=True
        )
        
        return [
            {
                "idea_id": int(match["id"]),
                "score": match["score"],
                "text": match["metadata"]["text"]
            }
            for match in results["matches"]
        ]
    
    async def _search_weaviate(self, query_embedding: List[float], limit: int) -> List[Dict[str, Any]]:
        """Search in Weaviate"""
        result = self.weaviate_client.query.get(
            "Idea",
            ["ideaId", "text"]
        ).with_near_vector({
            "vector": query_embedding
        }).with_limit(limit).do()
        
        return [
            {
                "idea_id": item["ideaId"],
                "text": item["text"],
                "score": item.get("_additional", {}).get("certainty", 0)
            }
            for item in result["data"]["Get"]["Idea"]
        ]
