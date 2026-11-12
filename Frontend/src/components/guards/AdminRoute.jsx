import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  // Strictly check Admin role
  if (user?.role !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;