from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine
import shap
from sqlalchemy.engine import URL

load_dotenv()
print("===== MAIN.PY LOADED =====")

app = FastAPI(
    title="AI Credit Risk Assessment API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "https://credit-risk-assessment-system.vercel.app"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ==========================================================
# Model Directories
# ==========================================================

NEW_CUSTOMER_MODEL_DIR = os.path.join(
    BASE_DIR,
    "Credit_Risk_Model",
    "new_customer"
)

EXISTING_CUSTOMER_MODEL_DIR = os.path.join(
    BASE_DIR,
    "Credit_Risk_Model",
    "existing_customer"
)

# ==========================================================
# Load New Customer Model
# ==========================================================

new_customer_model = joblib.load(
    os.path.join(
        NEW_CUSTOMER_MODEL_DIR,
        "new_customer_model.pkl"
    )
)

new_customer_feature_names = joblib.load(
    os.path.join(
        NEW_CUSTOMER_MODEL_DIR,
        "new_customer_feature_names.pkl"
    )
)

new_customer_threshold = joblib.load(
    os.path.join(
        NEW_CUSTOMER_MODEL_DIR,
        "new_customer_threshold.pkl"
    )
)

# ==========================================================
# Load Existing Customer Model
# ==========================================================

existing_customer_model = joblib.load(
    os.path.join(
        EXISTING_CUSTOMER_MODEL_DIR,
        "existing_customer_model.pkl"
    )
)

existing_customer_feature_names = joblib.load(
    os.path.join(
        EXISTING_CUSTOMER_MODEL_DIR,
        "existing_customer_feature_names.pkl"
    )
)

existing_customer_threshold = joblib.load(
    os.path.join(
        EXISTING_CUSTOMER_MODEL_DIR,
        "existing_customer_threshold.pkl"
    )
)

# ==========================================================
# SHAP Explainer for Existing Customer Model
# ==========================================================

existing_customer_explainer = shap.TreeExplainer(existing_customer_model)

# ==========================================================
# SHAP Explainer for New Customer Model
# ==========================================================

new_customer_explainer = shap.TreeExplainer(new_customer_model)


# ==========================================================
# MySQL Database Connection
# ==========================================================

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

database_url = URL.create(
    drivername="mysql+mysqlconnector",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME
)

engine = create_engine(
    database_url,
    connect_args={
        "ssl_ca": os.path.join(BASE_DIR, "ca.pem"),
        "ssl_verify_cert": True
    }
)

existing_customer_threshold = joblib.load(
    os.path.join(
        EXISTING_CUSTOMER_MODEL_DIR,
        "existing_customer_threshold.pkl"
    )
)
from pydantic import BaseModel, Field

class CustomerData(BaseModel):

    # ==========================================================
    # Personal Information
    # ==========================================================

    CODE_GENDER: str = Field(
        ..., description="Gender (M/F)"
    )

    AGE_YEARS: int = Field(
        ..., ge=18, le=100,
        description="Customer Age"
    )

    CNT_CHILDREN: int = Field(
        ..., ge=0,
        description="Number of Children"
    )

    CNT_FAM_MEMBERS: int = Field(
        ..., ge=1,
        description="Total Family Members"
    )

    NAME_FAMILY_STATUS: str = Field(
        ..., description="Marital Status"
    )

    # ==========================================================
    # Employment
    # ==========================================================

    EMPLOYMENT_YEARS: float = Field(
        ..., ge=0,
        description="Employment Experience (Years)"
    )

    NAME_INCOME_TYPE: str = Field(
        ..., description="Income Type"
    )

    OCCUPATION_TYPE: str = Field(
        ..., description="Occupation Type"
    )

    ORGANIZATION_TYPE: str = Field(
        ..., description="Organization Type"
    )

    # ==========================================================
    # Financial
    # ==========================================================

    AMT_INCOME_TOTAL: float = Field(
        ..., gt=0,
        description="Annual Income"
    )

    AMT_CREDIT: float = Field(
        ..., gt=0,
        description="Requested Loan Amount"
    )

    AMT_ANNUITY: float = Field(
        ..., gt=0,
        description="Loan Annuity"
    )

    AMT_GOODS_PRICE: float = Field(
        ..., gt=0,
        description="Goods Price"
    )

    # ==========================================================
    # Property
    # ==========================================================

    FLAG_OWN_CAR: str = Field(
        ..., description="Owns a Car (Y/N)"
    )

    OWN_CAR_AGE: float = Field(
        ..., ge=0,
        description="Car Age (Years)"
    )

    FLAG_OWN_REALTY: str = Field(
        ..., description="Owns Real Estate (Y/N)"
    )

    NAME_HOUSING_TYPE: str = Field(
        ..., description="Housing Type"
    )

    # ==========================================================
    # Loan
    # ==========================================================

    NAME_CONTRACT_TYPE: str = Field(
        ..., description="Cash loans / Revolving loans"
    )
# ==========================================================
# Existing Customer Input
# ==========================================================

from pydantic import BaseModel, Field

class ExistingCustomerData(BaseModel):

    # Customer ID
    SK_ID_CURR: int = Field(..., gt=0, description="Existing Customer ID")

    # Updated Personal Information
    AGE_YEARS: int = Field(..., ge=18, le=100, description="Customer Age")

    EMPLOYMENT_YEARS: float = Field(
        ..., ge=0, description="Employment Experience (Years)"
    )

    # Updated Financial Information
    AMT_INCOME_TOTAL: float = Field(
        ..., gt=0, description="Annual Income"
    )

    # New Loan Details
    AMT_CREDIT: float = Field(
        ..., gt=0, description="Requested Loan Amount"
    )

    AMT_ANNUITY: float = Field(
        ..., gt=0, description="Loan Annuity"
    )

    AMT_GOODS_PRICE: float = Field(
        ..., gt=0, description="Goods Price"
    )

    NAME_CONTRACT_TYPE: str = Field(
        ..., description="Cash loans / Revolving loans"
    )
@app.get("/")
def home():
    return {
        "message": "Welcome to AI Credit Risk Assessment System"
    }


@app.post("/predict/new_customer")
def predict(data: CustomerData):

    # Create DataFrame from user input
    customer_input = pd.DataFrame([{
        "CODE_GENDER": data.CODE_GENDER,
        "AGE_YEARS": data.AGE_YEARS,
        "CNT_CHILDREN": data.CNT_CHILDREN,
        "CNT_FAM_MEMBERS": data.CNT_FAM_MEMBERS,
        "NAME_FAMILY_STATUS": data.NAME_FAMILY_STATUS,

        "EMPLOYMENT_YEARS": data.EMPLOYMENT_YEARS,
        "NAME_INCOME_TYPE": data.NAME_INCOME_TYPE,
        "OCCUPATION_TYPE": data.OCCUPATION_TYPE,
        "ORGANIZATION_TYPE": data.ORGANIZATION_TYPE,

        "AMT_INCOME_TOTAL": data.AMT_INCOME_TOTAL,
        "AMT_CREDIT": data.AMT_CREDIT,
        "AMT_ANNUITY": data.AMT_ANNUITY,
        "AMT_GOODS_PRICE": data.AMT_GOODS_PRICE,

        "FLAG_OWN_CAR": data.FLAG_OWN_CAR,
        "OWN_CAR_AGE": data.OWN_CAR_AGE,
        "FLAG_OWN_REALTY": data.FLAG_OWN_REALTY,
        "NAME_HOUSING_TYPE": data.NAME_HOUSING_TYPE,

        "NAME_CONTRACT_TYPE": data.NAME_CONTRACT_TYPE
    }])

    # Find categorical columns
    categorical_cols = customer_input.select_dtypes(include=["object"]).columns

    # One-Hot Encoding
    customer_input = pd.get_dummies(
        customer_input,
        columns=categorical_cols,
        drop_first=True,
        dtype="int8"
    )

    # Add missing columns
    for col in new_customer_feature_names:
        if col not in customer_input.columns:
            customer_input[col] = 0

    # Remove extra columns
    customer_input = customer_input.reindex(
    columns=new_customer_feature_names,
    fill_value=0
)

    # Predict probability
    default_probability = new_customer_model.predict_proba(customer_input)[0][1]

    # Apply saved threshold
    prediction = int(default_probability >= new_customer_threshold)

    # ==========================================================
    # Confidence Score
    # ==========================================================

    if prediction == 1:
      confidence = default_probability * 100
    else:
      confidence = (1 - default_probability) * 100

    # Risk Level
    if default_probability < 0.30:
        risk_level = "Low Risk"
    elif default_probability < 0.60:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    # Loan Decision
    if prediction == 0:
        loan_decision = "Approved"
    else:
        loan_decision = "Rejected"

    # ==========================================================
    # AI Recommendations
    # ==========================================================

    recommendations = []

    # Loan Decision
    if prediction == 0:
      recommendations.append("Customer is eligible for loan approval.")
    else:
      recommendations.append("Customer has a high probability of default.")

    # Income Analysis
    if data.AMT_INCOME_TOTAL >= 500000:
      recommendations.append("Customer has a strong annual income.")
    else:
      recommendations.append("Customer income is relatively low.")

    # Credit Analysis
    credit_income_ratio = data.AMT_CREDIT / data.AMT_INCOME_TOTAL

    if credit_income_ratio <= 5:
      recommendations.append("Requested loan amount is within a healthy range.")
    else:
      recommendations.append("Requested loan amount is high compared to income.")

    # Risk Analysis
    if risk_level == "Low Risk":
      recommendations.append("Overall financial risk is low.")
    elif risk_level == "Medium Risk":
      recommendations.append("Customer should be monitored carefully.")
    else:
      recommendations.append("Loan approval requires additional verification.")

    # Return Result
    return {
    "prediction": {
        "default_probability": round(float(default_probability), 4),
        "confidence": round(float(confidence), 2),
        "threshold": round(float(new_customer_threshold), 4),
        "prediction": prediction,
        "loan_decision": loan_decision,
        "risk_level": risk_level
    },

    "recommendations": recommendations
}

# ==========================================================
# Existing Customer Prediction
# ==========================================================
@app.post("/predict/existing_customer")
def predict_existing_customer(data: ExistingCustomerData):

    # ==========================================================
    # Fetch Customer from Database
    # ==========================================================

    query = """
    SELECT *
    FROM final_credit_risk_dataset
    WHERE SK_ID_CURR = %(customer_id)s
    """

    try:
        customer = pd.read_sql(
            query,
            engine,
            params={"customer_id": data.SK_ID_CURR}
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database Error: {str(e)}"
        )

    # ==========================================================
    # Customer Not Found
    # ==========================================================

    if customer.empty:
        raise HTTPException(
            status_code=404,
            detail=f"Customer ID {data.SK_ID_CURR} not found."
        )

    # ==========================================================
    # Update Latest Customer Information
    # ==========================================================

    customer.loc[0, "AGE_YEARS"] = data.AGE_YEARS
    customer.loc[0, "EMPLOYMENT_YEARS"] = data.EMPLOYMENT_YEARS
    customer.loc[0, "AMT_INCOME_TOTAL"] = data.AMT_INCOME_TOTAL

    customer.loc[0, "AMT_CREDIT"] = data.AMT_CREDIT
    customer.loc[0, "AMT_ANNUITY"] = data.AMT_ANNUITY
    customer.loc[0, "AMT_GOODS_PRICE"] = data.AMT_GOODS_PRICE

    customer.loc[0, "NAME_CONTRACT_TYPE"] = data.NAME_CONTRACT_TYPE

    # ==========================================================
    # Remove Target Column
    # ==========================================================

    customer = customer.drop(columns=["TARGET"])

    # ==========================================================
    # One-Hot Encoding
    # ==========================================================

    categorical_cols = customer.select_dtypes(include=["object"]).columns

    customer = pd.get_dummies(
        customer,
        columns=categorical_cols,
        drop_first=True,
        dtype="int8"
    )

    # ==========================================================
    # Add Missing Columns
    # ==========================================================

    for col in existing_customer_feature_names:
        if col not in customer.columns:
            customer[col] = 0

    # ==========================================================
    # Arrange Feature Order
    # ==========================================================

    customer = customer.reindex(
        columns=existing_customer_feature_names,
        fill_value=0
    )

    # ==========================================================
    # Prediction
    # ==========================================================

    default_probability = existing_customer_model.predict_proba(customer)[0][1]

    # ==========================================================
    # SHAP Values
    # ==========================================================

    shap_values = existing_customer_explainer(customer)

   

    # ==========================================================
    # Feature Importance
    # ==========================================================

    feature_importance = pd.DataFrame({
    "feature": customer.columns,
    "impact": shap_values.values[0]
})

    feature_importance["abs_impact"] = feature_importance["impact"].abs()

    feature_importance = feature_importance.sort_values(
    by="abs_impact",
    ascending=False
)

    top_features = feature_importance.head(5)

    top_features = top_features[
    ["feature", "impact"]
    ].to_dict(orient="records")


    prediction = int(
        default_probability >= existing_customer_threshold
    )
    # ==========================================================
    # Confidence Score
    # ==========================================================

    if prediction == 1:
      confidence = default_probability * 100
    else:
      confidence = (1 - default_probability) * 100
    # ==========================================================
    # Risk Level
    # ==========================================================

    if default_probability < 0.30:
        risk_level = "Low Risk"
    elif default_probability < 0.60:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    # ==========================================================
    # Loan Decision
    # ==========================================================

    if prediction == 0:
        loan_decision = "Approved"
    else:
        loan_decision = "Rejected"

    # ==========================================================
# AI Recommendations
# ==========================================================

    recommendations = []

# Loan Decision
    if prediction == 0:
      recommendations.append("Customer is eligible for loan approval.")
    else:
      recommendations.append("Customer has a high probability of default.")

# Income Analysis
    if data.AMT_INCOME_TOTAL >= 500000:
      recommendations.append("Customer has a strong annual income.")
    else:
      recommendations.append("Customer income is relatively low.")

# Credit Analysis
    credit_income_ratio = data.AMT_CREDIT / data.AMT_INCOME_TOTAL

    if credit_income_ratio <= 5:
      recommendations.append("Requested loan amount is within a healthy range.")
    else:
      recommendations.append("Requested loan amount is high compared to income.")

# Risk Analysis
    if risk_level == "Low Risk":
      recommendations.append("Overall financial risk is low.")
    elif risk_level == "Medium Risk":
      recommendations.append("Customer should be monitored carefully.")
    else:
      recommendations.append("Loan approval requires additional verification.")

        

    # ==========================================================
    # Response
    # ==========================================================

    return {
    "customer": {
        "customer_id": int(data.SK_ID_CURR)
    },

    "prediction": {
        "default_probability": round(float(default_probability), 4),
        "confidence": round(float(confidence), 2),
        "threshold": round(float(existing_customer_threshold), 4),
        "prediction": prediction,
        "loan_decision": loan_decision,
        "risk_level": risk_level
    },

    "recommendations": recommendations,

    "shap": {
    "top_features": top_features
}
}