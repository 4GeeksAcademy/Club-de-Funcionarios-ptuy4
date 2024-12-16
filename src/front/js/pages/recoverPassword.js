import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Swal from "sweetalert2";

export const RecoverPassword = () => {
  const { actions } = useContext(Context); 
  const [email, setEmail] = useState(""); 

  
  const handleRecoverPassword = () => {
    if (!email) {
      // Validación simple para verificar que el correo no esté vacío
      Swal.fire({
        title: "Error",
        text: "Por favor, introduce un correo electrónico válido.",
        icon: "error",
      });
      return;
    }
    
    actions.recoverUserPass(email);
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
            <h1 className="mb-5">Recuperar Contraseña</h1>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Correo electrónico"
                aria-label="correoElectronico"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <button
              className="btn btn-primary mb-2"
              onClick={handleRecoverPassword} 
            >
              Enviar mail
            </button>
            <p className="mt-3">
              Te enviaremos un correo electrónico con una nueva contraseña.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Configuración de rutas solo para RecoverPassword
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/recoverPassword" element={<RecoverPassword />} />
      </Routes>
    </Router>
  );
}
