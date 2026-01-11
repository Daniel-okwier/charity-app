import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { Spinner } from '@components/ui/spinner';

const PrivateRoute = ({ requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If requiredRole is specified, check if user has that role
  if (requiredRole && user.roleId !== requiredRole) {
    // Redirect admin to admin dashboard, regular users to user dashboard
    const redirectPath = user.roleId === 1 ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If all checks pass, render the protected route
  return <Outlet />;
};

export default PrivateRoute;
