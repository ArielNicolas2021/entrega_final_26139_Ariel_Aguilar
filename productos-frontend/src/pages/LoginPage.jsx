import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });
    navigate("/productos");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg border border-border p-8">

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
            Ingresá a tu cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Iniciar sesión
          </button>

        </form>

        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tenés una cuenta?
            <button
              type="button"
              className="
        ml-1
        font-medium
        transition-colors
        hover:underline
      "
              style={{
                color: "var(--accent)",
              }}
              onClick={() => navigate("/register")}
            >
              Registrate
            </button>
          </p>

          <span className="block text-xs text-muted-foreground">
            Sistema de Gestión de Productos
          </span>
        </div>

      </div>
    </div>
  );
}