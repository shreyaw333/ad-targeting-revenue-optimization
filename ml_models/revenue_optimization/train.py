import pandas as pd
import numpy as np
from model import RevenueOptimizer
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import time

def load_campaign_data():
    campaign_data = pd.read_csv('../../data/raw/campaign_performance.csv')
    ad_features = pd.read_csv('../../data/raw/ad_features.csv')
    
    campaign_data = campaign_data.merge(
        ad_features[['ad_id', 'bid_price']].rename(columns={'ad_id': 'campaign_id'}),
        left_index=True,
        right_on='campaign_id',
        how='left'
    )
    
    if 'bid_price' not in campaign_data.columns:
        campaign_data['bid_price'] = np.random.uniform(0.5, 5.0, len(campaign_data))
    
    if 'conversion_rate' not in campaign_data.columns:
        campaign_data['conversion_rate'] = campaign_data['conversions'] / campaign_data['clicks'] * 100
    
    numeric_columns = campaign_data.select_dtypes(include=[np.number]).columns
    campaign_data[numeric_columns] = campaign_data[numeric_columns].fillna(campaign_data[numeric_columns].mean())
    
    return campaign_data

def main():
    print("Loading campaign data...")
    campaigns = load_campaign_data()
    
    print(f"Number of campaigns: {len(campaigns)}")
    print(f"\nCampaign statistics:")
    print(campaigns[['budget', 'spent', 'ctr', 'conversion_rate', 'roas']].describe())
    
    print("\nInitializing Revenue Optimizer...")
    optimizer = RevenueOptimizer(campaigns)
    
    print("\nRunning optimization simulation (5000 iterations)...")
    start_time = time.time()
    
    optimizer.optimize(n_iterations=5000)
    
    optimization_time = time.time() - start_time
    print(f"Optimization completed in {optimization_time:.2f} seconds")
    
    print("\nPerformance Summary:")
    summary = optimizer.get_performance_summary()
    print(f"Total Revenue: ${summary['total_revenue']:.2f}")
    print(f"Total Cost: ${summary['total_cost']:.2f}")
    print(f"Profit: ${summary['profit']:.2f}")
    print(f"ROI: {summary['roi']:.2f}x")
    
    print("\nBandit Arm Statistics:")
    arm_stats = optimizer.bandit.get_arm_statistics()
    print(arm_stats.head(10))
    
    print("\nRecommended Budget Allocation (for $100,000 budget):")
    allocations = optimizer.get_optimal_allocation(total_budget=100000)
    print(allocations.head(10))
    
    print("\nSaving model...")
    optimizer.save_model('../../data/processed/revenue_optimizer.pkl')
    
    metrics_data = {
        'model_name': 'revenue_optimization',
        'total_revenue': summary['total_revenue'],
        'total_cost': summary['total_cost'],
        'roi': summary['roi'],
        'profit': summary['profit'],
        'optimization_time': optimization_time,
        'n_iterations': summary['n_iterations']
    }
    
    metrics_df = pd.DataFrame([metrics_data])
    metrics_df.to_csv('../../data/processed/revenue_model_metrics.csv', index=False)
    
    allocations.to_csv('../../data/processed/optimal_budget_allocation.csv', index=False)
    arm_stats.to_csv('../../data/processed/campaign_arm_statistics.csv', index=False)
    
    print("\nRevenue Optimization training complete!")

if __name__ == "__main__":
    main()