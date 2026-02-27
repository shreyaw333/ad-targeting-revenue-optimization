import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from datetime import datetime
import pickle
import os

class DataPreprocessor:
    def __init__(self):
        self.scalers = {}
        self.encoders = {}
        
    def load_raw_data(self):
        user_events = pd.read_csv('../../data/raw/user_events.csv')
        user_features = pd.read_csv('../../data/raw/user_features.csv')
        ad_features = pd.read_csv('../../data/raw/ad_features.csv')
        campaign_performance = pd.read_csv('../../data/raw/campaign_performance.csv')
        
        return user_events, user_features, ad_features, campaign_performance
    
    def engineer_user_features(self, user_events, user_features):
        user_events['timestamp'] = pd.to_datetime(user_events['timestamp'])
        
        user_stats = user_events.groupby('user_id').agg({
            'event_type': 'count',
            'timestamp': ['min', 'max']
        }).reset_index()
        
        user_stats.columns = ['user_id', 'total_events', 'first_seen', 'last_seen']
        
        user_stats['days_active'] = (
            pd.to_datetime(user_stats['last_seen']) - 
            pd.to_datetime(user_stats['first_seen'])
        ).dt.days + 1
        
        user_stats['events_per_day'] = (
            user_stats['total_events'] / user_stats['days_active']
        ).round(2)
        
        impressions = user_events[user_events['event_type'] == 'impression'].groupby('user_id').size()
        clicks = user_events[user_events['event_type'] == 'click'].groupby('user_id').size()
        conversions = user_events[user_events['event_type'] == 'conversion'].groupby('user_id').size()
        
        user_stats['impressions'] = user_stats['user_id'].map(impressions).fillna(0)
        user_stats['clicks'] = user_stats['user_id'].map(clicks).fillna(0)
        user_stats['conversions'] = user_stats['user_id'].map(conversions).fillna(0)
        
        user_stats['ctr'] = np.where(
            user_stats['impressions'] > 0,
            (user_stats['clicks'] / user_stats['impressions'] * 100).round(3),
            0
        )
        
        user_stats['conversion_rate'] = np.where(
            user_stats['clicks'] > 0,
            (user_stats['conversions'] / user_stats['clicks'] * 100).round(3),
            0
        )
        
        revenue = user_events.groupby('user_id')['revenue'].sum()
        user_stats['total_revenue'] = user_stats['user_id'].map(revenue).fillna(0).round(2)
        
        device_modes = user_events.groupby('user_id')['device'].agg(lambda x: x.mode()[0] if len(x.mode()) > 0 else 'unknown')
        user_stats['preferred_device'] = user_stats['user_id'].map(device_modes)
        
        enriched_users = user_features.merge(user_stats, on='user_id', how='left')
        enriched_users = enriched_users.fillna(0)
        
        return enriched_users
    
    def create_user_ad_interaction_matrix(self, user_events):
        interactions = user_events[user_events['event_type'].isin(['click', 'conversion'])].copy()
        
        interactions['weight'] = interactions['event_type'].map({
            'click': 1,
            'conversion': 5
        })
        
        interaction_matrix = interactions.pivot_table(
            index='user_id',
            columns='ad_id',
            values='weight',
            aggfunc='sum',
            fill_value=0
        )
        
        return interaction_matrix
    
    def prepare_ctr_dataset(self, user_events, user_features, ad_features):
        data = user_events.copy()
        
        data = data.merge(user_features, on='user_id', how='left')
        data = data.merge(ad_features, on='ad_id', how='left')
        
        data['clicked'] = (data['event_type'] == 'click').astype(int)
        
        data['hour'] = pd.to_datetime(data['timestamp']).dt.hour
        data['day_of_week'] = pd.to_datetime(data['timestamp']).dt.dayofweek
        data['is_weekend'] = (data['day_of_week'] >= 5).astype(int)
        
        categorical_columns = ['device', 'browser', 'location', 'age_group', 
                              'gender', 'income_level', 'category', 'ad_type', 
                              'target_audience']
        
        for col in categorical_columns:
            if col not in self.encoders:
                self.encoders[col] = LabelEncoder()
                data[f'{col}_encoded'] = self.encoders[col].fit_transform(data[col].astype(str))
            else:
                data[f'{col}_encoded'] = self.encoders[col].transform(data[col].astype(str))
        
        interest_dummies = data['interests'].str.get_dummies(sep=',')
        data = pd.concat([data, interest_dummies], axis=1)
        
        return data
    
    def scale_features(self, df, columns):
        for col in columns:
            if col not in self.scalers:
                self.scalers[col] = StandardScaler()
                df[f'{col}_scaled'] = self.scalers[col].fit_transform(df[[col]])
            else:
                df[f'{col}_scaled'] = self.scalers[col].transform(df[[col]])
        return df
    
    def save_processed_data(self, data, filename):
        output_path = f'../../data/processed/{filename}'
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        data.to_csv(output_path, index=False)
        print(f"Saved processed data to {output_path}")
    
    def save_preprocessor(self, filename='preprocessor.pkl'):
        output_path = f'../../data/processed/{filename}'
        with open(output_path, 'wb') as f:
            pickle.dump({
                'scalers': self.scalers,
                'encoders': self.encoders
            }, f)
        print(f"Saved preprocessor to {output_path}")

def main():
    print("Starting data preprocessing pipeline...")
    
    preprocessor = DataPreprocessor()
    
    print("\nLoading raw data...")
    user_events, user_features, ad_features, campaign_performance = preprocessor.load_raw_data()
    
    print("\nEngineering user features...")
    enriched_users = preprocessor.engineer_user_features(user_events, user_features)
    preprocessor.save_processed_data(enriched_users, 'enriched_users.csv')
    
    print("\nCreating user-ad interaction matrix...")
    interaction_matrix = preprocessor.create_user_ad_interaction_matrix(user_events)
    preprocessor.save_processed_data(interaction_matrix, 'user_ad_interactions.csv')
    
    print("\nPreparing CTR prediction dataset...")
    ctr_data = preprocessor.prepare_ctr_dataset(user_events, user_features, ad_features)
    preprocessor.save_processed_data(ctr_data, 'ctr_training_data.csv')
    
    print("\nScaling numerical features...")
    numerical_cols = ['engagement_score', 'bid_price', 'quality_score']
    ctr_data = preprocessor.scale_features(ctr_data, numerical_cols)
    
    preprocessor.save_preprocessor()
    
    print("\nData preprocessing complete!")
    print(f"\nProcessed datasets:")
    print(f"- Enriched users: {len(enriched_users):,} records")
    print(f"- Interaction matrix: {interaction_matrix.shape}")
    print(f"- CTR training data: {len(ctr_data):,} records")

if __name__ == "__main__":
    main()