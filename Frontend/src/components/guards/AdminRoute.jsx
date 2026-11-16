import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user, token, authReady } = useContext(AuthContext);

  if (!authReady) {
    return <div className="portal-empty" role="status">Checking your account…</div>;
  }

  if (!token || !user) {
    return <Navigate to="/user/login" replace />;
  }

  if (user.role === 'user') {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/user/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;