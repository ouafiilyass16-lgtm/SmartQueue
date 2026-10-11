
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import QueueCard from "../components/QueueCard";
import TicketCard from "../components/TicketCard";

import { getQueues } from "../services/queueService";
import {
  createTicket,
  cancelTicket,
} from "../services/ticketService";

export default function ClientTickets() {
  const [searchParams] = useSearchParams();

  // Si le client vient de QueueCard, récupérer queueId dans l'URL
  const initialQueueId = searchParams.get("queueId") || "";

  const [queues, setQueues] = useState([]);
  const [selectedQueueId, setSelectedQueueId] =
    useState(initialQueueId);

  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQueues() {
      try {
        setError("");

        const data = await getQueues();
        const activeQueues = (Array.isArray(data) ? data : [])
          .filter(
            (queue) =>
              String(queue.status).toUpperCase() === "ACTIVE"
          );

        setQueues(activeQueues);

        // Vérifier que la file demandée existe et est active
        const selectedQueueExists = activeQueues.some(
          (queue) => String(queue.id) === String(initialQueueId)
        );

        if (initialQueueId && !selectedQueueExists) {
          setSelectedQueueId("");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Impossible de charger les files."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQueues();
  }, [initialQueueId]);

  // Demander un ticket au backend
  async function handleCreateTicket(event) {
    event.preventDefault();

    if (!selectedQueueId) {
      setError("Choisissez une file d'attente.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const ticket = await createTicket(selectedQueueId);

      // Afficher le ticket retourné par Spring Boot
      setMyTickets((previous) => [ticket, ...previous]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Impossible de créer le ticket."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Annuler un ticket en attente
  async function handleCancel(ticketId) {
    try {
      setError("");

      await cancelTicket(ticketId);

      setMyTickets((previous) =>
        previous.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, status: "CANCELLED" }
            : ticket
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Impossible d'annuler le ticket."
      );
    }
  }

  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="eyebrow">ESPACE CLIENT</p>
        <h1>Mes tickets</h1>
        <p className="muted">
          Choisissez un service et prenez votre ticket.
        </p>
      </section>

      <section className="ticket-create-section">
        <h2>Prendre un ticket</h2>

        {loading ? (
          <p>Chargement des services...</p>
        ) : queues.length === 0 ? (
          <p>Aucune file active n'est disponible.</p>
        ) : (
          <form onSubmit={handleCreateTicket}>
            <label htmlFor="queueSelect">
              Choisissez votre service
            </label>

            <select
              id="queueSelect"
              value={selectedQueueId}
              onChange={(event) =>
                setSelectedQueueId(event.target.value)
              }
              required
            >
              <option value="">-- Sélectionner une file --</option>

              {queues.map((queue) => (
                <option key={queue.id} value={queue.id}>
                  {queue.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="button button--primary"
              disabled={submitting}
            >
              {submitting ? "Création..." : "Prendre un ticket"}
            </button>
          </form>
        )}
      </section>

      {error && <p role="alert">{error}</p>}

      <section className="my-tickets-section">
        <h2>Tickets créés pendant cette session</h2>

        {myTickets.length === 0 ? (
          <p>Vous n'avez pas encore pris de ticket dans cette session.</p>
        ) : (
          <div className="tickets-grid">
            {myTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}