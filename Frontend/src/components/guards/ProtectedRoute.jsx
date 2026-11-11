import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  // Agar Admin galati se normal user dashboard par aaye toh use Admin Dashboard par bhejo
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;