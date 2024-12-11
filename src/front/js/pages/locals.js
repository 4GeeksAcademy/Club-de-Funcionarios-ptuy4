import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Asegúrate de importar Link
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from 'date-fns/locale';
import "../../styles/index.css";
import { Context } from "../store/appContext";

const Locals = () => {
  const { store, actions } = useContext(Context);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  useEffect(() => {
    actions.getPlaces();
  }, []);

  const availableBooks = store.places;

  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Columna del calendario */}
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
              onClick={() => console.log("Buscando:", searchQuery)}
            >
              Buscar
            </button>
          </div>

          {/* Información del local (reemplazar lista dinámica) */}
          <div className="d-flex flex-column flex-md-row align-items-center">
            <img
              alt="Un lugar bellamente decorado para eventos"
              className="img-fluid rounded-lg mb-4 mb-md-0 me-md-4"
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1798&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              style={{ width: "300px", height: "200px" }}
            />
            <div>
              <h2 className="text-2xl fw-bold mb-2">LOCAL 1</h2>
              <p className="text-gray-700 mb-1">
                Dirección: Arenal Grande 1570, Montevideo.
              </p>
              <p className="text-gray-700 mb-1">Capacidad: 100 personas.</p>
              <p className="text-gray-700 mb-4">Disponible: Sí/No</p>
              <button className="btn btn-success px-4 py-2">Reservar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locals;