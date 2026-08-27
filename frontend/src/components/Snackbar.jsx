import { useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

export const Snackbar = ({ message, type = "success", onClose}) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(onClose, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const styles = {
    success: "bg-green-200 text-green-950 border-green-500",
    error: "bg-red-200 text-red-950 border-red-500"
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />
  };

  return (
    <div className={`fixed bottom-5 left-5 z-50 flex items-center gap-3 rounded-lg px-4 py-3 border shadow-lg ${styles[type]}`}>
      {icons[type]}
      <span>{message}</span>
      <button type="button" onClick={onClose} className="ml-2 hover:opacity-70"><X size={18} /></button>
    </div>
  );
};