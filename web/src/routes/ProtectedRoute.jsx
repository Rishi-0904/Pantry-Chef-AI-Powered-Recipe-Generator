import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) return <p className="status">Checking auth…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}