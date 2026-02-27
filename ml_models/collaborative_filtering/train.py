import pandas as pd
import numpy as np
from model import CollaborativeFilteringModel
from sklearn.model_selection import train_test_split
import time

def load_interaction_matrix():
    interaction_matrix = pd.read_csv('../../data/processed/user_ad_interactions.csv', index_col=0)
    return interaction_matrix

def evaluate_model(model, test_matrix, k=10):
    total_precision = 0
    total_recall = 0
    n_users = 0
    
    for user_id in test_matrix.index[:100]:
        actual_items = set(test_matrix.loc[user_id][test_matrix.loc[user_id] > 0].index)
        
        if len(actual_items) == 0:
            continue
        
        recommendations = model.predict(user_id, n_recommendations=k)
        predicted_items = set([rec['item_id'] for rec in recommendations])
        
        hits = len(actual_items.intersection(predicted_items))
        
        precision = hits / k if k > 0 else 0
        recall = hits / len(actual_items) if len(actual_items) > 0 else 0
        
        total_precision += precision
        total_recall += recall
        n_users += 1
    
    avg_precision = total_precision / n_users if n_users > 0 else 0
    avg_recall = total_recall / n_users if n_users > 0 else 0
    
    return {
        'precision': avg_precision,
        'recall': avg_recall,
        'f1_score': 2 * (avg_precision * avg_recall) / (avg_precision + avg_recall) if (avg_precision + avg_recall) > 0 else 0
    }

def main():
    print("Loading interaction matrix...")
    interaction_matrix = load_interaction_matrix()
    
    print(f"Interaction matrix shape: {interaction_matrix.shape}")
    print(f"Sparsity: {(1 - interaction_matrix.astype(bool).sum().sum() / (interaction_matrix.shape[0] * interaction_matrix.shape[1])) * 100:.2f}%")
    
    print("\nSplitting data...")
    train_matrix = interaction_matrix.copy()
    test_matrix = interaction_matrix.copy()
    
    count = 0
    for user_id in interaction_matrix.index:
        user_items = interaction_matrix.loc[user_id][interaction_matrix.loc[user_id] > 0]
        if len(user_items) > 2:
            test_items = np.random.choice(user_items.index, size=min(2, len(user_items)), replace=False)
            for item in test_items:
                train_matrix.at[user_id, item] = 0
        
        count += 1
        if count % 1000 == 0:
            print(f"Processed {count}/{len(interaction_matrix)} users...")
    
    print("\nTraining collaborative filtering model...")
    start_time = time.time()
    
    model = CollaborativeFilteringModel(n_components=50)
    model.fit(train_matrix)
    
    training_time = time.time() - start_time
    print(f"Training completed in {training_time:.2f} seconds")
    
    print("\nEvaluating model...")
    metrics = evaluate_model(model, test_matrix, k=10)
    
    reconstruction_error = model.get_reconstruction_error(train_matrix)
    
    print("\nModel Performance:")
    print(f"Precision@10: {metrics['precision']:.4f}")
    print(f"Recall@10: {metrics['recall']:.4f}")
    print(f"F1-Score: {metrics['f1_score']:.4f}")
    print(f"Reconstruction Error: {reconstruction_error:.4f}")
    
    print("\nSample recommendations for user 1:")
    recommendations = model.predict(1, n_recommendations=10)
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. Ad ID: {rec['item_id']}, Score: {rec['score']:.4f}")
    
    print("\nSimilar users to user 1:")
    similar_users = model.get_similar_users(1, n_similar=5)
    for i, user in enumerate(similar_users, 1):
        print(f"{i}. User ID: {user['user_id']}, Similarity: {user['similarity']:.4f}")
    
    print("\nSaving model...")
    model.save_model('../../data/processed/collaborative_filtering_model.pkl')
    
    metrics_data = {
        'model_name': 'collaborative_filtering',
        'precision': metrics['precision'],
        'recall': metrics['recall'],
        'f1_score': metrics['f1_score'],
        'reconstruction_error': reconstruction_error,
        'training_time': training_time,
        'n_components': 50
    }
    
    metrics_df = pd.DataFrame([metrics_data])
    metrics_df.to_csv('../../data/processed/cf_model_metrics.csv', index=False)
    
    print("\nCollaborative Filtering training complete!")

if __name__ == "__main__":
    main()