// =======================================================
// Este componente es el input SIN LÓGICA
// Si se quiere modificar alguna función, ir a Form.jsx
// =======================================================
export const FormInput = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  value,
  error,
  onChange,
  options = []
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className={`rounded-lg border px-3 py-2 outline-none ${error ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">
            Seleccioná una opción
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          className={`rounded-lg border px-3 py-2 outline-none ${error ? "border-red-500" : "border-gray-300"
            }`}
        />
      )}
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  )
}
