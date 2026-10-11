
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";

export default function AgentScanner() {
  const scannerRef = useRef(null);
  const processingRef = useRef(false);

  const [result, setResult] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);

 
async function verifyTicket(ticketId) {
  setLoading(true);
  setError("");
  setTicket(null);

  try {
    const response = await api.get(
      `/api/tickets/${ticketId}`
    );

    console.log("Réponse complète du backend :", response.data);

    if (!response.data || !response.data.id) {
      setError("Le serveur n'a pas retourné les informations du ticket.");
      return;
    }

    setTicket(response.data);
  } catch (err) {
    console.error("Erreur API :", err);
    console.error("Réponse erreur :", err.response?.data);

    if (err.response?.status === 404) {
      setError("Ticket introuvable.");
    } else if (
      err.response?.status === 401 ||
      err.response?.status === 403
    ) {
      setError("Accès refusé. Vérifie ta connexion et tes autorisations.");
    } else {
      setError(
        err.response?.data?.message ||
        "Impossible de récupérer les informations du ticket."
      );
    }
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    let scanner;
    let cancelled = false;

    async function startCamera() {
      try {
        scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            // Éviter plusieurs requêtes pour le même scan
            if (processingRef.current) return;
            processingRef.current = true;

            const ticketId = decodedText.trim();
            setResult(ticketId);

            try {
              if (scanner.isScanning) {
                await scanner.stop();
              }

              if (!cancelled) {
                setRunning(false);
                await verifyTicket(ticketId);
              }
            } catch (err) {
              console.error("Erreur après lecture :", err);
              if (!cancelled) {
                setError("Erreur pendant le traitement du QR code.");
              }
            }
          },
          () => {
            // Les erreurs de lecture image par image sont normales.
          }
        );

        if (!cancelled) {
          setRunning(true);
        } else if (scanner.isScanning) {
          await scanner.stop();
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "Impossible d'ouvrir la caméra. Vérifie HTTPS et les autorisations."
          );
        }

        console.error("Erreur caméra :", err);
      }
    }

    startCamera();

    return () => {
      cancelled = true;

      if (scanner?.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <section style={{ maxWidth: 600, margin: "20px auto", padding: 20 }}>
      <h2>Scanner le QR code du client</h2>

      <p>
        Présente le QR code du ticket devant la caméra.
      </p>

      <div id="qr-reader" style={{ width: "100%" }} />

      {running && (
        <p>Caméra active : recherche d'un QR code...</p>
      )}

      {result && (
        <p>
          Identifiant scanné : <strong>{result}</strong>
        </p>
      )}

      {loading && <p>Vérification du ticket...</p>}

      {ticket && (
        <div
          role="status"
          style={{
            marginTop: 20,
            padding: 16,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <h3>Ticket trouvé</h3>

          <p>
            Numéro : <strong>{ticket.number}</strong>
          </p>

          <p>
  Statut : <strong>{getStatusLabel(ticket.status)}</strong>
</p>
          <p>
            File : <strong>{ticket.queueName}</strong>
          </p>

          <p>
            Créé le :{" "}
            {ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleString()
              : "Non disponible"}
          </p>
        </div>
      )}

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {result && !loading && (
        <button
          type="button"
          onClick={() => {
            setResult("");
            setTicket(null);
            setError("");
            processingRef.current = false;
          }}
        >
          Effacer le résultat
        </button>
      )}
    </section>
  );
}
function getStatusLabel(status) {
  const statuses = {
    WAITING: "En attente",
    CALLED: "Client appelé",
    SERVED: "Ticket servi",
    CANCELLED: "Ticket annulé",
    NO_SHOW: "Client absent",
  };

  return statuses[status] || status;
}