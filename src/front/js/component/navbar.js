import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light andaBackgroundColor h-100">
			<div className="container">
				<Link to="/">
					<img src="https://i.ibb.co/zrCKh8H/logo-anda-blanco.png" alt="Logo ANDA" style={{height: "10vh", width: "15vh"}}></img>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-light andaTextColor">Ingresar</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
