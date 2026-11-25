import { useState } from "react";
import { FormInput } from "../Form/FormInput.jsx";
import { Loader } from "lucide-react";
import { ImageUploader } from "./ImageUploader.jsx";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

export const Form = ({
  fields,
  initialValues = {},
  onSubmit,
  submitText = "Enviar",
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    fields.forEach(({ name, validate }) => {
      if (!validate) return;

      const error = validate(values[name], values);

      if (error) {
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      let finalValues = { ...values };

      // Si hay una imagen (objeto File) seleccionada en el formulario
      if (values.imagen instanceof File) {
        const imagenUrl = await uploadToCloudinary(values.imagen);
        finalValues.imagen = imagenUrl; // Reemplaza el File por la URL de Cloudinary
      }

      // Enviar los datos del formulario con la URL de la imagen a tu backend
      await onSubmit(finalValues);
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((field) => (
        <FormInput
          key={field.name}
          {...field}
          value={values[field.name]}
          error={errors[field.name]}
          onChange={handleChange}
        />
      ))}

      {/* Guarda el archivo File en state.imagen cuando el usuario selecciona una foto */}
      <ImageUploader
        maxFiles={1}
        onImagesChange={(files) => {
          setValues((prev) => ({
            ...prev,
            imagen: files[0] || null, // Toma el primer archivo seleccionado
          }));
        }}
      />

      <button
        type="submit"
        disabled={loading}
        className="
          w-full 
          py-3 
          rounded-lg 
          font-medium 
          transition-all
          flex
          justify-center
          items-center
          hover:opacity-90 
          disabled:opacity-50 
          disabled:cursor-not-allowed
        "
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--navy-900)",
        }}
      >
        {loading ? <Loader className="animate-spin" /> : submitText}
      </button>
    </form>
  );
};
