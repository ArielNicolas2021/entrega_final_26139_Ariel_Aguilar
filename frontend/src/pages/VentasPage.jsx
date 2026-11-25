import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  EyeIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useFetch as fetchData } from "../utils/useFetch.js";
import { usePaginatedResource } from "../hooks/usePaginatedResource.js";
import { PaginationControls } from "../components/ui/PaginationControls.jsx";
import { VentaDetalleModal } from "../components/ventas/VentaDetalleModal.jsx";
import { CancelarVentaModal } from "../components/ventas/CancelarVentaModal.jsx";
import { Snackbar } from "../components/Snackbar.jsx";

export const VentasPage = () => {
  const navigate = useNavigate();

  const {
    data: ventas,
    meta,
    setPage,
    setSize,
    loading,
    refetch,
  } = usePaginatedResource("ventas", { initialSize: 20 });

  const [search, setSearch] = useState("");
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [ventaToCancel, setVentaToCancel] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: "", type: "success" });

  const handleCloseModal = useCallback(() => setSelectedVenta(null), []);
  const handleCloseCancelModal = useCallback(() => {
    if (!canceling) setVentaToCancel(null);
  }, [canceling]);

  useEffect(() => {
    document.title = "Ventas | Gestión Comercial";
  }, []);

  // Formato de moneda
  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  // Formato de fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  };

  // Cancelar venta (PATCH /ventas/{id}/cancelar)
  // Cancelar venta (PATCH /ventas/{id}/estado)
  const handleConfirmCancel = async (id) => {
    setCanceling(true);
    try {
      const response = await fetchData(`ventas/${id}/estado`, "PATCH", {
        estado: "CANCELADA",
      });

      if (response?.status >= 400 || response?.error) {
        setSnackbar({
          message:
            response?.message || "No se pudo cancelar la venta.",
          type: "error",
        });
        return;
      }

      setSnackbar({
        message: "Venta cancelada correctamente.",
        type: "success",
      });
      setVentaToCancel(null);
      refetch();
    } catch (error) {
      console.error("Error al cancelar la venta:", error);
      setSnackbar({
        message: error?.message || "Ocurrió un error al cancelar la venta.",
        type: "error",
      });
    } finally {
      setCanceling(false);
    }
  };

  // Filtrar ventas por búsqueda
  const filteredVentas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ventas;
    return ventas.filter((v) => {
      const codigo = String(v.codigo || v.id || "").toLowerCase();
      const metodo = (v.metodoPago || "").toLowerCase();
      const fecha = (v.fecha || "").toLowerCase();
      return codigo.includes(q) || metodo.includes(q) || fecha.includes(q);
    });
  }, [ventas, search]);

  const getEstadoBadge = (estadoRaw) => {
    const estado = estadoRaw || "Completada";
    const normalized = estado.toLowerCase();

    if (normalized.includes("cancel") || normalized.includes("anulad")) {
      return {
        label: estado,
        className: "bg-red-500/10 text-red-600 dark:text-red-400",
        isCanceled: true,
      };
    }

    if (normalized.includes("pendiente")) {
      return {
        label: estado,
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        isCanceled: false,
      };
    }

    return {
      label: estado,
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      isCanceled: false,
    };
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-text-main">Ventas</h1>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span>Home</span>
          <span>&gt;</span>
          <span className="font-semibold text-text-main">Ventas</span>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="w-full font-sans rounded-2xl border border-secondary bg-bg-card overflow-hidden shadow-sm">
        <div className="p-5 pb-0">
          {/* Header / Acciones superiores */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-main">
                Lista de Ventas
              </h2>
              <p className="text-sm font-normal text-text-muted">
                Gestiona el historial de ventas y facturación de tu tienda.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-bg-card px-4 py-2.5 text-sm font-medium text-text-main hover:bg-secondary transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </button>
              <button
                type="button"
                onClick={() => navigate("/ventas/facturar")}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-sm"
              >
                <PlusIcon className="h-4 w-4" />
                Nueva venta
              </button>
            </div>
          </div>

          {/* Buscador y Filtro */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-lg border border-secondary bg-bg-card pl-9 pr-4 py-2 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-bg-card px-3 py-2 text-sm font-medium text-text-main hover:bg-secondary transition-colors"
            >
              <FunnelIcon className="h-4 w-4 text-text-muted" />
              Filtro
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto px-5">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-secondary text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th scope="col" className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todas las ventas"
                    className="rounded border-secondary text-primary focus:ring-primary"
                  />
                </th>
                <th scope="col" className="px-4 py-3">
                  Código
                </th>
                <th scope="col" className="px-4 py-3">
                  Fecha
                </th>
                <th scope="col" className="px-4 py-3">
                  Método de Pago
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Total
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Estado
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-text-muted">
                    Cargando ventas...
                  </td>
                </tr>
              ) : filteredVentas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-text-muted">
                    No se encontraron ventas.
                  </td>
                </tr>
              ) : (
                filteredVentas.map((venta) => {
                  const id = venta.id ?? venta.ventaId;
                  const codigo =
                    venta.codigo || `VTA-${String(id).padStart(6, "0")}`;
                  const badge = getEstadoBadge(venta.estado);

                  return (
                    <tr
                      key={id || Math.random()}
                      className="hover:bg-bg-main/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          aria-label={`Seleccionar venta ${codigo}`}
                          className="rounded border-secondary text-primary focus:ring-primary"
                        />
                      </td>

                      {/* Código */}
                      <td className="px-4 py-4 font-mono text-xs font-semibold text-primary">
                        {codigo}
                      </td>

                      {/* Fecha */}
                      <td className="px-4 py-4 text-text-muted text-xs">
                        {formatDate(venta.fecha)}
                      </td>

                      {/* Método de Pago */}
                      <td className="px-4 py-4 font-semibold text-text-main">
                        {venta.metodoPago || "Efectivo"}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4 text-right font-bold text-text-main">
                        {formatMoney(venta.total)}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedVenta(venta)}
                            className="rounded p-1.5 text-text-muted hover:bg-secondary hover:text-primary transition-colors"
                            title="Ver Detalle"
                            aria-label={`Ver detalle de ${codigo}`}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>

                          {!badge.isCanceled && (
                            <button
                              type="button"
                              onClick={() => setVentaToCancel(venta)}
                              className="rounded p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
                              title="Cancelar Venta"
                              aria-label={`Cancelar venta ${codigo}`}
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación conectada a Spring Data Page */}
        <PaginationControls
          meta={meta}
          onPageChange={setPage}
          onSizeChange={setSize}
          disabled={loading}
        />
      </div>

      {/* Modal Detalle */}
      <VentaDetalleModal
        venta={selectedVenta}
        onClose={handleCloseModal}
        formatMoney={formatMoney}
        formatDate={formatDate}
      />

      {/* Modal Confirmar Cancelación */}
      <CancelarVentaModal
        venta={ventaToCancel}
        loading={canceling}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        formatMoney={formatMoney}
      />

      {/* Snackbar Feedback */}
      {snackbar.message && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar({ message: "", type: "success" })}
        />
      )}
    </div>
  );
};