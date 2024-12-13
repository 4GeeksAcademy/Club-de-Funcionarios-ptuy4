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

  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    actions.getBooks();
  }, []);

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

    // Si el libro no está ya seleccionado, lo añadimos con las fechas seleccionadas
    if (!selectedBooks.find((b) => b.book_id === book.book_id)) {
      setSelectedBooks([
        ...selectedBooks,
        { ...book, startDate: selectionRange.startDate, endDate: selectionRange.endDate },
      ]);
    }
  };

  const handleRemoveBook = (index) => {
    const updatedBooks = selectedBooks.filter((_, i) => i !== index);
    setSelectedBooks(updatedBooks);
  };

  const handleReservation = async () => {
    if (selectedBooks.length === 0) {
      setErrorMessage("Por favor, selecciona al menos un libro para reservar.");
      return;
    }
  
    setErrorMessage(""); // Limpiar cualquier mensaje de error anterior
  
    // Validación de fechas (si son menores a hoy)
 const today = new Date();
const todayFormatted = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Solo día, mes y año

for (const book of selectedBooks) {
  const startDateFormatted = new Date(book.startDate.getFullYear(), book.startDate.getMonth(), book.startDate.getDate());
  const endDateFormatted = new Date(book.endDate.getFullYear(), book.endDate.getMonth(), book.endDate.getDate());

  if (startDateFormatted < todayFormatted || endDateFormatted < todayFormatted) {
    setErrorMessage("La fecha seleccionada no puede ser anterior a hoy.");
    return;
  }
}

  
    let reservationSuccessList = []; // Lista para guardar el resultado de cada reserva
  
    try {
      // Procesar reservas una por una para garantizar que todas se manejen correctamente
      for (const book of selectedBooks) {
        const reservation = {
          user_id: store.user.id,
          book_id: book.book_id,
          location_id: null,
          start_time: book.startDate.toISOString(),
          end_time: book.endDate.toISOString(),
          status: "reservado",
        };
  
        // Comprobar si el libro está disponible antes de intentar hacer la reserva
        const reservationSuccess = await actions.addSchedule(reservation);
  
        // Guardar el resultado de cada reserva
        reservationSuccessList.push({
          book: book.title,
          success: reservationSuccess,
        });
  
        // Si la reserva no es exitosa, mostramos un mensaje individual para cada libro no disponible
        if (!reservationSuccess) {
          // Si la respuesta contiene el error de 3 reservas
          if (reservationSuccess.error === "error_3_reservas") {
            setErrorMessage("Ya tienes 3 reservas activas. No puedes hacer más reservas.");
            return; // Salir del proceso si el usuario tiene 3 reservas
          }
          alert(`El libro "${book.title}" no está disponible en las fechas seleccionadas.`);
        } else {
          // Si la reserva es exitosa, mostramos el nombre del libro en el mensaje de éxito
          alert(`La reserva del libro "${book.title}" se realizó con éxito.`);
        }
      }
  
      // Al final, revisamos los resultados de todas las reservas
      const successfulReservations = reservationSuccessList.filter(res => res.success).length;
      const failedReservations = reservationSuccessList.length - successfulReservations;
  
      // Mostrar un mensaje global basado en el éxito de las reservas
      if (successfulReservations > 0) {
        alert(`${successfulReservations} reserva(s) realizada(s) con éxito.`);
      }
  
      if (failedReservations > 0) {
        alert(`${failedReservations} reserva(s) no pudieron realizarse debido a la falta de disponibilidad.`);
      }
  
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      alert("Ocurrió un error al intentar realizar las reservas. Inténtalo de nuevo.");
    }
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
                      <br />
                      <small>
                        {`Fecha de inicio: ${book.startDate.toLocaleDateString()} - Fecha de fin: ${book.endDate.toLocaleDateString()}`}
                      </small>
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
