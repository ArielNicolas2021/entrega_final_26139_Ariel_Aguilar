import { useEffect, useState, useMemo } from "react";
import { Snackbar } from "../components/Snackbar.jsx";
import { useFetch as fetchData } from "../utils/useFetch.js";
import { usePaginatedResource } from "../hooks/usePaginatedResource.js";
import { PaginationControls } from "../components/ui/PaginationControls.jsx";
import { MarcaTable } from "../components/marcas/MarcaTable.jsx";
import { MarcaModal } from "../components/marcas/MarcaModal.jsx";
import { DeleteMarca } from "../components/marcas/DeleteMarca.jsx";

export const MarcasPage = () => {
  const {
    data: marcas,
    meta,
    setPage,
    setSize,
    loading,
    refetch: getMarcas,
  } = usePaginatedResource("marcas", { initialSize: 20 });

  // Control de modales ("create" | "edit" | "delete" | null)
  const [action, setAction] = useState(null);
  const [editMarca, setEditMarca] = useState(null);
  const [deleteMarca, setDeleteMarca] = useState(null);

  // Estado para el Snackbar (mensaje de confirmación)
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "success",
  });

  // Estado del buscador
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Marcas | Gestión Comercial";
  }, []);

  const filteredMarcas = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return marcas;
    return marcas.filter((marca) => {
      const nombre = (marca.nombre || marca.marca || "").toLowerCase();
      const descripcion = (marca.descripcion || "").toLowerCase();
      return nombre.includes(query) || descripcion.includes(query);
    });
  }, [marcas, search]);

  /*
  ===============================
  Crear marca
  ===============================
  */
  const toggleCreate = () => {
    setEditMarca(null);
    setAction("create");
  };

  const handlePost = async (marca) => {
    const response = await fetchData("marcas", "POST", marca);

    if (response?.status >= 400 || response?.error) {
      setSnackbar({
        message:
          "Error al crear la marca: " +
          (response?.message || "Intente nuevamente"),
        type: "error",
      });
      setAction(null);
      return;
    }

    setSnackbar({
      message: "Marca creada correctamente",
      type: "success",
    });
    setAction(null);
    getMarcas();
  };

  /*
  ===============================
  Editar marca
  ===============================
  */
  const toggleEdit = (marca) => {
    setEditMarca(marca);
    setAction("edit");
  };

  const handleEdit = async (marca) => {
    const marcaId = editMarca.id ?? editMarca.marcaID;
    const response = await fetchData(`marcas/${marcaId}`, "PUT", marca);

    if (response?.status >= 400 || response?.error) {
      setSnackbar({
        message:
          "Error al editar la marca: " +
          (response?.message || "Intente nuevamente"),
        type: "error",
      });
      setAction(null);
      setEditMarca(null);
      return;
    }

    setSnackbar({
      message: "Marca actualizada correctamente",
      type: "success",
    });
    setAction(null);
    setEditMarca(null);
    getMarcas();
  };

  /*
  ===============================
  Eliminar marca
  ===============================
  */
  const toggleDelete = (marca) => {
    setDeleteMarca(marca);
    setAction("delete");
  };

  const handleDelete = async (id) => {
    const response = await fetchData(`marcas/${id}`, "DELETE");

    if (response?.status >= 400 || response?.error) {
      setSnackbar({
        message:
          "Error al eliminar la marca: " +
          (response?.message || "Intente nuevamente"),
        type: "error",
      });
      setAction(null);
      setDeleteMarca(null);
      return;
    }

    setSnackbar({
      message: "Marca eliminada correctamente",
      type: "success",
    });
    setAction(null);
    setDeleteMarca(null);
    getMarcas();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-text-main">Marcas</h1>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span>Home</span>
          <span>&gt;</span>
          <span className="font-semibold text-text-main">Marcas</span>
        </div>
      </div>

      {/* Tabla de Marcas + Paginación */}
      <div className="rounded-2xl border border-secondary bg-bg-card overflow-hidden shadow-sm">
        <MarcaTable
          marcas={filteredMarcas}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onAddMarca={toggleCreate}
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

      {/* Modal de Crear / Editar Marca */}
      <MarcaModal
        isOpen={action === "create" || action === "edit"}
        initialData={action === "edit" ? editMarca : null}
        onClose={() => {
          setAction(null);
          setEditMarca(null);
        }}
        onSubmit={action === "edit" ? handleEdit : handlePost}
      />

      {/* Modal de Confirmación de Eliminación */}
      {action === "delete" && deleteMarca && (
        <DeleteMarca
          data={deleteMarca}
          onClose={() => {
            setAction(null);
            setDeleteMarca(null);
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