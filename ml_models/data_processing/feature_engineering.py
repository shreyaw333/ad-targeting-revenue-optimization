import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer

class FeatureEngineer:
    def __init__(self):
        self.svd = None
        self.tfidf = None
    
    def create_time_features(self, df, timestamp_col='timestamp'):
        df = df.copy()
        df[timestamp_col] = pd.to_datetime(df[timestamp_col])
        
        df['hour'] = df[timestamp_col].dt.hour
        df['day_of_week'] = df[timestamp_col].dt.dayofweek
        df['day_of_month'] = df[timestamp_col].dt.day
        df['month'] = df[timestamp_col].dt.month
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        df['is_business_hours'] = ((df['hour'] >= 9) & (df['hour'] <= 17)).astype(int)
        
        df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
        df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
        df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
        
        return df
    
    def create_aggregation_features(self, df, group_cols, agg_col, agg_funcs):
        agg_features = df.groupby(group_cols)[agg_col].agg(agg_funcs).reset_index()
        
        col_names = [f"{agg_col}_{func}_by_{'_'.join(group_cols)}" for func in agg_funcs]
        agg_features.columns = list(group_cols) + col_names
        
        df = df.merge(agg_features, on=group_cols, how='left')
        
        return df
    
    def create_interaction_features(self, df, col1, col2):
        df = df.copy()
        
        df[f'{col1}_x_{col2}'] = df[col1] * df[col2]
        
        df[f'{col1}_div_{col2}'] = np.where(
            df[col2] != 0,
            df[col1] / df[col2],
            0
        )
        
        return df
    
    def create_latent_features(self, interaction_matrix, n_components=50):
        if self.svd is None:
            self.svd = TruncatedSVD(n_components=n_components, random_state=42)
            latent_features = self.svd.fit_transform(interaction_matrix)
        else:
            latent_features = self.svd.transform(interaction_matrix)
        
        latent_df = pd.DataFrame(
            latent_features,
            columns=[f'latent_factor_{i}' for i in range(n_components)],
            index=interaction_matrix.index
        )
        
        return latent_df
    
    def create_text_features(self, df, text_col, max_features=50):
        if self.tfidf is None:
            self.tfidf = TfidfVectorizer(max_features=max_features)
            tfidf_features = self.tfidf.fit_transform(df[text_col].fillna(''))
        else:
            tfidf_features = self.tfidf.transform(df[text_col].fillna(''))
        
        tfidf_df = pd.DataFrame(
            tfidf_features.toarray(),
            columns=[f'tfidf_{i}' for i in range(tfidf_features.shape[1])],
            index=df.index
        )
        
        return pd.concat([df, tfidf_df], axis=1)
    
    def create_user_engagement_features(self, user_events):
        user_engagement = user_events.groupby('user_id').agg({
            'event_type': 'count',
            'timestamp': ['min', 'max']
        }).reset_index()
        
        user_engagement.columns = ['user_id', 'total_events', 'first_event', 'last_event']
        
        user_engagement['first_event'] = pd.to_datetime(user_engagement['first_event'])
        user_engagement['last_event'] = pd.to_datetime(user_engagement['last_event'])
        user_engagement['user_lifetime_days'] = (
            user_engagement['last_event'] - user_engagement['first_event']
        ).dt.days + 1
        
        user_engagement['events_per_day'] = (
            user_engagement['total_events'] / user_engagement['user_lifetime_days']
        )
        
        user_engagement['recency_days'] = (
            datetime.now() - user_engagement['last_event']
        ).dt.days
        
        return user_engagement
    
    def create_ad_performance_features(self, user_events):
        ad_performance = user_events.groupby('ad_id').agg({
            'event_type': lambda x: (x == 'click').sum(),
            'user_id': 'nunique'
        }).reset_index()
        
        ad_performance.columns = ['ad_id', 'total_clicks', 'unique_users']
        
        impressions = user_events[user_events['event_type'] == 'impression'].groupby('ad_id').size()
        ad_performance['total_impressions'] = ad_performance['ad_id'].map(impressions).fillna(0)
        
        ad_performance['ctr'] = np.where(
            ad_performance['total_impressions'] > 0,
            (ad_performance['total_clicks'] / ad_performance['total_impressions'] * 100),
            0
        )
        
        ad_performance['clicks_per_user'] = np.where(
            ad_performance['unique_users'] > 0,
            ad_performance['total_clicks'] / ad_performance['unique_users'],
            0
        )
        
        return ad_performance
    
    def create_cross_features(self, df, user_features, ad_features):
        df = df.merge(user_features[['user_id', 'interests']], on='user_id', how='left')
        df = df.merge(ad_features[['ad_id', 'category']], on='ad_id', how='left')
        
        df['interest_match'] = df.apply(
            lambda row: 1 if str(row['category']) in str(row['interests']) else 0,
            axis=1
        )
        
        return df

def main():
    print("Starting feature engineering...")
    
    engineer = FeatureEngineer()
    
    print("\nLoading processed data...")
    user_events = pd.read_csv('../../data/raw/user_events.csv')
    ctr_data = pd.read_csv('../../data/processed/ctr_training_data.csv')
    interaction_matrix = pd.read_csv('../../data/processed/user_ad_interactions.csv', index_col=0)
    
    print("\nCreating time-based features...")
    user_events = engineer.create_time_features(user_events)
    
    print("\nCreating user engagement features...")
    user_engagement = engineer.create_user_engagement_features(user_events)
    user_engagement.to_csv('../../data/processed/user_engagement_features.csv', index=False)
    
    print("\nCreating ad performance features...")
    ad_performance = engineer.create_ad_performance_features(user_events)
    ad_performance.to_csv('../../data/processed/ad_performance_features.csv', index=False)
    
    print("\nCreating latent features from interaction matrix...")
    latent_features = engineer.create_latent_features(interaction_matrix, n_components=50)
    latent_features.to_csv('../../data/processed/latent_user_features.csv')
    
    print("\nFeature engineering complete!")
    print(f"\nGenerated features:")
    print(f"- User engagement: {len(user_engagement):,} records")
    print(f"- Ad performance: {len(ad_performance):,} records")
    print(f"- Latent features: {latent_features.shape}")

if __name__ == "__main__":
    from datetime import datetime
    main()