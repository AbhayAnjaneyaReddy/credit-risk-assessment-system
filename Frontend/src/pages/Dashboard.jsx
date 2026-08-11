import { useLocation, useNavigate } from "react-router-dom";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import "../styles/Dashboard.css";

function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    const result = location.state;

    // Protect dashboard if opened without prediction data
    if (!result) {
        return (
            <div className="dashboard-error">
                <h2>No prediction data found</h2>

                <button
                    className="back-button"
                    onClick={() => navigate("/existing")}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const prediction = result.prediction;

    const probability = Number(prediction.default_probability);
    const confidence = Number(prediction.confidence);
    const income = Number(result.input?.AMT_INCOME_TOTAL || 0);
const requestedCredit = Number(result.input?.AMT_CREDIT || 0);

const loanToIncomeRatio =
  income > 0 ? requestedCredit / income : 0;

  const annuity = Number(result.input?.AMT_ANNUITY || 0);

const annuityToIncomeRatio =
  income > 0 ? annuity / income : 0;

  const financialBurdenScore = Math.min(
  (
    loanToIncomeRatio * 4 +
    annuityToIncomeRatio * 100 +
    probability * 100
  ) / 3,
  100
);

    // -----------------------------
    // DONUT DATA
    // -----------------------------

    const donutData = [
        {
            name: "Default",
            value: probability * 100
        },
        {
            name: "Non-default",
            value: (1 - probability) * 100
        }
    ];

    // -----------------------------
// SHAP DATA
// -----------------------------

const shapData = result.shap?.top_features
    ? result.shap.top_features.map((feature) => ({
        feature: feature.feature,
        impact: Number(feature.impact)
    }))
    : [];
    // -----------------------------
    // RISK CLASS
    // -----------------------------

    let riskClass = "low-risk";

    if (prediction.risk_level === "Medium Risk") {
        riskClass = "medium-risk";
    }

    if (prediction.risk_level === "High Risk") {
        riskClass = "high-risk";
    }

    // -----------------------------
    // DECISION CLASS
    // -----------------------------

    const decisionClass =
        prediction.loan_decision === "Approved"
            ? "approved"
            : "rejected";

    return (
        <div className="dashboard">

            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside className="sidebar">

                <div className="brand">

                    <div className="brand-icon">
                        AI
                    </div>

                    <div>
                        <h2>CreditAI</h2>
                        <span>Risk Intelligence</span>
                    </div>

                </div>


                <nav className="sidebar-nav">

                    <div className="nav-item active">
                        <span>▣</span>
                        Dashboard
                    </div>


                    <div
                        className="nav-item"
                        onClick={() => navigate("/existing")}
                    >
                        <span>◉</span>
                        Customers
                    </div>


                    <div className="nav-item">
                        <span>◈</span>
                        Analytics
                    </div>

                </nav>


                <div className="sidebar-bottom">

                    <div className="system-status">

                        <span className="status-dot"></span>

                        <div>
                            <strong>AI System</strong>
                            <small>Online</small>
                        </div>

                    </div>

                </div>

            </aside>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="main-content">

                {/* HEADER */}

                <header className="dashboard-header">

                    <div>

                        <p className="eyebrow">
                            AI CREDIT RISK ASSESSMENT
                        </p>

                        <h1>
                            Risk Dashboard
                        </h1>

                        <p className="subtitle">
                            Intelligent loan risk analysis powered by
                            machine learning
                        </p>

                    </div>


                    <button
                        className="new-prediction-btn"
                        onClick={() => navigate("/existing")}
                    >
                        + New Prediction
                    </button>

                </header>


                {/* =========================================
                    CUSTOMER BANNER
                ========================================= */}

                <section className="customer-banner">

                    <div>

                        <span className="customer-label">
                            CUSTOMER
                        </span>

                        <h2>
                            #{result.customer.customer_id}
                        </h2>

                    </div>


                    <div className="customer-type">
                        {result.customer?.customer_id === "NEW"
                            ? "New Customer"
                            : "Existing Customer"}
                    </div>

                </section>


                {/* =========================================
                    METRIC CARDS
                ========================================= */}

                <section className="metric-grid">

                    {/* RISK */}

                    <div className="metric-card">

                        <span className="metric-label">
                            RISK LEVEL
                        </span>

                        <h2 className={riskClass}>
                            {prediction.risk_level}
                        </h2>

                        <span className="metric-description">
                            Overall credit risk assessment
                        </span>

                    </div>


                    {/* DECISION */}

                    <div className="metric-card">

                        <span className="metric-label">
                            LOAN DECISION
                        </span>

                        <h2 className={decisionClass}>
                            {prediction.loan_decision}
                        </h2>

                        <span className="metric-description">
                            AI recommended decision
                        </span>

                    </div>


                    {/* PROBABILITY */}

                    <div className="metric-card">

                        <span className="metric-label">
                            DEFAULT PROBABILITY
                        </span>

                        <h2>
                            {(probability * 100).toFixed(2)}%
                        </h2>

                        <span className="metric-description">
                            Probability of loan default
                        </span>

                    </div>


                    {/* CONFIDENCE */}

                    <div className="metric-card">

                        <span className="metric-label">
                            MODEL CONFIDENCE
                        </span>

                        <h2>
                            {confidence.toFixed(2)}%
                        </h2>

                        <span className="metric-description">
                            Prediction confidence
                        </span>

                    </div>

                </section>


                {/* =========================================
                    CHART SECTION
                ========================================= */}

                <section className="chart-grid">


                    {/* DONUT CHART */}

                    <div className="panel probability-panel">

                        <div className="panel-header">

                            <div>

                                <span className="panel-label">
                                    RISK ANALYSIS
                                </span>

                                <h2>
                                    Default Probability
                                </h2>

                            </div>

                            <span className="ai-badge">
                                AI MODEL
                            </span>

                        </div>


                        <div className="donut-container">

                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >

                                <PieChart>

                                    <Pie
                                        data={donutData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={90}
                                        outerRadius={120}
                                        paddingAngle={3}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                    >

                                        <Cell fill="#8b5cf6" />

                                        <Cell fill="#25263a" />

                                    </Pie>

                                </PieChart>

                            </ResponsiveContainer>


                            <div className="donut-center">

                                <span>
                                    DEFAULT
                                </span>

                                <strong>
                                    {(probability * 100).toFixed(1)}%
                                </strong>

                                <small>
                                    probability
                                </small>

                            </div>

                        </div>


                        <div className="probability-footer">

                            <div>
                                <span className="legend-dot purple"></span>

                                Default

                                <strong>
                                    {(probability * 100).toFixed(1)}%
                                </strong>
                            </div>


                            <div>
                                <span className="legend-dot dark"></span>

                                Non-default

                                <strong>
                                    {((1 - probability) * 100).toFixed(1)}%
                                </strong>
                            </div>

                        </div>

                    </div>


                    {/* DECISION OVERVIEW */}

                    <div className="panel decision-panel">

                        <div className="panel-header">

                            <div>

                                <span className="panel-label">
                                    DECISION OVERVIEW
                                </span>

                                <h2>
                                    AI Assessment
                                </h2>

                            </div>

                        </div>


                        <div className="decision-overview">

                            <div className="decision-icon">
                                {prediction.loan_decision === "Approved"
                                    ? "✓"
                                    : "!"}
                            </div>


                            <h3 className={decisionClass}>
                                {prediction.loan_decision}
                            </h3>


                            <p>
                                The AI model has classified this
                                customer as{" "}
                                <strong>
                                    {prediction.risk_level}
                                </strong>.
                            </p>


                            <div className="threshold-box">

                                <span>
                                    Decision Threshold
                                </span>

                                <strong>
                                    {(Number(prediction.threshold) * 100).toFixed(0)}%
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================= FINANCIAL ANALYSIS ================= */}

<section className="panel financial-analysis-panel">

  <div className="panel-header">

    <div>
      <span className="panel-label">
        FINANCIAL ANALYSIS
      </span>

      <h2>
        Income vs Requested Credit
      </h2>

      <p className="chart-description">
        Comparison between the customer's annual income and requested credit
      </p>
    </div>

  </div>

  <div className="financial-chart">

    <ResponsiveContainer width="100%" height={320}>

      <BarChart
        data={[
          {
            name: "Annual Income",
            value: Number(
              result.input?.AMT_INCOME_TOTAL || 0
            )
          },
          {
            name: "Requested Credit",
            value: Number(
              result.input?.AMT_CREDIT || 0
            )
          }
        ]}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20
        }}
      >

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip
          formatter={(value) =>
            `₹${Number(value).toLocaleString()}`
          }
        />

        <Bar
          dataKey="value"
          fill="#8b5cf6"
          radius={[8, 8, 0, 0]}
          barSize={80}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

</section>

{/* ================= LOAN TO INCOME RATIO ================= */}

<section className="panel ratio-panel">

  <div className="panel-header">

    <div>
      <span className="panel-label">
        FINANCIAL BURDEN
      </span>

      <h2>
        Loan-to-Income Ratio
      </h2>

      <p className="chart-description">
        Requested credit compared with annual customer income
      </p>
    </div>

  </div>

  <div className="ratio-content">

    <div className="ratio-circle">

      <div className="ratio-inner">

        <strong>
          {loanToIncomeRatio.toFixed(1)}×
        </strong>

        <span>
          Income
        </span>

      </div>

    </div>

    <div className="ratio-details">

      <div className="ratio-stat">

        <span>
          Annual Income
        </span>

        <strong>
          ₹{income.toLocaleString()}
        </strong>

      </div>

      <div className="ratio-stat">

        <span>
          Requested Credit
        </span>

        <strong>
          ₹{requestedCredit.toLocaleString()}
        </strong>

      </div>

      <div className="ratio-message">

        {loanToIncomeRatio > 5
          ? "High financial burden relative to income"
          : loanToIncomeRatio > 3
          ? "Moderate financial burden relative to income"
          : "Low financial burden relative to income"
        }

      </div>

    </div>

  </div>

</section>

{/* ================= ANNUITY VS INCOME ================= */}

<section className="panel annuity-panel">

  <div className="panel-header">

    <div>
      <span className="panel-label">
        REPAYMENT ANALYSIS
      </span>

      <h2>
        Loan Annuity vs Income
      </h2>

      <p className="chart-description">
        Relationship between loan annuity and annual customer income
      </p>
    </div>

  </div>

  <div className="annuity-content">

    <div className="annuity-main">

      <span className="annuity-label">
        ANNUITY / INCOME
      </span>

      <strong>
        {(annuityToIncomeRatio * 100).toFixed(1)}%
      </strong>

      <span className="annuity-subtext">
        of annual income
      </span>

    </div>

    <div className="annuity-details">

      <div className="annuity-stat">

        <span>
          Annual Income
        </span>

        <strong>
          ₹{income.toLocaleString()}
        </strong>

      </div>

      <div className="annuity-stat">

        <span>
          Loan Annuity
        </span>

        <strong>
          ₹{annuity.toLocaleString()}
        </strong>

      </div>

      <div className="annuity-progress">

        <div
          className="annuity-progress-fill"
          style={{
            width: `${Math.min(
              annuityToIncomeRatio * 100,
              100
            )}%`
          }}
        />

      </div>

    </div>

  </div>

</section>

{/* ================= FINANCIAL BURDEN ================= */}

<section className="panel burden-panel">

  <div className="panel-header">

    <div>
      <span className="panel-label">
        RISK INTELLIGENCE
      </span>

      <h2>
        Financial Burden Assessment
      </h2>

      <p className="chart-description">
        Combined assessment of loan burden and default probability
      </p>
    </div>

    <span className="ai-badge">
      AI RISK
    </span>

  </div>


  <div className="burden-content">

    <div className="burden-score">

      <div
  className="burden-circle"
  style={{
    "--burden-score": financialBurdenScore
  }}
>

        <div className="burden-circle-inner">

          <strong>
            {financialBurdenScore.toFixed(0)}
          </strong>

          <span>
            / 100
          </span>

        </div>

      </div>

      <p>
        Financial Burden Score
      </p>

    </div>


    <div className="burden-details">

      <div className="burden-item">

        <span>
          Default Probability
        </span>

        <strong>
          {(probability * 100).toFixed(1)}%
        </strong>

      </div>


      <div className="burden-item">

        <span>
          Loan / Income
        </span>

        <strong>
          {loanToIncomeRatio.toFixed(1)}×
        </strong>

      </div>


      <div className="burden-item">

        <span>
          Annuity / Income
        </span>

        <strong>
          {(annuityToIncomeRatio * 100).toFixed(1)}%
        </strong>

      </div>


      <div className="burden-status">

        {financialBurdenScore >= 70
          ? "High Financial Burden"
          : financialBurdenScore >= 40
          ? "Moderate Financial Burden"
          : "Low Financial Burden"
        }

      </div>

    </div>

  </div>

</section>
 {/* =========================================
    SHAP CHART
========================================= */}

{result.shap?.top_features && (

    <section className="panel shap-panel">

        <div className="panel-header">

            <div>

                <span className="panel-label">
                    EXPLAINABLE AI
                </span>

                <h2>
                    Feature Impact on Prediction
                </h2>

                <p className="panel-description">
                    SHAP values show how each feature influenced
                    the model's prediction.
                </p>

            </div>

            <span className="ai-badge">
                SHAP
            </span>

        </div>


        {/* SHAP LEGEND */}

        <div className="shap-legend">

            <div className="shap-legend-item">
                <span className="legend-square positive"></span>
                <span>Increases default risk</span>
            </div>

            <div className="shap-legend-item">
                <span className="legend-square negative"></span>
                <span>Reduces default risk</span>
            </div>

        </div>


        {/* SHAP CHART */}

        <div className="shap-chart">

            <ResponsiveContainer
                width="100%"
                height={350}
            >

                <BarChart
                    data={shapData}
                    layout="vertical"
                    margin={{
                        top: 10,
                        right: 40,
                        left: 30,
                        bottom: 10
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                    />

                    <XAxis
                        type="number"
                        tickFormatter={(value) =>
                            value.toFixed(2)
                        }
                    />

                    <YAxis
                        type="category"
                        dataKey="feature"
                        width={200}
                    />

                    <Tooltip
                        formatter={(value) => [
                            Number(value).toFixed(4),
                            "SHAP Impact"
                        ]}
                    />

                    <Bar
                        dataKey="impact"
                        radius={[0, 6, 6, 0]}
                    >

                        {shapData.map((entry, index) => (

                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    entry.impact >= 0
                                        ? "#ef4444"
                                        : "#8b5cf6"
                                }
                            />

                        ))}

                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        </div>


        {/* SHAP EXPLANATION */}

        <div className="shap-explanation-box">

            <div className="shap-explanation-icon">
                ✦
            </div>

            <div>

                <strong>
                    How to interpret this chart
                </strong>

                <p>
                    Positive SHAP values push the prediction
                    toward higher default risk, while negative
                    values push the prediction toward lower
                    default risk.
                </p>

            </div>

        </div>

    </section>

)}
                {/* =========================================
                    SHAP DETAIL LIST
                ========================================= */}

               {result.shap?.top_features && (
                  <section className="panel shap-detail-panel">

                    <div className="panel-header">

                        <div>

                            <span className="panel-label">
                                FEATURE DETAILS
                            </span>

                            <h2>
                                Top Risk Factors
                            </h2>

                        </div>

                    </div>


                    <div className="shap-list">

                        {shapData.map((feature, index) => {

                            const impact = feature.impact;

                            return (

                                <div
                                    className="shap-row"
                                    key={index}
                                >

                                    <div className="shap-name">
                                        {feature.feature}
                                    </div>


                                    <div className="shap-bar-container">

                                        <div
                                            className={`shap-bar ${
                                                impact >= 0
                                                    ? "positive"
                                                    : "negative"
                                            }`}
                                            style={{
                                                width: `${Math.min(
                                                    Math.abs(impact) * 180,
                                                    100
                                                )}%`
                                            }}
                                        />

                                    </div>


                                    <div
                                        className={`shap-value ${
                                            impact >= 0
                                                ? "positive-text"
                                                : "negative-text"
                                        }`}
                                    >

                                        {impact >= 0 ? "+" : ""}

                                        {impact.toFixed(4)}

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </section>

         )}
                {/* =========================================
                    RECOMMENDATIONS
                ========================================= */}

                <section className="panel recommendations-panel">

                    <div className="panel-header">

                        <div>

                            <span className="panel-label">
                                AI INSIGHTS
                            </span>

                            <h2>
                                Recommendations
                            </h2>

                        </div>


                        <span className="recommendation-icon">
                            ✦
                        </span>

                    </div>


                    <div className="recommendation-list">

                        {result.recommendations.map(
                            (recommendation, index) => (

                                <div
                                    className="recommendation"
                                    key={index}
                                >

                                    <span className="check">
                                        ✓
                                    </span>

                                    <p>
                                        {recommendation}
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                </section>


                {/* =========================================
                    FOOTER
                ========================================= */}

                <footer className="dashboard-footer">

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

export default Dashboard;