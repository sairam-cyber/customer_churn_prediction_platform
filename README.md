🛡️ ChurnGuard: AI-Powered Customer Churn Prediction Platform
Project Overview
ChurnGuard is an end-to-end predictive analytics platform designed to help businesses reduce customer attrition by predicting which customers are most likely to churn. It features a full-stack MERN-like architecture with a Python/Flask backend for ML model serving.

The platform provides:

Real-time Churn Prediction: Get an instant probability score for any customer.

Model Explainability (SHAP): Understand the specific factors driving a customer's churn risk.

Dashboard & Insights: Monitor key performance indicators (KPIs), identify high-risk customers, and visualize churn drivers and risk segmentation.

Model Management: Retrain the predictive model using different algorithms (Logistic Regression, Random Forest).

🚀 Key Features
Secure Authentication: User signup requires a custom dataset upload to immediately train a dedicated, personalized model.

Dynamic Dashboard: Displays total customers, current churn rate, and a table of the top 5 highest-risk customers.

Prediction Explainability: Uses SHAP (SHapley Additive exPlanations) to show the contribution of each customer feature to the final churn prediction.

Model Performance: Dedicated page to view key metrics (Accuracy, Precision, Recall, F1-Score) and a Confusion Matrix.

Full Customization: Users can retrain their model on the fly using either Logistic Regression or Random Forest.

🛠️ Tech Stack
Component	Technology	Description
Frontend (Client)	React (Vite), React Router, Recharts, React-Plotly	Interactive, dark-themed dashboard and predictor UI.
Backend (API)	Node.js/Express	Serves as the main REST API gateway, handles user authentication, and proxies ML requests.
Machine Learning	Python (Flask), Scikit-learn, Pandas, SHAP, Joblib	Dedicated ML server for model training, prediction, and deep-dive analysis.
Database	MongoDB (via Mongoose)	Stores user information, including the unique modelId associated with their trained ML pipeline.

Export to Sheets
⚙️ Getting Started
Follow these steps to get a copy of the project up and running on your local machine.

Prerequisites
Node.js (v18+) and npm

Python (v3.8+) and pip

MongoDB running locally on the default port (27017)

A Sample CSV Dataset for initial signup (must contain columns used by the model: CreditScore, Geography, Gender, Age, Tenure, Balance, NumOfProducts, HasCrCard, IsActiveMember, EstimatedSalary, and the target variable Exited).

Installation
Clone the repository:

Bash

git clone <repository-url>
cd ChurnGuard
Setup Python Backend (ML Server):

Bash

# Install Python dependencies
pip install -r requirements.txt 
# NOTE: You will need to create a requirements.txt file based on the Python imports (flask, pandas, scikit-learn, joblib, shap, numpy)
Setup Node.js Backend (API Gateway):

Bash

cd <project_root_directory>
npm install # Assuming your node dependencies are installed here
Setup Frontend (Client):

Bash

# Assuming the frontend is run from the root, or navigate to src/
npm install
Running the Project
You must run the three main components independently: MongoDB, the Node.js API, and the Python ML server.

Start MongoDB: Ensure your MongoDB server is running.

Start Python ML Server:

Bash

python app.py
# Server runs on http://127.0.0.1:5000
Start Node.js API Gateway:

Bash

node server.js
# Server runs on http://localhost:3000
Start React Frontend:

Bash

# Use your Vite or React script command, e.g., 
npm run dev
# Application runs on http://localhost:5173 (or similar port)
📝 Usage
Navigate to the running frontend URL (http://localhost:5173).

Click Sign Up and register your company.

Crucially: Upload your customer dataset (.csv) during the signup process. This triggers the initial model training.

Log in and explore the Dashboard, Performance, and Predictor pages!

🤝 Contribution
Contributions are welcome! Please feel free to open an issue or submit a pull request for new features, bug fixes, or improvements.

📄 License
Distributed under the MIT License. See the repository for details.