import { Pencil, Trash2 } from "lucide-react";

export default function CategoriaTable({ categorias, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-gray-500 text-sm">
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Categoría</th>
              <th className="px-6 py-4 text-left">Descripción</th>
            </tr>
          </thead>
          <tbody>

            {categorias.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-400">No hay categorías registradas.</td>
              </tr>
            )}

            {categorias.map((categoria) => (
              <tr key={categoria.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-6 py-5 font-medium">{categoria.id}</td>
                <td className="px-6 py-5">
                  <div>
                    <h3 className="font-semibold text-gray-800">{categoria.nombre}</h3>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-600">{categoria.descripcion}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(categoria)} className="p-2 rounded-lg hover:bg-blue-100 transition">
                      <Pencil
                        size={18}
                        className="text-blue-600"
                      />
                    </button>
                    <button onClick={() => onDelete(categoria)} className="p-2 rounded-lg hover:bg-red-100 transition">
                      <Trash2
                        size={18}
                        className="text-red-500"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">Mostrando {categorias.length} categorías</span>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100">←</button>
          <button className="w-10 h-10 rounded-lg bg-indigo-600 text-white">1</button>
          <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100">→</button>
        </div>
      </div>
    </div>
  );
}