import Landing from "./pages/Landing";
import { Routes, Route } from "react-router-dom";

import ExistingCustomer from "./pages/ExistingCustomer";
import NewCustomer from "./pages/NewCustomer";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Landing />}
            />

            <Route
                path="/existing"
                element={<ExistingCustomer />}
            />

            <Route
                path="/new"
                element={<NewCustomer />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />

        </Routes>
    );
}

export default App;