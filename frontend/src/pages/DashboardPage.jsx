import { useState, useEffect } from "react";
import { ArrowPathIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { KpiCards } from "../components/dashboard/KpiCards.jsx";
import { SalesContributionChart } from "../components/dashboard/SalesContributionChart.jsx";
import { TopProductsCard } from "../components/dashboard/TopProductsCard.jsx";

export const DashboardPage = () => {
  // Por defecto vacío para que GET /api/dashboard traiga el período actual del backend
  const [selectedPeriodo, setSelectedPeriodo] = useState("");

  const { data, loading, error, refetch } = useDashboardData(selectedPeriodo);

  useEffect(() => {
    document.title = "Dashboard | Gestión Comercial";
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Encabezado + Filtro de período (YYYY-MM) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-text-main">Dashboard</h1>
            {data.periodo && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-secondary bg-bg-card px-2.5 py-0.5 text-xs font-semibold text-primary">
                <CalendarIcon className="h-3.5 w-3.5" />
                {data.periodo}
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Resumen de ventas, transacciones y productos ganadores del período.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="dashboard-periodo" className="sr-only">
            Seleccionar período (mes y año)
          </label>
          <input
            id="dashboard-periodo"
            type="month"
            value={selectedPeriodo || data.periodo}
            onChange={(e) => setSelectedPeriodo(e.target.value)}
            className="rounded-lg border border-secondary bg-bg-card px-3 py-1.5 text-xs font-semibold text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />

          <button
            type="button"
            onClick={refetch}
            disabled={loading}
            aria-label="Actualizar métricas"
            title="Actualizar métricas"
            className="p-2 rounded-lg border border-secondary bg-bg-card text-text-muted hover:bg-secondary hover:text-text-main transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mensaje de error con reintento */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-600 dark:text-red-400 flex items-center justify-between gap-3"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={refetch}
            className="font-semibold underline hover:no-underline shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tarjetas KPI */}
      <KpiCards data={data} loading={loading} />

      {/* Gráfico de rendimiento + Ranking de productos ganadores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesContributionChart
            products={data.productosGanadores}
            totalVentas={data.totalVentas}
            periodo={data.periodo}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-1">
          <TopProductsCard
            products={data.productosGanadores}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};