import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const role = String(user?.role || "").toUpperCase();
  const isAdmin = role === "ADMIN";
  const isAgent = role === "AGENT";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const homePath = isAdmin
    ? "/admin"
    : isAgent
      ? "/agent"
      : "/dashboard";

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Navigation principale">
        <NavLink to={homePath} className="brand">
          <span className="brand-mark">S</span>
          <span>Smart<span>Queue</span></span>
        </NavLink>

        <div className="nav-links">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Connexion
              </NavLink>

              <NavLink
                to="/register"
                className="button button--small button--primary"
              >
                Créer un compte
              </NavLink>
            </>
          ) : (
            <>
              {isAdmin && (
                <>
                  <NavLink to="/admin" className={linkClass}>
                    Tableau de bord
                  </NavLink>

                  <NavLink to="/admin/queues" className={linkClass}>
                    Gestion des files
                  </NavLink>
                </>
              )}

              {isAgent && (
                <NavLink to="/agent" className={linkClass}>
                  Gestion des tickets
                </NavLink>
              )}

              {!isAdmin && !isAgent && (
                <>
                  <NavLink to="/dashboard" className={linkClass}>
                    Accueil
                  </NavLink>

                  <NavLink to="/queues" className={linkClass}>
                    Files d'attente
                  </NavLink>

                  <NavLink to="/tickets" className={linkClass}>
                    Mes tickets
                  </NavLink>
                </>
              )}

             <span className="nav-user">
  <span>
    {user?.firstName}
  </span>
</span>

              <button
                type="button"
                className="button button--small button--outline"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}