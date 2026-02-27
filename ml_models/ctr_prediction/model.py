import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score, precision_score, recall_score, f1_score
import pickle
import os

class CTRPredictionModel:
    def __init__(self, n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42):
        self.model = GradientBoostingClassifier(
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            max_depth=max_depth,
            random_state=random_state
        )
        self.feature_columns = None
        self.feature_importance = None
        
    def prepare_features(self, df):
        feature_cols = [
            'device_encoded', 'browser_encoded', 'location_encoded',
            'age_group_encoded', 'gender_encoded', 'income_level_encoded',
            'category_encoded', 'ad_type_encoded', 'target_audience_encoded',
            'hour', 'day_of_week', 'is_weekend',
            'engagement_score', 'bid_price', 'quality_score'
        ]
        
        interest_cols = [col for col in df.columns if col in ['tech', 'fashion', 'sports', 'gaming', 'travel', 'food', 'music']]
        feature_cols.extend(interest_cols)
        
        available_cols = [col for col in feature_cols if col in df.columns]
        
        return df[available_cols].fillna(0), available_cols
    
    def fit(self, X_train, y_train):
        X_train_prepared, self.feature_columns = self.prepare_features(X_train)
        
        self.model.fit(X_train_prepared, y_train)
        
        self.feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        return self
    
    def predict_proba(self, X):
        X_prepared, _ = self.prepare_features(X)
        X_prepared = X_prepared[self.feature_columns]
        
        return self.model.predict_proba(X_prepared)[:, 1]
    
    def predict(self, X, threshold=0.5):
        probas = self.predict_proba(X)
        return (probas >= threshold).astype(int)
    
    def evaluate(self, X_test, y_test):
        y_pred = self.predict(X_test)
        y_proba = self.predict_proba(X_test)
        
        metrics = {
            'auc': roc_auc_score(y_test, y_proba),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1_score': f1_score(y_test, y_pred)
        }
        
        return metrics
    
    def get_feature_importance(self, top_n=20):
        return self.feature_importance.head(top_n)
    
    def save_model(self, filepath='ctr_prediction_model.pkl'):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        model_data = {
            'model': self.model,
            'feature_columns': self.feature_columns,
            'feature_importance': self.feature_importance
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"Model saved to {filepath}")
    
    @classmethod
    def load_model(cls, filepath):
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        ctr_model = cls()
        ctr_model.model = model_data['model']
        ctr_model.feature_columns = model_data['feature_columns']
        ctr_model.feature_importance = model_data['feature_importance']
        
        return ctr_model