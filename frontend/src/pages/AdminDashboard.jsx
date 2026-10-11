
import { useEffect, useState } from "react";

import {
  getQueues,
  openQueue,
  closeQueue,
  deleteQueue,
} from "../services/queueService";

import { getAdminStatistics } from "../services/statisticsService";

import "./QueueManagement.css";

export default function QueueManagement() {
  const [queues, setQueues] = useState([]);
  const [statistics, setStatistics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busyQueueId, setBusyQueueId] = useState(null);

  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

  // Normaliser le statut d'une file
  const getQueueStatus = (queue) => {
    return String(
      queue.queueStatus ?? queue.status ?? "UNKNOWN"
    ).toUpperCase();
  };

  // Charger les files et les statistiques
  const load = async () => {
    setError("");
    setStatsError("");

    try {
      const [queuesResult, statsResult] =
        await Promise.allSettled([
          getQueues(),
          getAdminStatistics(),
        ]);

      // Résultat des files
      if (queuesResult.status === "fulfilled") {
        setQueues(queuesResult.value);
      } else {
        console.error(
          "Erreur de chargement des files :",
          queuesResult.reason
        );

        setError(
          "Impossible de charger les files existantes."
        );
      }

      // Résultat des statistiques
      if (statsResult.status === "fulfilled") {
        setStatistics(statsResult.value);
      } else {
        console.error(
          "Erreur de chargement des statistiques :",
          statsResult.reason
        );

        setStatsError(
          statsResult.reason?.response?.status === 403
            ? "Accès refusé aux statistiques : vérifiez votre rôle Admin."
            : "Impossible de charger les statistiques."
        );
      }
    } catch (err) {
      console.error("Erreur générale :", err);
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    load();
  }, []);

  // Ouvrir ou fermer une file
  const handleToggleQueue = async (queue) => {
    const active = getQueueStatus(queue) === "ACTIVE";

    setBusyQueueId(queue.id);
    setError("");

    try {
      if (active) {
        await closeQueue(queue.id);
      } else {
        await openQueue(queue.id);
      }

      // Actualiser aussi les statistiques
      await load();
    } catch (err) {
      console.error("Erreur de modification :", err);

      setError(
        err.response?.data?.message ||
          "Impossible de modifier le statut de la file."
      );
    } finally {
      setBusyQueueId(null);
    }
  };

  // Supprimer une file
  const handleDeleteQueue = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette file ?"
    );

    if (!confirmed) return;

    setBusyQueueId(id);
    setError("");

    try {
      await deleteQueue(id);

      // Actualiser les files et les statistiques
      await load();
    } catch (err) {
      console.error("Erreur de suppression :", err);

      setError(
        err.response?.data?.message ||
          "Impossible de supprimer cette file."
      );
    } finally {
      setBusyQueueId(null);
    }
  };

  // Définition des cartes statistiques
  const statisticCards = [
    {
      label: "Utilisateurs",
      value: statistics?.totalUsers,
      icon: "👥",
      color: "blue",
    },
    {
      label: "Tickets créés",
      value: statistics?.totalTickets,
      icon: "🎟️",
      color: "purple",
    },
    {
      label: "Tickets servis",
      value: statistics?.servedTickets,
      icon: "✓",
      color: "green",
    },
    {
      label: "Tickets en attente",
      value: statistics?.waitingTickets,
      icon: "◷",
      color: "orange",
    },
    {
      label: "Files totales",
      value: statistics?.totalQueues,
      icon: "▦",
      color: "cyan",
    },
    {
      label: "Files actives",
      value: statistics?.activeQueues,
      icon: "●",
      color: "pink",
    },
  ];

  // Affichage du chargement initial
  if (loading) {
    return (
      <section className="queue-management">
        <p>Chargement des files et des statistiques...</p>
      </section>
    );
  }

  return (
    <section className="queue-management">
      {/* EN-TÊTE */}
      <div className="queue-header">
        <div>
          <h2>Dashboard Admin</h2>
          <p>
            Gestion des files et suivi de l'activité SmartQueue.
          </p>
        </div>

        <button
          type="button"
          className="button button--outline"
          onClick={load}
          disabled={busyQueueId !== null}
        >
          ↻ Actualiser
        </button>
      </div>

      {/* ERREUR DES FILES */}
      {error && (
        <div className="queue-error" role="alert">
          {error}
        </div>
      )}

      {/* STATISTIQUES */}
      <div className="queue-statistics">
        {statisticCards.map((stat) => (
          <article
            className="queue-stat-card"
            key={stat.label}
          >
            <div
              className={`queue-stat-card__icon ${stat.color}`}
            >
              {stat.icon}
            </div>

            <div className="queue-stat-card__content">
              <p>{stat.label}</p>

              <h3>
                {stat.value == null
                  ? "—"
                  : Number(stat.value).toLocaleString("fr-FR")}
              </h3>
            </div>
          </article>
        ))}
      </div>

      {/* ERREUR DES STATISTIQUES */}
      {statsError && (
        <div className="queue-error" role="alert">
          {statsError}
        </div>
      )}

      {/* RÉSUMÉ */}
      {statistics && (
        <div className="queue-statistics-summary">
          <div>
            <h3>Résumé de l'activité</h3>

            <p>
              {statistics.totalTickets === 0
                ? "Aucun ticket créé pour le moment."
                : `${statistics.servedTickets} ticket(s) servi(s) sur ${statistics.totalTickets} ticket(s) créés.`}
            </p>
          </div>

          <span className="queue-summary-badge">
            {statistics.activeQueues} file(s) active(s)
          </span>
        </div>
      )}

      {/* LISTE DES FILES */}
      <div className="queue-header queue-list-header">
        <div>
          <h2>Files existantes</h2>
          <p>
            {queues.length} file(s) enregistrée(s)
          </p>
        </div>
      </div>

      {queues.length === 0 ? (
        <p>Aucune file enregistrée.</p>
      ) : (
        <div className="queue-list">
          {queues.map((queue) => {
            const status = getQueueStatus(queue);
            const active = status === "ACTIVE";
            const busy = busyQueueId === queue.id;

            return (
              <article
                className="queue-card"
                key={queue.id}
              >
                <div className="queue-card__info">
                  <div className="queue-card__icon">
                    ▦
                  </div>

                  <div className="queue-card__details">
                    <h3>{queue.name}</h3>

                    <p>
                      Gérez la disponibilité de ce service.
                    </p>

                    <span
                      className={`queue-status ${
                        active
                          ? "queue-status--active"
                          : "queue-status--closed"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                <div className="queue-card__actions">
                  <button
                    type="button"
                    className={`button ${
                      active
                        ? "button--close"
                        : "button--open"
                    }`}
                    disabled={busyQueueId !== null}
                    onClick={() => handleToggleQueue(queue)}
                  >
                    {busy
                      ? "Modification..."
                      : active
                        ? "Fermer la file"
                        : "Ouvrir la file"}
                  </button>

                  <button
                    type="button"
                    className="button button--delete"
                    disabled={busyQueueId !== null}
                    onClick={() =>
                      handleDeleteQueue(queue.id)
                    }
                  >
                    {busy
                      ? "Suppression..."
                      : "Supprimer"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
