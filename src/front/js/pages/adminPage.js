import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const AdminPage = () => {
	const { store, actions } = useContext(Context);

	return (
		<div>
			<div className="card mb-3" style={{ "max-width": "540px;" }}>
				<div className="row g-0">
					<div className="col-md-6">
						<img src="https://img.freepik.com/vector-premium/icono-perfil-simple-color-blanco-icono_1076610-50204.jpg"
							className="img-fluid rounded-start d-flex flex-center float-end" alt="..." style={{ "width": "8rem", }} />
					</div>
					<div className="col-md-6">
						<div className="card-body">
							<h1 className="card-title d-flex">Nombre</h1>
						</div>
					</div>
				</div>
			</div>

			<nav>
				<div className="nav nav-tabs nav justify-content-center">
					<button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Usuarios</button>
					<button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Libros</button>
					<button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Locales</button>
				</div>
			</nav>

			<div className="tab-content mx-4" id="nav-tabContent">
				<div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
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
							<tr>
								<th scope="row">1</th>
								<td>Mariana</td>
								<td>mariana@email.com</td>
								<td>
									<button type="button" className="btn btn-secondary m-1">X</button>
									<button type="button" className="btn btn-secondary m-1">X</button>
								</td>
							</tr>
							<tr>
								<th scope="row">2</th>
								<td>Rodrigo</td>
								<td>rodrigo@email.com</td>
								<td>
									<button type="button" className="btn btn-secondary m-1">X</button>
									<button type="button" className="btn btn-secondary m-1">X</button>
								</td>
							</tr>
							<tr>
							<th scope="row">2</th>
								<td>Nicoás</td>
								<td>nicolas@email.com</td>
								<td>
									<button type="button" className="btn btn-secondary m-1">X</button>
									<button type="button" className="btn btn-secondary m-1">X</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
				<div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
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
							<tr>
								<th scope="row">1</th>
								<td>Mariana</td>
								<td>mariana@email.com</td>
								<td>
									<button type="button" className="btn btn-secondary m-1">X</button>
									<button type="button" className="btn btn-secondary m-1">X</button>
								</td>
							</tr>
							<tr>
								<th scope="row">2</th>
								<td>Rodrigo</td>
								<td>rodrigo@email.com</td>
								<td>
									<button type="button" className="btn btn-secondary m-1">X</button>
									<button type="button" className="btn btn-secondary m-1">X</button>
								</td>
							</tr>
							<tr>
							<th scope="row">2</th>
								<td>Nicoás</td>
								<td>nicolas@email.com</td>
								<td>
									<button type="button" className="btn btn-secondary m-1">X</button>
									<button type="button" className="btn btn-secondary m-1">X</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				</div>
				<div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" tabindex="0">
					...
				</div>
			</div>
		</div>
	);
};