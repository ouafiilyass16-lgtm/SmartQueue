import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      const destination = location.state?.from?.pathname;

// Vérifier le rôle de l'utilisateur
const role = user?.role?.toUpperCase();

// Rediriger selon le rôle
if (role === "ADMIN") {
  navigate("/admin", { replace: true });
} else if (role === "AGENT") {
  navigate("/agent", { replace: true });
} else if (role === "CLIENT") {
  navigate("/dashboard", { replace: true });
} else {
  setError("Rôle utilisateur inconnu. Vérifiez les données de connexion.");
}
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Connexion impossible. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual__content">
          <div className="auth-illustration" aria-hidden="true">
            <div className="illustration-orbit orbit-one" />
            <div className="illustration-orbit orbit-two" />
            <div className="illustration-ticket"><span>SMARTQUEUE</span><strong>A-024</strong><small>Votre tour approche</small><div className="ticket-progress"><i /></div></div>
            <div className="floating-chip chip-one">✓ Simple & rapide</div>
            <div className="floating-chip chip-two">⏱ Moins d'attente</div>
          </div>
          <p className="eyebrow eyebrow--light">UNE ATTENTE PLUS INTELLIGENTE</p>
          <h1>Votre temps<br />compte vraiment.</h1>
          <p>Rejoignez une file, suivez votre ticket et profitez d'une expérience plus fluide.</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><span className="brand-mark">S</span> SmartQueue</div>
          <p className="eyebrow">BON RETOUR</p>
          <h2>Connectez-vous</h2>
          <p className="auth-subtitle">Accédez à votre espace SmartQueue.</p>

          {error && <div className="alert alert--error" role="alert">{error}</div>}

          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field">
              <span>Adresse e-mail</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="vous@exemple.com" autoComplete="email" required />
            </label>
            <label className="field">
              <span>Mot de passe</span>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Votre mot de passe" autoComplete="current-password" required />
            </label>
            <button className="button button--primary button--full button--large" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"} <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="auth-switch">Vous n'avez pas de compte ? <Link to="/register">Créer un compte</Link></p>
          <p className="auth-footnote">En continuant, vous accédez à votre espace personnel sécurisé.</p>
        </div>
      </section>
    </main>
  );
}
