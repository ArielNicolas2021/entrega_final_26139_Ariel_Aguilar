import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const TABS = [
  { id: "ingresos", label: "Ingresos ($)" },
  { id: "unidades", label: "Unidades vendidas" },
];

export const SalesContributionChart = ({
  products = [],
  totalVentas = 0,
  periodo = "",
  loading = false,
}) => {
  const [metric, setMetric] = useState("ingresos");
  const prefersReducedMotion = useReducedMotion();

  const isIngresos = metric === "ingresos";

  const maxValue =
    products.length > 0
      ? Math.max(
        ...products.map((p) =>
          isIngresos ? p.ingresosGenerados : p.unidadesVendidas
        ),
        1
      )
      : 1;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="rounded-2xl border border-secondary bg-bg-card p-6 shadow-sm flex flex-col justify-between"
    >
      {/* Header + Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-text-main">
            Rendimiento por Producto {periodo ? `(${periodo})` : ""}
          </h2>
          <p className="text-xs text-text-muted">
            {isIngresos
              ? "Ingresos generados y participación sobre el total vendido"
              : "Cantidad de unidades despachadas por producto"}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Métrica de rendimiento"
          className="inline-flex rounded-xl border border-secondary bg-bg-main p-1 self-start sm:self-auto"
        >
          {TABS.map((tab) => {
            const active = metric === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMetric(tab.id)}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors z-10 ${active
                    ? "text-white"
                    : "text-text-muted hover:text-text-main"
                  }`}
              >
                {active && (
                  <motion.span
                    layoutId="dashboard-metric-tab"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                    className="absolute inset-0 rounded-lg bg-primary -z-10"
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cuerpo del gráfico */}
      {loading ? (
        <div className="space-y-4 animate-pulse py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-1/3 rounded bg-secondary" />
              <div className="h-7 w-full rounded-lg bg-secondary" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="h-60 flex items-center justify-center text-sm text-text-muted border border-dashed border-secondary rounded-xl">
          No hay ventas registradas para este período.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((prod, idx) => {
            const val = isIngresos
              ? prod.ingresosGenerados
              : prod.unidadesVendidas;
            const barPercent = Math.max(Math.round((val / maxValue) * 100), 4);
            const sharePercent =
              totalVentas > 0
                ? ((prod.ingresosGenerados / totalVentas) * 100).toFixed(1)
                : 0;

            return (
              <div key={prod.productoId ?? idx} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-text-muted">
                      #{prod.productoId}
                    </span>
                    <span className="font-semibold text-text-main truncate">
                      {prod.nombre}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 tabular-nums">
                    <span className="font-bold text-text-main">
                      {isIngresos
                        ? `$${prod.ingresosGenerados.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}`
                        : `${prod.unidadesVendidas.toLocaleString("es-AR")} un.`}
                    </span>
                    {isIngresos && (
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-text-muted">
                        {sharePercent}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-6 w-full rounded-lg bg-bg-main overflow-hidden p-0.5 border border-secondary/60">
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { width: `${barPercent}%` }
                        : { width: 0 }
                    }
                    animate={{ width: `${barPercent}%` }}
                    transition={{
                      duration: 0.45,
                      delay: idx * 0.06,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-md ${isIngresos ? "bg-primary" : "bg-emerald-500"
                      }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};