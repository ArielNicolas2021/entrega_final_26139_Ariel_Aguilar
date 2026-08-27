export const DataTable = ({ data = [], columns = [], emptyMessage = "No hay datos disponibles" }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-gray-500">
            {columns.map(([key, label]) => (
              <th
                key={key}
                className="px-6 py-4 text-left"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id ?? index}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                {columns.map(([key, label, render]) => (
                  <td
                    key={key}
                    className="px-6 py-4 text-gray-600"
                  >
                    {render
                      ? render(item)
                      : item[key]}
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