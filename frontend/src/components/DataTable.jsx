export const DataTable = ({
  data = [],
  columns = [],
  emptyMessage = "No hay datos disponibles",
}) => {
  const hasData = data.length > 0;

  // Formateador de moneda (ej: 12500 -> $ 12.500,00)
  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return val;

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const renderCellContent = (item, key, label, render) => {
    // 1. Prioridad a la función render personalizada si existe
    if (render) {
      return render(item);
    }

    // Normalizar la etiqueta para evitar fallos por tildes o mayúsculas
    const normalizedLabel = label
      ?.toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // 2. Formato especial para columnas de Precio o Costo
    if (normalizedLabel === "precio" || normalizedLabel === "costo") {
      return formatCurrency(item[key]);
    }

    // 3. Renderizado automático de imágenes
    if (normalizedLabel === "imagen") {
      return (
        <img
          src={item[key]}
          alt={item.nombre || item.name || "Imagen de la fila"}
          className="w-12 h-12 object-cover rounded-lg"
        />
      );
    }

    // 4. Valor por defecto
    return item[key];
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-gray-500">
            {columns.map(([key, label]) => (
              <th key={key} className="px-6 py-4 text-left font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!hasData ? (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="text-center py-10 text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id ?? index}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columns.map(([key, label, render]) => (
                  <td key={key} className="px-6 py-4 text-gray-600">
                    {renderCellContent(item, key, label, render)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
