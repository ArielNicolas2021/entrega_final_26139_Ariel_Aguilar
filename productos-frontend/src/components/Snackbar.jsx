export default function Snackbar({ message, show, onClose, type }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-5 z-60 px-6 py-4 rounded-lg shadow-lg text-black animate-[fadeIn_0.3s_ease]" style={{ backgroundColor: type == "danger" ? "var(--danger-bg)" : "var(--success-bg)", border: type == "danger" ? "1px solid var(--danger)" : "1px solid var(--success)", color: type == "danger" ? "var(--warning)" : "var(--success)" }}>
      <div className="flex items-center gap-3">
        <span>{type == "danger" ? "❌" : "✅"}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-black">✕</button>
      </div>
    </div>
  );
}