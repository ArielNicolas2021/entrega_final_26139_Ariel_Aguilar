import { useEffect, useState } from "react";

export const CategoriaModal = ({ isOpen, onClose, onSave, categorias }) => {
  // Estado para guardar el value de los forms
  const [categoria, setCategoria] = useState({
    nombre: "",
    descripcion: ""
  });

  // Estado para validar forms
  const [errors, setErrors] = useState({});

  // Función para validar forms
  const validate = () => {
    const newErrors = {};

    if (!categoria.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    if (!categoria.descripcion) {
      newErrors.descripcion = "La descripción es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  // Función para actualizar el value de los forms (cambia mientras escribís)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCategoria({
      ...categoria,
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

    onSave(categoria);

    setCategoria({
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
      setCategoria({
      nombre: "",
      descripcion: ""
    });
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    onClose();
    setErrors({});
    setCategoria({
      nombre: "",
      descripcion: ""
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" onClick={handleClickOutside}>
      <div className="bg-[#F8F9FC] w-full max-w-lg rounded-lg border border-border shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl" style={{ color: "var(--navy-800)" }}>Nueva categoria</h2>
          <button onClick={handleCloseModal} className="text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" value={categoria.nombre} onChange={handleChange} placeholder="Tecnología" className={`w-full mt-1 px-4 py-3 rounded-lg bg-input-background border ${errors.nombre ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />

            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre}
              </p>
            )}

          </div>
          <div>
            <label htmlFor="desc">Descripción</label>
            <input type="text" id="descripcion" name="descripcion" value={categoria.descripcion} onChange={handleChange} placeholder="Ingrese la descripción de la categoría" className={`w-full mt-1 px-4 py-3 rounded-lg bg-input-background border ${errors.descripcion ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />

            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">
                {errors.descripcion}
              </p>
            )}

          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="flex justify-center items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-100 transition">Cancelar</button>
            <button type="submit" className="flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}