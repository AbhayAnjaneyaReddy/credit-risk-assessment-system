import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";

function Landing() {

    const navigate = useNavigate();

    return (
        <div className="landing-page">

            {/* Animated background */}
            <div className="landing-grid"></div>

            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            {/* Header */}
            <header className="landing-header">

                <div className="landing-brand">
                    <div className="brand-mark">
                        C
                    </div>

                    <div>
                        <div className="brand-name">
                            CREDIT<span>AI</span>
                        </div>

                        <div className="brand-subtitle">
                            CREDIT RISK INTELLIGENCE
                        </div>
                    </div>
                </div>

                <div className="system-status">
                    <span className="status-dot"></span>
                    AI SYSTEM ONLINE
                </div>

            </header>


            {/* Main */}
            <main className="landing-content">

                {/* Hero */}
                <section className="landing-hero">

                    <div className="hero-badge">
                        <span>✦</span>
                        AI-POWERED CREDIT DECISIONING
                    </div>

                    <h1>
                        Smarter decisions.
                        <br />

                        <span>
                            Lower credit risk.
                        </span>
                    </h1>

                    <p>
                        Evaluate credit applications using
                        machine learning, financial intelligence
                        and explainable AI.
                    </p>

                </section>


                {/* Live AI visualization */}
                <div className="ai-visual">

                    <div className="orbit orbit-one"></div>
                    <div className="orbit orbit-two"></div>

                    <div className="ai-core">

                        <div className="core-ring">
                            <span>AI</span>
                        </div>

                        <small>
                            RISK ENGINE
                        </small>

                    </div>

                    <div className="data-node node-one">
                        <span>₹</span>
                        <small>FINANCE</small>
                    </div>

                    <div className="data-node node-two">
                        <span>⌁</span>
                        <small>ML MODEL</small>
                    </div>

                    <div className="data-node node-three">
                        <span>✦</span>
                        <small>SHAP AI</small>
                    </div>

                </div>


                {/* Selection */}
                <section className="customer-section">

                    <div className="selection-heading">

                        <span>
                            START ASSESSMENT
                        </span>

                        <h2>
                            Who are you assessing?
                        </h2>

                    </div>


                    <div className="customer-options">

                        {/* Existing */}
                        <button
                            className="customer-option"
                            onClick={() =>
                                navigate("/existing")
                            }
                        >

                            <div className="option-icon">
                                ◉
                            </div>

                            <div className="option-content">

                                <span className="option-label">
                                    EXISTING CUSTOMER
                                </span>

                                <h3>
                                    Analyze an existing profile
                                </h3>

                                <p>
                                    Use an existing customer ID
                                    and financial information to
                                    evaluate credit risk.
                                </p>

                                <div className="option-action">
                                    Analyze Customer
                                    <span>→</span>
                                </div>

                            </div>

                        </button>


                        {/* New */}
                        <button
                            className="customer-option featured"
                            onClick={() =>
                               navigate("/new")
                            }
                        >

                            <div className="option-icon">
                                +
                            </div>

                            <div className="option-content">

                                <span className="option-label">
                                    NEW CUSTOMER
                                </span>

                                <h3>
                                    Start a new assessment
                                </h3>

                                <p>
                                    Enter customer details and let
                                    the AI model evaluate the
                                    credit application.
                                </p>

                                <div className="option-action">
                                    Start Assessment
                                    <span>→</span>
                                </div>

                            </div>

                            <div className="featured-tag">
                                RECOMMENDED
                            </div>

                        </button>

                    </div>

                </section>


                {/* Trust indicators */}
                <section className="landing-trust">

                    <div>
                        <strong>
                            ML
                        </strong>

                        <span>
                            MACHINE LEARNING
                        </span>
                    </div>

                    <div>
                        <strong>
                            SHAP
                        </strong>

                        <span>
                            EXPLAINABLE AI
                        </span>
                    </div>

                    <div>
                        <strong>
                            24/7
                        </strong>

                        <span>
                            RISK ANALYSIS
                        </span>
                    </div>

                    <div>
                        <strong>
                            SECURE
                        </strong>

                        <span>
                            DATA PROCESSING
                        </span>
                    </div>

                </section>

            </main>


            {/* Footer */}
            <footer className="landing-footer">

                <span>
                    CREDITAI RISK INTELLIGENCE PLATFORM
                </span>

                <span>
                    Powered by Machine Learning
                </span>

            </footer>

        </div>
    );
}

export default Landing;