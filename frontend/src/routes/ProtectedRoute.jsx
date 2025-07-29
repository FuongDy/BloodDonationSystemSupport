// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ requiredRoles }) => {
  const { user, isAuthenticated, isAuthenticating } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isAuthenticating) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Check role permissions if required
  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return <Navigate to='/forbidden' replace />;
  }

  // Render protected content
  return <Outlet />;
};

export default ProtectedRoute;
