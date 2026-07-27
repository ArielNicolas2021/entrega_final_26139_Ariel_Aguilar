import { useState, useEffect } from "react";
import { ProductModal } from "../components/productos/ProductModal.jsx";
import Snackbar from "../components/Snackbar.jsx";
import EditProductModal from "../components/productos/EditProductModal.jsx";
import DeleteProductModal from "../components/productos/DeleteProductModal.jsx";
import ProductTable from "../components/productos/ProductTable.jsx";
import ProductToolbar from "../components/productos/ProductToolbar.jsx";

export const ProductosPage = () => {
  // Estado para cargar productos y categorias
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estado para el modal de agregar productos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para el Snackbar (mensaje de confirmación)
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarError, setIsSnackbarError] = useState(false);

  // Estado para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  // Estado para el modal de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const token = localStorage.getItem("token");

  // Estado del buscador
  const [search, setSearch] = useState("");
  const filteredProducts = productos.filter((producto) => producto.nombre.toLowerCase().includes(search.toLowerCase()));

  // Función para obtener los productos desde el backend
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:8080/api/productos", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        method: "GET"
      });
      const data = await response.json();
      const filteredData = data.filter((producto) => producto.usuarioId === parseInt(localStorage.getItem("usuarioId")));

      setProductos(filteredData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardamos el producto creado en el modal, para luego enviarlo al backend
  const handleSaveProduct = async (producto) => {
    try {
      const response = await fetch("http://localhost:8080/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(producto),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el producto");
      };
      await fetchProducts();

      setIsSnackbarError(false);
      setSnackbarMessage("Producto creado correctamente");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
    } catch (error) {
      setIsSnackbarError(true);
      setSnackbarMessage("Error al crear el producto");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);

      console.error(error);
    }
  };

  // Abrir el modal para editar el producto seleccionado
  const handleEditProduct = (producto) => {
    setSelectedProducto(producto);
    setIsEditModalOpen(true);
  }

  // Método para editar el producto seleccionado
  const handleUpdateProduct = async (updatedProducto) => {
    try {
      const response = await fetch(`http://localhost:8080/api/productos/${updatedProducto.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedProducto),
      });
      if (!response.ok) {
        throw new Error("No se pudo actualizar el producto");
      };

      await fetchProducts();

      setSnackbarMessage("Producto actualizado correctamente");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
    } catch (error) {
      setSnackbarMessage("Error al actualizar el producto");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);

      console.error(error);
    };
  };

  // Abrir el modal para eliminar el producto seleccionado
  const handleDeleteClick = (producto) => {
    setProductToDelete(producto);
    setIsDeleteModalOpen(true);
  };

  // Método para eliminar el producto seleccionado
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/productos/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Error al eliminar producto");
      }

      setSnackbarMessage("Producto eliminado correctamente");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);

      setIsDeleteModalOpen(false);

      // Recargar productos
      fetchProducts();
    } catch (error) {
      setSnackbarMessage("Error al eliminar producto");
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
      console.error(error);
    };
  };

  // Usamos el hook personalizado para obtener los productos desde el backend
  useEffect(() => {
    fetchProducts();
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categorias", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          method: "GET",
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Could not fetch categorias:", error);
      }
    };

    fetchCategorias();
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
            onNewProduct={() => setIsModalOpen(true)}
            onExport={() => console.log("Exportar")}
            onFilter={() => console.log("Filtros")}
          />

          {/* Tabla */}
          <ProductTable
            productos={productos}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
          />
        </div>
      </main>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        categorias={categorias}
      />
      <Snackbar
        show={showSnackbar}
        message={snackbarMessage}
        onClose={() => setShowSnackbar(false)}
        isError={isSnackbarError}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProducto}
        categorias={categorias}
        onUpdate={handleUpdateProduct}
      />
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        product={productToDelete}
      />
    </div>
  );
}