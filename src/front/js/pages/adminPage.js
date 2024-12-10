import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const AdminPage = () => {
	const { store, actions } = useContext(Context);
	const username = store.user ? store.user.name : "Usuario";

	useEffect(() => {
		actions.getUsers();
		actions.getBooks();
		actions.getPlaces();
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
						id="nav-home-tab"
						data-bs-toggle="tab"
						data-bs-target="#nav-home"
						type="button"
						role="tab"
						aria-controls="nav-home"
						aria-selected="true"
					>
						Usuarios
					</button>
					<button
						className="nav-link"
						id="nav-profile-tab"
						data-bs-toggle="tab"
						data-bs-target="#nav-profile"
						type="button"
						role="tab"
						aria-controls="nav-profile"
						aria-selected="false"
					>
						Libros
					</button>
					<button
						className="nav-link"
						id="nav-contact-tab"
						data-bs-toggle="tab"
						data-bs-target="#nav-contact"
						type="button"
						role="tab"
						aria-controls="nav-contact"
						aria-selected="false"
					>
						Locales
					</button>
				</div>
			</nav>

			<div className="tab-content mx-4" id="nav-tabContent">
				{/* Usuarios */}
				<div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
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
									<td>{usuario.name}</td>
									<td>{usuario.email}</td>
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
				<div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
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
									<td>{libro.titulo}</td>
									<td>{libro.autor}</td>
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

				{/* Locales */}
				<div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
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
									<td>{local.salon}</td>
									<td>{local.capacidad}</td>
									<td>{local.direccion}</td>
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
