import {
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const MarcaTable = ({
  marcas = [],
  loading = false,
  search = "",
  onSearchChange,
  onEdit,
  onDelete,
  onAddMarca,
}) => {
  return (
    <div className="w-full font-sans p-5">
      {/* Header / Acciones superiores */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-text-main">
            Lista de Marcas
          </h2>
          <p className="text-sm font-normal text-text-muted">
            Gestiona las marcas disponibles en tu catálogo.
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
            onClick={onAddMarca}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Añadir marca
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
            placeholder="Buscar marca..."
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
                Categorías
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
                  Cargando marcas...
                </td>
              </tr>
            ) : marcas.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-text-muted">
                  No se encontraron marcas.
                </td>
              </tr>
            ) : (
              marcas.map((marca) => (
                <tr
                  key={marca.id || marca.marcaID}
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
                    {marca.nombre || marca.marca}
                  </td>

                  {/* Categorías */}
                  <td className="px-4 py-4">
                    {Array.isArray(marca.categorias) &&
                      marca.categorias.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {marca.categorias.map((cat, idx) => {
                          const label =
                            typeof cat === "object"
                              ? cat.nombre || cat.categoria
                              : cat;
                          const key =
                            typeof cat === "object" ? cat.id || idx : idx;

                          return (
                            <span
                              key={key}
                              className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-text-main border border-secondary"
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    ) : marca.categoria ? (
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-text-main border border-secondary">
                        {typeof marca.categoria === "object"
                          ? marca.categoria.nombre
                          : marca.categoria}
                      </span>
                    ) : (
                      <span className="text-xs italic text-text-muted">
                        Sin categoría
                      </span>
                    )}
                  </td>

                  {/* Acciones (Editar / Borrar) */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(marca)}
                        className="rounded p-1.5 text-text-muted hover:bg-secondary hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(marca)}
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