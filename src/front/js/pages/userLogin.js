import React from "react";
import { Link } from "react-router-dom";

export const UserLogin = () => {
  return (
    <div
      className="container-fluid position-relative"
      style={{
        
        
        color: "white",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
        padding: 0,
        margin: 0,
      }}
    >
      <div
        className="position-absolute w-100 h-50 mt-5"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundPosition: "center",
          backgroundImage: "url('https://images.unsplash.com/photo-1580173368206-d8dc5ba0ae4d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          top: 0,
          left: 0,
        }}
      ></div>

<div className="position-relative z-index-1 text-start w-100"
       style={{ top: "-300px",  paddingLeft: "10px", textAlign: "left" }}
       >
        
        <h1 className="mb-4">
          !Hola Usuario !
        </h1>
        <p className="mb-4">
          Comienza a disfrutar de tus beneficios como nuestro colaborador,<br />
          podés reservar libros de la biblioteca o realziar la reserva del local <br />
          de eventos.
        </p>
       
      </div>
    
    
    </div>
    
    
  );
};
