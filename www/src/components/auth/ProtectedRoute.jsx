import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Debug
  console.log('ProtectedRoute check:', { isAuthenticated, userRole: user?.role, requiredRole, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log('Role mismatch:', user?.role, '!==', requiredRole, '→ redirect to home');
    return <Navigate to="/" replace />;
  }

  console.log('Access granted to', requiredRole ? requiredRole : 'any authenticated user');
  return children;
}

export default ProtectedRoute;
