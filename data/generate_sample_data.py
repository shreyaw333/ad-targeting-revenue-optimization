import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

np.random.seed(42)
random.seed(42)

def generate_user_events(n_users=10000, n_events=100000):
    user_ids = np.random.randint(1, n_users + 1, n_events)
    
    start_date = datetime.now() - timedelta(days=90)
    timestamps = [start_date + timedelta(seconds=random.randint(0, 90*24*3600)) for _ in range(n_events)]
    
    event_types = np.random.choice(
        ['impression', 'click', 'conversion'],
        n_events,
        p=[0.85, 0.13, 0.02]
    )
    
    ad_ids = np.random.randint(1, 501, n_events)
    
    devices = np.random.choice(
        ['mobile', 'desktop', 'tablet'],
        n_events,
        p=[0.6, 0.35, 0.05]
    )
    
    browsers = np.random.choice(
        ['chrome', 'safari', 'firefox', 'edge'],
        n_events,
        p=[0.6, 0.25, 0.1, 0.05]
    )
    
    locations = np.random.choice(
        ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN'],
        n_events,
        p=[0.4, 0.15, 0.1, 0.08, 0.08, 0.07, 0.07, 0.05]
    )
    
    revenue = np.where(
        event_types == 'conversion',
        np.random.uniform(10, 200, n_events),
        0
    )
    
    df = pd.DataFrame({
        'user_id': user_ids,
        'timestamp': timestamps,
        'event_type': event_types,
        'ad_id': ad_ids,
        'device': devices,
        'browser': browsers,
        'location': locations,
        'revenue': revenue
    })
    
    df = df.sort_values('timestamp').reset_index(drop=True)
    
    return df

def generate_user_features(n_users=10000):
    user_ids = range(1, n_users + 1)
    
    age_groups = np.random.choice(
        ['18-24', '25-34', '35-44', '45-54', '55+'],
        n_users,
        p=[0.15, 0.35, 0.25, 0.15, 0.1]
    )
    
    genders = np.random.choice(['M', 'F', 'Other'], n_users, p=[0.48, 0.48, 0.04])
    
    interests = []
    interest_categories = ['tech', 'fashion', 'sports', 'gaming', 'travel', 'food', 'music']
    for _ in range(n_users):
        n_interests = random.randint(1, 4)
        user_interests = random.sample(interest_categories, n_interests)
        interests.append(','.join(user_interests))
    
    income_levels = np.random.choice(
        ['low', 'medium', 'high'],
        n_users,
        p=[0.3, 0.5, 0.2]
    )
    
    engagement_scores = np.random.beta(2, 5, n_users) * 100
    
    df = pd.DataFrame({
        'user_id': user_ids,
        'age_group': age_groups,
        'gender': genders,
        'interests': interests,
        'income_level': income_levels,
        'engagement_score': engagement_scores.round(2)
    })
    
    return df

def generate_ad_features(n_ads=500):
    ad_ids = range(1, n_ads + 1)
    
    categories = np.random.choice(
        ['electronics', 'fashion', 'sports', 'gaming', 'home', 'beauty', 'auto'],
        n_ads,
        p=[0.2, 0.2, 0.15, 0.15, 0.1, 0.1, 0.1]
    )
    
    ad_types = np.random.choice(
        ['banner', 'video', 'native', 'interstitial'],
        n_ads,
        p=[0.4, 0.3, 0.2, 0.1]
    )
    
    target_audiences = np.random.choice(
        ['tech_enthusiasts', 'fashion_lovers', 'sports_fans', 'gamers', 'general'],
        n_ads,
        p=[0.2, 0.2, 0.2, 0.2, 0.2]
    )
    
    bid_prices = np.random.uniform(0.5, 5.0, n_ads).round(2)
    
    quality_scores = np.random.beta(5, 2, n_ads) * 10
    
    df = pd.DataFrame({
        'ad_id': ad_ids,
        'category': categories,
        'ad_type': ad_types,
        'target_audience': target_audiences,
        'bid_price': bid_prices,
        'quality_score': quality_scores.round(2)
    })
    
    return df

def generate_campaign_performance(n_campaigns=50):
    campaign_ids = range(1, n_campaigns + 1)
    
    names = [f"Campaign_{i}" for i in campaign_ids]
    
    start_dates = [datetime.now() - timedelta(days=random.randint(30, 90)) for _ in range(n_campaigns)]
    
    budgets = np.random.uniform(5000, 100000, n_campaigns).round(2)
    spent = budgets * np.random.uniform(0.3, 0.95, n_campaigns)
    
    impressions = np.random.randint(10000, 1000000, n_campaigns)
    clicks = (impressions * np.random.uniform(0.01, 0.05, n_campaigns)).astype(int)
    conversions = (clicks * np.random.uniform(0.02, 0.10, n_campaigns)).astype(int)
    
    revenue = conversions * np.random.uniform(15, 150, n_campaigns)
    
    df = pd.DataFrame({
        'campaign_id': campaign_ids,
        'campaign_name': names,
        'start_date': start_dates,
        'budget': budgets,
        'spent': spent.round(2),
        'impressions': impressions,
        'clicks': clicks,
        'conversions': conversions,
        'revenue': revenue.round(2),
        'ctr': (clicks / impressions * 100).round(3),
        'conversion_rate': (conversions / clicks * 100).round(3),
        'roas': (revenue / spent).round(2)
    })
    
    return df

if __name__ == "__main__":
    print("Generating sample data...")
    
    print("Generating user events...")
    user_events = generate_user_events()
    user_events.to_csv('raw/user_events.csv', index=False)
    print(f"Generated {len(user_events)} user events")
    
    print("Generating user features...")
    user_features = generate_user_features()
    user_features.to_csv('raw/user_features.csv', index=False)
    print(f"Generated {len(user_features)} user profiles")
    
    print("Generating ad features...")
    ad_features = generate_ad_features()
    ad_features.to_csv('raw/ad_features.csv', index=False)
    print(f"Generated {len(ad_features)} ad profiles")
    
    print("Generating campaign performance...")
    campaign_performance = generate_campaign_performance()
    campaign_performance.to_csv('raw/campaign_performance.csv', index=False)
    print(f"Generated {len(campaign_performance)} campaign records")
    
    print("\nData generation complete!")
    print("\nDataset Summary:")
    print(f"- User Events: {len(user_events):,} records")
    print(f"- Users: {len(user_features):,} profiles")
    print(f"- Ads: {len(ad_features):,} profiles")
    print(f"- Campaigns: {len(campaign_performance):,} campaigns")