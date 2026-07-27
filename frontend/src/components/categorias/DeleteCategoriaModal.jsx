export default function DeleteCategoriaModal({ isOpen, onClose, onConfirm, categoria }) {
  if (!isOpen || !categoria) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-[#F8F9FC] rounded-lg border border-border shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl mb-4" style={{ color: "var(--navy-800)" }}>Confirmar eliminación</h2>
        <p className="text-muted-foreground mb-2">¿Estás seguro que querés eliminar esta categoría?</p>
        <p className="font-semibold mb-6">{categoria.nombre}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="flex justify-center items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-100 transition">Cancelar</button>
          <button onClick={() => onConfirm(categoria.id)} className="flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition">Eliminar</button>
        </div>
      </div>
    </div>
  );
}