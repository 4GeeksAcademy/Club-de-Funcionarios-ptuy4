import React from "react";
import { Link } from "react-router-dom";

export const Profile = () => {
  return (
	<div className="m-5">
  <div className="row g-0">
    <div className="col-md-4 d-flex flex-column align-items-center my-4">
      <img src="https://cdn-icons-png.flaticon.com/512/8716/8716389.png"
      className="img-fluid border border-primary d-flex flex-center"
      style={{"width": "18rem",}} alt="..."/>
      <button className="btn btn-primary col-4 mt-5">Cambiar foto</button>
    </div>
    <div className="col-md-8 bg-light rounded-3 my-2">
        <h5 className="card-title m-5" style={{"font-size": "40px"}}><strong>Mis datos personales</strong></h5>
        <p className="card-text mx-5" style={{"font-size": "20px"}}>Nombre completo:</p>
        <p className="card-text mx-5" style={{"font-size": "20px"}}>E-mail:</p>
        <p className="card-text mx-5" style={{"font-size": "20px"}}>Nro de colaborador:</p>
      <div className="d-flex justify-content-center mt-5">
        <button className="btn btn-danger float-center m-5">Eliminar perfil</button>
        <button className="btn btn-success float-center m-5">Actualizar</button>
      </div>
      </div>
    </div>
  </div>
  )}