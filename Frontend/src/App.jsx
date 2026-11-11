import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserRoutesList } from "./routes/userRoutes";
import { AdminRoutesList } from "./routes/adminRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        
        {UserRoutesList}
        {AdminRoutesList}

        <Route path="*" element={<h2>404 Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;