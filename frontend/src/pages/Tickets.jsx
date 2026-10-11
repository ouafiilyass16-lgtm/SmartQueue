
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getQueues } from "../services/queueService";

import {
  cancelTicket,
  createTicket,
  getMyTickets,
} from "../services/ticketService";

import TicketCard from "../components/TicketCard";
import Loading from "../components/Loading";
import "./Dashboard.css";

export default function Tickets() {
  const [searchParams] = useSearchParams();

  const [queues, setQueues] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [queueId, setQueueId] = useState(
    searchParams.get("queueId") || ""
  );

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Lire le statut d'une file d'attente.
  const getQueueStatus = (queue) =>
    String(
      queue.status ?? queue.queueStatus ?? ""
    ).toUpperCase();

  // Charger les files et les tickets.
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    // 1. Charger les files d'attente.
    try {
      const queueData = await getQueues();

      const queueList = Array.isArray(queueData)
        ? queueData
        : [];

      setQueues(queueList);

      // Conserver la sélection si la file est toujours active.
      setQueueId((currentId) => {
        const selectedQueueExists = queueList.some(
          (queue) =>
            String(queue.id) === String(currentId) &&
            getQueueStatus(queue) === "ACTIVE"
        );

        if (selectedQueueExists) {
          return currentId;
        }

        const activeQueue = queueList.find(
          (queue) => getQueueStatus(queue) === "ACTIVE"
        );

        return activeQueue ? String(activeQueue.id) : "";
      });
    } catch (err) {
      setQueues([]);
      setTickets([]);

      setError(
        err.response?.data?.message ||
          "Impossible de charger les files d'attente."
      );

      setLoading(false);
      return;
    }

    // 2. Charger les tickets du client connecté.
    try {
      const ticketData = await getMyTickets();

      setTickets(
        Array.isArray(ticketData) ? ticketData : []
      );
    } catch (err) {
      setTickets([]);

      setError(
        err.response?.data?.message ||
          "Impossible de charger les données des tickets."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les données au démarrage.
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Afficher uniquement les files actives.
  const activeQueues = queues.filter(
    (queue) => getQueueStatus(queue) === "ACTIVE"
  );

  // Masquer les tickets annulés ou servis.
  const activeTickets = tickets.filter((ticket) => {
    const status = String(
      ticket.status ?? ""
    ).toUpperCase();

    return (
      status !== "CANCELLED" &&
      status !== "CANCELED" &&
      status !== "SERVED"
    );
  });

  // Créer un ticket.
  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");
    setNotice("");

    if (!queueId) {
      setError("Choisissez une file active.");
      return;
    }

    const selectedQueue = activeQueues.find(
      (queue) => String(queue.id) === String(queueId)
    );

    if (!selectedQueue) {
      setError(
        "Cette file n'est plus active. Choisissez une autre file."
      );
      return;
    }

    setCreating(true);

    try {
      const created = await createTicket(queueId);

      setNotice(
        `Ticket ${
          created?.number ? `#${created.number} ` : ""
        }créé avec succès.`
      );

      // Actualiser la liste après la création.
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "La création du ticket a échoué."
      );
    } finally {
      setCreating(false);
    }
  };

  // Annuler un ticket.
  const handleCancel = async (id) => {
    setError("");
    setNotice("");

    try {
      await cancelTicket(id);

      setNotice("Ticket annulé avec succès.");

      // Recharger les tickets pour masquer le ticket annulé.
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible d'annuler ce ticket."
      );
    }
  };

  return (
    <main className="page-shell container">
      {/* Présentation */}
      <section className="page-intro">
        <p className="eyebrow">VOTRE PASSAGE</p>

        <h1>Mes tickets</h1>

        <p className="muted">
          Prenez un ticket et retrouvez ici les informations
          de votre passage.
        </p>
      </section>

      {/* Formulaire de création */}
      <section className="ticket-create-panel">
        <div>
          <span className="panel-icon">＋</span>

          <h2>Prendre un nouveau ticket</h2>

          <p className="muted">
            Sélectionnez une file active pour continuer.
          </p>
        </div>

        <form
          className="ticket-create-form"
          onSubmit={handleCreate}
        >
          <label className="field">
            <span>File d'attente</span>

            <select
              value={queueId}
              onChange={(event) =>
                setQueueId(event.target.value)
              }
              required
              disabled={
                loading ||
                creating ||
                activeQueues.length === 0
              }
            >
              <option value="">
                Choisir une file...
              </option>

              {activeQueues.map((queue) => (
                <option
                  key={queue.id}
                  value={String(queue.id)}
                >
                  {queue.name}
                </option>
              ))}
            </select>
          </label>

          <button
            className="button button--primary"
            type="submit"
            disabled={
              creating ||
              loading ||
              !queueId ||
              activeQueues.length === 0
            }
          >
            {creating
              ? "Création..."
              : "Prendre un ticket →"}
          </button>
        </form>

        {!loading &&
          activeQueues.length === 0 &&
          !error && (
            <p className="muted">
              Aucune file active pour le moment.
              Veuillez réessayer plus tard.
            </p>
          )}
      </section>

      {/* Messages */}
      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div
          className="alert alert--success"
          role="status"
        >
          {notice}
        </div>
      )}

      {/* Liste des tickets actifs */}
      <section>
        <div className="section-heading">
          <div>
            <h2>Mes tickets actifs</h2>

            <p className="muted">
              Les tickets annulés ou servis ne sont plus
              affichés dans cette liste.
            </p>
          </div>

          <button
            type="button"
            className="button button--outline"
            onClick={loadData}
            disabled={loading}
          >
            ↻ Actualiser
          </button>
        </div>

        {loading && (
          <Loading text="Chargement des tickets..." />
        )}

        {!loading && activeTickets.length > 0 && (
          <div className="ticket-list">
            {activeTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {!loading && activeTickets.length === 0 && (
          <p className="empty-state">
            Aucun ticket actif pour le moment.
          </p>
        )}
      </section>
    </main>
  );
}
