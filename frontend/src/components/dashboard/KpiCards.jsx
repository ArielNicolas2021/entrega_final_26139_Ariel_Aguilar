import { motion, useReducedMotion } from "motion/react";
import {
  BanknotesIcon,
  ReceiptPercentIcon,
  CalculatorIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const formatCurrency = (val) =>
  `$${Number(val || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const KpiCards = ({ data, loading }) => {
  const prefersReducedMotion = useReducedMotion();
  const topProduct = data.productosGanadores?.[0];

  const cards = [
    {
      id: "ventas",
      title: "Total Ventas",
      value: formatCurrency(data.totalVentas),
      subtitle: data.periodo ? `Período ${data.periodo}` : "Facturación total",
      Icon: BanknotesIcon,
      accent: "bg-primary/10 text-primary",
    },
    {
      id: "transacciones",
      title: "Tickets / Transacciones",
      value: Number(data.totalTransacciones || 0).toLocaleString("es-AR"),
      subtitle: "operaciones registradas",
      Icon: ReceiptPercentIcon,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "ticket-promedio",
      title: "Ticket Promedio",
      value: formatCurrency(data.ticketPromedio),
      subtitle: "promedio por transacción",
      Icon: CalculatorIcon,
      accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      id: "top-product",
      title: "Producto Ganador",
      value: topProduct?.nombre || "Sin datos",
      subtitle: topProduct
        ? `${topProduct.unidadesVendidas.toLocaleString("es-AR")} un. · ${formatCurrency(
          topProduct.ingresosGenerados
        )}`
        : "Aún sin ventas",
      Icon: TrophyIcon,
      accent: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      isTextValue: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.22,
            delay: index * 0.05,
            ease: "easeOut",
          }}
          className="rounded-2xl border border-secondary bg-bg-card p-5 shadow-sm flex flex-col justify-between gap-4"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {card.title}
            </span>
            <div className={`p-2 rounded-xl shrink-0 ${card.accent}`}>
              <card.Icon className="h-5 w-5" />
            </div>
          </div>

          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-7 w-32 rounded-lg bg-secondary" />
              <div className="h-3.5 w-24 rounded bg-secondary" />
            </div>
          ) : (
            <div>
              <p
                className={`font-bold text-text-main tracking-tight ${card.isTextValue
                    ? "text-lg line-clamp-1"
                    : "text-2xl tabular-nums"
                  }`}
                title={card.isTextValue ? card.value : undefined}
              >
                {card.value}
              </p>
              <p className="mt-1.5 text-xs text-text-muted">{card.subtitle}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};