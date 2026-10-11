import { Link } from "react-router-dom";

export default function QueueCard({ queue, showAction = true }) {
  const status = String(queue.status ?? "INCONNU").toUpperCase();
  const active = status === "ACTIVE";

  return (
    <article className="queue-card">
      <div className="queue-card__top">
        <div className="queue-icon" aria-hidden="true">▦</div>
        <span className={`status-badge ${active ? "status-badge--active" : "status-badge--inactive"}`}>
          <span className="status-dot" />
          {status}
        </span>
      </div>
      <h3>{queue.name || "File d'attente"}</h3>
      <p className="muted">Suivez votre passage simplement et sans stress.</p>
      {showAction && (
        <Link
          className={`button button--full ${active ? "button--primary" : "button--disabled"}`}
          to={`/tickets?queueId=${encodeURIComponent(queue.id)}`}
          aria-disabled={!active}
          onClick={(event) => { if (!active) event.preventDefault(); }}
        >
          {active ? "Prendre un ticket" : "File indisponible"}
          {active && <span aria-hidden="true"> →</span>}
        </Link>
      )}
    </article>
  );
}
