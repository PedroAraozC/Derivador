import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fotoDefault from "../../assets/person.svg";
import "./Perfil.css";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button } from "@mui/material";

const Perfil = () => {
  const [validado, setValidado] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const validator = () => {
    setValidado(!validado);
  };
  
  const handleEditDatos = () =>{
    setIsEditing(!isEditing)
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="d-flex flex-column p-2 mt-3 contenedorPerfil">
        <div className="d-flex py-4 px-2 justify-content-between align-items-center gap-3">
          <img src={fotoDefault} alt="Foto de perfil" className="fotoPerfil" />
          {validado ? (
            <div className="d-flex align-items-center justify-content-center gap-2">
              <p className="m-0">Usuario validado: </p>
              <FontAwesomeIcon icon={faCheck} onClick={validator} />
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center gap-2">
              <p className="m-0">Usuario validado: </p>
              <FontAwesomeIcon icon={faXmark} onClick={validator} />
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="px-2">
            <p className="datoUsuario">Nombres:</p> <p>Tobias</p>
            <p className="datoUsuario">Apellidos:</p> <p> Alvarez</p>
            <p className="datoUsuario">DNI:</p> <p> *******</p>
            <p className="datoUsuario">Fecha nacimiento:</p> <p> 20/12/1999</p>
            <p className="datoUsuario">Localidad:</p> <p> Las Talitas</p>
            <p className="datoUsuario">Domicilio:</p> <p> Mi casa</p>
            <p className="datoUsuario">Telefono:</p> <p> 3811234567</p>
            <p className="datoUsuario">Email:</p> <p> tosal1099@gmail.com</p>
            <p className="datoUsuario">Contraseña:</p> <p> ***********</p>
          </div>
        ) : ( 
          <form className="px-2 d-flex flex-column formEdit">
            <input type="text" placeholder="Localidad" className="inputEditPerfil"/>
            <input type="text" placeholder="Domicilio" className="inputEditPerfil"/>
            <input type="text" placeholder="Telefono o Celular" className="inputEditPerfil"/>
            <input type="email" placeholder="Correo electronico" className="inputEditPerfil"/>
            <input type="password" placeholder="Contraseña nueva" className="inputEditPerfil"/>
            <input type="password" placeholder="Confirmar contraseña" className="inputEditPerfil"/>
          </form>
        )}
        <div>
          {
            isEditing?
            <Button onClick={() => setIsEditing(!isEditing)}>Editar datos</Button>
            :
            <Button onClick={handleEditDatos}>Guardar Cambios</Button>
          }
        </div>
      </div>
    </div>
  );
};

export default Perfil;
