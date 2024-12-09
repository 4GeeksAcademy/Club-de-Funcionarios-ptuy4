import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"; // Asegúrate de importar el contexto

export const Navbar = () => {
  const { store, actions } = useContext(Context); // Obtener el store y las acciones del contexto
  const [email, setEmail] = useState(""); // Estado para el email del formulario
  const [password, setPassword] = useState(""); // Estado para la contraseña del formulario
  const [error, setError] = useState(""); // Estado para manejar errores del formulario
  const navigate = useNavigate(); // Para redirigir al usuario

  // Manejar el envío del formulario de login
  const handleLogin = async (e) => {
    e.preventDefault(); // Evitar la recarga de la página

    // Validaciones simples para email y password
    if (!email || !password) {
      setError("Por favor, completa ambos campos.");
      return;
    }

    // Llamar a la acción de login desde el contexto
    const success = await actions.login(email, password);

    if (success) {
      setError(""); // Limpiar el mensaje de error si el login es exitoso
      navigate("/userLogin"); // Redirigir a la página reservas si esta OK
    } else {
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }
  };

  // Manejar logout
  const handleLogout = () => {
    actions.logout(); // Llamar a la acción de logout
    navigate("/"); // Redirigir a la página principal después de cerrar sesión
  };

  return (
    <nav className="navbar navbar-light andaBackgroundColor h-100">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/">
          <img
            src="https://i.ibb.co/zrCKh8H/logo-anda-blanco.png"
            alt="Logo ANDA"
            style={{ height: "10vh", width: "15vh" }}
          />
        </Link>

        {/* Mostrar solo si el usuario está logueado */}
        {store.isAuthenticated && (
          <div className="d-flex gap-4">
            <Link to="/profile" className="text-decoration-none text-white">
              Mi Perfil
            </Link>
            <Link to="/mis-reservas" className="text-decoration-none text-white">
              Mis Reservas
            </Link>

            {/* Mostrar "Administrar Locales y Libros" solo si el usuario es admin */}
            {store.user && store.user.is_admin === true && 
  <Link to="/adminPage" className="text-decoration-none text-white">
    Administrar Locales y Libros
  </Link>
}
          </div>
        )}

        {/* Dropdown o botón de login/logout */}
        <div className="ml-auto">
          {!store.isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn btn-light andaTextColor dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Ingresar
              </button>
              <div
                className="dropdown-menu dropdown-menu-end p-4 shadow"
                aria-labelledby="dropdownMenuButton"
                style={{ minWidth: "300px" }}
              >
                <form onSubmit={handleLogin}>
                  {/* Mostrar el error si existe */}
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {/* Enlace para recuperar la contraseña */}
                  <Link
                    to="/recoverPassword"
                    className="d-block mb-3 text-decoration-none"
                  >
                    Olvidé mi contraseña
                  </Link>
                  <button type="submit" className="btn btn-primary w-100">
                    Ingresar
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-light andaTextColor"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
