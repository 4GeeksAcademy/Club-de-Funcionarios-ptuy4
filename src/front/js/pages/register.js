import React from "react";
import { Link } from "react-router-dom";

export const Register = () => {
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
            <div class="input-group mb-3">
              <input type="text" className="form-control" placeholder="Nombre completo" aria-label="nombreCompleto"/>
            </div>
            <div class="input-group mb-3">
              <input type="text" className="form-control" placeholder="Nº de colaborador" aria-label="nroColaborador"/>
            </div>
            <div class="input-group mb-3">
              <input type="text" className="form-control" placeholder="Email" aria-label="email"/>
            </div>
            <div class="input-group mb-3">
              <input type="password" className="form-control" placeholder="Contraseña" aria-label="contraseña"/>
            </div>
            
            <Link to="/register">
              <button className="btn btn-primary mb-2">Registrate</button>
            </Link>
            <p>Al registrate aceptas nuestros<br />
            términos y condiciones</p>
       
          </div>
       
        </div>
      
      </div>
    </div>
  );
};
