
import { useCallback, useEffect, useState } from "react";

import {
  getQueues,
  createQueue,
  closeQueue,
  openQueue,
  deleteQueue,
} from "../services/queueService";

import Loading from "../components/Loading";
import "./Dashboard.css";

export default function AdminQueues() {
  const [queues, setQueues] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Lire le statut, quel que soit le nom renvoyé par le backend.
const getQueueStatus = (queue) =>
  String(
    queue.status ?? queue.queueStatus ?? ""
  ).toUpperCase();

  // Charger toutes les files.
  const loadQueues = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getQueues();
      setQueues(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de charger les files."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  // Créer une nouvelle file.
  async function handleCreate(event) {
    event.preventDefault();

    const queueName = name.trim();

    if (!queueName) {
      setError("Veuillez saisir le nom du service.");
      return;
    }

    setCreating(true);
    setError("");
    setNotice("");

    try {
      await createQueue(queueName);

      setName("");
      setNotice("La file a été créée avec succès.");

      await loadQueues();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "La création de la file a échoué."
      );
    } finally {
      setCreating(false);
    }
  }

  // Ouvrir ou fermer une file.
  async function handleToggle(queue) {
    if (busyId !== null) return;

    setBusyId(queue.id);
    setError("");
    setNotice("");

    try {
      const isActive = getQueueStatus(queue) === "ACTIVE";

      if (isActive) {
        await closeQueue(queue.id);
        setNotice("La file a été fermée avec succès.");
      } else {
        await openQueue(queue.id);
        setNotice("La file a été ouverte avec succès.");
      }

      await loadQueues();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de modifier cette file."
      );
    } finally {
      setBusyId(null);
    }
  }

  // Supprimer une file.
  async function handleDelete(queue) {
    if (busyId !== null) return;

    const confirmed = window.confirm(
      `Voulez-vous supprimer la file "${queue.name}" ?`
    );

    if (!confirmed) return;

    setBusyId(queue.id);
    setError("");
    setNotice("");

    try {
      await deleteQueue(queue.id);

      setNotice("La file a été supprimée avec succès.");
      await loadQueues();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de supprimer cette file."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="page-shell container">
      <section className="page-intro">
        <p className="eyebrow">ESPACE ADMINISTRATEUR</p>

        <h1>Gestion des files</h1>

        <p className="muted">
          Créez et gérez les services proposés aux clients.
        </p>
      </section>

      {/* Formulaire de création */}
      <section className="ticket-create-panel">
        <div>
          <span className="panel-icon">＋</span>

          <h2>Créer une nouvelle file</h2>

          <p className="muted">
            Exemple : Carte nationale, Consultation, Paiement...
          </p>
        </div>

        <form
          className="ticket-create-form"
          onSubmit={handleCreate}
        >
          <label className="field">
            <span>Nom du service</span>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex. Carte nationale"
              maxLength={100}
              required
            />
          </label>

          <button
            className="button button--primary"
            type="submit"
            disabled={creating || busyId !== null}
          >
            {creating ? "Création..." : "Créer la file"}
          </button>
        </form>
      </section>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div className="alert alert--success" role="status">
          {notice}
        </div>
      )}

      {/* Liste des files */}
      <section>
        <div className="section-heading">
          <div>
            <h2>Files existantes</h2>

            <p className="muted">
              {queues.length} file(s) enregistrée(s)
            </p>
          </div>

          <button
            type="button"
            className="button button--outline"
            onClick={loadQueues}
            disabled={loading || busyId !== null}
          >
            ↻ Actualiser
          </button>
        </div>

        {loading && (
          <Loading text="Chargement des files..." />
        )}

        {!loading && !error && queues.length === 0 && (
          <div className="empty-state">
            <span>▦</span>
            <h3>Aucune file créée</h3>
            <p>
              Créez votre premier service avec le formulaire.
            </p>
          </div>
        )}

        {!loading && queues.length > 0 && (
          <div className="card-grid">
            {queues.map((queue) => {
              const status = getQueueStatus(queue);
              const active = status === "ACTIVE";
              const busy = busyId === queue.id;

              return (
                <article
                  key={queue.id}
                  className="queue-card"
                >
                  <div className="queue-card__top">
                    <div className="queue-icon">▦</div>

                    <span
                      className={`status-badge ${
                        active
                          ? "status-badge--active"
                          : "status-badge--inactive"
                      }`}
                    >
                      {status || "INCONNU"}
                    </span>
                  </div>

                  <h3>{queue.name}</h3>

                  <p className="muted">
                    Gérez la disponibilité de ce service.
                  </p>

                  <div className="queue-management-actions">
                    <button
                      type="button"
                      className="button button--outline"
                      onClick={() => handleToggle(queue)}
                      disabled={busyId !== null}
                    >
                      {busy
                        ? "Traitement..."
                        : active
                          ? "Fermer la file"
                          : "Ouvrir la file"}
                    </button>

                    <button
                      type="button"
                      className="button button--outline"
                      onClick={() => handleDelete(queue)}
                      disabled={busyId !== null}
                    >
                      {busy ? "Traitement..." : "Supprimer"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
