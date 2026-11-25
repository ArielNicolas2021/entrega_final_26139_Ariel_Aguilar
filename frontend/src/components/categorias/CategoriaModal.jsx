import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const CategoriaModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
      });
    } else {
      setFormData({ nombre: "", descripcion: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-secondary bg-bg-card p-6 shadow-xl space-y-5 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-secondary pb-3">
          <h2 className="text-lg font-bold text-text-main">
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-secondary hover:text-text-main transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-main mb-1.5">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nombre: e.target.value }))
              }
              placeholder="Ej. Calzado Deportivo"
              className="w-full rounded-lg border border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-main mb-1.5">
              Descripción
            </label>
            <textarea
              rows={3}
              value={formData.descripcion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
              placeholder="Breve descripción de los productos que incluye..."
              className="w-full rounded-lg border border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-secondary bg-bg-card text-sm font-medium text-text-main hover:bg-secondary transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
            >
              {loading
                ? "Guardando..."
                : isEditing
                  ? "Guardar Cambios"
                  : "Crear Categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
