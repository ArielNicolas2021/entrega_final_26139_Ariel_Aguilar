import { useEffect, useState } from "react";
import { CategoriaModal } from "../components/categorias/CategoriaModal";
import Snackbar from "../components/Snackbar";
import EditCategoriaModal from "../components/categorias/EditCategoriaModal";
import DeleteCategoriaModal from "../components/categorias/DeleteCategoriaModal";
import CategoriaToolbar from "../components/categorias/CategoriaToolbar";
import CategoriaTable from "../components/categorias/CategoriaTable";

export const CategoriasPage = () => {
  // Estado para cargar categorias
  const [categorias, setCategorias] = useState([]);

  // Estado para el modal de agregar categorias
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para el Snackbar (mensaje de confirmación)
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [type, setType] = useState("")

  // Estado para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  // Estado para el modal de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoriaToDelete, setcategoriaToDelete] = useState(null);

  // Estado del buscador
  const [search, setSearch] = useState("");
  const filteredCategorias = categorias.filter((categoria) => categoria.nombre.toLowerCase().includes(search.toLowerCase()));

  // Función para obtener las categorias desde el backend
  const fetchCategorias = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:8080/api/categorias");
      const data = await response.json();

      setCategorias(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardamos la categoría creada en el modal, para luego enviar al backend
  const handleSaveCategorias = async (categoria) => {
    try {
      const response = await fetch("http://localhost:8080/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoria),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la categoría");
      };
      await fetchCategorias();

      setSnackbarMessage("Categoría creada correctamente");
      setType("success");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
    } catch (error) {
      setSnackbarMessage("Error al crear la categoría");
      setType("danger");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);

      console.error(error);
    }
  };

  // Abrir el modal para editar la categoría seleccionado
  const handleEditCategoria = (categoria) => {
    setSelectedCategoria(categoria);
    setIsEditModalOpen(true);
  }

  // Método para editar la categoría seleccionada
  const handleUpdateCategoria = async (updatedCategoria) => {
    try {
      const response = await fetch(`http://localhost:8080/api/categorias/${updatedCategoria.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategoria)
      });
      if (!response.ok) {
        throw new Error("No se pudo actualizar la categoría");
      };

      await fetchCategorias();

      setSnackbarMessage("Categoría actualizada correctamente");
      setType("success");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
    } catch (error) {
      setSnackbarMessage("Error al actualizar la categoría");
      setType("danger");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);

      console.log(error);
    }
  }

  // Método para eliminar la categoría seleccionada
  const handleDeleteCategoria = async (categoriaId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/categorias/${categoriaId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la categoría");
      }

      setSnackbarMessage("Categoría eliminada correctamente");
      setType("success");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);

      setIsDeleteModalOpen(false)

      fetchCategorias();
    } catch (error) {
      setSnackbarMessage("No puedes eliminar la categoría porque uno o más productos dependen de ella");
      setType("danger");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
      console.log(error)
    }
  }

  // Abrir el modal para eliminar el producto seleccionado
  const handleDeleteClick = (categoria) => {
    setcategoriaToDelete(categoria);
    setIsDeleteModalOpen(true);
  }

  useEffect(() => {
    fetchCategorias();
    document.title = "Categorías | Product Manager";
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col-reverse sm:flex-row justify-between sm:items-center">
          <h1 className="text-4xl" style={{ color: "var(--navy-800)" }}>Categorías</h1>
          <div className="flex gap-1">
            <span className="text-gray-500">Home</span>
            <span className="text-gray-500">{">"}</span>
            <span className="font-semibold">Categorías</span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <CategoriaToolbar
            search={search}
            setSearch={setSearch}
            onNewCategoria={() => setIsModalOpen(true)}
            onExport={() => console.log("Exportar")}
            onFilter={() => console.log("Filtros")}
          />

          {/* Tabla */}
          <CategoriaTable
            categorias={categorias}
            onEdit={handleEditCategoria}
            onDelete={handleDeleteClick}
          />
        </div>
      </main>
      <CategoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategorias}
        categorias={categorias}
      />
      <Snackbar
        show={showSnackbar}
        message={snackbarMessage}
        onClose={() => setShowSnackbar(false)}
        type={type}
      />
      <EditCategoriaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        categoria={selectedCategoria}
        onUpdate={handleUpdateCategoria}
      />
      <DeleteCategoriaModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategoria}
        categoria={categoriaToDelete}
      />
    </div>
  );
};