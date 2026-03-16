import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const roleDashboard = {
  instructor: "/instructor/dashboard",
  center:     "/center/dashboard",
  marketer:   "/marketer/dashboard",
  admin:      "/admin/dashboard",
  student:    "/dashboard",
};

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) {
    const redirect = roleDashboard[user.role] || "/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return children;
}
