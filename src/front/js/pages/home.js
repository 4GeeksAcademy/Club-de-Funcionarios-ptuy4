import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Home = () => {


  const navigate = useNavigate();
  const { store } = useContext(Context); // Obtenemos el estado global, donde guardamos el token
  const token = store.token || localStorage.getItem("token"); // Revisamos el token

  
  useEffect(() => {
    if (token) {
      navigate("/userLogin"); // Redirige a la página de userLogin
    }
  }, [token, navigate]);

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
        overflow: "hidden",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Capa negra con transparencia */}
      <div
        className="position-absolute w-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          height: "50%", 
          top: "25%", 
          left: 0,
        }}
      ></div>

      {/* Contenido del texto */}
      <div
        className="position-relative z-index-1 text-start w-100"
        style={{
          paddingLeft: "50px", 
          textAlign: "left",
        }}
      >
        <h1 className="mb-4">
          Te damos la bienvenida al Club de<br />
          Funcionarios de ANDA.
        </h1>
        <p className="mb-4">
          Inicia sesión o registrate para disfrutar de tus beneficios como colaborador.
        </p>
        <Link to="/register">
          <button className="btn btn-primary">Registrarme</button>
        </Link>
      </div>
    </div>
  );
};