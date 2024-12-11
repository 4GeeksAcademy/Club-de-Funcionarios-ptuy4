import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const AdminPage = () => {
	const { store, actions } = useContext(Context);
	const username = store.user ? store.user.name : "Usuario";

	useEffect(() => {
		actions.getUsers();
		actions.getBooks();
		actions.getPlaces();
		actions.getSchedules();
	}, []);

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
										<button type="button" className="btn btn-secondary m-1">
											<i className="fa-solid fa-pen"></i>
										</button>
										<button type="button" className="btn btn-secondary m-1">
											<i className="fa-solid fa-trash"></i>
										</button>
										<button type="button" className="btn btn-primary m-1">
											<i className="fa-solid fa-plus"></i>
										</button>
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
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{store.books.map((libro, index) => (
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{libro.title}</td>
									<td>{libro.author}</td>
									<td>

								{/* EDITAR LIBRO */}
										<button type="button" className="btn btn-success m-1" data-bs-toggle="modal" data-bs-target="#editBookModal" data-bs-whatever="@mdo">
											<i className="fa-solid fa-pen"></i>
										</button>
										<div className="modal fade" id="editBookModal" tabindex="-1" aria-labelledby="editBookModalLabel" aria-hidden="true">
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id="editBookModalLabel">Editar libro</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Titulo:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Autor:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
														<button type="button" className="btn btn-primary">Confirmar</button>
													</div>
												</div>
											</div>
										</div>
								{/* BORRAR LIBRO */}
										<button type="button" className="btn btn-danger m-1">
											<i className="fa-solid fa-trash"></i>
										</button>	
								{/* AGREGAR LIBRO */}
										<button type="button" className="btn btn-primary m-1" data-bs-toggle="modal" data-bs-target="#addBookModal" data-bs-whatever="@fat">
											<i className="fa-solid fa-plus"></i>
										</button>
										<div className="modal fade" id="addBookModal" tabindex="-1" aria-labelledby="addBookModalLabel" aria-hidden="true">
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id="addBookModalLabel">Agregar libro</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Titulo:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Autor:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
														<button type="button" className="btn btn-primary">Agregar</button>
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
									<td>
									{/* EDITAR LOCAL */}
										<button type="button" className="btn btn-success m-1" data-bs-toggle="modal" data-bs-target="#editModal" data-bs-whatever="@mdo">
											<i className="fa-solid fa-pen"></i>
										</button>
										<div className="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id="editModalLabel">Editar libro</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Nombre:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Capacidad:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Dirección:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
														<button type="button" className="btn btn-primary">Confirmar</button>
													</div>
												</div>
											</div>
										</div>
									{/* BORRAR LOCAL */}
										<button type="button" className="btn btn-danger m-1">
											<i className="fa-solid fa-trash"></i>
										</button>
									{/* AGREGAR LOCAL */}
										<button type="button" className="btn btn-primary m-1" data-bs-toggle="modal" data-bs-target="#addModal" data-bs-whatever="@fat">
											<i className="fa-solid fa-plus"></i>
										</button>
										<div className="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5" id="addModalLabel">Agregar local</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<form>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Nombre:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Capacidad:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
															<div className="mb-3">
																<label for="recipient-name" className="col-form-label">Dirección:</label>
																<input type="text" className="form-control" id="recipient-name"/>
															</div>
														</form>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
														<button type="button" className="btn btn-primary">Agregar</button>
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
										<button type="button" className="btn btn-secondary m-1">
											<i className="fa-solid fa-pen"></i>
										</button>
										<button type="button" className="btn btn-secondary m-1">
											<i className="fa-solid fa-trash"></i>
										</button>
										<button type="button" className="btn btn-primary m-1">
											<i className="fa-solid fa-plus"></i>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
