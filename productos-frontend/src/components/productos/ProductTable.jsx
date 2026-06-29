import { Pencil, Trash2 } from "lucide-react";

export default function ProductTable({ productos, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-gray-500 text-sm">
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Producto</th>
              <th className="px-6 py-4 text-left">Categoría</th>
              <th className="px-6 py-4 text-left">Precio</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>

            {productos.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">No hay productos registrados.</td>
              </tr>
            )}

            {productos.map((producto) => (
              <tr key={producto.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-6 py-5 font-medium">{producto.id}</td>
                <td className="px-6 py-5">
                  <div>
                    <h3 className="font-semibold text-gray-800">{producto.nombre}</h3>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-600">{producto.categoria?.nombre}</td>
                <td className="px-6 py-5 font-medium">${Number(producto.precio).toLocaleString("es-AR")}</td>
                <td className="px-6 py-5">{producto.stock}</td>
                <td className="px-6 py-5 text-center">

                  {producto.stock > 0 ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">En Stock</span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">Sin Stock</span>
                  )}

                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(producto)} className="p-2 rounded-lg hover:bg-blue-100 transition">
                      <Pencil
                        size={18}
                        className="text-blue-600"
                      />
                    </button>
                    <button onClick={() => onDelete(producto)} className="p-2 rounded-lg hover:bg-red-100 transition">
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
        <span className="text-sm text-gray-500">Mostrando {productos.length} productos</span>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100">←</button>
          <button className="w-10 h-10 rounded-lg bg-indigo-600 text-white">1</button>
          <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100">→</button>
        </div>
      </div>
    </div>
  );
}