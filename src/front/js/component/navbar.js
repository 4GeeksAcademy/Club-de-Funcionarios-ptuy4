import React from "react";
import { Link } from "react-router-dom";


export const Navbar = () => {
	return (
		<nav className="navbar navbar-light andaBackgroundColor h-100">
			<div className="container">
				<Link to="/">
					<img
						src="https://i.ibb.co/zrCKh8H/logo-anda-blanco.png"
						alt="Logo ANDA"
						style={{ height: "10vh", width: "15vh" }}
					/>
				</Link>
				<div className="ml-auto">
					<div className="dropdown">
						<button
							className="btn btn-light andaTextColor dropdown-toggle"
							type="button"
							id="dropdownMenuButton"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Ingresar
						</button>
						<div
							className="dropdown-menu dropdown-menu-end p-4 shadow"
							aria-labelledby="dropdownMenuButton"
							style={{ minWidth: "300px" }} // Hacer el menú más ancho
						>
							<form>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">
										Email
									</label>
									<input
										type="email"
										className="form-control"
										id="email"
										placeholder="Email"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">
										Contraseña
									</label>
									<input
										type="password"
										className="form-control"
										id="password"
										placeholder="Contraseña"
										required
									/>
								</div>
								<a href="#" className="d-block mb-3 text-decoration-none">
									Olvidé mi contraseña
								</a>
								<Link to="/userLogin">
								<button type="submit" className="btn btn-primary w-100">
									Ingresar
								</button>
								</Link>
							</form>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};
