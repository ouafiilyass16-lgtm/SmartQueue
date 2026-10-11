export default function Loading({ text = "Chargement en cours..." }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner" />
      <span>{text}</span>
    </div>
  );
}
