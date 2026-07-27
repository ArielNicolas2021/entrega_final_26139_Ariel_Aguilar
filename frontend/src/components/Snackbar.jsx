export default function Snackbar({ message, show, onClose, isError }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-5 z-60 px-6 py-4 rounded-lg shadow-lg text-black animate-[fadeIn_0.3s_ease]" style={{ backgroundColor: isError ? "var(--danger-bg)" : "var(--success-bg)", border: isError ? "1px solid var(--danger)" : "1px solid var(--success)", color: isError ? "var(--warning)" : "var(--success)" }}>
      <div className="flex items-center gap-3">
        <span>{isError ? "❌" : "✅"}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-black">✕</button>
      </div>
    </div>
  );
}