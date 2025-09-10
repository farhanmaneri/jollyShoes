import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import Login from "../pages/Login";
import React from "react";

export const ProtectedRoute = () => {
  
  const { token } = useAuth();
  // localStorage.clear();
  
    // Check if the user is authenticated
    if (!token) {
      // If not authenticated, redirect to the login page
      return <Navigate to="/login" />;
    }
  
    // If authenticated, render the child routes
    return <Outlet />;
  };