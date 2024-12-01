import React from "react";
import { Link } from "react-router-dom";

export const UserLogin = () => {
  return (
    <div
      className="container-fluid position-relative"
      style={{
        color: "white",
        height: "100vh",
        overflow: "hidden",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Header */}
      <div
        className="position-relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1580173368206-d8dc5ba0ae4d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: "50px",
          color: "white",
        }}
      >
        {/* Capa negra */}
        <div
          className="position-absolute w-100"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            height: "100%",
            top: 0,
            left: 0,
          }}
        ></div>

        <h1 className="mb-3" style={{ position: "relative" }}>¡Hola! Usuario</h1>
        <p style={{ maxWidth: "600px", position: "relative" }}>
          Comenzá a disfrutar de tus beneficios como nuestro colaborador, podés
          reservar libros de la biblioteca o realizar la reserva del local de
          eventos.
        </p>
      </div>

      {/* Biblioteca y Local */}
      <div className="row m-0 text-center">
        <div className="col-md-6 p-0">
          <Link
            to="/biblioteca"
            style={{ textDecoration: "none" }}
          >
            <div
              className="position-relative d-flex justify-content-center align-items-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1485322551133-3a4c27a9d925?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "50vh",
                color: "white",
              }}
            >
              {/* Capa negra */}
              <div
                className="position-absolute w-100"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  height: "100%",
                  top: 0,
                  left: 0,
                }}
              ></div>

              <h2 style={{ fontSize: "3rem", position: "relative" }}>
                BIBLIOTECA
              </h2>
            </div>
          </Link>
        </div>
        <div className="col-md-6 p-0">
          <Link
            to="/local"
            style={{ textDecoration: "none" }}
          >
            <div
              className="position-relative d-flex justify-content-center align-items-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1798&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "50vh",
                color: "white",
              }}
            >
              {/* Capa negra */}
              <div
                className="position-absolute w-100"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  height: "100%",
                  top: 0,
                  left: 0,
                }}
              ></div>

              <h2 style={{ fontSize: "3rem", position: "relative" }}>LOCAL</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
