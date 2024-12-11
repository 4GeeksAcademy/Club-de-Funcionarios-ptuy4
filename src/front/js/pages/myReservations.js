import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

const reservations = [];

export const MyReservations = () => {
  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
		reservations = actions.getUserSchedule(store.user.user_id);
	}, []);

  const handleCancel = (id) => {
    setSelectedReservation(id);
    setShowModal(true);
  };

  const confirmCancel = () => {
    console.log(`Reserva con ID ${selectedReservation} cancelada`);
    setShowModal(false);
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1435527173128-983b87201f4d?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        className="row w-100 h-100 d-flex justify-content-center align-items-center"
        style={{ margin: 0 }}
      >
        <div
          className="col-12 col-md-8 d-flex flex-column align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "10px",
            padding: "30px",
            overflowY: "auto",
            maxHeight: "100vh"
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
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "15px",
                }}
              >
                <div className="card-body text-center">
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

          <Link to="/userLogin">
            <button className="btn btn-secondary mt-4">Volver a Inicio</button>
          </Link>
        </div>
      </div>

{/* Modal */}
{showModal && selectedReservation && (
  <div
    className="modal d-block"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
  >
    <div className="modal-dialog">
      <div className="modal-content" style={{ color: "black" }}>
        <div className="modal-header">
          <h5 className="modal-title">Confirmar Cancelación</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <p>
            ¿Estás seguro de que deseas cancelar la reserva de{" "}
            <strong>
              {reservations.find((res) => res.id === selectedReservation).type}
            </strong>
            ?
          </p>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Cerrar
          </button>
          <button className="btn btn-danger" onClick={confirmCancel}>
            Cancelar Reserva
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};