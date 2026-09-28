import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useAuth(); // This retrieves the current user and loading state from our AuthContext.

  // Wait until authentication check finishes
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Checking authentication...
        </p>
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!user) {
    return <Navigate to="/login" replace />; // Navigate is a React Router component used to navigate programmatically during rendering.
  }

  // Render the protected page
  return <Outlet />; // Outlet renders the matching child route of a parent route.
}

export default ProtectedRoute;