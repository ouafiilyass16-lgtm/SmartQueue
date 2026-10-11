
import { useCallback, useEffect, useState } from "react";
import AgentScanner from "../components/AgentScanner";
import {
  getTickets,
  callTicket,
  serveTicket,
  noShowTicket,
} from "../services/ticketService";

import Loading from "../components/Loading";
import "./Dashboard.css";

export default function AgentDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // 1. Charger les tickets depuis le backend

  // Charger les tickets depuis le backend
  const loadTickets = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const data = await getTickets();
      setTickets(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de charger les tickets."
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  // Charger au démarrage, puis actualiser toutes les 5 secondes
  useEffect(() => {
    loadTickets();

    const intervalId = setInterval(() => {
      loadTickets(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loadTickets]);


  // 3. Récupérer le statut du ticket
  const statusOf = (ticket) =>
    String(ticket.status ?? ticket.ticketStatus ?? "").toUpperCase();

  // 4. Calculer les statistiques
  const waitingTickets = tickets.filter((ticket) =>
    ["WAITING", "PENDING"].includes(statusOf(ticket))
  );

  const calledTickets = tickets.filter((ticket) =>
    ["CALLED", "IN_PROGRESS"].includes(statusOf(ticket))
  );

  const servedTickets = tickets.filter((ticket) =>
    ["SERVED", "COMPLETED"].includes(statusOf(ticket))
  );

  // 5. Exécuter une action sur un ticket
  async function performAction(ticket, action, successMessage) {
    setBusyId(ticket.id);
    setError("");
    setNotice("");

    try {
      await action(ticket.id);

      setNotice(successMessage);

      // Recharger la liste après l'action
      await loadTickets();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "L'action a échoué. Vérifiez le statut du ticket."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="page-shell container">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <p className="eyebrow eyebrow--light">
            ESPACE PROFESSIONNEL
          </p>

          <h1>Gestion des tickets</h1>

          <p>
            Suivez les clients en attente et gérez leur passage au
            guichet depuis votre espace agent.
          </p>

          
<div className="welcome-actions">
  <button
    type="button"
    className="button button--white"
    onClick={loadTickets}
    disabled={loading}
  >
    ↻ Actualiser les tickets
  </button>

  <button
    type="button"
    className="button button--white"
    onClick={() => setShowScanner((previous) => !previous)}
  >
    {showScanner ? "✕ Fermer le scanner" : "▦ Scanner un QR code"}
  </button>
</div>

        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon stat-icon--orange">◷</span>
          <div className="stat-content">
            <p>En attente</p>
            <strong>
              {loading ? "—" : waitingTickets.length}
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon stat-icon--blue">↗</span>
          <div className="stat-content">
            <p>Appelés</p>
            <strong>
              {loading ? "—" : calledTickets.length}
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon stat-icon--green">✓</span>
          <div className="stat-content">
            <p>Servis</p>
            <strong>
              {loading ? "—" : servedTickets.length}
            </strong>
          </div>
        </article>
      </section>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
          <button
            type="button"
            className="text-button"
            onClick={loadTickets}
          >
            Réessayer
          </button>
        </div>
      )}

      {notice && (
        <div className="alert alert--success" role="status">
          {notice}
        </div>
      )}

      <section className="admin-activity">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SUIVI DES TICKETS</p>
            <h2>Tickets à traiter</h2>
            <p className="muted">
              Appelez un ticket en attente ou terminez un passage.
            </p>
          </div>
        </div>

        {loading && <Loading text="Chargement des tickets..." />}

        {!loading && !error && tickets.length === 0 && (
          <div className="empty-state">
            <span>✓</span>
            <h3>Aucun ticket disponible</h3>
            <p>
              Les tickets apparaîtront ici lorsqu'ils seront créés.
            </p>
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <div className="agent-ticket-list">
            {tickets.map((ticket) => {
              const status = statusOf(ticket);

              const waiting = ["WAITING", "PENDING"].includes(status);
              const called = ["CALLED", "IN_PROGRESS"].includes(status);
              const busy = busyId === ticket.id;

              return (
                <article
                  className="agent-ticket-card"
                  key={ticket.id}
                >
                  <div className="agent-ticket-info">
                    <span className="muted">
                      Numéro du ticket
                    </span>

                    <h3>
                      {ticket.number ??
                        ticket.ticketNumber ??
                        "—"}
                    </h3>

                    <p>
                      File : {ticket.queueName || "Service non précisé"}
                    </p>

                    <span
                      className={`status-badge ${
                        waiting || called
                          ? "status-badge--active"
                          : "status-badge--inactive"
                      }`}
                    >
                      {status || "INCONNU"}
                    </span>
                  </div>

                  <div className="agent-ticket-actions">
                    {waiting && (
                      <button
                        type="button"
                        className="button button--primary"
                        disabled={busyId !== null}
                        onClick={() =>
                          performAction(
                            ticket,
                            callTicket,
                            "Le ticket a été appelé."
                          )
                        }
                      >
                        {busy ? "Traitement..." : "Appeler"}
                      </button>
                    )}

                    {called && (
                      <>
                        <button
                          type="button"
                          className="button button--primary"
                          disabled={busyId !== null}
                          onClick={() =>
                            performAction(
                              ticket,
                              serveTicket,
                              "Le ticket a été marqué comme servi."
                            )
                          }
                        >
                          {busy ? "Traitement..." : "Marquer servi"}
                        </button>

                        <button
                          type="button"
                          className="button button--outline"
                          disabled={busyId !== null}
                          onClick={() =>
                            performAction(
                              ticket,
                              noShowTicket,
                              "L'absence du client a été enregistrée."
                            )
                          }
                        >
                          Client absent
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      
{showScanner && (
  <section className="admin-activity">
    <div className="section-heading">
      <div>
        <p className="eyebrow">LECTURE DU QR CODE</p>
        <h2>Scanner le ticket du client</h2>
        <p className="muted">
          Présentez le QR code devant la caméra.
        </p>
      </div>
    </div>

    <AgentScanner />
  </section>
)}

      <p className="muted">
        Les données sont actualisées après chaque action ou lorsque
        vous cliquez sur Actualiser.
      </p>
      
    </main>
  );
}
