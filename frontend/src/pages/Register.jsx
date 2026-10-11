import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerService } from "../services/authService";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      await registerService(form);
      setSuccess("Votre compte a été créé. Vous pouvez maintenant vous connecter.");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Inscription impossible. Vérifiez les informations saisies.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page auth-page--register">
      <section className="auth-visual">
        <div className="auth-visual__content">
          <div className="register-graphic" aria-hidden="true">
            <div className="graphic-circle circle-a" /><div className="graphic-circle circle-b" />
            <div className="graphic-card"><span className="brand-mark">S</span><div><b>Bienvenue !</b><small>Votre prochaine étape commence ici.</small></div><span className="graphic-check">✓</span></div>
          </div>
          <p className="eyebrow eyebrow--light">REJOIGNEZ SMARTQUEUE</p>
          <h1>Moins d'attente.<br />Plus de temps.</h1>
          <p>Créez votre compte et gérez vos passages simplement, depuis un seul espace.</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><span className="brand-mark">S</span> SmartQueue</div>
          <p className="eyebrow">COMMENCEZ ICI</p>
          <h2>Créer un compte</h2>
          <p className="auth-subtitle">Quelques informations suffisent.</p>

          {error && <div className="alert alert--error" role="alert">{error}</div>}
          {success && <div className="alert alert--success" role="status">{success}</div>}

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="field"><span>Prénom</span><input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Votre prénom" autoComplete="given-name" required /></label>
              <label className="field"><span>Nom</span><input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Votre nom" autoComplete="family-name" required /></label>
            </div>
            <label className="field"><span>Adresse e-mail</span><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="vous@exemple.com" autoComplete="email" required /></label>
            <label className="field"><span>Mot de passe</span><input type="password" name="password" value={form.password} onChange={handleChange} placeholder="8 caractères minimum" autoComplete="new-password" minLength={8} required /></label>
            <button className="button button--primary button--full button--large" type="submit" disabled={loading}>
              {loading ? "Création du compte..." : "Créer mon compte"} <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="auth-switch">Vous avez déjà un compte ? <Link to="/login">Se connecter</Link></p>
          <p className="auth-footnote">Vos informations sont utilisées pour gérer votre accès à SmartQueue.</p>
        </div>
      </section>
    </main>
  );
}
