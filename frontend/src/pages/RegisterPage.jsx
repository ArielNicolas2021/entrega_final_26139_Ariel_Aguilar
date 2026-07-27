import { useState } from "react";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState(400);

  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    if (!form.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    }
    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    }
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    } else if (form.confirmPassword != form.password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const newUser = {
      nombre: form.nombre + " " + form.apellido,
      email: form.email,
      password: form.password
    }

    const response = await fetch("http://localhost:8080/auth/register", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(newUser)
    });

    const data = await response.json();

    if (data.status == 400) {
      setShowMessage(true);
      setMessage(data.message);
      setMessageStatus(400)
      return
    }
    
    setShowMessage(true);
    setMessage(data.message);
    setMessageStatus(200)

    setForm({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      confirmPassword: "",
    })

    setErrors({});

  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-card border border-border rounded-lg shadow-lg p-8">
        <div className="text-center mb-8 flex flex-col gap-2">
          <h1 className="text-4xl mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--navy-800)" }}>SGP Premium</h1>
          <p className="text-muted-foreground">Registrate para comenzar a gestionar tus productos</p>
          <div className={showMessage ? "block" : "hidden"}>
            <p className={messageStatus == 200 ? "border border-green-500 bg-green-200 rounded-md py-3 text-green-950" : "border border-red-500 bg-red-200 rounded-md py-3 text-red-950"}>{message}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan" className={`w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring ${errors.nombre ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2">Apellido</label>
              <input type="text" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Pérez" className={`w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring ${errors.apellido ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />
              {errors.apellido && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellido}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-2">Correo Electrónico</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="correo@empresa.com" className={`w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring ${errors.email ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2">Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="********" className={`w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring ${errors.password ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2">Confirmar Contraseña</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="********" className={`w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring ${errors.confirmPassword ? 'border-red-500' : 'border-border hover:border-gray-300'}`} />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button type="submit" className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90" style={{ backgroundColor: "var(--accent)", color: "var(--navy-900)" }}>Crear Cuenta</button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tenés una cuenta?
            <Link to="/login" className="ml-1 font-medium hover:underline" style={{ color: "var(--accent)" }}>Iniciá sesión</Link>
          </p>
          <p className="text-xs text-muted-foreground mt-4">Sistema de Gestión de Productos</p>
        </div>
      </div>
    </div>
  );
}