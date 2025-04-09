
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-invenx-light p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
