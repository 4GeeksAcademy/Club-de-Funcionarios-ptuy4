import React from "react";
import { Link } from "react-router-dom";

const reservations = [
  {
    id: 1,
    type: "Biblioteca",
    items: ["Libro 1", "Libro 2", "Libro 3"],
    startDate: "2023-10-01",
    endDate: "2023-10-10",
  },
  {
    id: 2,
    type: "Local",
    venue: "Salón de Eventos A",
    startDate: "2023-10-15",
    endDate: "2023-10-16",
  },
];

export const MyReservations = () => {
  const handleCancel = (id) => {
    // Lógica para cancelar la reserva
    console.log(`Reserva con ID ${id} cancelada`);
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop')", // Cambia la URL si es necesario
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
          className="col-8 d-flex flex-column align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "10px",
            padding: "30px",
            overflowY: "auto", // Por si hay muchas reservas
            maxHeight: "90vh",
          }}
        >
          <h1 className="mb-4">Mis Reservas</h1>

          {reservations.length === 0 ? (
            <p className="text-center">No tienes reservas actualmente.</p>
          ) : (
            reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="card mb-3 w-100"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">{reservation.type}</h5>
                  {reservation.type === "Biblioteca" ? (
                    <p>
                      <strong>Libros reservados:</strong>{" "}
                      {reservation.items.join(", ")}
                    </p>
                  ) : (
                    <p>
                      <strong>Local reservado:</strong> {reservation.venue}
                    </p>
                  )}
                  <p>
                    <strong>Fechas:</strong> {reservation.startDate} -{" "}
                    {reservation.endDate}
                  </p>
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleCancel(reservation.id)}
                  >
                    Cancelar Reserva
                  </button>
                </div>
              </div>
            ))
          )}

          <Link to="/">
            <button className="btn btn-secondary mt-4">Volver a Inicio</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
