import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../../styles/index.css";

const Library = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  // Libros disponibles para la búsqueda (luego reemplazamos a datos reales de backend)
  const availableBooks = [
    { author: "Gabriel García Márquez", title: "Cien años de soledad" },
    { author: "J.K. Rowling", title: "Harry Potter y la piedra filosofal" },
    { author: "George Orwell", title: "1984" },
    { author: "J.R.R. Tolkien", title: "El señor de los anillos" },
    { author: "Jane Austen", title: "Orgullo y prejuicio" },
  ];

  const handleSearch = () => {
    const results = availableBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(results);
  };

  const handleSelectBook = (book) => {
    // Limitar a 3 libros seleccionados
    if (selectedBooks.length >= 3) {
      alert("Solo puedes seleccionar un máximo de 3 libros.");
      return;
    }

    // Evitar seleccionar un libro repetido
    if (!selectedBooks.find((b) => b.title === book.title)) {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const handleRemoveBook = (index) => {
    const updatedBooks = selectedBooks.filter((_, i) => i !== index);
    setSelectedBooks(updatedBooks);
  };

  const handleReservation = () => {
    // Validación del rango de fechas
    if (!selectionRange.startDate || !selectionRange.endDate) {
      setErrorMessage("Por favor, selecciona un rango de fechas para reservar.");
      return;
    }

    // Validación de libros seleccionados
    if (selectedBooks.length === 0) {
      setErrorMessage("Por favor, selecciona al menos un libro para reservar.");
      return;
    }

    // Si no hay errores, hacer la reserva
    setErrorMessage(""); // Limpiar el mensaje de error
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
          className="col-5 d-flex justify-content-center align-items-center position-relative"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            className="overlay position-absolute w-100 h-100"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
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
              ranges={[selectionRange]}
              onChange={handleSelect}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              editableDateInputs={true}
            />
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