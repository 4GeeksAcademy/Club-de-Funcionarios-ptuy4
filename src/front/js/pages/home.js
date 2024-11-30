import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div
      className="container-fluid position-relative"
      style={{
        backgroundImage: "url('https://i.ibb.co/M5hmKC5/image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
          top: 0,
          left: 0,
        }}
      ></div>

      <div className="position-relative z-index-1 text-start w-100"
       style={{ top: "-300px",  paddingLeft: "10px", textAlign: "left" }}
       >
        <h1 className="mb-4">
          Te damos la bienvenida al Club de<br />
          Funcionaros de ANDA.
        </h1>
        <p className="mb-4">
          Inicia sesión o regístrate para disfrutar de tus beneficios como colaborador.
        </p>
        <Link to="/register">
        <button className="btn btn-primary">Registrarme</button>
        </Link>
      </div>
    </div>
  );
};
