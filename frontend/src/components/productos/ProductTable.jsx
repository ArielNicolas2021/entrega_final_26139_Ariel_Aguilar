import { motion, useReducedMotion } from "motion/react";
import {
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const ProductTable = ({
  products = [],
  loading = false,
  search = "",
  onSearchChange,
  onEdit,
  onDelete,
  onAddProduct,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full font-sans p-5">
      {/* Header / Acciones superiores */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-text-main">
            Lista de Productos
          </h2>
          <p className="text-sm font-normal text-text-muted">
            Gestiona el catálogo de productos de tu tienda.
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
          <motion.button
            type="button"
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            onClick={onAddProduct}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Añadir producto
          </motion.button>
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
            onChange={(e) => onSearchChange?.(e.target.value)}
            aria-label="Buscar producto por nombre, código, categoría o marca"
            placeholder="Buscar por nombre, código, categoría..."
            className="w-full rounded-lg border border-secondary bg-bg-card pl-9 pr-4 py-2 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-secondary text-xs font-semibold uppercase tracking-wider text-text-muted">
              <th scope="col" className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Seleccionar todos los productos"
                  className="rounded border-secondary text-primary focus:ring-primary"
                />
              </th>
              <th scope="col" className="px-4 py-3">
                Imagen
              </th>
              <th scope="col" className="px-4 py-3">
                Código
              </th>
              <th scope="col" className="px-4 py-3">
                Nombre
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Costo
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Precio
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Stock
              </th>
              <th scope="col" className="px-4 py-3">
                Categoría
              </th>
              <th scope="col" className="px-4 py-3">
                Marca
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {loading ? (
              <tr>
                <td colSpan="10" className="py-10 text-center text-text-muted">
                  Cargando productos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-10 text-center text-text-muted">
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              products.map((product, index) => {
                const isOutOfStock = Number(product.stock) <= 0;

                return (
                  <motion.tr
                    key={product.id}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.18,
                      delay: Math.min(index * 0.025, 0.25),
                    }}
                    className="hover:bg-bg-main/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        aria-label={`Seleccionar ${product.nombre}`}
                        className="rounded border-secondary text-primary focus:ring-primary"
                      />
                    </td>

                    {/* Imagen */}
                    <td className="px-4 py-4">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bg-main border border-secondary">
                        {product.imagenUrl ? (
                          <img
                            src={product.imagenUrl}
                            alt={product.nombre}
                            loading="lazy"
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[11px] text-text-muted">
                            Sin img
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-text-muted font-mono text-xs">
                      {product.codigo}
                    </td>

                    {/* Nombre */}
                    <td className="px-4 py-4 font-semibold text-text-main">
                      {product.nombre}
                    </td>

                    {/* Costo */}
                    <td className="px-4 py-4 text-right text-text-main">
                      $
                      {Number(product.costo).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Precio */}
                    <td className="px-4 py-4 text-right text-text-main font-medium">
                      $
                      {Number(product.precioVenta).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isOutOfStock
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          }`}
                      >
                        {isOutOfStock ? "Agotado" : `${product.stock} un.`}
                      </span>
                    </td>

                    {/* Categoría */}
                    <td className="px-4 py-4 font-medium text-text-main">
                      {product.categoria}
                    </td>

                    {/* Marca */}
                    <td className="px-4 py-4">
                      {product.marca ? (
                        <span className="font-medium text-text-main">
                          {product.marca}
                        </span>
                      ) : (
                        <span className="text-xs italic text-text-muted">
                          Sin marca
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(product)}
                          className="rounded p-1.5 text-text-muted hover:bg-secondary hover:text-primary transition-colors"
                          title="Editar"
                          aria-label={`Editar ${product.nombre}`}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(product)}
                          className="rounded p-1.5 text-text-muted hover:bg-secondary hover:text-red-500 transition-colors"
                          title="Eliminar"
                          aria-label={`Eliminar ${product.nombre}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};