
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getQueues } from "../services/queueService";
import QueueCard from "../components/QueueCard";
import Loading from "../components/Loading";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQueues = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getQueues();
      setQueues(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Impossible de charger les files d'attente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  const activeQueues = queues.filter(
    (queue) => String(queue.status).toUpperCase() === "ACTIVE"
  ).length;

  const inactiveQueues = queues.length - activeQueues;
  const firstName = user?.email?.split("@")[0] || "Client";

  return (
    <main className="page-shell container dashboard-page">

      {/* Bannière d'accueil */}
      <section className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-label">
            <span className="welcome-label__dot" />
            ESPACE CLIENT
          </div>

          <p className="eyebrow eyebrow--light">
            BIENVENUE SUR SMARTQUEUE
          </p>

          <h1>
            Bonjour, {firstName} <span>👋</span>
          </h1>

          <p>
            Moins d'attente, plus de temps pour vous.
            Trouvez votre file, prenez votre ticket et suivez
            votre passage en toute simplicité.
          </p>

          <div className="welcome-actions">
            <Link className="button button--white" to="/queues">
              Trouver une file <span>→</span>
            </Link>

            <Link className="welcome-secondary-link" to="/tickets">
              Mes tickets
            </Link>
          </div>

          <div className="welcome-trust">
            <span>✓</span> Simple
            <span>✓</span> Rapide
            <span>✓</span> Pratique
          </div>
        </div>

        <div className="welcome-art" aria-hidden="true">
          <div className="art-ring ring-1" />
          <div className="art-ring ring-2" />
          <div className="art-ring ring-3" />

          <div className="art-clock">
            <span>◷</span>
          </div>

          <div className="art-ticket">
            <span className="art-ticket__label">SMARTQUEUE</span>
            <strong>A-024</strong>
            <span className="art-ticket__status">
              <i /> Votre tour approche
            </span>
          </div>

          <div className="art-tag">✦ À votre rythme</div>
        </div>
      </section>

      {/* Indicateurs */}
      <section className="dashboard-overview">
        <div className="section-heading">
          <div>
            <p className="eyebrow">VUE D'ENSEMBLE</p>
            <h2>Votre espace en un coup d'œil</h2>
            <p className="muted">
              Retrouvez les informations essentielles.
            </p>
          </div>

          <button
            className="button button--outline refresh-button"
            onClick={loadQueues}
            disabled={loading}
            type="button"
          >
            <span className={loading ? "refresh-icon is-spinning" : "refresh-icon"}>
              ↻
            </span>
            Actualiser
          </button>
        </div>

        <div className="stats-grid">
          <article className="stat-card stat-card--featured">
            <span className="stat-icon stat-icon--blue">▦</span>
            <div className="stat-content">
              <p>Files disponibles</p>
              <strong>{loading ? "—" : queues.length}</strong>
              <span className="stat-caption">
                Files enregistrées
              </span>
            </div>
          </article>

          <article className="stat-card">
            <span className="stat-icon stat-icon--green">✓</span>
            <div className="stat-content">
              <p>Files actives</p>
              <strong>{loading ? "—" : activeQueues}</strong>
              <span className="stat-caption">
                Disponibles actuellement
              </span>
            </div>
          </article>

          <article className="stat-card">
            <span className="stat-icon stat-icon--orange">Ⅱ</span>
            <div className="stat-content">
              <p>Files inactives</p>
              <strong>{loading ? "—" : inactiveQueues}</strong>
              <span className="stat-caption">
                Non disponibles
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* Files d'attente */}
      <section className="queues-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">À VOUS DE CHOISIR</p>
            <h2>Explorez les files d'attente</h2>
            <p className="muted">
              Choisissez une file active pour commencer.
            </p>
          </div>

          <Link
            className="button button--outline see-all-button"
            to="/queues"
          >
            Toutes les files <span>→</span>
          </Link>
        </div>

        {loading && (
          <div className="dashboard-feedback">
            <Loading text="Chargement des files d'attente..." />
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error" role="alert">
            <div className="feedback-icon">!</div>
            <div>
              <h3>Chargement impossible</h3>
              <p>{error}</p>
              <button
                className="button button--outline"
                onClick={loadQueues}
                type="button"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!loading && !error && queues.length === 0 && (
          <div className="empty-state dashboard-empty">
            <span>▦</span>
            <h3>Aucune file disponible pour le moment</h3>
            <p>
              Les files créées par l'administration apparaîtront ici.
              Revenez un peu plus tard.
            </p>
          </div>
        )}

        {!loading && !error && queues.length > 0 && (
          <>
            <div className="queues-results-bar">
              <span>
                <i className="results-dot" />
                {queues.length} file{queues.length > 1 ? "s" : ""} trouvée
                {queues.length > 1 ? "s" : ""}
              </span>

              <span className="results-hint">
                Choisissez votre destination
              </span>
            </div>

            <div className="card-grid">
              {queues.slice(0, 3).map((queue) => (
                <QueueCard key={queue.id} queue={queue} />
              ))}
            </div>

            {queues.length > 3 && (
              <div className="center-action">
                <Link
                  className="button button--primary"
                  to="/queues"
                >
                  Découvrir les {queues.length} files
                  <span>→</span>
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Aide */}
      <section className="dashboard-help">
        <div className="help-icon">✦</div>
        <div className="help-copy">
          <h3>Prêt à gagner du temps ?</h3>
          <p>
            Sélectionnez une file active et suivez les instructions
            pour prendre votre ticket.
          </p>
        </div>
        <Link to="/tickets" className="help-link">
          Voir mes tickets <span>→</span>
        </Link>
      </section>
    </main>
  );
}
