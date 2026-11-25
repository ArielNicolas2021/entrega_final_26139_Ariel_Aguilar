import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFetch as fetchData } from "../../utils/useFetch.js";

const defaultFormatMoney = (amount) =>
  Number(amount || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

const defaultFormatDate = (dateStr) => {
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

export const VentaDetalleModal = ({
  venta,
  onClose,
  formatMoney = defaultFormatMoney,
  formatDate = defaultFormatDate,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [ventaCompleta, setVentaCompleta] = useState(null);
  const [productosMap, setProductosMap] = useState({});
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState(null);

  // Caché en memoria de nombres por productoID para evitar re-fetches
  const productosCacheRef = useRef({});

  const ventaId = venta?.id ?? venta?.ventaId;

  useEffect(() => {
    if (!ventaId) {
      setVentaCompleta(null);
      setErrorDetalle(null);
      return;
    }

    let isMounted = true;

    const getDetalleYProductos = async () => {
      setLoadingDetalle(true);
      setErrorDetalle(null);

      try {
        const response = await fetchData(`ventas/${ventaId}`, "GET");
        if (!isMounted) return;

        const ventaData = Array.isArray(response)
          ? { ...venta, detalleVenta: response }
          : response && typeof response === "object"
            ? { ...venta, ...response }
            : venta;

        setVentaCompleta(ventaData);

        const detalles = Array.isArray(ventaData?.detalleVenta)
          ? ventaData.detalleVenta
          : Array.isArray(ventaData?.detalles)
            ? ventaData.detalles
            : [];

        // IDs únicos que aún no están en caché ni traen el nombre embebido
        const idsFaltantes = [
          ...new Set(
            detalles
              .filter(
                (item) =>
                  !item.nombreProducto &&
                  !item.producto?.nombre &&
                  (item.productoID ?? item.productoId) != null
              )
              .map((item) => item.productoID ?? item.productoId)
              .filter((id) => !(id in productosCacheRef.current))
          ),
        ];

        if (idsFaltantes.length > 0) {
          const results = await Promise.allSettled(
            idsFaltantes.map(async (id) => {
              const prod = await fetchData(`productos/${id}`, "GET");
              return { id, nombre: prod?.nombre };
            })
          );

          if (!isMounted) return;

          results.forEach((res) => {
            if (res.status === "fulfilled" && res.value?.nombre) {
              productosCacheRef.current[res.value.id] = res.value.nombre;
            }
          });
        }

        if (isMounted) {
          setProductosMap({ ...productosCacheRef.current });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error al obtener el detalle de la venta:", error);
        setErrorDetalle("No se pudo cargar el detalle de los productos.");
      } finally {
        if (isMounted) setLoadingDetalle(false);
      }
    };

    getDetalleYProductos();

    return () => {
      isMounted = false;
    };
  }, [ventaId]);

  useEffect(() => {
    if (!venta) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [venta, onClose]);

  const data = ventaCompleta || venta;
  const items = Array.isArray(data?.detalleVenta)
    ? data.detalleVenta
    : Array.isArray(data?.detalles)
      ? data.detalles
      : [];

  const titleId = "venta-detalle-modal-title";

  return (
    <AnimatePresence>
      {venta && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
        >
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.96, y: 10 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 340,
              duration: prefersReducedMotion ? 0 : undefined,
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-bg-card rounded-2xl border border-secondary shadow-xl p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-secondary pb-3">
              <h3 id={titleId} className="text-lg font-bold text-text-main">
                Detalle de Venta {data.codigo || `#${ventaId}`}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className="p-1 text-text-muted hover:text-text-main hover:bg-secondary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Metadatos de la venta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-text-muted">
              <p>
                <strong className="text-text-main">Fecha:</strong>{" "}
                {formatDate(data.fecha)}
              </p>
              <p>
                <strong className="text-text-main">Método de Pago:</strong>{" "}
                {data.metodoPago || "Efectivo"}
              </p>
              {data.observaciones && (
                <p className="sm:col-span-2">
                  <strong className="text-text-main">Observaciones:</strong>{" "}
                  {data.observaciones}
                </p>
              )}
            </div>

            {/* Listado de artículos */}
            <div className="border border-secondary rounded-xl overflow-hidden text-xs">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-bg-main text-text-muted font-semibold border-b border-secondary">
                    <tr>
                      <th className="px-3 py-2.5">Producto</th>
                      <th className="px-3 py-2.5 text-center">Cant.</th>
                      <th className="px-3 py-2.5 text-right">Precio Unit.</th>
                      <th className="px-3 py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary">
                    {loadingDetalle ? (
                      Array.from({ length: 3 }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="px-3 py-2.5">
                            <div className="h-3.5 w-32 rounded bg-secondary" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="mx-auto h-3.5 w-8 rounded bg-secondary" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="ml-auto h-3.5 w-16 rounded bg-secondary" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="ml-auto h-3.5 w-20 rounded bg-secondary" />
                          </td>
                        </tr>
                      ))
                    ) : errorDetalle ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-3 py-4 text-center text-red-500 font-medium"
                        >
                          {errorDetalle}
                        </td>
                      </tr>
                    ) : items.length > 0 ? (
                      items.map((item, i) => {
                        const prodId = item.productoID ?? item.productoId;
                        const nombreProducto =
                          productosMap[prodId] ||
                          item.nombreProducto ||
                          item.producto?.nombre ||
                          (typeof item.producto === "string"
                            ? item.producto
                            : null) ||
                          `Producto #${prodId ?? i + 1}`;
                        const precio = item.precioVenta ?? item.precio ?? 0;
                        const subtotal =
                          item.subtotal ??
                          Number(precio) * Number(item.cantidad || 0);

                        return (
                          <tr
                            key={item.id ?? `${prodId}-${i}`}
                            className="hover:bg-bg-main/40 transition-colors"
                          >
                            <td className="px-3 py-2.5 text-text-main font-medium">
                              <span>{nombreProducto}</span>
                              {prodId != null && (
                                <span className="ml-1.5 text-[11px] font-normal text-text-muted">
                                  #{prodId}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-center text-text-muted">
                              {item.cantidad}
                            </td>
                            <td className="px-3 py-2.5 text-right text-text-muted">
                              {formatMoney(precio)}
                            </td>
                            <td className="px-3 py-2.5 text-right text-text-main font-semibold">
                              {formatMoney(subtotal)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-3 py-4 text-center text-text-muted"
                        >
                          Sin desglose de productos.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-secondary">
              <span className="text-sm font-bold text-text-main">Total:</span>
              <span className="text-base font-bold text-primary">
                {formatMoney(data.total)}
              </span>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-secondary text-text-main hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};