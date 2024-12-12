import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importar Link
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from "date-fns/locale";
import "../../styles/index.css";
import { Context } from "../store/appContext";

const Library = () => {
  const { store, actions } = useContext(Context);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  useEffect(() => {
    actions.getBooks();
  }, []);

  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const availableBooks = store.books;

  const handleSearch = () => {
    const results = availableBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(results);
  };

  const handleSelectBook = (book) => {
    if (selectedBooks.length >= 3) {
      alert("Solo puedes seleccionar un máximo de 3 libros.");
      return;
    }

    if (!selectedBooks.find((b) => b.title === book.title)) {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const handleRemoveBook = (index) => {
    const updatedBooks = selectedBooks.filter((_, i) => i !== index);
    setSelectedBooks(updatedBooks);
  };

  const handleReservation = () => {
    if (!selectionRange.startDate || !selectionRange.endDate) {
      setErrorMessage("Por favor, selecciona un rango de fechas para reservar.");
      return;
    }

    if (selectedBooks.length === 0) {
      setErrorMessage("Por favor, selecciona al menos un libro para reservar.");
      return;
    }

    let reservationObjects = []
    selectedBooks.map((book, index) => {
      let reservation = {
        user_id: store.user.id,
        book_id: book.book_id,
        location_id: null,
        start_time: selectionRange.startDate.toISOString(),
        end_time: selectionRange.endDate.toISOString(),
        status: "reservado"
      };
      reservationObjects.push(reservation);
    });

    try {
      reservationObjects.map((reservation) => {
        actions.addSchedule(reservation);
      });
      alert("Se ha realizado la reserva correctamente")
    } catch (error) {
      alert("Error al crear la reserva")
      console.error(error);
    }


    setErrorMessage("");

    alert("Reserva realizada con éxito");
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "#f0f0f0",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <div className="row w-100 h-100 m-0">
        {/* Sección izquierda: Calendario */}
        <div
          className="col-5 d-flex flex-column justify-content-center align-items-center position-relative"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <div
            className="overlay position-absolute w-100 h-100"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              zIndex: 1,
            }}
          ></div>
          <div
            className="text-center px-4 position-relative"
            style={{
              zIndex: 2,
            }}
          >
            <h1
              className="mb-4"
              style={{
                color: "white",
                fontSize: "3.5rem",
              }}
            >
              Biblioteca
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
        </div>
        {/* Sección derecha: Búsqueda y selección */}
        <div
          className="col-7 p-4"
          style={{
            backgroundColor: "white",
          }}
        >
          {/* Barra de búsqueda */}
          <div className="search-bar d-flex align-items-center mb-4">
            <input
              className="form-control me-2"
              placeholder="Busca por título o autor"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Buscar
            </button>
          </div>

          {/* Resultados de búsqueda */}
          {filteredBooks.length > 0 && (
            <div className="search-results mb-4">
              <h5>Resultados de búsqueda:</h5>
              <ul className="list-group">
                {filteredBooks.map((book, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <strong>{book.title}</strong> - {book.author}
                    </span>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleSelectBook(book)}
                    >
                      Seleccionar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Libros seleccionados */}
          <div className="selected-books">
            <h2
              className="mb-3 text-center"
              style={{
                color: "#2c3e50",
                fontWeight: "bold",
                borderBottom: "2px solid #2c3e50",
                paddingBottom: "10px",
              }}
            >
              Libros Seleccionados
            </h2>
            {selectedBooks.length > 0 ? (
              <ul className="list-group">
                {selectedBooks.map((book, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <strong>{book.title}</strong> - {book.author}
                    </span>
                    <i
                      className="fas fa-times text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveBook(index)}
                    ></i>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-center">
                No hay libros seleccionados.
              </p>
            )}

            {/* Mensaje de error si no se ha seleccionado un rango o libros */}
            {errorMessage && (
              <div className="alert alert-danger text-center" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="d-flex justify-content-center mt-4">
              <button className="btn btn-success" onClick={handleReservation}>
                Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;