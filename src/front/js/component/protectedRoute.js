import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext"; // Asegúrate de importar el contexto

const ProtectedRoute = ({ children }) => {
  const { store } = useContext(Context); // Obtenemos el estado global, donde guardamos el token

  const token = store.token || localStorage.getItem("token"); // Primero revisamos en el store, sino en localStorage

  if (!token) {
    return <Navigate to="/" />; // Si no hay token, redirige al home
  }

  return children; // Si el token está presente, muestra el contenido protegido
};

export default ProtectedRoute;
