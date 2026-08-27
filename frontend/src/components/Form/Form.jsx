import { useState } from "react";
import { FormInput } from "../Form/FormInput.jsx";
import { Loader } from "lucide-react";

export const Form = ({
  fields,
  initialValues = {},
  onSubmit,
  submitText = 'Enviar'
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Leer el valor del input cada vez que cambia
  const handleChange = ({ target }) => {
    const { name, value } = target;

    setValues((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validar los inputs
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
    await onSubmit(values);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {
        fields.map((field) => (
          <FormInput key={field.name} {...field} value={values[field.name]} error={errors[field.name]} onChange={handleChange} />
        ))
      }
      <button
        type="submit"
        disabled={loading}
        className='
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
        '
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--navy-900)",
        }}
      >
        {loading ? <Loader className="animate-spin" /> : submitText}
      </button>
    </form >
  );
}
