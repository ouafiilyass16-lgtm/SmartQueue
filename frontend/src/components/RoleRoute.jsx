
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RoleRoute({ allowedRole }) {
  const { user } = useAuth();

  // L'utilisateur n'est pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role || "").toUpperCase();
  const requiredRole = String(allowedRole || "").toUpperCase();

  // Le rôle ne correspond pas à la page demandée
  if (role !== requiredRole) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "AGENT") {
      return <Navigate to="/agent" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  // Le rôle est correct : afficher la page demandée
  return <Outlet />;
}
