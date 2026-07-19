import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';

const ProtectedRoute: React.FC = () => {
  const { userInfo } = useAppSelector((s) => s.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
