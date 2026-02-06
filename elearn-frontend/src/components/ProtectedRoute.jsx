import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("[protected]", location.pathname, { loading, isAuthenticated });
  }, [location.pathname, loading, isAuthenticated]);

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
