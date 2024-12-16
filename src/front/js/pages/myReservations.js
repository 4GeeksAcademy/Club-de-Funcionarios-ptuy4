import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";

export const MyReservations = () => {
  const { store, actions } = useContext(Context);
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    const userReservations = await actions.getUserSchedules(store.user.id);
    setReservations(Array.isArray(userReservations) ? userReservations : []);
  };

  useEffect(() => {
    fetchReservations();
  }, [actions, store.user.user_id]);

  const cleanDates = (date) => {
    const cleanDate = date.split("T")
    return cleanDate[0];
  }

  const handleCancel = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Cancelarás tu reserva, este cambio no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Si, hazlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        actions.updateSchedule(id, { status: "cancelado" });
        fetchReservations();
      }
    });
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
            maxHeight: "100vh",
          }}
        >
          <h1 className="mb-4">Mis Reservas</h1>

          {reservations.length === 0 ? (
            <p className="text-center">No tienes reservas activas actualmente.</p>
          ) : (
            reservations.map((reservation, index) => (
              <div
                key={index}
                className="card mb-3 w-100"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "15px",
                }}
              >
                <div className="card-body text-center">
                  {reservation.book_id ? (
                    <p>
                      <strong>Libro reservado:</strong>{" "}
                      {reservation.book_title}
                    </p>
                  ) : (
                    <p>
                      <strong>Local reservado:</strong>{" "}
                      {reservation.location_name}
                    </p>
                  )}
                  <p>
                    <strong>Fechas:</strong> Desde {" "} {cleanDates(reservation.start_time)} hasta{" "}
                    {cleanDates(reservation.end_time)}
                  </p>
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleCancel(reservation.schedule_id)}
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
    </div>
  );
};
