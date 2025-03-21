import React from 'react';
import { Navigate } from 'react-router-dom';

// Protect routes from unauthenticated access
const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;