import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir al usuario
import { useContext } from "react";
import { Context } from "../store/appContext"; // Asegúrate de importar el contexto

export const Register = () => {
  const { actions } = useContext(Context); // Acciones del contexto para registro
  const navigate = useNavigate(); // Para redirigir al usuario

  // Estado para manejar los datos del formulario
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // Estado para manejar errores

  // Manejo del cambio de los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar la recarga de la página al enviar el formulario

    // Validación de los campos del formulario
    if (!user.fullName || !user.email || !user.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // Validación del formato del correo
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(user.email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Validación de la contraseña (debe tener al menos 8 caracteres)
    if (user.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Intentar registrar al usuario usando la acción del contexto
    try {
      const response = await actions.register(user.fullName, user.email, user.password, navigate);

      if (response) {
        setError(""); // Limpiar errores si el registro es exitoso
        navigate("/userlogin"); // Redirigir al login después de registrarse
      } else {
        setError("Hubo un problema al registrar el usuario.");
      }
    } catch (error) {
      setError("Hubo un error al registrar el usuario.");
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('https://i.ibb.co/rGc9cYg/image-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <div className="row w-100 h-100 m-0">
        <div
          className="col-5 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="text-center px-4">
            <h1 className="mb-5">Registrate</h1>

            {/* Mostrar el error si existe */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Formulario de registro */}
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre completo"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  name="password"
                  value={user.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary mb-2">
                Registrate
              </button>
            </form>

            <p>
              Al registrarte aceptas nuestros <br />
              <a href="/terms-and-conditions" style={{ color: "white" }}>
                términos y condiciones
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
