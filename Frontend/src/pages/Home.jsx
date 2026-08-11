import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>AI Credit Risk Assessment System</h1>

      <p>
        Intelligent Loan Risk Prediction using Machine Learning and Explainable AI
      </p>

      <Link to="/existing">
        <button>Existing Customer</button>
      </Link>

      <Link to="/new">
        <button>New Customer</button>
      </Link>
    </div>
  );
}

export default Home;