import { useEffect, useState } from "react";
import { Snackbar } from "../components/Snackbar";
import CategoriaToolbar from "../components/categorias/CategoriaToolbar";
import { DataTable } from "../components/DataTable";
import { CreateCategoria } from "../components/categorias/CreateCategoria";
import { EditCategoria } from "../components/categorias/EditCategoria";
import { DeleteCategoria } from "../components/categorias/DeleteCategoria";
import { useFetch } from "../utils/useFetch";
import { Pencil, Trash2 } from "lucide-react";

export const CategoriasPage = () => {
  // Estado para obtener categorias
  const [categorias, setCategorias] = useState([]);

  // Estado para los modals
  const [action, setAction] = useState('');

  // Estado para el Snackbar (mensaje de confirmación)
  const [snackbar, setSnackbar] = useState({
    message: '',
    type: 'success'
  });

  // Estado para guardar la categoría a editar
  const [editCategoria, setEditCategoria] = useState({});

  // Estado para guardar la categoría a eliminar
  const [deleteCategoria, setDeleteCategoria] = useState({});

  // Estado del buscador
  const [search, setSearch] = useState("");
  const filteredCategorias = categorias.filter((categoria) => categoria.nombre.toLowerCase().includes(search.toLowerCase()));
  /*
  ===============================
  Obtener categorías
  ===============================
  */
  const getCategorias = async () => {
    const response = await useFetch('/api/categorias', 'GET');
    if (response.status == 400) return;

    setCategorias(response);
  };
  /*
  ===============================
  Crear categoría
  ===============================
  */
  const handlePost = async (categoria) => {
    const response = await useFetch('/api/categorias', 'POST', categoria);

    if (response.status == 400) {
      setSnackbar({
        message: 'Error al crear la categoría: ' + response.message,
        type: 'error'
      });
      setAction(null);
      return;
    }

    setSnackbar({
      message: 'Categoría creada correctamente',
      type: 'success'
    });
    setAction(null);
    getCategorias();
  }
  /*
  ===============================
  Editar categoria
  ===============================
  */
  const toggleEdit = (categoria) => {
    setEditCategoria(categoria);
    setAction('edit');
  }

  const handleEdit = async (categoria) => {
    const response = await useFetch(`/api/categorias/${editCategoria.id}`, 'PATCH', categoria);

    if (response.status == 400) {
      setSnackbar({
        message: 'Error al editar la categoría: ' + response.message,
        type: 'error'
      });
      setAction(null);
      return;
    }

    setSnackbar({
      message: 'Categoría creada correctamente',
      type: 'success'
    });
    setAction(null);
    getCategorias();
  }
  /*
  ===============================
  Eliminar categoría
  ===============================
  */
  const toggleDelete = (categoria) => {
    setDeleteCategoria(categoria);
    setAction('delete');
  }

  const handleDelete = async (id) => {
    const response = await useFetch(`/api/categorias/${id}`, 'DELETE');

    if (response.status == 400) {
      setSnackbar({
        message: 'Error al eliminar la categoría: ' + response.message,
        type: 'error'
      });
      setAction(null);
      return;
    }

    setSnackbar({
      message: 'Categoría eliminada correctamente',
      type: 'success'
    });
    setAction(null);
    getCategorias();
  }
  /*
  ===============================
  Render para los modals
  ===============================
  */
  const modals = {
    post: <CreateCategoria onClose={() => setAction(null)} onSave={handlePost} />,
    edit: <EditCategoria onClose={() => setAction(null)} onUpdate={handleEdit} data={editCategoria} />,
    delete: <DeleteCategoria onClose={() => setAction(null)} onDelete={handleDelete} data={deleteCategoria} />
  }

  useEffect(() => {
    getCategorias();
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
            onNewCategoria={() => setAction('post')}
            onExport={() => console.log("Exportar")}
            onFilter={() => console.log("Filtros")}
          />

          {/* Tabla */}
          <DataTable
            data={categorias}
            columns={[
              ['id', 'ID'],
              ['nombre', 'Nombre'],
              ['descripcion', 'Descripción'],
              ['acciones', 'Acciones', (categoria) => (
                <div className="flex gap-2">
                  <button onClick={() => toggleEdit(categoria)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Editar"><Pencil size={18} /></button>
                  <button onClick={() => toggleDelete(categoria)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={18} /></button>
                </div>
              )]
            ]}
          />
        </div>
      </main>
      <Snackbar
        {...snackbar}
        onClose={() => setSnackbar({ message: '' })}
      />
      {modals[action]}
    </div>
  );
};