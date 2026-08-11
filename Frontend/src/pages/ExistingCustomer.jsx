import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ExistingCustomer.css";

function ExistingCustomer() {
  const [formData, setFormData] = useState({
    SK_ID_CURR: "",
    AGE_YEARS: "",
    EMPLOYMENT_YEARS: "",
    AMT_INCOME_TOTAL: "",
    AMT_CREDIT: "",
    AMT_ANNUITY: "",
    AMT_GOODS_PRICE: "",
    NAME_CONTRACT_TYPE: "Cash loans"
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErrorMessage("");
  }

  async function handlePredict() {
    setErrorMessage("");

    // Basic validation
    if (
      !formData.SK_ID_CURR ||
      !formData.AGE_YEARS ||
      !formData.EMPLOYMENT_YEARS ||
      !formData.AMT_INCOME_TOTAL ||
      !formData.AMT_CREDIT ||
      !formData.AMT_ANNUITY ||
      !formData.AMT_GOODS_PRICE
    ) {
      setErrorMessage("Please fill in all customer details before continuing.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/predict/existing_customer",
        {
          SK_ID_CURR: Number(formData.SK_ID_CURR),
          AGE_YEARS: Number(formData.AGE_YEARS),
          EMPLOYMENT_YEARS: Number(formData.EMPLOYMENT_YEARS),
          AMT_INCOME_TOTAL: Number(formData.AMT_INCOME_TOTAL),
          AMT_CREDIT: Number(formData.AMT_CREDIT),
          AMT_ANNUITY: Number(formData.AMT_ANNUITY),
          AMT_GOODS_PRICE: Number(formData.AMT_GOODS_PRICE),
          NAME_CONTRACT_TYPE: formData.NAME_CONTRACT_TYPE
        }
      );

      console.log("Prediction response:", response.data);

      navigate("/dashboard", {
        state: {
          ...response.data,
          input: formData
        }
      });

    } catch (error) {
      console.error("Prediction error:", error);

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
        setErrorMessage(`Request Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="existing-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="existing-sidebar">

        <div className="existing-brand">

          <div className="brand-icon">
            AI
          </div>

          <div>
            <h2>CreditAI</h2>
            <span>Risk Intelligence</span>
          </div>

        </div>


        <nav className="existing-nav">

          <div
            className="existing-nav-item"
            onClick={() => navigate("/")}
          >
            <span>⌂</span>
            Home
          </div>


          <div className="existing-nav-item active">

            <span>◉</span>
            Existing Customer

          </div>


          <div
            className="existing-nav-item"
            onClick={() => navigate("/new")}
          >
            <span>＋</span>
            New Customer
          </div>

        </nav>


        <div className="existing-system-status">

          <span className="status-dot"></span>

          <div>
            <strong>AI System</strong>
            <small>Online</small>
          </div>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="existing-main">

        {/* HEADER */}

        <header className="existing-header">

          <div>

            <p className="existing-eyebrow">
              CREDIT RISK ASSESSMENT
            </p>

            <h1>
              Existing Customer
            </h1>

            <p className="existing-subtitle">
              Enter customer information to generate an
              AI-powered credit risk assessment.
            </p>

          </div>


          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/")}
          >
            ← Back Home
          </button>

        </header>


        {/* CUSTOMER IDENTIFICATION */}

        <section className="customer-info-card">

          <div className="customer-info-icon">
            ID
          </div>

          <div>

            <span>
              CUSTOMER IDENTIFICATION
            </span>

            <h2>
              Existing Customer Profile
            </h2>

            <p>
              Use the customer's existing application ID
              to retrieve their credit-risk assessment.
            </p>

          </div>

        </section>


        {/* FORM */}

        <section className="customer-form-card">

          <div className="form-section-header">

            <div>

              <span className="form-label">
                CUSTOMER INFORMATION
              </span>

              <h2>
                Personal & Financial Details
              </h2>

            </div>

          </div>


          <div className="form-grid">

            {/* CUSTOMER ID */}

            <div className="form-group">

              <label>
                Customer ID
              </label>

              <input
                type="number"
                name="SK_ID_CURR"
                placeholder="e.g. 100003"
                value={formData.SK_ID_CURR}
                onChange={handleChange}
              />

              <span className="input-help">
                Existing application/customer identifier
              </span>

            </div>


            {/* AGE */}

            <div className="form-group">

              <label>
                Age
              </label>

              <div className="input-with-unit">

                <input
                  type="number"
                  name="AGE_YEARS"
                  placeholder="e.g. 35"
                  value={formData.AGE_YEARS}
                  onChange={handleChange}
                />

                <span>
                  years
                </span>

              </div>

            </div>


            {/* EMPLOYMENT */}

            <div className="form-group">

              <label>
                Employment Experience
              </label>

              <div className="input-with-unit">

                <input
                  type="number"
                  name="EMPLOYMENT_YEARS"
                  placeholder="e.g. 8"
                  value={formData.EMPLOYMENT_YEARS}
                  onChange={handleChange}
                />

                <span>
                  years
                </span>

              </div>

            </div>


            {/* CONTRACT TYPE */}

            <div className="form-group">

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


            {/* ANNUAL INCOME */}

            <div className="form-group">

              <label>
                Annual Income
              </label>

              <div className="input-with-unit">

                <span className="currency">
                  ₹
                </span>

                <input
                  type="number"
                  name="AMT_INCOME_TOTAL"
                  placeholder="e.g. 180000"
                  value={formData.AMT_INCOME_TOTAL}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* CREDIT */}

            <div className="form-group">

              <label>
                Requested Credit
              </label>

              <div className="input-with-unit">

                <span className="currency">
                  ₹
                </span>

                <input
                  type="number"
                  name="AMT_CREDIT"
                  placeholder="e.g. 450000"
                  value={formData.AMT_CREDIT}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* ANNUITY */}

            <div className="form-group">

              <label>
                Loan Annuity
              </label>

              <div className="input-with-unit">

                <span className="currency">
                  ₹
                </span>

                <input
                  type="number"
                  name="AMT_ANNUITY"
                  placeholder="e.g. 25000"
                  value={formData.AMT_ANNUITY}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* GOODS PRICE */}

            <div className="form-group">

              <label>
                Goods Price
              </label>

              <div className="input-with-unit">

                <span className="currency">
                  ₹
                </span>

                <input
                  type="number"
                  name="AMT_GOODS_PRICE"
                  placeholder="e.g. 400000"
                  value={formData.AMT_GOODS_PRICE}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>


          {/* ERROR */}

          {errorMessage && (

            <div className="form-error">

              <span>!</span>

              <p>
                {errorMessage}
              </p>

            </div>

          )}


          {/* ACTION */}

          <div className="form-actions">

            <button
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>


            <button
              className="predict-btn"
              onClick={handlePredict}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="loading-spinner"></span>
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

        <footer className="existing-footer">

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

export default ExistingCustomer;