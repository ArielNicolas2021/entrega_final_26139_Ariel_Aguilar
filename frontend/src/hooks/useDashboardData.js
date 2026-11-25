import { useState, useEffect, useCallback } from "react";
import { useFetch as fetchData } from "../utils/useFetch.js";

const EMPTY_DASHBOARD = {
  periodo: "",
  totalVentas: 0,
  totalTransacciones: 0,
  ticketPromedio: 0,
  productosGanadores: [],
};

export const useDashboardData = (periodo = "") => {
  const [data, setData] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const endpoint = periodo ? `dashboard?periodo=${periodo}` : "dashboard";
    const response = await fetchData(endpoint, "GET");

    if (!response || response.error || response.status >= 400) {
      setError(
        response?.message || "No se pudieron cargar las métricas del dashboard."
      );
      setLoading(false);
      return;
    }

    const totalVentas = Number(response.totalVentas ?? 0);
    const totalTransacciones = Number(response.totalTransacciones ?? 0);

    const productosGanadores = Array.isArray(response.productosGanadores)
      ? response.productosGanadores.map((prod) => ({
        productoId: prod.productoId,
        nombre: prod.nombre ?? "Producto sin nombre",
        unidadesVendidas: Number(prod.unidadesVendidas ?? 0),
        ingresosGenerados: Number(prod.ingresosGenerados ?? 0),
      }))
      : [];

    setData({
      periodo: response.periodo ?? "",
      totalVentas,
      totalTransacciones,
      ticketPromedio:
        totalTransacciones > 0 ? totalVentas / totalTransacciones : 0,
      productosGanadores,
    });

    setLoading(false);
  }, [periodo]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return { data, loading, error, refetch: loadDashboard };
};