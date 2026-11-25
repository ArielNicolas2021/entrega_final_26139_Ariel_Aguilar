import {
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const CategoriaTable = ({
  categorias = [],
  loading = false,
  search = "",
  onSearchChange,
  onEdit,
  onDelete,
  onAddCategoria,
}) => {
  return (
    <div className="w-full font-sans p-5">
      {/* Header / Acciones superiores */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-text-main">
            Lista de Categorías
          </h2>
          <p className="text-sm font-normal text-text-muted">
            Gestiona las categorías de productos de tu tienda.
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
            onClick={onAddCategoria}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Añadir categoría
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
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Buscar categoría..."
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-secondary text-xs font-semibold uppercase tracking-wider text-text-muted">
              <th scope="col" className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  className="rounded border-secondary text-primary focus:ring-primary"
                />
              </th>
              <th scope="col" className="px-4 py-3">
                Nombre
              </th>
              <th scope="col" className="px-4 py-3">
                Descripción
              </th>
              <th scope="col" className="px-4 py-3 text-center w-32">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-text-muted">
                  Cargando categorías...
                </td>
              </tr>
            ) : categorias.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-text-muted">
                  No se encontraron categorías.
                </td>
              </tr>
            ) : (
              categorias.map((categoria) => (
                <tr
                  key={categoria.id || categoria.categoriaID}
                  className="hover:bg-bg-main/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-secondary text-primary focus:ring-primary"
                    />
                  </td>

                  {/* Nombre */}
                  <td className="px-4 py-4 font-semibold text-text-main">
                    {categoria.nombre}
                  </td>

                  {/* Descripción */}
                  <td className="px-4 py-4 text-text-muted">
                    {categoria.descripcion ? (
                      categoria.descripcion
                    ) : (
                      <span className="italic text-xs">Sin descripción</span>
                    )}
                  </td>

                  {/* Acciones (Editar / Borrar) */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(categoria)}
                        className="rounded p-1.5 text-text-muted hover:bg-secondary hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(categoria)}
                        className="rounded p-1.5 text-text-muted hover:bg-secondary hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};