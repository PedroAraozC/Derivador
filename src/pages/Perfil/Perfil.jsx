import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fotoDefault from "../../assets/person.svg";
import "./Perfil.css";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button } from "@mui/material";

const Perfil = () => {
  const [validado, setValidado] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const validator = () => {
    setValidado(!validado);
  };
  const handleEditDatos = () =>{
    setIsEditing(!isEditing)
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="d-flex flex-column p-2 mt-3 contenedorPerfil">
        <div className="d-flex py-4 px-2 justify-content-start align-items-center gap-3">
          <img src={fotoDefault} alt="Foto de perfil" className="fotoPerfil" />
          {validado ? (
            <FontAwesomeIcon icon={faCheck} onClick={validator} />
          ) : (
            <FontAwesomeIcon icon={faXmark} onClick={validator} />
          )}
        </div>
        {isEditing ? (
          <div className="px-2">
            <p>Nombres: Tobias</p>
            <p>Apellidos: Alvarez</p>
            <p>DNI: 42270169</p>
            <p>Fecha nacimiento: 20/12/1999</p>
            <p>Localidad: Las Talitas</p>
            <p>Domicilio: Mi casa</p>
            <p>Telefono: 3814462981</p>
            <p>Email: tosal1099@gmail.com</p>
            <p>Contraseña: ***********</p>
          </div>
        ) : (
          <form className="px-2 d-flex flex-column formEdit">
            <input type="text" placeholder="Localidad" className="inputEditPerfil"/>
            <input type="text" placeholder="Domicilio" className="inputEditPerfil"/>
            <input type="text" placeholder="Telefono o Celular" className="inputEditPerfil"/>
            <input type="text" placeholder="Correo electronico" className="inputEditPerfil"/>
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
