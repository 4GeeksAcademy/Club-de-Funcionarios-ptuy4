import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const user = store.user;
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const cleanValue = (value) => {
    if (value === undefined || value.trim() === "") {
      return null;
    }
    return value.trim();
  };

  const handleDelete = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Borrarás tu cuenta, este cambio no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Si, hazlo!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/register");
        actions.deleteUser(user.id);
      }
    });
  };

  const handleSaveChanges = () => {
    let userData = {};
    if (name != null && email == null) {
      return
    } else {
      cleanValue(name) ? userData.full_name = name : null;
      cleanValue(email) ? userData.email = email : null;
      cleanValue(password) ? userData.password = password : null
      actions.updateUser(user.id, userData);
    }

  };

  return (
    <div className="m-5">
      <div className="row g-0">
        <div className="col-md-4 d-flex flex-column align-items-center my-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/8716/8716389.png"
            className="img-fluid border border-primary d-flex flex-center"
            style={{ width: "18rem" }}
            alt="..."
          />
        </div>
        <div className="col-md-8 bg-light rounded-3 my-2">
          <h5 className="card-title m-5" style={{ fontSize: "40px" }}>
            <strong>Mis datos personales</strong>
          </h5>
          <p className="card-text mx-5" style={{ fontSize: "20px" }}>
            Nombre completo: {user.name}
          </p>
          <p className="card-text mx-5" style={{ fontSize: "20px" }}>
            E-mail: {user.email}
          </p>
          <div className="d-flex justify-content-center mt-5">
            <button className="btn btn-danger float-center m-5" onClick={handleDelete}>
              Eliminar perfil
            </button>
            <button
              type="button"
              className="btn btn-success float-center m-5"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              data-bs-whatever="@mdo"
            >
              Actualizar
            </button>
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Actualiza tu perfil:
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label htmlFor="recipient-name" className="col-form-label">
                          Nombre completo:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="recipient-name" className="col-form-label">
                          E-Mail:
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="e-mail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="recipient-name" className="col-form-label">
                          Contraseña:
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                      Cancelar
                    </button>
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSaveChanges}>
                      Guardar cambios
                    </button>
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
  );
};
