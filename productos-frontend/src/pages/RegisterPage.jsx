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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const response = await fetch("http://localhost:8080/auth/register", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(form)
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-card border border-border rounded-lg shadow-lg p-8">

        <div className="text-center mb-8">
          <h1
            className="text-4xl mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--navy-800)",
            }}
          >
            SGP Premium
          </h1>

          <p className="text-muted-foreground">
            Registrate para comenzar a gestionar tus productos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-2">
                Nombre
              </label>

              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Juan"
                className="
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  bg-input-background
                  border
                  border-border
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring
                "
              />
            </div>

            <div>
              <label className="block mb-2">
                Apellido
              </label>

              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                className="
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  bg-input-background
                  border
                  border-border
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring
                "
              />
            </div>

          </div>

          <div>
            <label className="block mb-2">
              Correo Electrónico
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@empresa.com"
              className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-input-background
                border
                border-border
                focus:outline-none
                focus:ring-2
                focus:ring-ring
              "
            />
          </div>

          <div>
            <label className="block mb-2">
              Contraseña
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-input-background
                border
                border-border
                focus:outline-none
                focus:ring-2
                focus:ring-ring
              "
            />
          </div>

          <div>
            <label className="block mb-2">
              Confirmar Contraseña
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-input-background
                border
                border-border
                focus:outline-none
                focus:ring-2
                focus:ring-ring
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-lg
              font-medium
              transition-all
              hover:opacity-90
            "
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--navy-900)",
            }}
          >
            Crear Cuenta
          </button>

        </form>

        <div className="mt-6 text-center">

          <p className="text-sm text-muted-foreground">
            ¿Ya tenés una cuenta?

            <Link
              to="/login"
              className="ml-1 font-medium hover:underline"
              style={{
                color: "var(--accent)",
              }}
            >
              Iniciá sesión
            </Link>
          </p>

          <p className="text-xs text-muted-foreground mt-4">
            Sistema de Gestión de Productos
          </p>

        </div>

      </div>
    </div>
  );
}