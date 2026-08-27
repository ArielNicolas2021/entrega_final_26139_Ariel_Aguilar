import { Form } from "../Form/Form.jsx"

export const CreateProduct = ({ onClose, onSave, dataSelect }) => {
  // Render para los inputs
  const fields = [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ingrese el nombre del producto',
      validate: (value) => {
        if (!value) return "El nombre es obligatorio";
      }
    },
    {
      name: 'precio',
      label: 'Precio',
      type: 'number',
      placeholder: 'Ingrese el precio del producto',
      validate: (value) => {
        if (!value) return "El precio es obligatorio";
        if (value <= 0) return "El precio debe ser mayor a 0";
      }
    },
    {
      name: 'stock',
      label: 'Stock',
      type: 'number',
      placeholder: 'Ingrese el stock del producto',
      validate: (value) => {
        if (!value) return "El stock es obligatorio";
        if (value < 0) return "El stock no puede ser negativo";
      }
    },
    {
      name: 'categoriaID',
      label: 'Categoría',
      type: "select",
      options: dataSelect.map((categoria) => ({
        value: categoria.id,
        label: categoria.nombre
      })),
      validate: (value) => {
        if (!value) return "Selecciona una categoría";
      }
    }
  ]

  // Función para cerrar el modal cuando clickeas afuera
  const handleClickOutside = (e) => {
    if (e.target.classList.contains("fixed")) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" onClick={handleClickOutside}>
      <div className="bg-[#F8F9FC] w-full max-w-lg rounded-lg border border-border shadow-xl p-6 mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl" style={{ color: "var(--navy-800)" }}>Nuevo Producto</h2>
          <button onClick={() => onClose()} className="text-xl">✕</button>
        </div>
        <Form
          fields={fields}
          onSubmit={onSave}
          submitText="Agregar producto"
        />
      </div>
    </div>
  );
}