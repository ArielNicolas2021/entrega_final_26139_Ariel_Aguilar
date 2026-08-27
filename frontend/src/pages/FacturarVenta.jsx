import { useEffect, useState } from "react";
import { Search, Plus, Minus, Trash2, Save, Calendar, ChevronDown, ShoppingCart } from "lucide-react";

export default function FacturarVenta() {
  const token = localStorage.getItem("token");

  const [productosVenta, setProductosVenta] = useState([]);

  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [fecha, setFecha] = useState(
    new Date().toISOString().split("T")[0]
  );

  /*
   * Por ahora usamos productos de ejemplo.
   * Después los reemplazamos por los productos
   * obtenidos desde /api/productos.
   */
  const productosDisponibles = [
    {
      id: 1,
      nombre: "Mouse inalámbrico",
      precio: 2000,
      stock: 10,
    },
    {
      id: 2,
      nombre: "Teclado mecánico",
      precio: 3500,
      stock: 5,
    },
    {
      id: 3,
      nombre: "Auriculares RGB",
      precio: 4800,
      stock: 8,
    },
  ];

  // =========================
  // AGREGAR PRODUCTO
  // =========================

  const agregarProducto = (producto) => {
    const productoExistente = productosVenta.find(
      (item) => item.id === producto.id
    );

    if (productoExistente) {
      aumentarCantidad(producto.id);
      return;
    }

    setProductosVenta([
      ...productosVenta,
      {
        ...producto,
        cantidad: 1,
      },
    ]);
  };

  // =========================
  // AUMENTAR CANTIDAD
  // =========================

  const aumentarCantidad = (id) => {
    setProductosVenta((productos) =>
      productos.map((producto) => {
        if (producto.id !== id) {
          return producto;
        }

        if (producto.cantidad >= producto.stock) {
          return producto;
        }

        return {
          ...producto,
          cantidad: producto.cantidad + 1,
        };
      })
    );
  };

  // =========================
  // DISMINUIR CANTIDAD
  // =========================

  const disminuirCantidad = (id) => {
    setProductosVenta((productos) =>
      productos
        .map((producto) => {
          if (producto.id !== id) {
            return producto;
          }

          return {
            ...producto,
            cantidad: producto.cantidad - 1,
          };
        })
        .filter((producto) => producto.cantidad > 0)
    );
  };

  // =========================
  // ELIMINAR PRODUCTO
  // =========================

  const eliminarProducto = (id) => {
    setProductosVenta((productos) =>
      productos.filter((producto) => producto.id !== id)
    );
  };

  // =========================
  // LIMPIAR VENTA
  // =========================

  const limpiarVenta = () => {
    setProductosVenta([]);
    setCliente("");
    setMetodoPago("");
    setObservaciones("");
  };

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal = productosVenta.reduce(
    (total, producto) =>
      total + producto.precio * producto.cantidad,
    0
  );

  // =========================
  // DESCUENTO
  // =========================

  const descuento = 0;

  // =========================
  // IMPUESTOS
  // =========================

  const impuestos = subtotal * 0.21;

  // =========================
  // TOTAL
  // =========================

  const total = subtotal - descuento + impuestos;

  // =========================
  // FORMATEAR PRECIO
  // =========================

  const formatPrice = (value) => {
    return value.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  };

  // =========================
  // GUARDAR VENTA
  // =========================

  const guardarVenta = () => {
    if (productosVenta.length === 0) {
      alert("Debés agregar al menos un producto.");
      return;
    }

    const venta = {
      fecha,
      cliente,
      metodoPago,
      observaciones,
      total,
      detalles: productosVenta.map((producto) => ({
        productoId: producto.id,
        cantidad: producto.cantidad,
        subtotal:
          producto.precio * producto.cantidad,
      })),
    };

    console.log("Venta:", venta);

    /*
     * Acá posteriormente hacemos:
     *
     * POST /api/ventas
     *
     * enviando:
     *
     * {
     *   cliente,
     *   fecha,
     *   total,
     *   detalles: [...]
     * }
     */
  };

  {/* ========================= */ }
  { /* TRAEMOS LOS PRODUCTOS DEL BACKEND */ }
  {/* ========================= */ }
  useEffect(() => {
    const getProductos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/productos", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          method: "GET"
        });

        if (!response.ok) { throw new Error(`Error al obtener los productos: ${response.status}`) };

        const data = response.json();
      } catch (error) {
        console.error("Error al obtener los productos: ", error)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Facturar venta</h1>
        <p className="text-gray-500 mt-1">Creá una nueva venta y agregá los productos correspondientes.</p>
      </div>
      {/* ========================= */}
      {/* DATOS DE LA VENTA */}
      {/* ========================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Datos de la venta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <div className="relative">
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  bg-white
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-200
                "
              />
              <Calendar size={18}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  pointer-events-none
                "
              />
            </div>
          </div>

          {/* Método de pago */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Método de pago</label>
            <div className="relative">
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}
                className="
                  w-full
                  appearance-none
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  bg-white
                  text-gray-700
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-200
                "
              >
                <option value="">Seleccionar método</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
              <ChevronDown size={18}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  pointer-events-none
                "
              />
            </div>
          </div>

          {/* Observaciones */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
              <span className="text-gray-400">
                {" "}
                (opcional)
              </span>
            </label>
            <input type="text" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Agregar observaciones..."
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-200
              "
            />
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* PRODUCTOS + RESUMEN */}
      {/* ========================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ========================= */}
        {/* PRODUCTOS */}
        {/* ========================= */}

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header */}

          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Productos</h2>
              <button onClick={() => agregarProducto(productosDisponibles[0])}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  bg-indigo-600
                  hover:bg-indigo-700
                  text-white
                  rounded-xl
                  transition
                "
              >
                <Plus size={18} />
                Agregar producto
              </button>
            </div>

            {/* Buscador */}

            <div className="relative mt-5">
              <Search size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input type="text" placeholder="Buscar producto por nombre o código..."
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  pl-11
                  pr-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-200
                "
              />
            </div>
          </div>

          {/* Tabla */}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-sm text-gray-500">
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
                    <td colSpan="5" className="text-center py-14 text-gray-400">
                      <ShoppingCart size={40} className="mx-auto mb-3 text-gray-300" />
                      No hay productos agregados.
                    </td>
                  </tr>
                ) : (
                  productosVenta.map((producto) => (
                    <tr key={producto.id} className="border-t border-gray-100 hover:bg-gray-50">
                      {/* Producto */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-800">{producto.nombre}</p>
                          <p className="text-sm text-gray-400 mt-1">ID: {producto.id}</p>
                        </div>
                      </td>
                      {/* Precio */}
                      <td className="px-6 py-5 font-medium text-gray-700">{formatPrice(producto.precio)}</td>
                      {/* Cantidad */}
                      <td className="px-6 py-5">
                        <div className="
                          flex
                          items-center
                          justify-center
                          border
                          border-gray-200
                          rounded-lg
                          overflow-hidden
                          w-fit
                          mx-auto
                        ">

                          <button onClick={() => disminuirCantidad(producto.id)} className="px-3 py-2 hover:bg-gray-100">
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-medium">{producto.cantidad}</span>
                          <button onClick={() => aumentarCantidad(producto.id)} className="px-3 py-2 hover:bg-gray-100">
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                      {/* Subtotal */}
                      <td className="px-6 py-5 font-semibold text-gray-800">{formatPrice(producto.precio * producto.cantidad)}</td>
                      {/* Eliminar */}
                      <td className="px-6 py-5">
                        <button onClick={() => eliminarProducto(producto.id)} className="
                          mx-auto
                          flex
                          items-center
                          justify-center
                          w-10
                          h-10
                          rounded-lg
                          border
                          border-red-100
                          text-red-500
                          hover:bg-red-50
                        "
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
            <div className="p-5 border-t border-gray-200">
              <button onClick={limpiarVenta} className="text-sm text-red-500 hover:text-red-600 font-medium">Limpiar venta</button>
            </div>
          )}
        </div>
        {/* ========================= */}
        {/* RESUMEN */}
        {/* ========================= */}
        <div className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          p-6
          h-fit
        "
        >
          <h2 className="text-lg font-semibold text-gray-800">Resumen de la venta</h2>
          <div className="mt-7 space-y-5">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Descuento</span>
              <span className="font-medium">{formatPrice(descuento)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Impuestos (21%)</span>
              <span className="font-medium">{formatPrice(impuestos)}</span>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-indigo-600">{formatPrice(total)}</span>
            </div>
          </div>
          {/* Guardar */}
          <button onClick={guardarVenta} className="
              w-full
              mt-7
              flex
              items-center
              justify-center
              gap-2
              py-3.5
              rounded-xl
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              font-medium
              transition
            "
          >
            <Save size={19} />
            Guardar venta
          </button>
        </div>
      </div>
    </div>
  );
}