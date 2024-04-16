import React, { useState } from "react";
import "./Turnos.css";
import { Input } from "@mui/base/Input";
import { TextField, Button } from "@mui/material";

function Turnero() {
  // const [documento, setDocumento] = useState("");
  // const [nombre, setNombre] = useState("");
  // const [apellido, setApellido] = useState("");

  // const handleDocumentoChange = (event) => {
  //   setDocumento(event.target.value);
  // };

  // const handleNombreChange = (event) => {
  //   setNombre(event.target.value);
  // };

  // const handleApellidoChange = (event) => {
  //   setApellido(event.target.value);
  // };

  const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // Aquí puedes enviar los datos a donde necesites
  //   console.log("Documento:", documento);
  //   console.log("Nombre:", nombre);
  //   console.log("Apellido:", apellido);
  };

  return (
    <>
    <div className="contenedorTurno">
    <div className="contenedor">
    <div className="turnos-container">
      <h2 className="turnos-title">Solicitar Turnos - Licencia de Conducir</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <TextField
            label="Numero de Documento" 
            className="inputNroDocumento"
            type="text"
            ></TextField>
         </div>
        <div className="input-group">
          <TextField
            label="Nombre"
            className="inputNombre"
            type="text"
            ></TextField>
          </div>
        <div className="input-group">
          <TextField
            label="Apellido"
            className="inputApellido"
            type="text"
            ></TextField>
          </div>
          <div className="contBtn">
        <Button className="boton" variant="contained" type="submit">Enviar</Button>
          </div>
      </form>
    </div>
            </div>
            </>
  );
}

export default Turnero;
