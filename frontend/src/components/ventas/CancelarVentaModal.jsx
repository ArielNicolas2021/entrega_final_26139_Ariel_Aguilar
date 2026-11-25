import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export const CancelarVentaModal = ({
  venta,
  loading = false,
  onClose,
  onConfirm,
  formatMoney,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (!venta) return null;

  const id = venta.id ?? venta.ventaId;
  const codigo = venta.codigo || `VTA-${String(id).padStart(6, "0")}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-venta-title"
      >
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.16 }}
          className="w-full max-w-md rounded-2xl border border-secondary bg-bg-card p-6 shadow-xl font-sans"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <ExclamationTriangleIcon className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="cancel-venta-title"
                  className="text-base font-bold text-text-main"
                >
                  Cancelar venta
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Esta acción anulará la operación y revertirá su impacto.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Cerrar modal"
              className="rounded-lg p-1.5 text-text-muted hover:bg-secondary hover:text-text-main transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-secondary bg-bg-main/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Comprobante:</span>
              <span className="font-mono font-semibold text-primary">
                {codigo}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Método de pago:</span>
              <span className="font-medium text-text-main">
                {venta.metodoPago || "Efectivo"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Total:</span>
              <span className="font-bold text-text-main">
                {formatMoney ? formatMoney(venta.total) : `$${venta.total}`}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-text-muted">
            ¿Estás seguro de que querés cancelar la venta{" "}
            <strong className="text-text-main">{codigo}</strong>?
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-secondary bg-bg-card px-4 py-2 text-xs font-semibold text-text-main hover:bg-secondary transition-colors disabled:opacity-50"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={() => onConfirm(id)}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Cancelando..." : "Sí, cancelar venta"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};