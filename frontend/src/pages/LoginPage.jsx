import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../utils/useFetch.js";
import { Form } from "../components/Form/Form.jsx";

const fields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Ingrese su email',
    validate: (value) => {
      if (!value) return "El email es obligatorio";
    }
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    placeholder: 'Ingrese su contraseña',
    validate: (value) => {
      if (!value) return "La contraseña es obligatoria";
    }
  }
]

export const LoginPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogin = async (body) => {
    setMessage('');
    const response = await useFetch('/auth/login', 'POST', body);
    if (response.status == 400) {
      setMessage(response.message);
      return;
    }
    localStorage.setItem('token', response.token);
    localStorage.setItem('usuarioId', response.usuarioId);
    navigate('/productos');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--navy-800)" }}>Iniciar sesión</h1>
          <p className="text-muted-foreground">Ingresá a tu cuenta</p>

          {
            message && (
              <p className="mt-4 border border-red-500 bg-red-200 rounded-md py-3 text-red-950">{message}</p>
            )
          }

        </div>
        <Form
          fields={fields}
          onSubmit={handleLogin}
          submitText="Iniciar sesión"
        />
        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tenés una cuenta?
            <button
              type="button"
              className="ml-1 font-medium transition-colors hover:underline"
              style={{ color: "var(--accent)" }}
              onClick={() => navigate("/register")}
            >
              Registrate
            </button>
          </p>
          <span className="block text-xs text-muted-foreground">Sistema de Gestión de Productos - TalentoTech</span>
        </div>
      </div>
    </div>
  );
};