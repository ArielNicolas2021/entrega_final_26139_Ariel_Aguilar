import { useState } from "react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export const DeleteCategoria = ({ onClose, onDelete, data }) => {
  const [loading, setLoading] = useState(false);

  if (!data) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (onDelete) {
        await onDelete(data.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-secondary bg-bg-card p-6 shadow-xl space-y-5 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">
                Confirmar eliminación
              </h2>
              <p className="text-xs text-text-muted">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-secondary hover:text-text-main transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-xl border border-secondary bg-bg-main/50 p-4 text-sm">
          <p className="text-text-muted text-xs mb-1">
            ¿Estás seguro que querés eliminar esta categoría?
          </p>
          <p className="font-semibold text-text-main text-base">
            {data?.nombre || "Categoría seleccionada"}
          </p>
          {data?.descripcion && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
              {data.descripcion}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-secondary bg-bg-card text-sm font-medium text-text-main hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar categoría"}
          </button>
        </div>
      </div>
    </div>
  );
};
