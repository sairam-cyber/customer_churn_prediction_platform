from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import uuid
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
from model import train_model
import shap
import json
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

# All models and datasets will be stored relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

def get_retention_strategy(probability):
    if probability > 0.75:
        return "High Priority: Offer a premium discount and a personalized loyalty bonus."
    elif probability > 0.5:
        return "Medium Priority: Engage with targeted email campaigns."
    else:
        return "Low Priority: Monitor activity and include in general marketing."

def get_paths_from_model_id(model_id):
    """Gets the absolute paths for a model and its dataset, managed internally."""
    model_dir = os.path.join(MODELS_DIR, model_id)
    model_path = os.path.join(model_dir, 'churn_model.joblib')
    dataset_path = os.path.join(model_dir, 'dataset.csv') # The dataset is now stored locally
    features_path = os.path.join(model_dir, 'churn_model_features.json')

    if not os.path.exists(model_path) or not os.path.exists(dataset_path):
        return None, None, None
        
    return model_path, dataset_path, features_path

@app.route('/dashboard_stats', methods=['POST'])
def dashboard_stats():
    body = request.get_json()
    model_id = body.get('model_id')

    if not model_id:
        return jsonify({"error": "model_id is required."}), 400

    model_path, data_path, _ = get_paths_from_model_id(model_id)
    
    if not data_path or not model_path:
        return jsonify({"error": "Dataset or model not found for the given ID."}), 404
    
    try:
        df = pd.read_csv(data_path)
        model_pipeline = joblib.load(model_path)

        total_customers = len(df)
        churned_customers = int(df['Exited'].sum())
        churn_rate = (churned_customers / total_customers) * 100 if total_customers > 0 else 0

        X = df.drop(columns=['RowNumber', 'CustomerId', 'Surname', 'Exited'], errors='ignore')
        predictions = model_pipeline.predict_proba(X)
        df['ChurnProbability'] = predictions[:, 1]
        
        high_risk_customers = df.sort_values(by='ChurnProbability', ascending=False).head(5)

        # Columns needed for the predictor form
        predictor_columns = [
            'CustomerId', 'Surname', 'CreditScore', 'Geography', 'Gender', 'Age', 
            'Tenure', 'Balance', 'NumOfProducts', 'HasCrCard', 'IsActiveMember', 
            'EstimatedSalary', 'ChurnProbability'
        ]
        
        stats = {
            "totalCustomers": total_customers,
            "churnedCustomers": churned_customers,
            "churnRate": round(churn_rate, 2),
            "highRiskCustomers": high_risk_customers[predictor_columns].to_dict('records')
        }
        return jsonify(stats)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/performance_stats', methods=['POST'])
def performance_stats():
    body = request.get_json()
    model_id = body.get('model_id')

    if not model_id:
        return jsonify({"error": "model_id is required."}), 400

    model_path, data_path, _ = get_paths_from_model_id(model_id)

    if not data_path or not model_path:
        return jsonify({"error": "Dataset or model not found for the given ID."}), 404

    try:
        df = pd.read_csv(data_path)
        model_pipeline = joblib.load(model_path)
        
        X = df.drop(columns=['RowNumber', 'CustomerId', 'Surname', 'Exited'], errors='ignore')
        y = df['Exited']
        
        _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        y_pred = model_pipeline.predict(X_test)
        
        tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()

        performance_data = {
            "metrics": { "accuracy": round(accuracy_score(y_test, y_pred), 4), "precision": round(precision_score(y_test, y_pred), 4), "recall": round(recall_score(y_test, y_pred), 4), "f1_score": round(f1_score(y_test, y_pred), 4), },
            "confusionMatrix": { "truePositive": int(tp), "falsePositive": int(fp), "trueNegative": int(tn), "falseNegative": int(fn) }
        }
        return jsonify(performance_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    model_id = data.pop('model_id', None)

    if not model_id:
        return jsonify({"error": "model_id is required."}), 400
    
    model_path, data_path, features_path = get_paths_from_model_id(model_id)

    if not model_path or not os.path.exists(model_path):
        return jsonify({"error": "Model not found."}), 404

    try:
        model_pipeline = joblib.load(model_path)
        
        # --- FIX: FALLBACK FOR MISSING FEATURE FILE ---
        # Try to load from file, but if it fails, generate from the model
        try:
            with open(features_path, 'r') as f:
                feature_names = json.load(f)
        except FileNotFoundError:
            # This handles models trained before the feature file was saved
            feature_names = model_pipeline.named_steps['preprocessor'].get_feature_names_out().tolist()

        feature_order = ['CreditScore', 'Geography', 'Gender', 'Age', 'Tenure', 'Balance', 
                         'NumOfProducts', 'HasCrCard', 'IsActiveMember', 'EstimatedSalary']
        
        features = pd.DataFrame([data])
        features = features[feature_order]

        transformed_features = model_pipeline.named_steps['preprocessor'].transform(features)
        
        churn_probability = model_pipeline.predict_proba(features)[0][1]
        strategy = get_retention_strategy(churn_probability)
        
        classifier = model_pipeline.named_steps['classifier']
        
        if isinstance(classifier, RandomForestClassifier):
            explainer = shap.TreeExplainer(classifier)
            shap_values = explainer.shap_values(transformed_features)
            base_value = explainer.expected_value[1]
            values = shap_values[1][0].tolist()
            
        elif isinstance(classifier, LogisticRegression):
            df_background = pd.read_csv(data_path)
            X_background = df_background.drop(columns=['RowNumber', 'CustomerId', 'Surname', 'Exited'], errors='ignore')
            
            X_background_transformed_np = model_pipeline.named_steps['preprocessor'].transform(X_background.head(100))
            transformed_feature_names = model_pipeline.named_steps['preprocessor'].get_feature_names_out()
            X_background_transformed = pd.DataFrame(X_background_transformed_np, columns=transformed_feature_names)
            
            explainer = shap.LinearExplainer(classifier, X_background_transformed)
            shap_values = explainer.shap_values(transformed_features)
            base_value = explainer.expected_value
            values = shap_values[0].tolist()
        else:
            base_value, values = 0, []

        return jsonify({ 
            'churnProbability': round(churn_probability, 4), 
            'recommendedStrategy': strategy,
            'shapValues': {
                'baseValue': base_value,
                'values': values,
                'featureNames': feature_names
            }
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/train', methods=['POST'])
def handle_train():
    if 'dataset' not in request.files:
        return jsonify({"error": "No dataset file provided"}), 400
    
    file = request.files['dataset']
    model_type = request.form.get('modelType', 'logistic_regression')
    
    model_id = str(uuid.uuid4())
    model_dir = os.path.join(MODELS_DIR, model_id)
    os.makedirs(model_dir, exist_ok=True)
    
    local_dataset_path = os.path.join(model_dir, 'dataset.csv')
    file.save(local_dataset_path)

    model_path_absolute = os.path.join(model_dir, 'churn_model.joblib')
    
    try:
        accuracy = train_model(local_dataset_path, model_path_absolute, model_type=model_type)
        return jsonify({
            "message": "Model trained successfully!",
            "model_id": model_id,
            "accuracy": accuracy
        })
    except Exception as e:
        return jsonify({"error": f"An error occurred during training: {e}"}), 500

@app.route('/retrain', methods=['POST'])
def handle_retrain():
    data = request.get_json()
    model_id = data.get('model_id')
    model_type = data.get('modelType', 'logistic_regression')

    if not model_id:
        return jsonify({"error": "model_id is required."}), 400

    model_path, data_path, _ = get_paths_from_model_id(model_id)

    if not data_path or not model_path:
        return jsonify({"error": "Model or dataset not found for the given ID."}), 404

    try:
        accuracy = train_model(data_path, model_path, model_type=model_type)
        return jsonify({
            "message": "Model retrained successfully!",
            "accuracy": accuracy
        })
    except Exception as e:
        return jsonify({"error": f"An error occurred during retraining: {e}"}), 500

@app.route('/churn_factors', methods=['POST'])
def get_churn_factors():
    body = request.get_json()
    model_id = body.get('model_id')

    if not model_id:
        return jsonify({"error": "model_id is required."}), 400

    model_path, data_path, _ = get_paths_from_model_id(model_id)

    if not data_path or not model_path:
        return jsonify({"error": "Dataset or model not found for the given ID."}), 404
        
    try:
        model_pipeline = joblib.load(model_path)
        
        feature_names = model_pipeline.named_steps['preprocessor'].get_feature_names_out()

        if hasattr(model_pipeline.named_steps['classifier'], 'coef_'):
            coefficients = model_pipeline.named_steps['classifier'].coef_[0]
            feature_importances = pd.Series(coefficients, index=feature_names)
            top_factors = feature_importances.abs().nlargest(5).to_dict()
        else:
            importances = model_pipeline.named_steps['classifier'].feature_importances_
            feature_importances = pd.Series(importances, index=feature_names)
            top_factors = feature_importances.nlargest(5).to_dict()

        return jsonify({"churnFactors": top_factors})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/segmentation', methods=['POST'])
def get_segmentation():
    body = request.get_json()
    model_id = body.get('model_id')

    if not model_id:
        return jsonify({"error": "model_id is required."}), 400

    model_path, data_path, _ = get_paths_from_model_id(model_id)

    if not data_path or not model_path:
        return jsonify({"error": "Dataset or model not found for the given ID."}), 404

    try:
        df = pd.read_csv(data_path)
        model_pipeline = joblib.load(model_path)

        X = df.drop(columns=['RowNumber', 'CustomerId', 'Surname', 'Exited'], errors='ignore')
        predictions = model_pipeline.predict_proba(X)[:, 1]
        df['ChurnProbability'] = predictions

        bins = [0, 0.35, 0.7, 1.0]
        labels = ['Low Risk', 'Medium Risk', 'High Risk']
        df['RiskCategory'] = pd.cut(df['ChurnProbability'], bins=bins, labels=labels, include_lowest=True)
        
        # --- FIX: SILENCE PANDAS WARNING ---
        segmentation_data = df.groupby('RiskCategory', observed=False)['CustomerId'].count().to_dict()

        return jsonify({"segmentation": segmentation_data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)