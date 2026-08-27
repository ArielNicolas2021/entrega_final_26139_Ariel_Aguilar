import { Form } from "../Form/Form";

export const CreateCategoria = ({ onClose, onSave }) => {
  // Render para los inputs
  const fields = [
    {
      name: 'nombre',
      label: 'Nombre',
      placeholder: 'Ingrese el nombre de la categoría',
      validate: (value) => {
        if (!value) return "El nombre es obligatorio";
      }
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      placeholder: 'Ingrese la descripción de la categoría',
      validate: (value) => {
        if (!value) return "La descripción es obligatoria";
      }
    }
  ]

  // Función para cerrar el modal cuando clickeas afuera
  const handleClickOutside = (e) => {
    if (e.target.classList.contains('fixed')) {
      onClose();
    }
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" onClick={handleClickOutside}>
      <div className="bg-[#F8F9FC] w-full max-w-lg rounded-lg border border-border shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl" style={{ color: "var(--navy-800)" }}>Nueva categoria</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>
        <Form
          fields={fields}
          onSubmit={onSave}
          submitText="Agregar categoría"
        />
      </div>
    </div>
  );
}