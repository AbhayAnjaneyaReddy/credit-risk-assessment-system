# AI-Powered Credit Risk Assessment System

An end-to-end machine learning application that evaluates customer credit risk and provides loan approval recommendations with explainable AI.

The system supports both **existing customers** using historical customer data and **new customers** using information entered through the application.

## 🚀 Live Demo

**Frontend:** https://credit-risk-assessment-system.vercel.app

**Backend API:** https://credit-risk-api-4o5i.onrender.com

**API Documentation:** https://credit-risk-api-4o5i.onrender.com/docs

> Note: The Existing Customer prediction feature requires the Aiven MySQL database to be running.

## 📌 Project Overview

Credit risk assessment is the process of determining the likelihood that a customer may fail to repay a loan.

This project uses machine learning to analyze customer financial, employment, demographic, and loan-related information and produces:

* Default probability
* Confidence score
* Loan approval/rejection decision
* Risk level
* Key factors influencing the prediction
* Personalized recommendations

The application also uses **SHAP (SHapley Additive exPlanations)** to make the machine learning predictions more interpretable.

## ✨ Key Features

### New Customer Assessment

Users can enter information about a new customer, including:

* Age
* Gender
* Family information
* Employment
* Income
* Requested credit
* Loan annuity
* Goods price
* Vehicle ownership
* Property ownership
* Housing type
* Contract type

The information is sent to the deployed FastAPI backend and processed by the machine learning model.

### Existing Customer Assessment

Existing customers can be evaluated using their customer/application ID along with required loan information.

The backend retrieves the customer's information from the MySQL database before generating the risk assessment.

### Explainable AI

The system uses SHAP to identify the features that have the largest influence on the prediction.

Example:

```text
Feature: AVG_PREVIOUS_ANNUITY
Impact: -0.3475

Feature: EXT_SOURCE_2
Impact: -0.3240
```

This helps users understand **why** the model produced a particular prediction rather than only showing the final result.

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │       Vercel         │
                    │   React Frontend     │
                    └──────────┬───────────┘
                               │
                               │ HTTP / Axios
                               ▼
                    ┌──────────────────────┐
                    │       Render         │
                    │   FastAPI Backend    │
                    │                      │
                    │  ML Model + SHAP     │
                    └──────────┬───────────┘
                               │
                         Existing Customer
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Aiven          │
                    │      MySQL           │
                    └──────────────────────┘
```

### Technology Flow

**Frontend**

React → Axios → FastAPI API

**Backend**

FastAPI → Data Processing → ML Model → SHAP → Prediction

**Existing Customer**

FastAPI → Aiven MySQL → Customer Data → ML Model → Prediction

## 🤖 Machine Learning

The project uses the Home Credit Default Risk dataset for credit-risk modeling.

The machine learning workflow included:

1. Data understanding
2. Data cleaning
3. Exploratory Data Analysis
4. Feature engineering
5. Database integration
6. Model training
7. Model evaluation
8. Threshold tuning
9. SHAP explainability
10. API deployment

### Models Evaluated

* Logistic Regression
* Random Forest
* XGBoost

The final model was selected based on its predictive performance and suitability for the credit-risk classification task.

## 🔍 Feature Engineering

Additional customer-level features were created from historical bureau information.

Examples include:

* `TOTAL_PREVIOUS_LOANS`
* `ACTIVE_LOANS`
* `TOTAL_DEBT`
* `TOTAL_CREDIT_SUM`
* `MAX_OVERDUE`

These aggregated features were joined with the main customer application data using the customer identifier.

## 🎯 Prediction Output

The API returns information such as:

```json
{
  "prediction": {
    "default_probability": 0.0999,
    "confidence": 90.01,
    "threshold": 0.65,
    "prediction": 0,
    "loan_decision": "Approved",
    "risk_level": "Low Risk"
  }
}
```

The application converts the model output into an easy-to-understand credit-risk assessment.

## 🗄️ Database

The project uses **MySQL** for storing and retrieving customer-related information.

The production database is hosted on **Aiven**.

The Existing Customer workflow uses the customer/application ID to retrieve the required information before performing the prediction.

Database credentials are stored using environment variables rather than being hard-coded into the application.

## ⚡ Backend API

The backend is developed using **FastAPI**.

Main prediction endpoints include:

```text
POST /predict/new_customer
POST /predict/existing_customer
```

Interactive API documentation is available through Swagger UI:

https://credit-risk-api-4o5i.onrender.com/docs

## 🎨 Frontend

The frontend is developed using:

* React
* Vite
* Axios
* React Router
* Recharts

The interface contains:

* Landing page
* Home page
* New Customer assessment
* Existing Customer assessment
* Prediction dashboard
* Risk visualization
* Model explanation

## ☁️ Deployment

### Frontend

Deployed using:

**Vercel**

### Backend

Deployed using:

**Render**

### Database

Hosted using:

**Aiven MySQL**

### Source Control

**GitHub**

## 📁 Project Structure

```text
Credit_Risk_Assessment_System/
│
├── api/
│   └── main.py
│
├── Credit_Risk_Model/
│   ├── existing_customer/
│   │   ├── existing_customer_model.pkl
│   │   ├── existing_customer_feature_names.pkl
│   │   └── existing_customer_threshold.pkl
│   │
│   └── new_customer/
│       ├── new_customer_model.pkl
│       ├── new_customer_feature_names.pkl
│       └── new_customer_threshold.pkl
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── Dashboard.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Notebooks/
│   └── Major_project.ipynb
│
├── ca.pem
├── requirements.txt
├── .gitignore
└── README.md
```

## 🛠️ Technologies Used

| Category            | Technologies          |
| ------------------- | --------------------- |
| Programming         | Python, JavaScript    |
| Frontend            | React, Vite           |
| Backend             | FastAPI               |
| Machine Learning    | Scikit-learn, XGBoost |
| Explainable AI      | SHAP                  |
| Data Processing     | Pandas, NumPy         |
| Database            | MySQL                 |
| Cloud Database      | Aiven                 |
| Backend Deployment  | Render                |
| Frontend Deployment | Vercel                |
| API Communication   | Axios                 |
| Visualization       | Recharts              |
| Version Control     | Git, GitHub           |

## 🔐 Security

Sensitive credentials such as database passwords and connection secrets are stored using environment variables.

Environment files and local database files are excluded from Git using `.gitignore`.

## 💻 Running Locally

### Backend

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn api.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Move into the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## 🔮 Future Improvements

Possible future improvements include:

* More advanced model monitoring
* Automated model retraining
* Additional financial data sources
* Improved risk visualization
* Authentication and role-based access
* Production database optimization
* Model performance monitoring
* Automated CI/CD pipeline

## 👨‍💻 Project

**AI-Powered Credit Risk Assessment System**

An end-to-end machine learning project combining **machine learning, explainable AI, SQL, FastAPI, React, and cloud deployment** to build a complete credit-risk assessment platform.
