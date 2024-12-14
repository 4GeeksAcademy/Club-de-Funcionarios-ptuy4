import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

export const AdminPage = () => {
	const { store, actions } = useContext(Context);
	const username = store.user ? store.user.name : "Usuario";

	useEffect(() => {
		actions.getUsers();
		actions.getBooks();
		actions.getPlaces();
		actions.getSchedules();
	}, []);

	const handleMakeUserAdmin = (usuario, index) => {
		const checkbox = document.getElementById(`admin-checkbox-${index}`);
		const is_admin = { "is_admin": checkbox.checked };

		if (is_admin) {
			actions.updateUser(usuario.user_id, is_admin)
		}
	}

	const handleUpdateBook = (book, index) => {
		const title = document.getElementById(`update-book-title${index}`);
		const author = document.getElementById(`update-book-author${index}`);

		const updatedBook = {
			"book_id": book.book_id,
			title,
			author
		}
		actions.updateBook(updatedBook);
	}

	const handleCreateBook = (index) => {
		const title = document.getElementById(`create-book-title-${index}`).value;
		const author = document.getElementById(`create-book-author-${index}`).value;
		actions.addBook(title, author);
	}

	const handleDeleteBook = (book_id) => {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "Este libro pasará a dejar de estar disponible",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, hazlo!"
		}).then((result) => {
			if (result.isConfirmed) {
				actions.deleteBook(book_id);
				Swal.fire({
					title: "Hecho!",
					text: "Este libro ya no está disponible.",
					icon: "success"
				});
			}
		});
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
																<input type="checkbox" className="form-check-input" id={`admin-checkbox-${index}`} />
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
															onClick={() => handleMakeUserAdmin(usuario, index)}
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
									<td>{libro.is_active ? 'Sí' : 'No'}</td>
									<td>

										{/* EDITAR LIBRO */}
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
											aria-labelledby={`editUserModalLabel-${index}`}
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
																<input type="text" className="form-control" id={`update-book-title-${index}`} />
															</div>
															<div className="mb-3">
																<label className="col-form-label">Autor:</label>
																<input type="text" className="form-control" id={`update-book-author-${index}`} />
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
															onClick={() => handleUpdateBook(libro, index)}
														>
															Confirmar
														</button>
													</div>
												</div>
											</div>
										</div>
										{/* BORRAR LIBRO */}
										<button type="button" className="btn btn-danger m-1" onClick={() => handleDeleteBook(libro.book_id)}>
											<i className="fa-solid fa-trash"></i>
										</button>

										{/* AGREGAR LIBRO */}
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
															Crear Libro
														</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label className="col-form-label">Titulo:</label>
																<input type="text" className="form-control" id={`create-book-title-${index}`} />
															</div>
															<div className="mb-3">
																<label className="col-form-label">Autor:</label>
																<input type="text" className="form-control" id={`create-book-author-${index}`} />
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
															onClick={() => handleCreateBook(libro, index)}
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
									<td>{local.is_active ? "Si" : "No"}</td>
									<td>
										{/* EDITAR LOCAL */}
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
															Editar local
														</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<p>Puedes dejar vacíos los campos que no quieras actualizar</p>
														<form>
															<div className="mb-3">
																<label className="col-form-label">Nombre:</label>
																<input type="text" className="form-control" id={`create-place-name-${index}`} />
															</div>
															<div className="mb-3">
																<label className="col-form-label">Capacidad:</label>
																<input type="text" className="form-control" id={`create-place-capacity-${index}`} />
															</div>
															<div className="mb-3">
																<label className="col-form-label">Dirección:</label>
																<input type="text" className="form-control" id={`create-place-address-${index}`} />
															</div>
															<div className="mb-3">
																<label className="col-form-label">Foto del local:</label>
																<input type="file" className="form-control" id={`create-place-img-${index}`} />
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
															onClick={() => handleUpdatePlace(local, index)}
														>
															Confirmar
														</button>
													</div>
												</div>
											</div>
										</div>
										{/* BORRAR LOCAL */}
										<button type="button" className="btn btn-danger m-1" onClick={() => handleDeletePlace(libro.book_id)}>
											<i className="fa-solid fa-trash"></i>
										</button>
										{/* AGREGAR LOCAL */}
										<button
											type="button"
											className="btn btn-primary m-1"
											data-bs-toggle="modal"
											data-bs-target={`#editPlaceModal-${index}`}
										>
											<i className="fa-solid fa-plus"></i>
										</button>

										<div
											className="modal fade"
											id={`createPlaceModal-${index}`}
											tabIndex="-1"
											aria-labelledby={`createPlaceModalLabel-${index}`}
											aria-hidden="true"
										>
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id={`createPlaceModalLabel-${index}`}>
															Crear local
														</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label className="col-form-label">Nombre:</label>
																<input type="text" className="form-control" id={`edit-place-name-${index}`} />
															</div>
															<div className="mb-3">
																<label className="col-form-label">Capacidad:</label>
																<input type="text" className="form-control" id={`edit-place-capacity-${index}`} />
															</div>
															<div className="mb-3">
																<label className="col-form-label">Dirección:</label>
																<input type="text" className="form-control" id={`edit-place-address-${index}`} />
															</div>
															<div className="mb-3">
																<label className="col-form-label">Foto del local:</label>
																<input type="file" className="form-control" id={`edit-place-img-${index}`} />
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
															onClick={() => handleUpdatePlace(local, index)}
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
								<th scope="col">Fecha de creación</th>
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{store.schedules.map((schedule, index) => (
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{schedule.user_id}</td>
									<td>{schedule.location_id ? 'Local' : 'Libro'}</td>
									<td>{schedule.start_time}</td>
									<td>{schedule.end_time}</td>
									<td>{schedule.status}</td>
									<td>{schedule.created_at}</td>
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
																<label className="form-check-label">
																	Seleccione el nuevo estado de reserva
																</label>
																<select className="form-select" id={`selectSchedule-${index}`} aria-label="Seleccione el estado del horario">
																	<option value="" disabled selected>Seleccione uno</option>
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
															onClick={() => handleMakeUserAdmin(usuario, index)}
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
