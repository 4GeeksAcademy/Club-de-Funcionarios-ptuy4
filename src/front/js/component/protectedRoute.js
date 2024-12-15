import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

const ProtectedRoute = ({ children, isAdminRequired = false }) => {
  const { store } = useContext(Context); // Obtenemos el estado global

  const token = store.token || localStorage.getItem("token"); // Primero revisamos en el store, sino en localStorage
  const isAdmin = store.user.is_admin; // Asumimos que el rol de admin está guardado en el estado global como `store.isAdmin`

  // Si no hay token, redirige al home
  if (!token) {
    return <Navigate to="/" />;
  }

  
  // Si la página requiere ser admin y el usuario no es admin, redirige
  if (isAdminRequired && !isAdmin) {
    return <Navigate to="/userLogin" />; // Redirige al home si no es admin
  }

  
  return children;
};

export default ProtectedRoute;
