import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { CloudArrowUpIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useFetch as fetchData } from "../../utils/useFetch.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { extractList } from "../../utils/pagination.js";
import { Snackbar } from "../Snackbar.jsx";

export const CreateProduct = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const redirectTimeoutRef = useRef(null);

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loadingMarcas, setLoadingMarcas] = useState(false);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: "", type: "success" });

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    costo: "",
    precioVenta: "",
    stock: 0,
    categoriaID: "",
    marcaID: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Cargar categorías al montar
  useEffect(() => {
    let cancelled = false;

    const loadCategorias = async () => {
      const categoriasRes = await fetchData("categorias?size=500", "GET");
      if (!cancelled) {
        setCategorias(extractList(categoriasRes));
      }
    };

    loadCategorias();
    document.title = "Añadir Producto | Gestión Comercial";

    return () => {
      cancelled = true;
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  // Cargar marcas asociadas a la categoría seleccionada
  useEffect(() => {
    if (!formData.categoriaID) {
      setMarcas([]);
      return;
    }

    let cancelled = false;

    const loadMarcasPorCategoria = async () => {
      setLoadingMarcas(true);
      const marcasRes = await fetchData(
        `categorias/${formData.categoriaID}/marcas?size=500`,
        "GET"
      );
      if (!cancelled) {
        setMarcas(extractList(marcasRes));
        setLoadingMarcas(false);
      }
    };

    loadMarcasPorCategoria();

    return () => {
      cancelled = true;
    };
  }, [formData.categoriaID]);

  // Revocar ObjectURL anterior al cambiar imagen o desmontar
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoriaChange = (e) => {
    const nuevaCategoriaID = e.target.value;
    setFormData((prev) => ({
      ...prev,
      categoriaID: nuevaCategoriaID,
      marcaID: "",
    }));
  };

  const handleStockChange = (delta) => {
    setFormData((prev) => ({
      ...prev,
      stock: Math.max(0, Number(prev.stock) + delta),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImageUrl = "";

    if (imageFile) {
      try {
        uploadedImageUrl = await uploadToCloudinary(imageFile);
      } catch (error) {
        setLoading(false);
        setSnackbar({
          message: "Error al subir la imagen a Cloudinary. Intente nuevamente.",
          type: "error",
        });
        return;
      }
    }

    const newProduct = {
      categoriaID: formData.categoriaID,
      codigo: formData.codigo,
      costo: formData.costo,
      imagenUrl: uploadedImageUrl,
      marcaID: formData.marcaID ? formData.marcaID : null,
      nombre: formData.nombre,
      precioVenta: formData.precioVenta,
      stock: formData.stock,
    };

    const response = await fetchData("productos", "POST", newProduct);
    setLoading(false);

    if (response?.status >= 400 || response?.error) {
      setSnackbar({
        message: `Error al crear el producto: ${response.message || "Intente nuevamente"}`,
        type: "error",
      });
      return;
    }

    setSnackbar({ message: "Producto creado correctamente", type: "success" });

    redirectTimeoutRef.current = setTimeout(() => {
      navigate("/productos");
    }, 900);
  };

  const blockMotionProps = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.22, delay, ease: "easeOut" },
      };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto pb-10">
      {/* Botón Volver */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/productos")}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors group"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Volver a Productos</span>
        </button>
      </div>

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Añadir Producto</h1>
          <p className="text-xs text-text-muted">
            Completa la información requerida para registrar un nuevo ítem en el
            catálogo.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span>Home</span>
          <span>&gt;</span>
          <span>Productos</span>
          <span>&gt;</span>
          <span className="font-semibold text-text-main">Añadir Producto</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bloque 1: Información General */}
        <motion.div
          {...blockMotionProps(0)}
          className="rounded-2xl border border-secondary bg-bg-card p-6 shadow-sm space-y-4"
        >
          <h2 className="text-base font-semibold text-text-main border-b border-secondary pb-3">
            Información General
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="create-codigo"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Código del Producto
              </label>
              <input
                id="create-codigo"
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Ej. PRD-1024"
                className="w-full rounded-lg border border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="create-nombre"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Nombre del Producto
              </label>
              <input
                id="create-nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Zapatillas Aura Pro"
                className="w-full rounded-lg border border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="create-categoria"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Categoría
              </label>
              <select
                id="create-categoria"
                name="categoriaID"
                value={formData.categoriaID}
                onChange={handleCategoriaChange}
                className="w-full rounded-lg border border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required
              >
                <option value="" className="bg-bg-card text-text-main">
                  Selecciona una categoría
                </option>
                {categorias.map((cat) => (
                  <option
                    key={cat.id || cat.categoriaID}
                    value={cat.id || cat.categoriaID}
                    className="bg-bg-card text-text-main"
                  >
                    {cat.nombre || cat.categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="create-marca"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Marca{" "}
                <span className="font-normal text-text-muted">(Opcional)</span>
              </label>
              <select
                id="create-marca"
                name="marcaID"
                value={formData.marcaID}
                onChange={handleChange}
                disabled={!formData.categoriaID || loadingMarcas}
                className="w-full rounded-lg border border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-bg-card text-text-main">
                  {!formData.categoriaID
                    ? "Primero selecciona una categoría"
                    : loadingMarcas
                      ? "Cargando marcas..."
                      : "Sin marca"}
                </option>
                {marcas.map((m) => (
                  <option
                    key={m.id || m.marcaID}
                    value={m.id || m.marcaID}
                    className="bg-bg-card text-text-main"
                  >
                    {m.nombre || m.marca}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Bloque 2: Precios y Stock */}
        <motion.div
          {...blockMotionProps(0.05)}
          className="rounded-2xl border border-secondary bg-bg-card p-6 shadow-sm space-y-4"
        >
          <h2 className="text-base font-semibold text-text-main border-b border-secondary pb-3">
            Precios y Stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="create-costo"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Costo ($)
              </label>
              <input
                id="create-costo"
                type="number"
                step={0.01}
                min={0}
                name="costo"
                value={formData.costo}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="create-precio"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Precio de Venta ($)
              </label>
              <input
                id="create-precio"
                type="number"
                step={0.01}
                min={0}
                name="precioVenta"
                value={formData.precioVenta}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="create-stock"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Stock Inicial
              </label>
              <div className="flex overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleStockChange(-1)}
                  aria-label="Disminuir stock"
                  className="px-3 bg-bg-main text-text-main hover:bg-secondary rounded-l-lg border border-secondary text-sm font-semibold transition-colors"
                >
                  -
                </button>
                <input
                  id="create-stock"
                  type="number"
                  min={0}
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full text-center border-y border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleStockChange(1)}
                  aria-label="Aumentar stock"
                  className="px-3 bg-bg-main text-text-main hover:bg-secondary rounded-r-lg border border-secondary text-sm font-semibold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bloque 3: Imagen del Producto */}
        <motion.div
          {...blockMotionProps(0.1)}
          className="rounded-2xl border border-secondary bg-bg-card p-6 shadow-sm space-y-4"
        >
          <h2 className="text-base font-semibold text-text-main border-b border-secondary pb-3">
            Imagen del Producto
          </h2>

          <div className="relative border-2 border-dashed border-secondary hover:border-primary rounded-2xl p-6 text-center transition-colors cursor-pointer bg-bg-main/30 flex flex-col items-center justify-center">
            <input
              type="file"
              accept="image/*"
              aria-label="Subir imagen del producto"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {imagePreview ? (
              <div className="relative group flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Previsualización"
                  className="h-32 w-32 object-cover rounded-xl border border-secondary"
                />
                <div className="mt-2 text-xs text-primary font-semibold">
                  Haz clic para cambiar la imagen
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <CloudArrowUpIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-text-main">
                  <span className="text-primary font-semibold">
                    Haz clic para subir
                  </span>{" "}
                  o arrastra y suelta
                </p>
                <p className="text-xs text-text-muted mt-1">
                  SVG, PNG, JPG o GIF (Recomendado max. 800x800px)
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Acciones del Formulario */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/productos")}
            className="px-5 py-2.5 rounded-lg border border-secondary bg-bg-card text-sm font-medium text-text-main hover:bg-secondary transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <motion.button
            type="submit"
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Producto"}
          </motion.button>
        </div>
      </form>

      {/* Snackbar Toast */}
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