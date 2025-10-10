import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import json

def train_model(data_path, model_output_path, model_type='logistic_regression'):
    """Trains the churn prediction model from a data file path and saves it."""
    df = pd.read_csv(data_path)

    # Ensure required columns exist
    required_cols = {'CreditScore', 'Geography', 'Gender', 'Age', 'Tenure', 'Balance',
                     'NumOfProducts', 'HasCrCard', 'IsActiveMember', 'EstimatedSalary', 'Exited'}
    if not required_cols.issubset(df.columns):
        missing_cols = required_cols - set(df.columns)
        raise ValueError(f"CSV is missing required columns: {missing_cols}")

    X = df.drop(columns=['RowNumber', 'CustomerId', 'Surname', 'Exited'], errors='ignore')
    y = df['Exited']

    categorical_features = ['Geography', 'Gender']
    numerical_features = ['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'HasCrCard', 'IsActiveMember', 'EstimatedSalary']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    if model_type == 'random_forest':
        classifier = RandomForestClassifier(random_state=42)
    else:
        classifier = LogisticRegression(random_state=42)

    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', classifier)
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model_pipeline.fit(X_train, y_train)

    # Save feature names after fitting the preprocessor
    feature_names = numerical_features + \
        list(model_pipeline.named_steps['preprocessor'].named_transformers_['cat'].get_feature_names_out(categorical_features))
    
    with open(model_output_path.replace('.joblib', '_features.json'), 'w') as f:
        json.dump(feature_names, f)


    y_pred = model_pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    joblib.dump(model_pipeline, model_output_path)
    print(f"Model trained with accuracy: {accuracy:.4f} and saved to {model_output_path}")

    return accuracy