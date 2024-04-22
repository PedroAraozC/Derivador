import React, { useState } from "react";
import "./Turnos.css";
import { Input } from "@mui/base/Input";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

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

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <div className="turnos-container">
        <h2 className="turnos-title">Solicitud de Turnos</h2>
      </div>
      <div className="select-container">
        <h4 className="tipoTramite">Tipo de tramite:</h4>

        <FormControl>
          <InputLabel id="select-label">Seleccionar</InputLabel>
          <Select
            className="selectTramite"
            labelId="selectTramite"
            value={selectedValue}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="option1">Licencia de Conducir</MenuItem>
            <MenuItem value="option2">Opción 2</MenuItem>
            <MenuItem value="option3">Opción 3</MenuItem>
          </Select>
        </FormControl>
      </div>
    <div className="inputsContainer">
      <TextField label="Ingrese su Nombre" className="inputNombre" type="text"></TextField>
      <TextField label="Ingrese su N° de CUIL" className="inputCuil" type="text"></TextField>
      <TextField label="Ingrese su Apellido" className="inputApellido" type="text"></TextField>
      <TextField label="Ingrese su Correo Electronico" className="inputMail" type="text"></TextField>
</div>
      <form onSubmit={handleSubmit}>
        <div className="contBtn">
          <Button className="boton" variant="contained" type="submit">
            Solicitar
          </Button>
        </div>
      </form>
    </>
  );
}

export default Turnero;
