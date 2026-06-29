import { useEffect, useState } from "react";

export default function EditCategoriaModal({ isOpen, onClose, categoria, onUpdate }) {
  // Estado para guardar el value de los forms
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    descripcion: ""
  });

  // Estado para validar forms
  const [errors, setErrors] = useState({});

  // Función para validar forms
  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    };
    if (!form.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria";
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para actualizar el value de los forms (cambia mientras escribís)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Función para enviar datos
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onUpdate(form);

    setForm({
      nombre: "",
      descripcion: ""
    });

    setErrors({});
    onClose();
  };

  // Función para cerrar el modal cuando clickeas afuera
  const handleClickOutside = (e) => {
    if (e.target.classList.contains("fixed")) {
      onClose();
      setErrors({});
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    onClose();
    setErrors({});
  };

  // Recibimos los datos del producto seleccionado
  useEffect(() => {
    if (categoria) {
      setForm({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion
      });
    }
  }, [categoria, isOpen]);
  if (!isOpen || !categoria) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" onClick={handleClickOutside}>
      <div className="bg-[#F8F9FC] rounded-lg border border-border shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl" style={{ color: "var(--navy-800)" }}>Editar categoria</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID SOLO LECTURA */}
          <div>
            <label htmlFor="categoriaId">ID</label>
            <input type="text" value={form.id} id="categoriaId" disabled className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border border-border text-gray-400 cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input type="text" name="nombre" id="nombre" value={form.nombre} onChange={handleChange} className={`w-full mt-1 px-4 py-3 rounded-lg bg-input-background border ${errors.nombre ? ' border-red-500' : ' border-border hover:border-gray-300'}`} />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="precio">descripcion</label>
            <input type="text" name="descripcion" id="descripcion" value={form.descripcion} onChange={handleChange} className={`w-full mt-1 px-4 py-3 rounded-lg bg-input-background border ${errors.descripcion ? ' border-red-500' : ' border-border hover:border-gray-300'}`} />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">
                {errors.descripcion}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="flex justify-center items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-100 transition">Cancelar</button>
            <button type="submit" className="flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
}