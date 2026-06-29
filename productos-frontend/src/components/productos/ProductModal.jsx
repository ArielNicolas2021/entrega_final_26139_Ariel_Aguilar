import { useEffect, useState } from "react";

export const ProductModal = ({ isOpen, onClose, onSave, categorias }) => {
  // Estado para guardar el value de los forms
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoriaId: "",
  });

  // Estado para validar forms
  const [errors, setErrors] = useState({});

  // Función para validar forms
  const validate = () => {
    const newErrors = {};

    if (!producto.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    if (!producto.precio) {
      newErrors.precio = "El precio es obligatorio";
    } else if (Number(producto.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }
    if (!producto.stock) {
      newErrors.stock = "El stock es obligatorio";
    } else if (Number(producto.stock) < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }
    if (!producto.categoriaId) {
      newErrors.categoriaId = "Debe seleccionar una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  // Función para actualizar el value de los forms (cambia mientras escribís)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProducto({
      ...producto,
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

    onSave(producto);

    setProducto({
      nombre: "",
      precio: "",
      stock: "",
      categoriaId: ""
    });

    setErrors({});
    onClose();
  };

  // Función para cerrar el modal cuando clickeas afuera
  const handleClickOutside = (e) => {
    if (e.target.classList.contains("fixed")) {
      onClose();
      setErrors({});
      setProducto({
        nombre: "",
        precio: "",
        stock: "",
        categoriaId: ""
      });
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    onClose();
    setErrors({});
    setProducto({
      nombre: "",
      precio: "",
      stock: "",
      categoriaId: ""
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" onClick={handleClickOutside}>
      <div className="bg-[#F8F9FC] w-full max-w-lg rounded-lg border border-border shadow-xl p-6 mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl" style={{ color: "var(--navy-800)" }}>Nuevo Producto</h2>
          <button onClick={handleCloseModal} className="text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Mouse Gamer XYZ" className={`w-full mt-1 px-4 py-3 rounded-lg bg-input-background border ${errors.nombre ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />

            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre}
              </p>
            )}

          </div>
          <div>
            <label htmlFor="precio">Precio</label>
            <input type="number" id="precio" name="precio" value={producto.precio} onChange={handleChange} placeholder="9999" className={`w-full mt-1 px-4 py-3 rounded-lg bg-input-background border ${errors.precio ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />

            {errors.precio && (
              <p className="text-red-500 text-sm mt-1">
                {errors.precio}
              </p>
            )}

          </div>

          <div>
            <label htmlFor="stock">Stock</label>
            <input type="number" id="stock" name="stock" value={producto.stock} onChange={handleChange} placeholder="100" className={`w-full mt-1 px-4 py-3 rounded-lg bg-input-background border ${errors.stock ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />

            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock}
              </p>
            )}

          </div>

          <div>
            <label htmlFor="categoriaId">Categoría</label>
            <select id="categoriaId" name="categoriaId" value={producto.categoriaId} onChange={handleChange} className={`w-full mt-1 px-4 py-3 rounded-lg bg-input-background border ${errors.categoriaId ? 'border-red-500' : 'border-border hover:border-gray-300'}`}>
              <option value="">Seleccionar categoría</option>

              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}

            </select>

            {errors.categoriaId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoriaId}
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