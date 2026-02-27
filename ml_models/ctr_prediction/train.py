import pandas as pd
import numpy as np
from model import CTRPredictionModel
from sklearn.model_selection import train_test_split
import time

def load_ctr_data():
    ctr_data = pd.read_csv('../../data/processed/ctr_training_data.csv')
    return ctr_data

def main():
    print("Loading CTR training data...")
    data = load_ctr_data()
    
    print(f"Dataset shape: {data.shape}")
    print(f"Click rate: {data['clicked'].mean():.4f}")
    
    print("\nPreparing features and labels...")
    X = data.drop(['clicked', 'event_type', 'timestamp', 'user_id', 'ad_id', 
                   'revenue', 'device', 'browser', 'location', 'interests',
                   'age_group', 'gender', 'income_level', 'category', 
                   'ad_type', 'target_audience'], axis=1, errors='ignore')
    y = data['clicked']
    
    print("\nSplitting data (80/20 train/test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set: {X_train.shape}, Click rate: {y_train.mean():.4f}")
    print(f"Test set: {X_test.shape}, Click rate: {y_test.mean():.4f}")
    
    print("\nTraining CTR prediction model...")
    start_time = time.time()
    
    model = CTRPredictionModel(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5
    )
    model.fit(X_train, y_train)
    
    training_time = time.time() - start_time
    print(f"Training completed in {training_time:.2f} seconds")
    
    print("\nEvaluating model...")
    metrics = model.evaluate(X_test, y_test)
    
    print("\nModel Performance:")
    print(f"AUC: {metrics['auc']:.4f}")
    print(f"Precision: {metrics['precision']:.4f}")
    print(f"Recall: {metrics['recall']:.4f}")
    print(f"F1-Score: {metrics['f1_score']:.4f}")
    
    print("\nTop 15 Most Important Features:")
    feature_importance = model.get_feature_importance(top_n=15)
    for idx, row in feature_importance.iterrows():
        print(f"{row['feature']}: {row['importance']:.4f}")
    
    print("\nSample predictions:")
    sample_X = X_test.head(5)
    sample_y_true = y_test.head(5).values
    sample_y_pred = model.predict(sample_X)
    sample_y_proba = model.predict_proba(sample_X)
    
    for i in range(5):
        print(f"Sample {i+1}: True={sample_y_true[i]}, Predicted={sample_y_pred[i]}, Probability={sample_y_proba[i]:.4f}")
    
    print("\nSaving model...")
    model.save_model('../../data/processed/ctr_prediction_model.pkl')
    
    metrics_data = {
        'model_name': 'ctr_prediction',
        'auc': metrics['auc'],
        'precision': metrics['precision'],
        'recall': metrics['recall'],
        'f1_score': metrics['f1_score'],
        'training_time': training_time,
        'n_estimators': 100,
        'max_depth': 5
    }
    
    metrics_df = pd.DataFrame([metrics_data])
    metrics_df.to_csv('../../data/processed/ctr_model_metrics.csv', index=False)
    
    feature_importance.to_csv('../../data/processed/ctr_feature_importance.csv', index=False)
    
    print("\nCTR Prediction training complete!")

if __name__ == "__main__":
    main()