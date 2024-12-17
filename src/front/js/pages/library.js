import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from 'date-fns/locale';
import "../../styles/index.css";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";

const Library = () => {
  const { store, actions } = useContext(Context);
  const [filteredbook, setFilteredbook] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });


  useEffect(() => {
    actions.getBooks();
  }, []);

  const availablebooks = store.books;

  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const handleSearch = () => {
    const results = availablebooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredbook(results);
  };

  const handleReservation = async (book) => {
    try {
      const reservationData = {
        user_id: store.user.id,
        book_id: book.book_id,
        location_id: null,
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
        Swal.fire({
          title: "<strong><u>Reserva realizada</u></strong>",
          icon: "success",
          html: `
            Reserva realizada exitosamente. 
            Fecha de inicio: ${formattedStartDate} 
            Fecha de fin: ${formattedEndDate},
          `,
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: `
            <i class="fa fa-thumbs-up"></i> Great!
          `,
          confirmButtonAriaLabel: "Thumbs up, great!"
        });

        setErrorMessage(successMessage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          html: `
            Tu reserva no se pudo realizar
            <b>${result?.error || "Error desconocido"}</b>,
          `
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: `
          Tu reserva no se pudo realizar
          <b>Error desconocido</b>,
        `
      });
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
            Libros
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
              bookholder="Buscar Local"
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


          {filteredbook.length > 0 && (
            <div className="search-results mb-4">
              <h5>Resultados de búsqueda:</h5>
              <ul className="list-group">
                {filteredbook.map((book, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex">

                      <div>
                        <div className="fs-4 fw-bold">{book.title}</div>
                        <div>Autor: {book.author}</div>

                      </div>
                    </div>
                    <button className="btn btn-success" onClick={() => handleReservation(book)}>Reservar</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
