import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/NewCustomer.css";

function NewCustomer() {

  const [formData, setFormData] = useState({
    CODE_GENDER: "M",
    AGE_YEARS: "",
    CNT_CHILDREN: "",
    CNT_FAM_MEMBERS: "",
    NAME_FAMILY_STATUS: "",
    EMPLOYMENT_YEARS: "",
    NAME_INCOME_TYPE: "",
    OCCUPATION_TYPE: "",
    ORGANIZATION_TYPE: "",
    AMT_INCOME_TOTAL: "",
    AMT_CREDIT: "",
    AMT_ANNUITY: "",
    AMT_GOODS_PRICE: "",
    FLAG_OWN_CAR: "N",
    OWN_CAR_AGE: "",
    FLAG_OWN_REALTY: "Y",
    NAME_HOUSING_TYPE: "",
    NAME_CONTRACT_TYPE: "Cash loans"
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  function handleChange(e) {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErrorMessage("");
  }


  // =====================================================
  // PREDICT
  // =====================================================

  async function handlePredict() {

    setErrorMessage("");

    // Basic validation
    const requiredFields = [
      "AGE_YEARS",
      "CNT_CHILDREN",
      "CNT_FAM_MEMBERS",
      "NAME_FAMILY_STATUS",
      "EMPLOYMENT_YEARS",
      "NAME_INCOME_TYPE",
      "OCCUPATION_TYPE",
      "ORGANIZATION_TYPE",
      "AMT_INCOME_TOTAL",
      "AMT_CREDIT",
      "AMT_ANNUITY",
      "AMT_GOODS_PRICE",
      "OWN_CAR_AGE",
      "NAME_HOUSING_TYPE"
    ];

    const missingField = requiredFields.some(
      (field) => !formData[field]
    );

    if (missingField) {

      setErrorMessage(
        "Please fill in all required customer details before continuing."
      );

      return;
    }
    // Age validation
const age = Number(formData.AGE_YEARS);

if (age < 18 || age > 100) {
    setErrorMessage("Age must be between 18 and 100 years.");
    return;
}

// Employment validation
const employmentYears = Number(formData.EMPLOYMENT_YEARS);

if (employmentYears > age - 18) {
    setErrorMessage(
        "Employment experience cannot be greater than the number of years since adulthood."
    );
    return;
}

// Financial validation

const income = Number(formData.AMT_INCOME_TOTAL);
const credit = Number(formData.AMT_CREDIT);
const annuity = Number(formData.AMT_ANNUITY);
const goodsPrice = Number(formData.AMT_GOODS_PRICE);

if (income <= 0) {
    setErrorMessage("Annual income must be greater than 0.");
    return;
}

if (credit <= 0) {
    setErrorMessage("Requested credit must be greater than 0.");
    return;
}

if (annuity <= 0) {
    setErrorMessage("Loan annuity must be greater than 0.");
    return;
}

if (goodsPrice <= 0) {
    setErrorMessage("Goods price must be greater than 0.");
    return;
}

// Other validations

const children = Number(formData.CNT_CHILDREN);
const familyMembers = Number(formData.CNT_FAM_MEMBERS);
const carAge = Number(formData.OWN_CAR_AGE);

if (children < 0) {
    setErrorMessage("Number of children cannot be negative.");
    return;
}

if (familyMembers < 1) {
    setErrorMessage("Family members must be at least 1.");
    return;
}

if (carAge < 0) {
    setErrorMessage("Car age cannot be negative.");
    return;
}


    try {

      setLoading(true);


      const response = await axios.post(
        "http://127.0.0.1:8000/predict/new_customer",
        {
          CODE_GENDER: formData.CODE_GENDER,

          AGE_YEARS: Number(formData.AGE_YEARS),

          CNT_CHILDREN: Number(
            formData.CNT_CHILDREN
          ),

          CNT_FAM_MEMBERS: Number(
            formData.CNT_FAM_MEMBERS
          ),

          NAME_FAMILY_STATUS:
            formData.NAME_FAMILY_STATUS,

          EMPLOYMENT_YEARS: Number(
            formData.EMPLOYMENT_YEARS
          ),

          NAME_INCOME_TYPE:
            formData.NAME_INCOME_TYPE,

          OCCUPATION_TYPE:
            formData.OCCUPATION_TYPE,

          ORGANIZATION_TYPE:
            formData.ORGANIZATION_TYPE,

          AMT_INCOME_TOTAL: Number(
            formData.AMT_INCOME_TOTAL
          ),

          AMT_CREDIT: Number(
            formData.AMT_CREDIT
          ),

          AMT_ANNUITY: Number(
            formData.AMT_ANNUITY
          ),

          AMT_GOODS_PRICE: Number(
            formData.AMT_GOODS_PRICE
          ),

          FLAG_OWN_CAR:
            formData.FLAG_OWN_CAR,

          OWN_CAR_AGE: Number(
            formData.OWN_CAR_AGE
          ),

          FLAG_OWN_REALTY:
            formData.FLAG_OWN_REALTY,

          NAME_HOUSING_TYPE:
            formData.NAME_HOUSING_TYPE,

          NAME_CONTRACT_TYPE:
            formData.NAME_CONTRACT_TYPE
        }
      );


      console.log(
        "New customer prediction:",
        response.data
      );


      // Send result to Dashboard
      navigate("/dashboard", {

        state: {
          ...response.data,

          input: formData,

          customer: {
            customer_id: "NEW"
          }

        }

      });


    } catch (error) {

      console.error(
        "New customer prediction error:",
        error
      );


      if (error.response) {

        setErrorMessage(
          `Backend Error (${error.response.status}): ${
            typeof error.response.data === "string"
              ? error.response.data
              : JSON.stringify(error.response.data)
          }`
        );

      } else if (error.request) {

        setErrorMessage(
          "Unable to connect to FastAPI. Please make sure the backend server is running."
        );

      } else {

        setErrorMessage(
          `Request Error: ${error.message}`
        );

      }

    } finally {

      setLoading(false);

    }

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="new-page">


      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="new-sidebar">


        <div className="new-brand">

          <div className="brand-icon">
            AI
          </div>

          <div>

            <h2>
              CreditAI
            </h2>

            <span>
              Risk Intelligence
            </span>

          </div>

        </div>


        <nav className="new-nav">


          <div
            className="new-nav-item"
            onClick={() => navigate("/")}
          >
            <span>⌂</span>
            Home
          </div>


          <div
            className="new-nav-item"
            onClick={() => navigate("/existing")}
          >
            <span>◉</span>
            Existing Customer
          </div>


          <div className="new-nav-item active">

            <span>＋</span>
            New Customer

          </div>


        </nav>


        <div className="new-system-status">

          <span className="status-dot"></span>

          <div>

            <strong>
              AI System
            </strong>

            <small>
              Online
            </small>

          </div>

        </div>


      </aside>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="new-main">


        {/* HEADER */}

        <header className="new-header">


          <div>

            <p className="new-eyebrow">
              CREDIT RISK ASSESSMENT
            </p>


            <h1>
              New Customer
            </h1>


            <p className="new-subtitle">
              Enter customer information to generate
              an AI-powered credit risk assessment.
            </p>

          </div>


          <button
            className="new-back-btn"
            onClick={() => navigate("/")}
          >
            ← Back Home
          </button>


        </header>


        {/* INTRO CARD */}

        <section className="new-intro-card">


          <div className="new-intro-icon">
            AI
          </div>


          <div>

            <span>
              NEW CUSTOMER ASSESSMENT
            </span>

            <h2>
              Create Customer Risk Profile
            </h2>

            <p>
              Provide the customer's personal,
              employment, financial and property
              information for risk analysis.
            </p>

          </div>


        </section>


        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <section className="new-form-card">


          {/* PERSONAL */}

          <div className="new-form-section">

            <div className="new-section-heading">

              <span>
                01
              </span>

              <div>

                <h2>
                  Personal Information
                </h2>

                <p>
                  Basic information about the customer
                </p>

              </div>

            </div>


            <div className="new-form-grid">


              {/* Gender */}

              <div className="new-form-group">

                <label>
                  Gender
                </label>

                <select
                  name="CODE_GENDER"
                  value={formData.CODE_GENDER}
                  onChange={handleChange}
                >

                  <option value="M">
                    Male
                  </option>

                  <option value="F">
                    Female
                  </option>

                </select>

              </div>


              {/* Age */}

              <div className="new-form-group">

                <label>
                  Age
                </label>

                <div className="new-input-unit">

                  <input
                    type="number"
                    name="AGE_YEARS"
                    min="18"
                    max="100"
                    placeholder="e.g. 35"
                    value={formData.AGE_YEARS}
                    onChange={handleChange}
                  />

                  <span>
                    years
                  </span>

                </div>

              </div>


              {/* Children */}

              <div className="new-form-group">

                <label>
                  Number of Children
                </label>

                <input
                  type="number"
                  name="CNT_CHILDREN"
                  min="0"
                  placeholder="e.g. 2"
                  value={formData.CNT_CHILDREN}
                  onChange={handleChange}
                />

              </div>


              {/* Family */}

              <div className="new-form-group">

                <label>
                  Family Members
                </label>

                <input
                  type="number"
                  name="CNT_FAM_MEMBERS"
                  min="1"
                  placeholder="e.g. 4"
                  value={formData.CNT_FAM_MEMBERS}
                  onChange={handleChange}
                />

              </div>


              {/* Family status */}

<div className="new-form-group">

    <label>
        Family Status
    </label>

    <select
        name="NAME_FAMILY_STATUS"
        value={formData.NAME_FAMILY_STATUS}
        onChange={handleChange}
    >
        <option value="">Select Family Status</option>
        <option value="Married">Married</option>
        <option value="Single / not married">
            Single / not married
        </option>
        <option value="Civil marriage">
            Civil marriage
        </option>
        <option value="Separated">
            Separated
        </option>
        <option value="Widow">
            Widow
        </option>
        <option value="Unknown">
            Unknown
        </option>
    </select>

</div>


            </div>

          </div>


          {/* EMPLOYMENT */}

          <div className="new-form-section">

            <div className="new-section-heading">

              <span>
                02
              </span>

              <div>

                <h2>
                  Employment Information
                </h2>

                <p>
                  Customer employment and income source
                </p>

              </div>

            </div>


            <div className="new-form-grid">


              {/* Employment */}

              <div className="new-form-group">

                <label>
                  Employment Experience
                </label>

                <div className="new-input-unit">

                  <input
                    type="number"
                    name="EMPLOYMENT_YEARS"
                    min="0"
                    placeholder="e.g. 8"
                    value={formData.EMPLOYMENT_YEARS}
                    onChange={handleChange}
                  />

                  <span>
                    years
                  </span>

                </div>

              </div>


             <div className="new-form-group">

    <label>
        Income Type
    </label>

    <select
        name="NAME_INCOME_TYPE"
        value={formData.NAME_INCOME_TYPE}
        onChange={handleChange}
    >
        <option value="">Select Income Type</option>

        <option value="Working">
            Working
        </option>

        <option value="Commercial associate">
            Commercial associate
        </option>

        <option value="Pensioner">
            Pensioner
        </option>

        <option value="State servant">
            State servant
        </option>

        <option value="Student">
            Student
        </option>

        <option value="Businessman">
            Businessman
        </option>

        <option value="Maternity leave">
            Maternity leave
        </option>

        <option value="Unemployed">
            Unemployed
        </option>

    </select>

</div>

              <div className="new-form-group">

    <label>
        Occupation Type
    </label>

    <select
        name="OCCUPATION_TYPE"
        value={formData.OCCUPATION_TYPE}
        onChange={handleChange}
    >
        <option value="">Select Occupation</option>

        <option value="Laborers">Laborers</option>
        <option value="Core staff">Core staff</option>
        <option value="Managers">Managers</option>
        <option value="Drivers">Drivers</option>
        <option value="Sales staff">Sales staff</option>
        <option value="High skill tech staff">
            High skill tech staff
        </option>
        <option value="Accountants">Accountants</option>
        <option value="Medicine staff">Medicine staff</option>
        <option value="Security staff">Security staff</option>
        <option value="Cooking staff">Cooking staff</option>
        <option value="Cleaning staff">Cleaning staff</option>
        <option value="Private service staff">
            Private service staff
        </option>
        <option value="Low-skill Laborers">
            Low-skill Laborers
        </option>
        <option value="Secretaries">Secretaries</option>
        <option value="Waiters/barmen staff">
            Waiters/barmen staff
        </option>
        <option value="Realty agents">Realty agents</option>
        <option value="HR staff">HR staff</option>
        <option value="IT staff">IT staff</option>
    </select>

</div>


              <div className="new-form-group">

    <label>
        Organization Type
    </label>

    <select
        name="ORGANIZATION_TYPE"
        value={formData.ORGANIZATION_TYPE}
        onChange={handleChange}
    >
        <option value="">Select Organization Type</option>

        <option value="Business Entity Type 3">
            Business Entity Type 3
        </option>
        <option value="Business Entity Type 2">
            Business Entity Type 2
        </option>
        <option value="Government">
            Government
        </option>
        <option value="Medicine">
            Medicine
        </option>
        <option value="School">
            School
        </option>
        <option value="Transport: type 3">
            Transport: type 3
        </option>
        <option value="XNA">
            XNA
        </option>
        <option value="Self-employed">
            Self-employed
        </option>
        <option value="Other">
            Other
        </option>
    </select>

</div>


            </div>

          </div>


          {/* FINANCIAL */}

          <div className="new-form-section">

            <div className="new-section-heading">

              <span>
                03
              </span>

              <div>

                <h2>
                  Financial Information
                </h2>

                <p>
                  Income and requested loan details
                </p>

              </div>

            </div>


            <div className="new-form-grid">


              {/* Income */}

              <div className="new-form-group">

                <label>
                  Annual Income
                </label>

                <div className="new-input-unit currency-unit">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="AMT_INCOME_TOTAL"
                    min="0"
                    placeholder="e.g. 500000"
                    value={formData.AMT_INCOME_TOTAL}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* Credit */}

              <div className="new-form-group">

                <label>
                  Requested Credit
                </label>

                <div className="new-input-unit currency-unit">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="AMT_CREDIT"
                    min="0"
                    placeholder="e.g. 1000000"
                    value={formData.AMT_CREDIT}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* Annuity */}

              <div className="new-form-group">

                <label>
                  Loan Annuity
                </label>

                <div className="new-input-unit currency-unit">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="AMT_ANNUITY"
                    min="0"
                    placeholder="e.g. 25000"
                    value={formData.AMT_ANNUITY}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* Goods */}

              <div className="new-form-group">

                <label>
                  Goods Price
                </label>

                <div className="new-input-unit currency-unit">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="AMT_GOODS_PRICE"
                    min="0"
                    placeholder="e.g. 900000"
                    value={formData.AMT_GOODS_PRICE}
                    onChange={handleChange}
                  />

                </div>

              </div>


            </div>

          </div>


          {/* PROPERTY */}

          <div className="new-form-section">

            <div className="new-section-heading">

              <span>
                04
              </span>

              <div>

                <h2>
                  Property & Housing
                </h2>

                <p>
                  Customer assets and housing information
                </p>

              </div>

            </div>


            <div className="new-form-grid">


              {/* Car */}

              <div className="new-form-group">

                <label>
                  Owns a Car
                </label>

                <select
                  name="FLAG_OWN_CAR"
                  value={formData.FLAG_OWN_CAR}
                  onChange={handleChange}
                >

                  <option value="N">
                    No
                  </option>

                  <option value="Y">
                    Yes
                  </option>

                </select>

              </div>


              {/* Car age */}

              <div className="new-form-group">

                <label>
                  Car Age
                </label>

                <div className="new-input-unit">

                  <input
                    type="number"
                    name="OWN_CAR_AGE"
                    min="0"
                    placeholder="e.g. 5"
                    value={formData.OWN_CAR_AGE}
                    onChange={handleChange}
                  />

                  <span>
                    years
                  </span>

                </div>

              </div>


              {/* Realty */}

              <div className="new-form-group">

                <label>
                  Owns Real Estate
                </label>

                <select
                  name="FLAG_OWN_REALTY"
                  value={formData.FLAG_OWN_REALTY}
                  onChange={handleChange}
                >

                  <option value="Y">
                    Yes
                  </option>

                  <option value="N">
                    No
                  </option>

                </select>

              </div>


              <div className="new-form-group">

    <label>
        Housing Type
    </label>

    <select
        name="NAME_HOUSING_TYPE"
        value={formData.NAME_HOUSING_TYPE}
        onChange={handleChange}
    >
        <option value="">
            Select Housing Type
        </option>

        <option value="House / apartment">
            House / apartment
        </option>

        <option value="With parents">
            With parents
        </option>

        <option value="Municipal apartment">
            Municipal apartment
        </option>

        <option value="Rented apartment">
            Rented apartment
        </option>

        <option value="Office apartment">
            Office apartment
        </option>

        <option value="Co-op apartment">
            Co-op apartment
        </option>
    </select>

</div>

            </div>

          </div>


          {/* LOAN */}

          <div className="new-form-section">

            <div className="new-section-heading">

              <span>
                05
              </span>

              <div>

                <h2>
                  Loan Information
                </h2>

                <p>
                  Select the requested loan type
                </p>

              </div>

            </div>


            <div className="new-form-grid">


              <div className="new-form-group">

                <label>
                  Contract Type
                </label>

                <select
                  name="NAME_CONTRACT_TYPE"
                  value={formData.NAME_CONTRACT_TYPE}
                  onChange={handleChange}
                >

                  <option value="Cash loans">
                    Cash loans
                  </option>

                  <option value="Revolving loans">
                    Revolving loans
                  </option>

                </select>

              </div>


            </div>

          </div>


          {/* ERROR */}

          {errorMessage && (

            <div className="new-form-error">

              <span>
                !
              </span>

              <p>
                {errorMessage}
              </p>

            </div>

          )}


          {/* ACTIONS */}

          <div className="new-form-actions">


            <button
              className="new-cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>


            <button
              className="new-predict-btn"
              onClick={handlePredict}
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="new-spinner"></span>
                  Analyzing Customer...
                </>

              ) : (

                <>
                  Predict Credit Risk →
                </>

              )}

            </button>


          </div>


        </section>


        {/* FOOTER */}

        <footer className="new-footer">

          <span>
            CreditAI Risk Intelligence
          </span>

          <span>
            Powered by Machine Learning + Explainable AI
          </span>

        </footer>


      </main>

    </div>
  );
}

export default NewCustomer;