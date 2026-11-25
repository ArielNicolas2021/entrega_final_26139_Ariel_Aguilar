import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Save,
  Calendar,
  ChevronDown,
  ShoppingCart,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useFetch as fetchData } from "../utils/useFetch.js";
import { extractList } from "../utils/pagination.js";

const getCurrentLocalDateTimeInput = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatToLocalDateTime = (value) => {
  if (!value) {
    const now = new Date();
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${getCurrentLocalDateTimeInput()}:${seconds}`;
  }

  const trimmed = value.trim();
  // Si viene de <input type="datetime-local"> ("YYYY-MM-DDTHH:mm")
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    const seconds = String(new Date().getSeconds()).padStart(2, "0");
    return `${trimmed}:${seconds}`;
  }
  // Si ya tiene segundos ("YYYY-MM-DDTHH:mm:ss")
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  // Si viene solo fecha ("YYYY-MM-DD")
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${trimmed}T${hh}:${mm}:${ss}`;
  }

  return trimmed;
};

export default function FacturarVenta() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Catálogo desde el backend
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  // Buscador / Dropdown de selección
  const [busqueda, setBusqueda] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buscadorRef = useRef(null);

  // Carrito de la venta
  const [productosVenta, setProductosVenta] = useState([]);

  // Datos de cabecera de la venta
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [observaciones, setObservaciones] = useState("");
  const [fecha, setFecha] = useState(getCurrentLocalDateTimeInput);

  // Estado de envío y feedback
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // =========================
  // CARGAR PRODUCTOS DEL BACKEND
  // =========================
  useEffect(() => {
    document.title = "Facturar Venta | Gestión Comercial";

    const getProductos = async () => {
      setLoadingProductos(true);
      try {
        const data = await fetchData("productos?size=1000", "GET");
        setProductosDisponibles(extractList(data));
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setFeedback({
          type: "error",
          message: "No se pudieron cargar los productos disponibles.",
        });
      } finally {
        setLoadingProductos(false);
      }
    };

    getProductos();
  }, []);

  // Cerrar dropdown al hacer clic fuera o presionar Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buscadorRef.current && !buscadorRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Filtrado de productos para el selector
  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productosDisponibles;
    return productosDisponibles.filter((p) => {
      const id = String(p.id ?? p.productoId ?? "").toLowerCase();
      const nombre = (p.nombre || "").toLowerCase();
      const codigo = (p.codigo || "").toLowerCase();
      return nombre.includes(q) || id.includes(q) || codigo.includes(q);
    });
  }, [productosDisponibles, busqueda]);

  // =========================
  // GESTIÓN DE PRODUCTOS EN VENTA
  // =========================
  const agregarProducto = (producto) => {
    const prodId = producto.id ?? producto.productoId;
    const stockDisponible = Number(producto.stock ?? 0);

    if (stockDisponible <= 0) {
      setFeedback({
        type: "error",
        message: `El producto "${producto.nombre}" no tiene stock disponible.`,
      });
      return;
    }

    setFeedback(null);

    setProductosVenta((prev) => {
      const existente = prev.find((item) => item.id === prodId);
      if (existente) {
        if (existente.cantidad >= stockDisponible) {
          setFeedback({
            type: "error",
            message: `Stock máximo alcanzado (${stockDisponible} unid.) para "${producto.nombre}".`,
          });
          return prev;
        }
        return prev.map((item) =>
          item.id === prodId ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      return [
        ...prev,
        {
          id: prodId,
          nombre: producto.nombre,
          precioVenta: Number(producto.precioVenta ?? 0),
          stock: stockDisponible,
          cantidad: 1,
        },
      ];
    });

    setBusqueda("");
    setDropdownOpen(false);
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    const parsed = parseInt(nuevaCantidad, 10);
    if (isNaN(parsed)) return;

    if (parsed <= 0) {
      eliminarProducto(id);
      return;
    }

    setProductosVenta((prev) =>
      prev.map((producto) => {
        if (producto.id !== id) return producto;
        const cantidadFinal = Math.min(parsed, producto.stock);
        return { ...producto, cantidad: cantidadFinal };
      })
    );
  };

  const aumentarCantidad = (id) => {
    setProductosVenta((prev) =>
      prev.map((producto) => {
        if (producto.id !== id || producto.cantidad >= producto.stock) {
          return producto;
        }
        return { ...producto, cantidad: producto.cantidad + 1 };
      })
    );
  };

  const disminuirCantidad = (id) => {
    setProductosVenta((prev) =>
      prev
        .map((producto) =>
          producto.id === id
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        )
        .filter((producto) => producto.cantidad > 0)
    );
  };

  const eliminarProducto = (id) => {
    setProductosVenta((prev) => prev.filter((producto) => producto.id !== id));
  };

  const limpiarVenta = () => {
    setProductosVenta([]);
    setMetodoPago("EFECTIVO");
    setObservaciones("");
    setFecha(getCurrentLocalDateTimeInput());
    setFeedback(null);
  };

  // =========================
  // CÁLCULOS DE TOTALES
  // =========================
  const subtotal = productosVenta.reduce(
    (acc, producto) => acc + producto.precioVenta * producto.cantidad,
    0
  );
  const descuento = 0;
  const impuestos = subtotal * 0.21;
  const total = subtotal - descuento + impuestos;

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  // =========================
  // GUARDAR VENTA (POST /api/ventas)
  // =========================
  const guardarVenta = async () => {
    if (productosVenta.length === 0) {
      setFeedback({
        type: "error",
        message: "Debés agregar al menos un producto para generar la venta.",
      });
      return;
    }

    if (!metodoPago) {
      setFeedback({
        type: "error",
        message: "Seleccioná un método de pago.",
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const payload = {
      fecha: formatToLocalDateTime(fecha), // Ej: "2026-10-15T18:30:00"
      metodoPago,
      observaciones: observaciones.trim() || null,
      total,
      detalleVenta: productosVenta.map((producto) => ({
        productoID: producto.id,
        cantidad: producto.cantidad,
      })),
    };

    try {
      const response = await fetchData("ventas", "POST", payload);

      if (response?.status >= 400 || response?.error) {
        setFeedback({
          type: "error",
          message:
            response?.message || "Ocurrió un error al registrar la venta.",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: "Venta registrada correctamente.",
      });

      setTimeout(() => {
        navigate("/ventas");
      }, 900);
    } catch (error) {
      console.error("Error al guardar la venta:", error);
      setFeedback({
        type: "error",
        message: error?.message || "Ocurrió un error al registrar la venta.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Facturar venta</h1>
          <p className="text-text-muted mt-1">
            Creá una nueva venta y agregá los productos correspondientes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/ventas")}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-xl border border-secondary bg-bg-card text-sm font-medium text-text-main hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={17} />
          Volver a Ventas
        </button>
      </div>

      {/* Alerta de feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            role="alert"
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${feedback.type === "success"
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0" />
            ) : (
              <AlertCircle size={18} className="shrink-0" />
            )}
            <span>{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================= */}
      {/* DATOS DE LA VENTA */}
      {/* ========================= */}
      <div className="bg-bg-card rounded-2xl border border-secondary shadow-sm p-6">
        <h2 className="text-lg font-semibold text-text-main mb-6">
          Datos de la venta
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Fecha y hora */}
          <div>
            <label
              htmlFor="venta-fecha"
              className="block text-sm font-medium text-text-main mb-2"
            >
              Fecha y hora
            </label>
            <div className="relative">
              <input
                id="venta-fecha"
                type="datetime-local"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-secondary rounded-xl px-4 py-3 bg-bg-card text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all scheme:light dark:scheme:dark"
              />
              <Calendar
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <label
              htmlFor="venta-metodo-pago"
              className="block text-sm font-medium text-text-main mb-2"
            >
              Método de pago
            </label>
            <div className="relative">
              <select
                id="venta-metodo-pago"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full appearance-none border border-secondary rounded-xl px-4 py-3 bg-bg-card text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="" className="bg-bg-card text-text-main">
                  Seleccionar método
                </option>
                <option value="EFECTIVO" className="bg-bg-card text-text-main">
                  Efectivo
                </option>
                <option value="TARJETA" className="bg-bg-card text-text-main">
                  Tarjeta
                </option>
                <option
                  value="TRANSFERENCIA"
                  className="bg-bg-card text-text-main"
                >
                  Transferencia
                </option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label
              htmlFor="venta-observaciones"
              className="block text-sm font-medium text-text-main mb-2"
            >
              Observaciones{" "}
              <span className="text-text-muted">(opcional)</span>
            </label>
            <input
              id="venta-observaciones"
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Agregar observaciones..."
              className="w-full border border-secondary rounded-xl px-4 py-3 bg-bg-card text-text-main placeholder-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* PRODUCTOS + RESUMEN */}
      {/* ========================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* PRODUCTOS */}
        <div className="xl:col-span-2 bg-bg-card rounded-2xl border border-secondary shadow-sm overflow-visible">
          {/* Header + Buscador selector */}
          <div className="p-6 border-b border-secondary">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-main">Productos</h2>
              <span className="text-xs font-medium text-text-muted">
                {loadingProductos
                  ? "Cargando catálogo..."
                  : `${productosDisponibles.length} productos disponibles`}
              </span>
            </div>

            {/* Buscador con resultados desplegables */}
            <div ref={buscadorRef} className="relative mt-4">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="text"
                role="combobox"
                aria-expanded={dropdownOpen}
                aria-controls="catalogo-productos-listbox"
                aria-label="Buscar producto por nombre o ID"
                value={busqueda}
                onFocus={() => setDropdownOpen(true)}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setDropdownOpen(true);
                }}
                placeholder="Buscar y seleccionar producto por nombre o ID..."
                className="w-full border border-secondary rounded-xl pl-11 pr-4 py-3 bg-bg-card text-text-main placeholder-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />

              {/* Lista desplegable de productos */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    id="catalogo-productos-listbox"
                    role="listbox"
                    initial={
                      prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 4 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.14 }}
                    className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-secondary bg-bg-card shadow-xl divide-y divide-secondary"
                  >
                    {loadingProductos ? (
                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-text-muted">
                        <Loader2 size={18} className="animate-spin" />
                        Cargando productos...
                      </div>
                    ) : productosFiltrados.length === 0 ? (
                      <div className="py-6 text-center text-sm text-text-muted">
                        No se encontraron productos para "{busqueda}".
                      </div>
                    ) : (
                      productosFiltrados.map((prod) => {
                        const prodId = prod.id ?? prod.productoId;
                        const sinStock = Number(prod.stock ?? 0) <= 0;
                        const enCarrito = productosVenta.find(
                          (item) => item.id === prodId
                        );

                        return (
                          <button
                            key={prodId}
                            type="button"
                            role="option"
                            aria-selected={Boolean(enCarrito)}
                            disabled={sinStock}
                            onClick={() => agregarProducto(prod)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-secondary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-text-muted overflow-hidden">
                                <img
                                  src={prod.imagenUrl}
                                  alt={prod.nombre}
                                  loading="lazy"
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="truncate">
                                <p className="text-sm font-semibold text-text-main truncate">
                                  {prod.nombre}
                                </p>
                                <p className="text-xs text-text-muted">
                                  ID #{prodId} · Stock:{" "}
                                  <span
                                    className={
                                      sinStock
                                        ? "text-red-500 font-semibold"
                                        : "text-text-main font-medium"
                                    }
                                  >
                                    {prod.stock ?? 0}
                                  </span>
                                  {enCarrito && (
                                    <span className="ml-2 text-primary font-medium">
                                      ({enCarrito.cantidad} en carrito)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 ml-3">
                              <span className="text-sm font-bold text-text-main">
                                {formatPrice(prod.precioVenta)}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-white">
                                <Plus size={14} />
                                Agregar
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Tabla de productos seleccionados */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-main/60 border-b border-secondary">
                <tr className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="text-left px-6 py-4">Producto</th>
                  <th className="text-left px-6 py-4">Precio unitario</th>
                  <th className="text-center px-6 py-4">Cantidad</th>
                  <th className="text-left px-6 py-4">Subtotal</th>
                  <th className="text-center px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosVenta.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-14 text-text-muted"
                    >
                      <ShoppingCart
                        size={40}
                        className="mx-auto mb-3 text-text-muted/50"
                      />
                      Buscá y seleccioná un producto arriba para comenzar.
                    </td>
                  </tr>
                ) : (
                  productosVenta.map((producto) => (
                    <tr
                      key={producto.id}
                      className="border-t border-secondary hover:bg-bg-main/40 transition-colors"
                    >
                      {/* Producto */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-text-main">
                            {producto.nombre}
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            ID: {producto.id} · Disp: {producto.stock}
                          </p>
                        </div>
                      </td>

                      {/* Precio */}
                      <td className="px-6 py-5 font-medium text-text-main">
                        {formatPrice(producto.precioVenta)}
                      </td>

                      {/* Cantidad editable */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center border border-secondary rounded-lg overflow-hidden w-fit mx-auto bg-bg-card text-text-main">
                          <button
                            type="button"
                            onClick={() => disminuirCantidad(producto.id)}
                            aria-label="Disminuir cantidad"
                            className="px-3 py-2 text-text-main hover:bg-secondary transition-colors"
                          >
                            <Minus size={15} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={producto.stock}
                            value={producto.cantidad}
                            onChange={(e) =>
                              actualizarCantidad(producto.id, e.target.value)
                            }
                            aria-label={`Cantidad de ${producto.nombre}`}
                            className="w-12 text-center font-medium text-sm bg-transparent text-text-main outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            onClick={() => aumentarCantidad(producto.id)}
                            disabled={producto.cantidad >= producto.stock}
                            aria-label="Aumentar cantidad"
                            className="px-3 py-2 text-text-main hover:bg-secondary disabled:opacity-40 transition-colors"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="px-6 py-5 font-semibold text-text-main">
                        {formatPrice(producto.precioVenta * producto.cantidad)}
                      </td>

                      {/* Eliminar */}
                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() => eliminarProducto(producto.id)}
                          aria-label={`Eliminar ${producto.nombre}`}
                          className="mx-auto flex items-center justify-center w-10 h-10 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Limpiar */}
          {productosVenta.length > 0 && (
            <div className="p-5 border-t border-secondary">
              <button
                type="button"
                onClick={limpiarVenta}
                className="text-sm text-red-500 hover:text-red-400 font-medium transition-colors"
              >
                Limpiar venta
              </button>
            </div>
          )}
        </div>

        {/* RESUMEN */}
        <div className="bg-bg-card rounded-2xl border border-secondary shadow-sm p-6 h-fit">
          <h2 className="text-lg font-semibold text-text-main">
            Resumen de la venta
          </h2>
          <div className="mt-7 space-y-5">
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-medium text-text-main">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Descuento</span>
              <span className="font-medium text-text-main">
                {formatPrice(descuento)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Impuestos (21%)</span>
              <span className="font-medium text-text-main">
                {formatPrice(impuestos)}
              </span>
            </div>
          </div>
          <div className="border-t border-secondary mt-6 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-text-main">Total</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Guardar */}
          <button
            type="button"
            disabled={saving || productosVenta.length === 0}
            onClick={guardarVenta}
            className="w-full mt-7 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Guardando venta...
              </>
            ) : (
              <>
                <Save size={19} />
                Guardar venta
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}