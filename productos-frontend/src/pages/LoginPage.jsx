import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState(400);

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    }
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const loginUser = {
      email: form.email,
      password: form.password
    }

    const response = await fetch("http://localhost:8080/auth/login", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(loginUser)
    });
    const data = await response.json();

    if (data.status == 400) {
      setShowMessage(true);
      setMessage(data.message);
      setMessageStatus(400)
      return
    }
    
    localStorage.setItem("token", data.token);

    setForm({
      email: "",
      password: "",
    })

    setErrors({});

    navigate("/productos");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--navy-800)" }}>SGP Premium</h1>
          <p className="text-muted-foreground">Ingresá a tu cuenta</p>
          <div className={showMessage ? "block" : "hidden"}>
            <p className={messageStatus == 200 ? "border border-green-500 bg-green-200 rounded-md py-3 text-green-950" : "border border-red-500 bg-red-200 rounded-md py-3 text-red-950"}>{message}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2">Correo electrónico</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="correo@empresa.com" className={`w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring ${errors.email ? 'border-red-500' : 'hover:border-gray-300'}`} />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2">Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="********" className={`w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring ${errors.password ? 'border-red-500' : 'hover:border-gray-300'}`} />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>
          <button type="submit" className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90" style={{ backgroundColor: "var(--accent)", color: "var(--navy-900)" }}>Iniciar sesión</button>
        </form>
        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tenés una cuenta?
            <button type="button" className="ml-1 font-medium transition-colors hover:underline" style={{ color: "var(--accent)" }} onClick={() => navigate("/register")}>Registrate</button>
          </p>
          <span className="block text-xs text-muted-foreground">Sistema de Gestión de Productos</span>
        </div>
      </div>
    </div>
  );
}