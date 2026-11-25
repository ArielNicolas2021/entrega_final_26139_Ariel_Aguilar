import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Snackbar } from "../components/Snackbar.jsx";
import { DeleteProduct } from "../components/productos/DeleteProduct.jsx";
import { useFetch as fetchData } from "../utils/useFetch.js";
import { usePaginatedResource } from "../hooks/usePaginatedResource.js";
import { PaginationControls } from "../components/ui/PaginationControls.jsx";
import { ProductTable } from "../components/productos/ProductTable.jsx";

export const ProductosPage = () => {
  const navigate = useNavigate();

  const {
    data: productos,
    meta,
    setPage,
    setSize,
    loading,
    refetch: getProductos,
  } = usePaginatedResource("productos", { initialSize: 20 });

  const [search, setSearch] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ message: "", type: "success" });

  useEffect(() => {
    document.title = "Productos | Gestión Comercial";
  }, []);

  const filteredProductos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(q) ||
        p.codigo?.toLowerCase().includes(q) ||
        p.categoria?.toLowerCase().includes(q) ||
        p.marca?.toLowerCase().includes(q)
    );
  }, [productos, search]);

  const handleGoToCreate = () => {
    navigate("/productos/crear-producto");
  };

  const handleGoToEdit = (producto) => {
    const productId = producto?.id ?? producto;
    navigate(`/productos/editar-producto/${productId}`);
  };

  const handleDelete = async (id) => {
    const response = await fetchData(`productos/${id}`, "DELETE");

    if (response?.status >= 400 || response?.error) {
      setSnackbar({
        message: `Error al eliminar producto: ${response?.message || "Error inesperado"}`,
        type: "error",
      });
      setIsDeleteOpen(false);
      setSelectedProduct(null);
      return;
    }

    setSnackbar({
      message: "Producto eliminado correctamente",
      type: "success",
    });
    setIsDeleteOpen(false);
    setSelectedProduct(null);
    getProductos();
  };

  const toggleDelete = (productoOrId) => {
    const productObj =
      typeof productoOrId === "object"
        ? productoOrId
        : productos.find((p) => String(p.id) === String(productoOrId));

    setSelectedProduct(productObj);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-text-main">Productos</h1>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span>Home</span>
          <span>&gt;</span>
          <span className="font-semibold text-text-main">Productos</span>
        </div>
      </div>

      {/* Tabla de Productos + Paginación */}
      <div className="rounded-2xl border border-secondary bg-bg-card overflow-hidden shadow-sm">
        <ProductTable
          products={filteredProductos}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onEdit={handleGoToEdit}
          onDelete={toggleDelete}
          onAddProduct={handleGoToCreate}
        />
        <PaginationControls
          meta={meta}
          onPageChange={setPage}
          onSizeChange={setSize}
          disabled={loading}
        />
      </div>

      {/* Modal de Confirmación de Eliminación con AnimatePresence */}
      <AnimatePresence>
        {isDeleteOpen && selectedProduct && (
          <DeleteProduct
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedProduct(null);
            }}
            onDelete={handleDelete}
            data={selectedProduct}
          />
        )}
      </AnimatePresence>

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