import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from 'date-fns/locale';
import "../../styles/index.css";
import { Context } from "../store/appContext";

const Locals = () => {
  const { store, actions } = useContext(Context);
  const [filteredPlace, setFilteredPlace] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });


  useEffect(() => {
    actions.getPlaces();
  }, []);

  const availablePlaces = store.places;

  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const handleSearch = () => {
    const results = availablePlaces.filter(
      (place) =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlace(results);
  };

  const handleReservation = async (place) => {
    try {
      const reservationData = {
        user_id: store.user.id,
        book_id: null,
        location_id: place.location_id,
        start_time: selectionRange.startDate.toISOString(),
        end_time: selectionRange.endDate.toISOString(),
        status: "reservado",
      };

      const result = await actions.addSchedule(reservationData);

      // Formatear las fechas de inicio y fin tomadas del DateRange
      const formattedStartDate = selectionRange.startDate.toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      const formattedEndDate = selectionRange.endDate.toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      // Comprobar el resultado de la reserva
      if (result && result.success) {
        const successMessage = `Reserva realizada exitosamente. 
                                Fecha de inicio: ${formattedStartDate} 
                                Fecha de fin: ${formattedEndDate}`;

        setErrorMessage(successMessage);
      } else {
        // Si la respuesta del backend contiene un error, lo mostramos
        const errorMessage = result?.error || "Error desconocido al hacer la reserva";
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      // Captura cualquier error inesperado
      setErrorMessage("Hubo un problema al procesar la reserva. Intenta nuevamente.");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        <div
          className="col-12 col-md-5 d-flex flex-column align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            height: "100vh",
          }}
        >
          <h1
            className="mb-4 text-white"
            style={{
              fontSize: "3.5rem",
            }}
          >
            Locales
          </h1>
          <DateRange
            locale={es}
            ranges={[selectionRange]}
            onChange={handleSelect}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
          />
          {/* Botón de Volver a Inicio */}
          <div className="mt-4">
            <Link to="/userLogin">
              <button className="btn btn-secondary">Volver a Inicio</button>
            </Link>
          </div>
        </div>

        {/* Columna de información */}
        <div className="col-12 col-md-7 bg-white p-4">
          {/* Barra de búsqueda */}
          <div className="search-bar d-flex align-items-center mb-4">
            <input
              className="form-control me-2"
              placeholder="Buscar Local"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>


          {filteredPlace.length > 0 && (
            <div className="search-results mb-4">
              <h5>Resultados de búsqueda:</h5>
              <ul className="list-group">
                {filteredPlace.map((place, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex">
                      <img
                        src={place.image_url}
                        alt={`Imagen de ${place.name}`}
                        width="150"
                        className="me-3"
                      />
                      <div>
                        <div className="fs-4 fw-bold">{place.name}</div>
                        <div>Capacidad: {place.capacity}</div>
                        <div>Dirección: {place.address}</div>
                      </div>
                    </div>
                    <button className="btn btn-success" onClick={() => handleReservation(place)}>Reservar</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mostrar error debajo de los locales */}
          {errorMessage && (
            <div className="alert alert-success mt-4">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Locals;
