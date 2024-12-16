import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

export const AdminPage = () => {
	const { store, actions } = useContext(Context);
	const username = store.user ? store.user.name : "Usuario";

	const [formValues, setFormValues] = useState({});

	useEffect(() => {
		actions.getUsers();
		actions.getBooks();
		actions.getPlaces();
		actions.getSchedules();
	}, []);

	const handleInputChange = (e, modalKey) => {
		const { name, value } = e.target;
		setFormValues((prevValues) => ({
			...prevValues,
			[modalKey]: {
				...prevValues[modalKey],
				[name]: value,
			},
		}));
	};

	const handleEditUser = (modalKey, user_id) => {
		const modalData = formValues[modalKey];
		if(modalData) {
			const userData = {
				is_admin: true
			}
			actions.updateUser(user_id, userData);
		}

	}

	const handleEditBook = (modalKey, book_id) => {
		const modalData = formValues[modalKey];
		console.log(modalData)
		if(modalData) {
			const bookData = {
				title: modalData.title,
				author: modalData.author
			}
			actions.updateBook(book_id, bookData);
		}
	}

	const handleDeleteBook = (book_id) => {
		if(book_id) {
			actions.deleteBook(book_id);
		}
	}

	const handleCreateBook = (modalKey) => {
		const modalData = formValues[modalKey];
		if(modalData.title && modalData.author) {
			const bookData = {
				title: modalData.title,
				author: modalData.author
			}
			actions.updateBook(bookData);
		}
		else {
			alert("Null values not allowed")
		}
	}

	const handleEditPlace = (modalKey, place_id) => {
		const modalData = formValues[modalKey];
		console.log(modalData)
	}

	const handleDeletePlace = (place_id) => {

	}

	const handleCreatePlace = (modalKey) => {
		const modalData = formValues[modalKey];
		console.log(modalData)
	}

	const handleEditSchedule = (modalKey, schedule_id) => {
		const modalData = formValues[modalKey];
		console.log(modalData)
	}

	return (
		<div>
			<div className="card mb-3" style={{ maxWidth: "540px" }}>
				<div className="row g-0">
					<div className="col-md-6">
						<img
							src="https://img.freepik.com/vector-premium/icono-perfil-simple-color-blanco-icono_1076610-50204.jpg"
							className="img-fluid rounded-start d-flex flex-center float-end"
							alt="..."
							style={{ width: "8rem" }}
						/>
					</div>
					<div className="col-md-6">
						<div className="card-body">
							<h1 className="card-title d-flex">{username}</h1>
						</div>
					</div>
				</div>
			</div>

			<nav>
				<div className="nav nav-tabs nav justify-content-center">
					<button
						className="nav-link active"
						id="nav-users-tab"
						data-bs-toggle="tab"
						data-bs-target="#nav-users"
						type="button"
						role="tab"
						aria-controls="nav-users"
						aria-selected="true"
					>
						Usuarios
					</button>
					<button
						className="nav-link"
						id="nav-books-tab"
						data-bs-toggle="tab"
						data-bs-target="#nav-books"
						type="button"
						role="tab"
						aria-controls="nav-books"
						aria-selected="false"
					>
						Libros
					</button>
					<button
						className="nav-link"
						id="nav-places-tab"
						data-bs-toggle="tab"
						data-bs-target="#nav-places"
						type="button"
						role="tab"
						aria-controls="nav-places"
						aria-selected="false"
					>
						Locales
					</button>
					<button
						className="nav-link"
						id="nav-schedules-tab"
						data-bs-toggle="tab"
						data-bs-target="#nav-schedules"
						type="button"
						role="tab"
						aria-controls="nav-schedules"
						aria-selected="false"
					>
						Reservas
					</button>
				</div>
			</nav>

			<div className="tab-content mx-4" id="nav-tabContent">
				{/* Usuarios */}
				<div className="tab-pane fade show active" id="nav-users" role="tabpanel" aria-labelledby="nav-users-tab">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Nombre completo</th>
								<th scope="col">Email</th>
								<th scope="col">Administrador</th>
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{store.users.map((usuario, index) => (
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{usuario.full_name}</td>
									<td>{usuario.email}</td>
									<td>{usuario.is_admin ? 'Sí' : 'No'}</td>
									<td>
										<button
											type="button"
											className="btn btn-success m-1"
											data-bs-toggle="modal"
											data-bs-target={`#editUserModal-${index}`}
										>
											<i className="fa-solid fa-pen"></i>
										</button>

										<div
											className="modal fade"
											id={`editUserModal-${index}`}
											tabIndex="-1"
											aria-labelledby={`editUserModalLabel-${index}`}
											aria-hidden="true"
										>
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id={`editUserModalLabel-${index}`}>
															Editar Usuario
														</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="form-check">
																<label htmlFor={`admin-checkbox-${index}`} className="form-check-label">
																	Hacer {usuario.full_name} administrador?
																</label>
																<input
																	type="checkbox"
																	className="form-check-input"
																	name="is_admin"
																	checked={formValues[`editUserModal-${index}`]?.is_admin || false}
																	onChange={(e) => handleInputChange(e, `editUserModal-${index}`)}
																/>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
															Cerrar
														</button>
														<button
															type="button"
															className="btn btn-primary"
															data-bs-dismiss="modal"
															onClick={() => handleEditUser(`editUserModal-${index}`, usuario.user_id)}
														>
															Confirmar
														</button>
													</div>
												</div>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Libros */}
				<div className="tab-pane fade" id="nav-books" role="tabpanel" aria-labelledby="nav-books-tab">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Titulo</th>
								<th scope="col">Autor</th>
								<th scope="col">Disponible</th>
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{store.books.map((libro, index) => (
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{libro.title}</td>
									<td>{libro.author}</td>
									<td>{libro.is_active ? "Si" : "No"}</td>
									<td>
										<button
											type="button"
											className="btn btn-success m-1"
											data-bs-toggle="modal"
											data-bs-target={`#editBookModal-${index}`}
										>
											<i className="fa-solid fa-pen"></i>
										</button>

										<div
											className="modal fade"
											id={`editBookModal-${index}`}
											tabIndex="-1"
											aria-labelledby={`editBookModalLabel-${index}`}
											aria-hidden="true"
										>
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id={`editBookModalLabel-${index}`}>
															Editar Libro
														</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label className="col-form-label">Titulo:</label>
																<input
																	type="text"
																	className="form-control"
																	name="title"
																	value={formValues[`editBookModal-${index}`]?.title || ""}
																	onChange={(e) => handleInputChange(e, `editBookModal-${index}`)}
																/>
															</div>
															<div className="mb-3">
																<label className="col-form-label">Autor:</label>
																<input
																	type="text"
																	className="form-control"
																	name="author"
																	value={formValues[`editBookModal-${index}`]?.author || ""}
																	onChange={(e) => handleInputChange(e, `editBookModal-${index}`)}
																/>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
															Cerrar
														</button>
														<button
															type="button"
															className="btn btn-primary"
															data-bs-dismiss="modal"
															onClick={() => handleEditBook(`editBookModal-${index}`, libro.book_id)}
														>
															Confirmar
														</button>
													</div>
												</div>
											</div>
										</div>
										{/* Eliminar libro */}
										<button type="button" className="btn btn-danger m-1" onClick={() => handleDeleteBook(libro.book_id)}>
											<i className="fa-solid fa-trash"></i>
										</button>
										{/* Agregar libro */}
										<button
											type="button"
											className="btn btn-primary m-1"
											data-bs-toggle="modal"
											data-bs-target={`#addBookModal-${index}`}
										>
											<i className="fa-solid fa-plus"></i>
										</button>
										<div
											className="modal fade"
											id={`addBookModal-${index}`}
											tabIndex="-1"
											aria-labelledby={`addBookModalLabel-${index}`}
											aria-hidden="true"
										>
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id={`addBookModalLabel-${index}`}>
															Agregar Libro
														</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label className="col-form-label">Titulo:</label>
																<input
																	type="text"
																	className="form-control"
																	name="title"
																	value={formValues[`addBookModal-${index}`]?.title || ""}
																	onChange={(e) => handleInputChange(e, `addBookModal-${index}`)}
																/>
															</div>
															<div className="mb-3">
																<label className="col-form-label">Autor:</label>
																<input
																	type="text"
																	className="form-control"
																	name="author"
																	value={formValues[`addBookModal-${index}`]?.author || ""}
																	onChange={(e) => handleInputChange(e, `addBookModal-${index}`)}
																/>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
															Cerrar
														</button>
														<button
															type="button"
															className="btn btn-primary"
															data-bs-dismiss="modal"
															onClick={() => handleCreateBook(`addBookModal-${index}`)}
														>
															Confirmar
														</button>
													</div>
												</div>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Locales */}
				<div className="tab-pane fade" id="nav-places" role="tabpanel" aria-labelledby="nav-places-tab">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Salón</th>
								<th scope="col">Capacidad</th>
								<th scope="col">Dirección</th>
								<th scope="col">Activo</th>
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{store.places.map((local, index) => (
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{local.name}</td>
									<td>{local.capacity}</td>
									<td>{local.address}</td>
									<td>{local.is_active ? "Sí" : "No"}</td>
									<td>
										<button
											type="button"
											className="btn btn-success m-1"
											data-bs-toggle="modal"
											data-bs-target={`#editPlaceModal-${index}`}
										>
											<i className="fa-solid fa-pen"></i>
										</button>

										<div
											className="modal fade"
											id={`editPlaceModal-${index}`}
											tabIndex="-1"
											aria-labelledby={`editPlaceModalLabel-${index}`}
											aria-hidden="true"
										>
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id={`editPlaceModalLabel-${index}`}>
															Editar Local
														</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label className="col-form-label">Nombre:</label>
																<input
																	type="text"
																	className="form-control"
																	name="name"
																	value={formValues[`editPlaceModal-${index}`]?.name || ""}
																	onChange={(e) => handleInputChange(e, `editPlaceModal-${index}`)}
																/>
															</div>
															<div className="mb-3">
																<label className="col-form-label">Capacidad:</label>
																<input
																	type="text"
																	className="form-control"
																	name="capacity"
																	value={formValues[`editPlaceModal-${index}`]?.capacity || ""}
																	onChange={(e) => handleInputChange(e, `editPlaceModal-${index}`)}
																/>
															</div>
															<div className="mb-3">
																<label className="col-form-label">Dirección:</label>
																<input
																	type="text"
																	className="form-control"
																	name="address"
																	value={formValues[`editPlaceModal-${index}`]?.address || ""}
																	onChange={(e) => handleInputChange(e, `editPlaceModal-${index}`)}
																/>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
															Cerrar
														</button>
														<button
															type="button"
															className="btn btn-primary"
															data-bs-dismiss="modal"
															onClick={() => handleEditPlace(`editPlaceModal-${index}`, local.place_id)}
														>
															Confirmar
														</button>
													</div>
												</div>
											</div>
										</div>
										{/* Eliminar local */}
										<button type="button" className="btn btn-danger m-1" onClick={() => handleDeletePlace(local.local_id)}>
											<i className="fa-solid fa-trash"></i>
										</button>
										{/* Agregar local */}
										<button
											type="button"
											className="btn btn-primary m-1"
											data-bs-toggle="modal"
											data-bs-target={`#addPlaceModal-${index}`}
										>
											<i className="fa-solid fa-plus"></i>
										</button>
										<div
											className="modal fade"
											id={`addPlaceModal-${index}`}
											tabIndex="-1"
											aria-labelledby={`addPlaceModal-${index}`}
											aria-hidden="true"
										>
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id={`addPlaceModal-${index}`}>
															Agregar Libro
														</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label className="col-form-label">Nombre:</label>
																<input
																	type="text"
																	className="form-control"
																	name="name"
																	value={formValues[`editPlaceModal-${index}`]?.name || ""}
																	onChange={(e) => handleInputChange(e, `editPlaceModal-${index}`)}
																/>
															</div>
															<div className="mb-3">
																<label className="col-form-label">Capacidad:</label>
																<input
																	type="text"
																	className="form-control"
																	name="capacity"
																	value={formValues[`editPlaceModal-${index}`]?.capacity || ""}
																	onChange={(e) => handleInputChange(e, `editPlaceModal-${index}`)}
																/>
															</div>
															<div className="mb-3">
																<label className="col-form-label">Dirección:</label>
																<input
																	type="text"
																	className="form-control"
																	name="address"
																	value={formValues[`editPlaceModal-${index}`]?.address || ""}
																	onChange={(e) => handleInputChange(e, `editPlaceModal-${index}`)}
																/>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
															Cerrar
														</button>
														<button
															type="button"
															className="btn btn-primary"
															data-bs-dismiss="modal"
															onClick={() => handleCreatePlace(`editPlaceModal-${index}`)}
														>
															Confirmar
														</button>
													</div>
												</div>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Reservas */}
				<div className="tab-pane fade" id="nav-schedules" role="tabpanel" aria-labelledby="nav-schedules-tab">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Usuario</th>
								<th scope="col">Tipo</th>
								<th scope="col">Fecha de inicio</th>
								<th scope="col">Fecha de fin</th>
								<th scope="col">Estado</th>
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{store.schedules.map((schedule, index) => (
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{schedule.user_id}</td>
									<td>{schedule.location_id ? "Local" : "Libro"}</td>
									<td>{schedule.start_time}</td>
									<td>{schedule.end_time}</td>
									<td>{schedule.status}</td>
									<td>
										<button
											type="button"
											className="btn btn-success m-1"
											data-bs-toggle="modal"
											data-bs-target={`#editScheduleModal-${index}`}
										>
											<i className="fa-solid fa-pen"></i>
										</button>

										<div
											className="modal fade"
											id={`editScheduleModal-${index}`}
											tabIndex="-1"
											aria-labelledby={`editScheduleModalLabel-${index}`}
											aria-hidden="true"
										>
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id={`editScheduleModalLabel-${index}`}>
															Editar Reserva
														</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label className="col-form-label">Estado:</label>
																<select
																	className="form-select"
																	name="status"
																	value={formValues[`editScheduleModal-${index}`]?.status || ""}
																	onChange={(e) => handleInputChange(e, `editScheduleModal-${index}`)}
																>
																	<option value="" disabled>Seleccione uno</option>
																	<option value="Reservado">Reservado</option>
																	<option value="Cancelado">Cancelado</option>
																	<option value="Terminado">Terminado</option>
																</select>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
															Cerrar
														</button>
														<button
															type="button"
															className="btn btn-primary"
															data-bs-dismiss="modal"
															onClick={() => handleEditSchedule(`editScheduleModal-${index}`, schedule.schedule.id)}
														>
															Confirmar
														</button>
													</div>
												</div>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>

				</div>
			</div>
			{/* Botón volver al inicio */}
			<div className="mt-4 container-fluid d-flex align-items-center justify-content-center">
				<Link to="/userLogin">
					<button className="btn btn-secondary mb-4">Volver a Inicio</button>
				</Link>
			</div>
		</div>
	);
};
