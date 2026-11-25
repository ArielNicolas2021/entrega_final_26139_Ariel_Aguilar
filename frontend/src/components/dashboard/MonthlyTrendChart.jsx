import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const TABS = [
  { id: "ventas", label: "Ventas por mes ($)" },
  { id: "tickets", label: "Tickets por mes" },
];

export const MonthlyTrendChart = ({ data = [], loading = false }) => {
  const [activeMetric, setActiveMetric] = useState("ventas");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  const isVentas = activeMetric === "ventas";

  const { maxVal, yTicks } = useMemo(() => {
    if (!data.length) return { maxVal: 100, yTicks: [0, 25, 50, 75, 100] };

    const rawMax = Math.max(
      ...data.map((d) => (isVentas ? d.totalVentas : d.cantidadTickets)),
      1
    );
    const niceMax = Math.ceil((rawMax * 1.15) / 10) * 10;
    const step = niceMax / 4;

    return {
      maxVal: niceMax,
      yTicks: [0, step, step * 2, step * 3, niceMax],
    };
  }, [data, isVentas]);

  const formatYAxis = (val) => {
    if (!isVentas) return Math.round(val).toLocaleString("es-AR");
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000)}k`;
    return `$${val}`;
  };

  const formatFullValue = (val) =>
    isVentas
      ? `$${Number(val).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
      : `${Number(val).toLocaleString("es-AR")} tickets`;

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="rounded-2xl border border-secondary bg-bg-card p-6 shadow-sm flex flex-col justify-between"
    >
      {/* Cabecera + Selector de métrica */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-text-main">
            Evolución Mensual
          </h2>
          <p className="text-xs text-text-muted">
            {isVentas
              ? "Facturación bruta acumulada mes a mes"
              : "Cantidad de tickets emitidos por mes"}
          </p>
        </div>

        {/* Segmented Control con layoutId */}
        <div
          role="tablist"
          aria-label="Métrica del gráfico mensual"
          className="inline-flex rounded-xl border border-secondary bg-bg-main p-1 self-start sm:self-auto"
        >
          {TABS.map((tab) => {
            const active = activeMetric === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveMetric(tab.id);
                  setHoveredIndex(null);
                }}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors z-10 ${active
                  ? "text-white"
                  : "text-text-muted hover:text-text-main"
                  }`}
              >
                {active && (
                  <motion.span
                    layoutId="dashboard-chart-tab"
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

      {/* Área del gráfico */}
      {loading ? (
        <div className="h-72 flex items-end gap-3 pt-8 px-2 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{ height: `${30 + ((i * 19) % 65)}%` }}
              className="flex-1 rounded-t-lg bg-secondary"
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-sm text-text-muted border border-dashed border-secondary rounded-xl">
          No hay registros mensuales para mostrar.
        </div>
      ) : (
        <div className="relative h-72 flex flex-col justify-end pt-8">
          {/* Tooltip flotante del mes seleccionado */}
          <AnimatePresence>
            {activeItem && (
              <motion.div
                key={activeItem.mes}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}
                className="absolute top-0 right-0 z-20 rounded-xl border border-secondary bg-bg-card px-3.5 py-2 shadow-md text-xs pointer-events-none"
              >
                <span className="font-bold text-text-main mr-2">
                  {activeItem.mes}:
                </span>
                <span className="font-semibold text-primary tabular-nums">
                  {formatFullValue(
                    isVentas
                      ? activeItem.totalVentas
                      : activeItem.cantidadTickets
                  )}
                </span>
                <span className="text-text-muted ml-2">
                  (
                  {isVentas
                    ? `${activeItem.cantidadTickets} tickets`
                    : `$${activeItem.totalVentas.toLocaleString("es-AR")}`}
                  )
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex h-60 items-stretch gap-3">
            {/* Eje Y */}
            <div className="flex flex-col justify-between text-[11px] font-mono text-text-muted text-right pr-1 pb-6 select-none">
              {[...yTicks].reverse().map((tick, idx) => (
                <span key={idx}>{formatYAxis(tick)}</span>
              ))}
            </div>

            {/* Barras y líneas guía */}
            <div className="relative flex-1 flex flex-col">
              {/* Líneas horizontales de fondo */}
              <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
                {yTicks.map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full border-b border-dashed border-secondary/80"
                  />
                ))}
              </div>

              {/* Columnas */}
              <div className="relative z-10 flex-1 flex items-end gap-1.5 sm:gap-3 px-1">
                {data.map((item, idx) => {
                  const val = isVentas ? item.totalVentas : item.cantidadTickets;
                  const heightPercent = Math.max(
                    Math.min((val / maxVal) * 100, 100),
                    val > 0 ? 3 : 0
                  );
                  const isHovered = hoveredIndex === idx;

                  return (
                    <div
                      key={item.mes || idx}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.mes}: ${formatFullValue(val)}`}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onFocus={() => setHoveredIndex(idx)}
                      onBlur={() => setHoveredIndex(null)}
                      className="flex-1 h-full flex flex-col justify-end items-center group focus:outline-none cursor-pointer"
                    >
                      <div className="w-full flex-1 flex items-end justify-center">
                        <motion.div
                          initial={
                            prefersReducedMotion
                              ? { height: `${heightPercent}%` }
                              : { height: 0 }
                          }
                          animate={{ height: `${heightPercent}%` }}
                          transition={{
                            duration: 0.4,
                            delay: idx * 0.025,
                            ease: "easeOut",
                          }}
                          className={`w-full max-w-8.5 rounded-t-lg transition-colors ${isVentas
                            ? isHovered
                              ? "bg-primary-hover"
                              : "bg-primary"
                            : isHovered
                              ? "bg-emerald-500"
                              : "bg-emerald-500/85"
                            }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Etiquetas Eje X */}
              <div className="h-6 flex items-center gap-1.5 sm:gap-3 px-1 pt-2 border-t border-secondary">
                {data.map((item, idx) => (
                  <span
                    key={item.mes || idx}
                    className={`flex-1 text-center text-[11px] font-medium truncate transition-colors ${hoveredIndex === idx
                      ? "text-primary font-bold"
                      : "text-text-muted"
                      }`}
                  >
                    {item.mes}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};