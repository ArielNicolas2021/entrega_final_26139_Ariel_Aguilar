import { useState, useEffect } from "react";
import { CreateProduct } from "../components/productos/CreateProduct.jsx";
import { Snackbar } from "../components/Snackbar.jsx";
import { EditProduct } from "../components/productos/EditProduct.jsx";
import { DeleteProduct } from "../components/productos/DeleteProduct.jsx";
import ProductToolbar from "../components/productos/ProductToolbar.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { useFetch } from "../utils/useFetch.js";
import { Pencil, Trash2 } from "lucide-react";

export const ProductosPage = () => {
  // Estado para obtener datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estado para los modals
  const [action, setAction] = useState('');

  // Estado para el Snackbar (mensaje de confirmación)
  const [snackbar, setSnackbar] = useState({
    message: '',
    type: 'success'
  });

  // Estado para guardar el producto a editar
  const [editProduct, setEditProduct] = useState({});

  // Estado para guardar el producto a eliminar
  const [deleteProduct, setDeleteProduct] = useState({});

  // Estado del buscador
  const [search, setSearch] = useState("");
  const filteredProducts = productos.filter((producto) => producto.nombre.toLowerCase().includes(search.toLowerCase()));

  /*  
  ==============================
  Obtener productos
  ==============================
  */
  const getProductos = async () => {
    const response = await useFetch('/api/productos', 'GET');
    if (response.status == 400) return;

    setProductos(response);
  };
  /*  
  ===============================
  Obtener categorías
  ===============================
  */
  const getCategorias = async () => {
    const response = await useFetch('/api/categorias', 'GET');
    if (response.status == 400) return;

    setCategorias(response);
  }

  /*  
  ===============================
  Crear producto
  ===============================
  */
  const handlePost = async (producto) => {
    const response = await useFetch('/api/productos', 'POST', producto);

    if (response.status == 400) {
      setSnackbar({
        message: 'Error al crear el producto: ' + response.message,
        type: 'error'
      });
      setAction(null);
      return;
    }

    setSnackbar({
      message: 'Producto creado correctamente',
      type: 'success'
    });
    setAction(null);
    getProductos();
  };
  /*
  ===============================
  Editar producto
  ===============================
  */
  const toggleEdit = (producto) => {
    setEditProduct(producto);
    setAction("edit");
  }

  const handleEdit = async (producto) => {
    const response = await useFetch(`/api/productos/${editProduct.id}`, 'PATCH', producto);

    if (response.status == 400) {
      setSnackbar({
        message: 'Error al editar el producto: ' + response.message,
        type: 'error'
      });
      setAction(null);
      return;
    }

    setSnackbar({
      message: 'Producto editado correctamente',
      type: 'success'
    });
    setAction(null);
    getProductos();
  }
  /*
  ===============================
  Eliminar producto
  ===============================
  */
  const toggleDelete = (producto) => {
    setDeleteProduct(producto);
    setAction("delete");
  }

  const handleDelete = async (id) => {
    const response = await useFetch(`/api/productos/${id}`, 'DELETE');

    if (response.status == 400) {
      setSnackbar({
        message: 'Error al eliminar el producto: ' + response.message,
        type: 'error'
      });
      setAction(null);
      return;
    }

    setSnackbar({
      message: 'Producto eliminado correctamente',
      type: 'success'
    });
    setAction(null);
    getProductos();
  }
  /*
  ===============================
  Render para los modals
  ===============================
  */
  const modals = {
    post: <CreateProduct onClose={() => setAction(null)} onSave={handlePost} dataSelect={categorias} />,
    edit: <EditProduct onClose={() => setAction(null)} onUpdate={handleEdit} dataSelect={categorias} data={editProduct} />,
    delete: <DeleteProduct onClose={() => setAction(null)} onDelete={handleDelete} data={deleteProduct} />
  }

  useEffect(() => {
    getProductos();
    getCategorias();
    document.title = "Productos | Product Manager";
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col-reverse sm:flex-row justify-between sm:items-center">
          <h1 className="text-4xl" style={{ color: "var(--navy-800)" }}>Productos</h1>
          <div className="flex gap-1">
            <span className="text-gray-500">Home</span>
            <span className="text-gray-500">{">"}</span>
            <span className="font-semibold">Productos</span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <ProductToolbar
            search={search}
            setSearch={setSearch}
            onNewProduct={() => setAction("post")}
            onExport={() => console.log("Exportar")}
            onFilter={() => console.log("Filtros")}
          />

          {/* Tabla */}
          <DataTable
            data={productos}
            columns={[
              ['id', 'ID'],
              ['nombre', 'Nombre'],
              ['precio', 'Precio'],
              ['stock', 'Stock'],
              ['categoria', 'Categoría'],
              ['acciones', 'Acciones', (producto) => (
                <div className="flex gap-2">
                  <button onClick={() => toggleEdit(producto)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Editar"><Pencil size={18} /></button>
                  <button onClick={() => toggleDelete(producto)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={18} /></button>
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
}