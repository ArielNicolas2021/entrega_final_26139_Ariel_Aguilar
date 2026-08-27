import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../components/Form/Form";
import { useFetch } from "../utils/useFetch";

const fields = [
  {
    name: 'nombre',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ingrese su nombre',
    validate: (value) => {
      if (!value) return "El nombre es obligatorio";
    }
  },
  {
    name: 'apellido',
    label: 'Apellido',
    type: 'text',
    placeholder: 'Ingrese su apellido',
    validate: (value) => {
      if (!value) return "El apellido es obligatorio";
    }
  },
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
    placeholder: 'Ingrese una contraseña',
    validate: (value) => {
      if (!value) return "La contraseña es obligatoria";
      if (value.length < 8) return "La contraseña debe tener al menos 8 carácteres";
    }
  },
  {
    name: 'confirmPassword',
    label: 'Confirmar contraseña',
    type: 'password',
    placeholder: 'Repita la contraseña',
    validate: (value, values) => {
      if (!value) return "Por favor, repita la contraseña";
      if (value != values.password) return "Las contraseñas no coinciden";
    }
  }
]

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  const handleRegister = async (body) => {
    setMessage('');
    const newUser = {
      nombre: `${body.nombre} ${body.apellido}`,
      email: body.email,
      password: body.password
    };

    const response = await useFetch('/auth/register', 'POST', newUser);
    if (response.status == 400) {
      setError(true);
      setMessage(response.message);
      return;
    }

    setError(false);
    setMessage(response.message);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--navy-800)" }}>Registrarse</h1>
          <p className="text-muted-foreground">Regístrate para comenzar a gestionar tus productos</p>

          {
            message && (
              <p className={`
                mt-4
                border
                rounded-md
                py-3
                ${error ? 'text-red-950 border-red-500 bg-red-200' : 'text-green-950 border-green-500 bg-green-200'}
              `}
              >
                {message}
              </p>
            )
          }

        </div>
        <Form
          fields={fields}
          onSubmit={handleRegister}
          submitText="Crear cuenta"
        />
        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tenés una cuenta?
            <button
              type="button"
              className="ml-1 font-medium transition-colors hover:underline"
              style={{ color: "var(--accent)" }}
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
          </p>
          <span className="block text-xs text-muted-foreground">Sistema de Gestión de Productos</span>
        </div>
      </div>
    </div>
  );
}