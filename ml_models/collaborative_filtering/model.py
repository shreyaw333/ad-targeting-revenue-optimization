import numpy as np
import pandas as pd
from sklearn.decomposition import NMF
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os

class CollaborativeFilteringModel:
    def __init__(self, n_components=50, random_state=42):
        self.n_components = n_components
        self.random_state = random_state
        self.model = NMF(
            n_components=n_components,
            init='random',
            random_state=random_state,
            max_iter=500
        )
        self.user_factors = None
        self.item_factors = None
        self.user_ids = None
        self.item_ids = None
        self.user_similarity = None
        
    def fit(self, interaction_matrix):
        interaction_matrix.columns = interaction_matrix.columns.astype(str)
        
        interaction_matrix = interaction_matrix.fillna(0)
        
        self.user_ids = interaction_matrix.index
        self.item_ids = interaction_matrix.columns
        
        self.user_factors = self.model.fit_transform(interaction_matrix.values)
        self.item_factors = self.model.components_
        
        self.user_similarity = cosine_similarity(self.user_factors)
        
        return self
    
    def predict(self, user_id, n_recommendations=10):
        if user_id not in self.user_ids:
            return []
        
        user_idx = list(self.user_ids).index(user_id)
        user_vector = self.user_factors[user_idx]
        
        scores = np.dot(user_vector, self.item_factors)
        
        top_items_idx = np.argsort(scores)[::-1][:n_recommendations]
        
        recommendations = [
            {
                'item_id': self.item_ids[idx],
                'score': float(scores[idx])
            }
            for idx in top_items_idx
        ]
        
        return recommendations
    
    def get_similar_users(self, user_id, n_similar=10):
        if user_id not in self.user_ids:
            return []
        
        user_idx = list(self.user_ids).index(user_id)
        similarities = self.user_similarity[user_idx]
        
        similar_idx = np.argsort(similarities)[::-1][1:n_similar+1]
        
        similar_users = [
            {
                'user_id': self.user_ids[idx],
                'similarity': float(similarities[idx])
            }
            for idx in similar_idx
        ]
        
        return similar_users
    
    def get_reconstruction_error(self, interaction_matrix):
        reconstructed = np.dot(self.user_factors, self.item_factors)
        error = np.mean((interaction_matrix.values - reconstructed) ** 2)
        return error
    
    def save_model(self, filepath='collaborative_filtering_model.pkl'):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        model_data = {
            'model': self.model,
            'user_factors': self.user_factors,
            'item_factors': self.item_factors,
            'user_ids': self.user_ids,
            'item_ids': self.item_ids,
            'user_similarity': self.user_similarity,
            'n_components': self.n_components
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"Model saved to {filepath}")
    
    @classmethod
    def load_model(cls, filepath):
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        model = cls(n_components=model_data['n_components'])
        model.model = model_data['model']
        model.user_factors = model_data['user_factors']
        model.item_factors = model_data['item_factors']
        model.user_ids = model_data['user_ids']
        model.item_ids = model_data['item_ids']
        model.user_similarity = model_data['user_similarity']
        
        return model