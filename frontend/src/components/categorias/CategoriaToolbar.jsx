import { Search, Plus, Download, SlidersHorizontal } from "lucide-react";

export default function CategoriaToolbar({ search, setSearch, onNewCategoria, onExport, onFilter }) {
  return (
    <div className="bg-white rounded-2xl mb-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 px-6 py-5 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Lista de Categorías</h2>
          <p className="text-gray-500 mt-1">Administrá todas las categorías del sistema.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onExport} className="flex justify-center items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition">
            <Download size={18} />
            Exportar
          </button>
          <button onClick={onNewCategoria} className="flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition">
            <Plus size={18} />
            Nueva Categoria
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex flex-col sm:flex-row justify-between gap-5 px-6 py-5">
        <div className="relative w-full sm:w-96">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar categoría..." className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200" />
        </div>
        <button onClick={onFilter} className="flex justify-center items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50">
          <SlidersHorizontal size={18} />
          Filtros
        </button>
      </div>
    </div>
  );
}