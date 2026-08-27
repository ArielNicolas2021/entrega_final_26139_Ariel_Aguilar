import { useEffect, useState } from "react";
import { Form } from "../Form/Form";

export const EditProduct = ({ onClose, onUpdate, dataSelect, data }) => {
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
      <div className="bg-[#F8F9FC] rounded-lg border border-border shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl" style={{ color: "var(--navy-800)" }}>Editar Producto</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <Form
          fields={fields}
          initialValues={{
            nombre: data.nombre,
            precio: data.precio,
            stock: data.stock,
            categoriaID: data.categoriaID
          }}
          onSubmit={onUpdate}
          submitText="Editar producto"
        />
      </div>
    </div>
  );
}