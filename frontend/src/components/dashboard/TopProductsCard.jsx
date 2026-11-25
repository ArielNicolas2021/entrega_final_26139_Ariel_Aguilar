import { motion, useReducedMotion } from "motion/react";
import { TrophyIcon } from "@heroicons/react/24/outline";

export const TopProductsCard = ({ products = [], loading = false }) => {
  const prefersReducedMotion = useReducedMotion();

  const maxUnits =
    products.length > 0
      ? Math.max(...products.map((p) => p.unidadesVendidas), 1)
      : 1;

  const getRankBadgeStyle = (index) => {
    if (index === 0)
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    if (index === 1)
      return "bg-slate-400/15 text-slate-600 dark:text-slate-300 border-slate-400/30";
    if (index === 2)
      return "bg-orange-600/15 text-orange-700 dark:text-orange-400 border-orange-600/30";
    return "bg-secondary text-text-muted border-secondary";
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.15 }}
      className="rounded-2xl border border-secondary bg-bg-card p-6 shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-text-main">
            Productos Ganadores
          </h2>
          <p className="text-xs text-text-muted">
            Ranking por unidades vendidas
          </p>
        </div>
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
          <TrophyIcon className="h-5 w-5" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-36 rounded bg-secondary" />
                <div className="h-4 w-16 rounded bg-secondary" />
              </div>
              <div className="h-2 w-full rounded-full bg-secondary" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12 text-sm text-text-muted border border-dashed border-secondary rounded-xl">
          Sin productos vendidos en este período.
        </div>
      ) : (
        <ul className="space-y-4">
          {products.map((product, index) => {
            const percentage = Math.round(
              (product.unidadesVendidas / maxUnits) * 100
            );

            return (
              <li key={product.productoId ?? index} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${getRankBadgeStyle(
                        index
                      )}`}
                    >
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-main truncate">
                        {product.nombre}
                      </p>
                      <p className="text-[11px] font-mono text-text-muted">
                        ID #{product.productoId}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 tabular-nums">
                    <p className="text-xs font-bold text-text-main">
                      {product.unidadesVendidas.toLocaleString("es-AR")} un.
                    </p>
                    <p className="text-[11px] text-text-muted">
                      $
                      {product.ingresosGenerados.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-bg-main overflow-hidden">
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { width: `${percentage}%` }
                        : { width: 0 }
                    }
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1 + index * 0.05,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full ${index === 0 ? "bg-primary" : "bg-primary/70"
                      }`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
};