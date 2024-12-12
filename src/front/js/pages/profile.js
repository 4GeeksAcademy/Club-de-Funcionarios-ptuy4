import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Profile = () => {
  const { store } = useContext(Context);
  const user = store.user;

  return (
    <div className="m-5">
      <div className="row g-0">
        <div className="col-md-4 d-flex flex-column align-items-center my-4">
          <img src="https://cdn-icons-png.flaticon.com/512/8716/8716389.png"
            className="img-fluid border border-primary d-flex flex-center"
            style={{ "width": "18rem", }} alt="..." />
          <button className="btn btn-primary col-4 mt-5">Cambiar foto</button>
        </div>
        <div className="col-md-8 bg-light rounded-3 my-2">
          <h5 className="card-title m-5" style={{ "fontSize": "40px" }}><strong>Mis datos personales</strong></h5>
          <p className="card-text mx-5" style={{ "fontSize": "20px" }}>Nombre completo: {user.name}</p>
          <p className="card-text mx-5" style={{ "fontSize": "20px" }}>E-mail: {user.email}</p>
          <div className="d-flex justify-content-center mt-5">
            <button className="btn btn-danger float-center m-5">Eliminar perfil</button>
            <button type="button" className="btn btn-success float-center m-5" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Actualizar</button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Actualiza tu perfil:</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label htmlFor="recipient-name" className="col-form-label">Nombre completo:</label>
                        <input type="text" className="form-control" id="name" />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="recipient-name" className="col-form-label">E-Mail:</label>
                        <input type="text" className="form-control" id="e-mail" />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" className="btn btn-primary">Guardar cambios</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Botón de Volver a Inicio */}
        <div className="mt-4 container-fluid d-flex align-items-center justify-content-center">
          <Link to="/userLogin">
            <button className="btn btn-secondary">Volver a Inicio</button>
          </Link>
        </div>
    </div>
  )
}