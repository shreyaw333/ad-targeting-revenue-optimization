import numpy as np
import pandas as pd
import pickle
import os

class ThompsonSamplingBandit:
    def __init__(self, n_arms):
        self.n_arms = n_arms
        self.alpha = np.ones(n_arms)
        self.beta = np.ones(n_arms)
        self.arm_rewards = {i: [] for i in range(n_arms)}
        
    def select_arm(self):
        samples = np.random.beta(self.alpha, self.beta)
        return np.argmax(samples)
    
    def update(self, arm, reward):
        self.arm_rewards[arm].append(reward)
        
        if reward > 0:
            self.alpha[arm] += 1
        else:
            self.beta[arm] += 1
    
    def get_arm_statistics(self):
        stats = []
        for arm in range(self.n_arms):
            mean_reward = np.mean(self.arm_rewards[arm]) if self.arm_rewards[arm] else 0
            n_pulls = len(self.arm_rewards[arm])
            
            stats.append({
                'arm': int(arm),
                'mean_reward': float(mean_reward),
                'n_pulls': int(n_pulls),
                'alpha': float(self.alpha[arm]),
                'beta': float(self.beta[arm]),
                'estimated_ctr': float(self.alpha[arm] / (self.alpha[arm] + self.beta[arm]))
            })
        
        return pd.DataFrame(stats)

class RevenueOptimizer:
    def __init__(self, campaigns_data):
        self.campaigns = campaigns_data.reset_index(drop=True)
        self.n_campaigns = len(campaigns_data)
        self.bandit = ThompsonSamplingBandit(self.n_campaigns)
        self.total_revenue = 0
        self.total_cost = 0
        self.history = []
        
    def simulate_campaign_outcome(self, campaign_id):
        campaign = self.campaigns.iloc[campaign_id]
        
        bid_price = campaign['bid_price']
        expected_ctr = campaign['ctr'] / 100
        expected_conversion = campaign['conversion_rate'] / 100
        
        clicked = np.random.random() < expected_ctr
        
        if clicked:
            converted = np.random.random() < expected_conversion
            if converted:
                revenue = np.random.uniform(15, 150)
                cost = bid_price
                return revenue - cost, True
            else:
                return -bid_price, False
        
        return 0, False
    
    def optimize(self, n_iterations=1000):
        for iteration in range(n_iterations):
            selected_campaign = self.bandit.select_arm()
            
            reward, converted = self.simulate_campaign_outcome(selected_campaign)
            
            self.bandit.update(selected_campaign, int(converted))
            
            self.total_revenue += max(reward, 0)
            self.total_cost += abs(min(reward, 0))
            
            self.history.append({
                'iteration': iteration,
                'campaign': selected_campaign,
                'reward': reward,
                'converted': converted,
                'cumulative_revenue': self.total_revenue,
                'cumulative_cost': self.total_cost,
                'roi': (self.total_revenue / self.total_cost) if self.total_cost > 0 else 0
            })
    
    def get_optimal_allocation(self, total_budget):
        stats = self.bandit.get_arm_statistics()
        stats = stats.sort_values('estimated_ctr', ascending=False)
        
        allocations = []
        remaining_budget = total_budget
        
        for _, row in stats.iterrows():
            if remaining_budget <= 0:
                break
            
            arm_idx = int(row['arm'])
            campaign = self.campaigns.iloc[arm_idx]
            
            estimated_revenue_per_dollar = row['estimated_ctr'] * float(campaign['conversion_rate']) / 100
            
            allocation = min(remaining_budget * 0.3, float(campaign['budget']) * 0.5)
            
            campaign_name = campaign.get('campaign_name', f'Campaign_{arm_idx}')
            if pd.isna(campaign_name):
                campaign_name = f'Campaign_{arm_idx}'
            
            allocations.append({
                'campaign_id': arm_idx,
                'campaign_name': str(campaign_name),
                'recommended_budget': float(allocation),
                'estimated_ctr': float(row['estimated_ctr']),
                'expected_roi': float(estimated_revenue_per_dollar * 2)
            })
            
            remaining_budget -= allocation
        
        return pd.DataFrame(allocations)
    
    def get_performance_summary(self):
        return {
            'total_revenue': self.total_revenue,
            'total_cost': self.total_cost,
            'roi': (self.total_revenue / self.total_cost) if self.total_cost > 0 else 0,
            'profit': self.total_revenue - self.total_cost,
            'n_iterations': len(self.history)
        }
    
    def save_model(self, filepath='revenue_optimizer.pkl'):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        model_data = {
            'bandit': self.bandit,
            'campaigns': self.campaigns,
            'total_revenue': self.total_revenue,
            'total_cost': self.total_cost,
            'history': self.history
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"Model saved to {filepath}")
    
    @classmethod
    def load_model(cls, filepath):
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        optimizer = cls(model_data['campaigns'])
        optimizer.bandit = model_data['bandit']
        optimizer.total_revenue = model_data['total_revenue']
        optimizer.total_cost = model_data['total_cost']
        optimizer.history = model_data['history']
        
        return optimizer