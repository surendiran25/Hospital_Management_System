import { Navigate } from "react-router-dom";
import { getUser } from "./auth";

// <ProtectedRoute>            any logged-in person can open it
// <ProtectedRoute role="admin"> only admins can open it
export default function ProtectedRoute({ role, children }) {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;

  return children;
}