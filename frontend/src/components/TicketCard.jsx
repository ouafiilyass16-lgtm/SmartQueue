
import { QRCodeSVG } from "qrcode.react";

function formatDate(value) {
  if (!value) return "Date non disponible";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

export default function TicketCard({ ticket, onCancel }) {
  const status = String(ticket.status ?? "INCONNU").toUpperCase();

  const cancelled = status === "CANCELLED" || status === "CANCELED";
  const served = status === "SERVED";
  const waiting = status === "WAITING" || status === "PENDING";

  return (
    <article className="ticket-card">
      {/* En-tête du ticket */}
      <div className="ticket-card__head">
        <div>
          <p className="eyebrow">VOTRE NUMÉRO</p>
          <h3 className="ticket-number">
            #{ticket.number ?? "—"}
          </h3>
        </div>

        <span
          className={`status-badge ${
            cancelled
              ? "status-badge--inactive"
              : served
                ? "status-badge--done"
                : "status-badge--active"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Informations du ticket */}
      <div className="ticket-card__details">
        <p>
          <span>File</span>
          <strong>
            {ticket.queueName ?? ticket.queue?.name ?? "File d'attente"}
          </strong>
        </p>

        <p>
          <span>Créé le</span>
          <strong>{formatDate(ticket.createdAt)}</strong>
        </p>
      </div>

      {/* QR code du ticket */}
      {ticket.id && !cancelled && (
        <div className="ticket-qr">
          <QRCodeSVG
            value={ticket.id}
            size={200}
            level="H"
            marginSize={4}
            title={`QR code du ticket ${ticket.number}`}
          />

          <p>Présentez ce QR code à l'agent</p>

          <small>
            Ticket : {ticket.number ?? "—"}
          </small>
        </div>
      )}

      {/* Bouton d'annulation */}
      {onCancel && waiting && (
        <button
          type="button"
          className="button button--outline button--full"
          onClick={() => onCancel(ticket.id)}
        >
          Annuler le ticket
        </button>
      )}
    </article>
  );
}
