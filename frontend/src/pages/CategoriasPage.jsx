import { useEffect, useState, useMemo } from "react";
import { Snackbar } from "../components/Snackbar.jsx";
import { useFetch as fetchData } from "../utils/useFetch.js";
import { usePaginatedResource } from "../hooks/usePaginatedResource.js";
import { PaginationControls } from "../components/ui/PaginationControls.jsx";
import { CategoriaTable } from "../components/categorias/CategoriaTable.jsx";
import { CategoriaModal } from "../components/categorias/CategoriaModal.jsx";
import { DeleteCategoria } from "../components/categorias/DeleteCategoria.jsx";

export const CategoriasPage = () => {
  const {
    data: categorias,
    meta,
    setPage,
    setSize,
    loading,
    refetch: getCategorias,
  } = usePaginatedResource("categorias", { initialSize: 20 });

  // Control de modales ("create" | "edit" | "delete" | null)
  const [action, setAction] = useState(null);
  const [editCategoria, setEditCategoria] = useState(null);
  const [deleteCategoria, setDeleteCategoria] = useState(null);

  // Estado para el Snackbar (mensaje de confirmación)
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "success",
  });

  // Estado del buscador
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Categorías | Gestión Comercial";
  }, []);

  const filteredCategorias = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categorias;
    return categorias.filter(
      (categoria) =>
        categoria.nombre?.toLowerCase().includes(q) ||
        categoria.descripcion?.toLowerCase().includes(q)
    );
  }, [categorias, search]);

  /*
  ===============================
  Crear categoría
  ===============================
  */
  const toggleCreate = () => {
    setEditCategoria(null);
    setAction("create");
  };

  const handlePost = async (categoria) => {
    const response = await fetchData("categorias", "POST", categoria);

    if (response?.status >= 400 || response?.error) {
      setSnackbar({
        message:
          "Error al crear la categoría: " +
          (response?.message || "Intente nuevamente"),
        type: "error",
      });
      setAction(null);
      return;
    }

    setSnackbar({
      message: "Categoría creada correctamente",
      type: "success",
    });
    setAction(null);
    getCategorias();
  };

  /*
  ===============================
  Editar categoría
  ===============================
  */
  const toggleEdit = (categoria) => {
    setEditCategoria(categoria);
    setAction("edit");
  };

  const handleEdit = async (categoria) => {
    const response = await fetchData(
      `categorias/${editCategoria.id}`,
      "PUT",
      categoria
    );

    if (response?.status >= 400 || response?.error) {
      setSnackbar({
        message:
          "Error al editar la categoría: " +
          (response?.message || "Intente nuevamente"),
        type: "error",
      });
      setAction(null);
      setEditCategoria(null);
      return;
    }

    setSnackbar({
      message: "Categoría actualizada correctamente",
      type: "success",
    });
    setAction(null);
    setEditCategoria(null);
    getCategorias();
  };

  /*
  ===============================
  Eliminar categoría
  ===============================
  */
  const toggleDelete = (categoria) => {
    setDeleteCategoria(categoria);
    setAction("delete");
  };

  const handleDelete = async (id) => {
    const response = await fetchData(`categorias/${id}`, "DELETE");

    if (response?.status >= 400 || response?.error) {
      setSnackbar({
        message:
          "Error al eliminar la categoría: " +
          (response?.message || "Intente nuevamente"),
        type: "error",
      });
      setAction(null);
      setDeleteCategoria(null);
      return;
    }

    setSnackbar({
      message: "Categoría eliminada correctamente",
      type: "success",
    });
    setAction(null);
    setDeleteCategoria(null);
    getCategorias();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-text-main">Categorías</h1>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span>Home</span>
          <span>&gt;</span>
          <span className="font-semibold text-text-main">Categorías</span>
        </div>
      </div>

      {/* Tabla de Categorías + Paginación */}
      <div className="rounded-2xl border border-secondary bg-bg-card overflow-hidden shadow-sm">
        <CategoriaTable
          categorias={filteredCategorias}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onAddCategoria={toggleCreate}
          onEdit={toggleEdit}
          onDelete={toggleDelete}
        />
        <PaginationControls
          meta={meta}
          onPageChange={setPage}
          onSizeChange={setSize}
          disabled={loading}
        />
      </div>

      {/* Modal de Crear / Editar Categoría */}
      <CategoriaModal
        isOpen={action === "create" || action === "edit"}
        initialData={action === "edit" ? editCategoria : null}
        onClose={() => {
          setAction(null);
          setEditCategoria(null);
        }}
        onSubmit={action === "edit" ? handleEdit : handlePost}
      />

      {/* Modal de Confirmación de Eliminación */}
      {action === "delete" && deleteCategoria && (
        <DeleteCategoria
          data={deleteCategoria}
          onClose={() => {
            setAction(null);
            setDeleteCategoria(null);
          }}
          onDelete={handleDelete}
        />
      )}

      {/* Feedback Toast */}
      {snackbar.message && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar({ message: "", type: "success" })}
        />
      )}
    </div>
  );
};