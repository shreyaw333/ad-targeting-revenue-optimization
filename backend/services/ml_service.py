import pickle
import os
import numpy as np
import pandas as pd
from pathlib import Path

class MLModelService:
    def __init__(self):
        self.models_path = Path(__file__).parent.parent.parent / "data" / "processed"
        self.collaborative_filtering = None
        self.ctr_prediction = None
        self.revenue_optimizer = None
        
        self.load_models()
    
    def load_models(self):
        try:
            cf_path = self.models_path / "collaborative_filtering_model.pkl"
            if cf_path.exists():
                with open(cf_path, 'rb') as f:
                    self.collaborative_filtering = pickle.load(f)
                print("Collaborative filtering model loaded")
            
            ctr_path = self.models_path / "ctr_prediction_model.pkl"
            if ctr_path.exists():
                with open(ctr_path, 'rb') as f:
                    self.ctr_prediction = pickle.load(f)
                print("CTR prediction model loaded")
            
            revenue_path = self.models_path / "revenue_optimizer.pkl"
            if revenue_path.exists():
                try:
                    with open(revenue_path, 'rb') as f:
                        self.revenue_optimizer = pickle.load(f)
                    print("Revenue optimizer loaded")
                except Exception as e:
                    print(f"Could not load revenue optimizer (will use mock data): {e}")
                    self.revenue_optimizer = None
                
        except Exception as e:
            print(f"Error loading models: {e}")
    
    def get_recommendations(self, user_id, n_recommendations=10):
        if self.collaborative_filtering is None:
            return self._get_mock_recommendations(n_recommendations)
        
        try:
            model_data = self.collaborative_filtering
            if 'model' in model_data:
                recommendations = []
                
                if user_id in model_data['user_ids']:
                    user_idx = list(model_data['user_ids']).index(user_id)
                    user_vector = model_data['user_factors'][user_idx]
                    scores = np.dot(user_vector, model_data['item_factors'])
                    
                    top_items_idx = np.argsort(scores)[::-1][:n_recommendations]
                    
                    for idx in top_items_idx:
                        recommendations.append({
                            'item_id': str(model_data['item_ids'][idx]),
                            'score': float(scores[idx])
                        })
                
                return recommendations if recommendations else self._get_mock_recommendations(n_recommendations)
            
        except Exception as e:
            print(f"Error getting recommendations: {e}")
            return self._get_mock_recommendations(n_recommendations)
    
    def predict_ctr(self, features):
        if self.ctr_prediction is None:
            return np.random.uniform(0.01, 0.08)
        
        try:
            model_data = self.ctr_prediction
            if 'model' in model_data:
                feature_df = pd.DataFrame([features])
                
                available_features = [col for col in model_data['feature_columns'] 
                                     if col in feature_df.columns]
                
                if available_features:
                    X = feature_df[available_features].fillna(0)
                    prediction = model_data['model'].predict_proba(X)[:, 1][0]
                    return float(prediction)
        
        except Exception as e:
            print(f"Error predicting CTR: {e}")
        
        return np.random.uniform(0.01, 0.08)
    
    def get_budget_allocation(self, total_budget=100000):
        if self.revenue_optimizer is None:
            return self._get_mock_budget_allocation(total_budget)
        
        try:
            optimizer_data = self.revenue_optimizer
            if 'bandit' in optimizer_data:
                stats = []
                bandit = optimizer_data['bandit']
                
                for arm in range(bandit.n_arms):
                    estimated_ctr = float(bandit.alpha[arm] / (bandit.alpha[arm] + bandit.beta[arm]))
                    stats.append({
                        'arm': int(arm),
                        'estimated_ctr': estimated_ctr
                    })
                
                stats_df = pd.DataFrame(stats).sort_values('estimated_ctr', ascending=False)
                
                allocations = []
                remaining_budget = total_budget
                campaigns = optimizer_data['campaigns']
                
                for _, row in stats_df.head(10).iterrows():
                    if remaining_budget <= 0:
                        break
                    
                    arm_idx = int(row['arm'])
                    if arm_idx < len(campaigns):
                        campaign = campaigns.iloc[arm_idx]
                        allocation = min(remaining_budget * 0.3, float(campaign.get('budget', 10000)) * 0.5)
                        
                        allocations.append({
                            'campaign_id': arm_idx,
                            'campaign_name': f"Campaign_{arm_idx}",
                            'recommended_budget': float(allocation),
                            'estimated_ctr': float(row['estimated_ctr'])
                        })
                        
                        remaining_budget -= allocation
                
                return allocations if allocations else self._get_mock_budget_allocation(total_budget)
        
        except Exception as e:
            print(f"Error getting budget allocation: {e}")
        
        return self._get_mock_budget_allocation(total_budget)
    
    def _get_mock_recommendations(self, n=10):
        return [
            {'item_id': str(i), 'score': np.random.uniform(0.01, 0.1)}
            for i in range(1, n+1)
        ]
    
    def _get_mock_budget_allocation(self, total_budget):
        allocations = []
        remaining = total_budget
        
        for i in range(5):
            allocation = remaining * 0.3
            allocations.append({
                'campaign_id': i,
                'campaign_name': f'Campaign_{i}',
                'recommended_budget': allocation,
                'estimated_ctr': np.random.uniform(0.01, 0.05)
            })
            remaining -= allocation
        
        return allocations

ml_service = MLModelService()