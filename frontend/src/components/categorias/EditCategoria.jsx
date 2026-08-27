import { useEffect, useState } from "react";
import { Form } from "../Form/Form";

export const EditCategoria = ({ onClose, onUpdate, data }) => {
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
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" onClick={handleClickOutside}>
      <div className="bg-[#F8F9FC] rounded-lg border border-border shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl" style={{ color: "var(--navy-800)" }}>Editar categoria</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <Form
          fields={fields}
          initialValues={{
            nombre: data.nombre,
            descripcion: data.descripcion
          }}
          onSubmit={onUpdate}
          submitText="Editar categoría"
        />
      </div>
    </div>
  );
}