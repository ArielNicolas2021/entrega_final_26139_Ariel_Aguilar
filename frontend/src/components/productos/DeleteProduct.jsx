import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export const DeleteProduct = ({ onClose, onDelete, data }) => {
  const [loading, setLoading] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loading, onClose]);

  if (!data) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete?.(data.id);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
      onClick={() => !loading && onClose?.()}
    >
      <motion.div
        initial={
          prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 8 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 6 }
        }
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="w-full max-w-md rounded-2xl border border-secondary bg-bg-card p-6 shadow-xl space-y-5 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <div>
              <h2
                id="delete-product-title"
                className="text-lg font-bold text-text-main"
              >
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
            disabled={loading}
            aria-label="Cerrar modal"
            className="rounded-lg p-1 text-text-muted hover:bg-secondary hover:text-text-main transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Detalle del Producto */}
        <div className="rounded-xl border border-secondary bg-bg-main/50 p-4 text-sm">
          <p className="text-text-muted text-xs mb-1">
            ¿Estás seguro que querés eliminar este producto?
          </p>
          <p className="font-semibold text-text-main text-base">
            {data?.nombre || "Producto seleccionado"}
          </p>
          {data?.codigo && (
            <p className="text-xs text-text-muted font-mono mt-0.5">
              Código: {data.codigo}
            </p>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-secondary bg-bg-card text-sm font-medium text-text-main hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <motion.button
            type="button"
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Eliminando..." : "Eliminar producto"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};