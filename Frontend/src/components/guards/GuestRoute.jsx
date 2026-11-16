import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const GuestRoute = () => {
  const { user, token, authReady } = useContext(AuthContext);

  if (!authReady) {
    return <div className="portal-empty" role="status">Checking your account…</div>;
  }

  if (token && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (token && user?.role === 'user') {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
