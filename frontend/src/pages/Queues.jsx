import { useCallback, useEffect, useState } from "react";
import { getQueues } from "../services/queueService";
import QueueCard from "../components/QueueCard";
import Loading from "../components/Loading";
import "./Dashboard.css";

export default function Queues() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await getQueues();
      setQueues(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger les files.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <main className="page-shell container">
      <section className="page-intro">
        <p className="eyebrow">SMARTQUEUE</p>
        <h1>Files d'attente</h1>
        <p className="muted">Retrouvez les files disponibles et choisissez où prendre votre ticket.</p>
      </section>
      <div className="section-heading">
        <div><h2>Toutes les files</h2><p className="muted">{loading ? "Chargement..." : `${queues.length} file(s) trouvée(s)`}</p></div>
        <button className="button button--outline" onClick={load} disabled={loading}>↻ Actualiser</button>
      </div>
      {loading && <Loading text="Chargement des files..." />}
      {!loading && error && <div className="alert alert--error">{error} <button className="text-button" onClick={load}>Réessayer</button></div>}
      {!loading && !error && queues.length === 0 && <div className="empty-state"><span>▦</span><h3>Aucune file disponible</h3><p>Revenez un peu plus tard.</p></div>}
      {!loading && !error && queues.length > 0 && <div className="card-grid">{queues.map((queue) => <QueueCard key={queue.id} queue={queue} />)}</div>}
    </main>
  );
}
