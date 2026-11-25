import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { CloudArrowUpIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useFetch as fetchData } from "../../utils/useFetch.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { Snackbar } from "../Snackbar.jsx";

const resolveId = (valueOrObj, list = []) => {
  if (!valueOrObj) return "";

  let rawVal = valueOrObj;
  if (typeof valueOrObj === "object") {
    rawVal =
      valueOrObj.id ??
      valueOrObj.categoriaID ??
      valueOrObj.marcaID ??
      valueOrObj.categoria_id ??
      valueOrObj.marca_id ??
      valueOrObj._id ??
      valueOrObj.nombre ??
      valueOrObj.categoria ??
      valueOrObj.marca ??
      "";
  }

  const strVal = String(rawVal).trim().toLowerCase();

  const matchById = list.find((item) => {
    const itemId = String(
      item.id ??
      item.categoriaID ??
      item.marcaID ??
      item.categoria_id ??
      item.marca_id ??
      item._id ??
      ""
    )
      .trim()
      .toLowerCase();
    return itemId === strVal;
  });

  if (matchById) {
    return String(
      matchById.id ??
      matchById.categoriaID ??
      matchById.marcaID ??
      matchById.categoria_id ??
      matchById.marca_id ??
      matchById._id
    );
  }

  const matchByName = list.find((item) => {
    const itemName = String(item.nombre ?? item.categoria ?? item.marca ?? "")
      .trim()
      .toLowerCase();
    return itemName === strVal;
  });

  if (matchByName) {
    return String(
      matchByName.id ??
      matchByName.categoriaID ??
      matchByName.marcaID ??
      matchByName.categoria_id ??
      matchByName.marca_id ??
      matchByName._id
    );
  }

  return String(rawVal);
};

export const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const prefersReducedMotion = useReducedMotion();
  const redirectTimeoutRef = useRef(null);
  const initialMarcaRawRef = useRef(null);

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loadingMarcas, setLoadingMarcas] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [snackbar, setSnackbar] = useState({ message: "", type: "success" });

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    costo: "",
    precioVenta: "",
    stock: 0,
    categoriaID: "",
    marcaID: "",
    imagenUrl: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // 1. Cargar categorías y datos actuales del producto
  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      setFetchingProduct(true);

      const [categoriasRes, productoRes] = await Promise.all([
        fetchData("categorias", "GET"),
        fetchData(`productos/${id}`, "GET"),
      ]);

      if (cancelled) return;

      const listaCategorias = Array.isArray(categoriasRes) ? categoriasRes : [];
      setCategorias(listaCategorias);

      if (productoRes && !productoRes.error) {
        const catRaw =
          productoRes.categoriaID ??
          productoRes.categoriaId ??
          productoRes.categoria_id ??
          productoRes.categoria;

        initialMarcaRawRef.current =
          productoRes.marcaID ??
          productoRes.marcaId ??
          productoRes.marca_id ??
          productoRes.marca;

        setFormData({
          codigo: productoRes.codigo || "",
          nombre: productoRes.nombre || "",
          costo: productoRes.costo ?? "",
          precioVenta: productoRes.precioVenta ?? "",
          stock: productoRes.stock ?? 0,
          categoriaID: resolveId(catRaw, listaCategorias),
          marcaID: "",
          imagenUrl: productoRes.imagenUrl || "",
        });

        if (productoRes.imagenUrl) {
          setImagePreview(productoRes.imagenUrl);
        }
      } else {
        setSnackbar({
          message: "No se pudo cargar la información del producto.",
          type: "error",
        });
      }

      setFetchingProduct(false);
    };

    loadInitialData();
    document.title = "Editar Producto | Gestión Comercial";

    return () => {
      cancelled = true;
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, [id]);

  // 2. Cargar marcas asociadas cada vez que cambia la categoría
  useEffect(() => {
    if (!formData.categoriaID) {
      setMarcas([]);
      return;
    }

    let cancelled = false;

    const loadMarcasPorCategoria = async () => {
      setLoadingMarcas(true);
      const marcasRes = await fetchData(
        `categorias/${formData.categoriaID}/marcas`,
        "GET"
      );

      if (cancelled) return;

      const listaMarcas = Array.isArray(marcasRes) ? marcasRes : [];
      setMarcas(listaMarcas);

      // Si es la carga inicial del producto, resolver el marcaID contra las marcas de esta categoría
      if (initialMarcaRawRef.current !== null) {
        const resolvedMarca = resolveId(
          initialMarcaRawRef.current,
          listaMarcas
        );
        initialMarcaRawRef.current = null;
        setFormData((prev) => ({
          ...prev,
          marcaID: resolvedMarca,
        }));
      }

      setLoadingMarcas(false);
    };

    loadMarcasPorCategoria();

    return () => {
      cancelled = true;
    };
  }, [formData.categoriaID]);

  // Limpieza segura de blob URLs
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
    initialMarcaRawRef.current = null;
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

    let finalImageUrl = formData.imagenUrl;

    if (imageFile) {
      try {
        finalImageUrl = await uploadToCloudinary(imageFile);
      } catch (error) {
        setLoading(false);
        setSnackbar({
          message: "Error al subir la nueva imagen a Cloudinary.",
          type: "error",
        });
        return;
      }
    }

    const updatedProduct = {
      categoriaID: formData.categoriaID,
      codigo: formData.codigo,
      costo: formData.costo,
      imagenUrl: finalImageUrl,
      marcaID: formData.marcaID ? formData.marcaID : null,
      nombre: formData.nombre,
      precioVenta: formData.precioVenta,
      stock: formData.stock,
    };

    const response = await fetchData(`productos/${id}`, "PUT", updatedProduct);
    setLoading(false);

    if (response?.status >= 400 || response?.error) {
      setSnackbar({
        message: `Error al actualizar el producto: ${response.message || "Intente nuevamente"}`,
        type: "error",
      });
      return;
    }

    setSnackbar({
      message: "Producto actualizado correctamente",
      type: "success",
    });

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

  if (fetchingProduct) {
    return (
      <div className="flex justify-center items-center py-20 text-text-muted text-sm">
        Cargando datos del producto...
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-text-main">Editar Producto</h1>
          <p className="text-xs text-text-muted">
            Modifica la información requerida del producto seleccionado.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span>Home</span>
          <span>&gt;</span>
          <span>Productos</span>
          <span>&gt;</span>
          <span className="font-semibold text-text-main">Editar Producto</span>
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
                htmlFor="edit-codigo"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Código del Producto
              </label>
              <input
                id="edit-codigo"
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
                htmlFor="edit-nombre"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Nombre del Producto
              </label>
              <input
                id="edit-nombre"
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
                htmlFor="edit-categoria"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Categoría
              </label>
              <select
                id="edit-categoria"
                name="categoriaID"
                value={formData.categoriaID}
                onChange={handleCategoriaChange}
                className="w-full rounded-lg border border-secondary bg-bg-card px-3.5 py-2 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required
              >
                <option value="" className="bg-bg-card text-text-main">
                  Selecciona una categoría
                </option>
                {categorias.map((cat) => {
                  const catId = String(
                    cat.id ??
                    cat.categoriaID ??
                    cat.categoria_id ??
                    cat._id ??
                    ""
                  );
                  return (
                    <option
                      key={catId}
                      value={catId}
                      className="bg-bg-card text-text-main"
                    >
                      {cat.nombre || cat.categoria}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-marca"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Marca <span className="font-normal text-text-muted">(Opcional)</span>
              </label>
              <select
                id="edit-marca"
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
                {marcas.map((m) => {
                  const marcaId = String(
                    m.id ?? m.marcaID ?? m.marca_id ?? m._id ?? ""
                  );
                  return (
                    <option
                      key={marcaId}
                      value={marcaId}
                      className="bg-bg-card text-text-main"
                    >
                      {m.nombre || m.marca}
                    </option>
                  );
                })}
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
                htmlFor="edit-costo"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Costo ($)
              </label>
              <input
                id="edit-costo"
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
                htmlFor="edit-precio"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Precio de Venta ($)
              </label>
              <input
                id="edit-precio"
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
                htmlFor="edit-stock"
                className="block text-xs font-semibold text-text-main mb-1.5"
              >
                Stock
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
                  id="edit-stock"
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
              aria-label="Cambiar imagen del producto"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {imagePreview ? (
              <div className="relative group flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Vista previa"
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
            {loading ? "Actualizando..." : "Actualizar Producto"}
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