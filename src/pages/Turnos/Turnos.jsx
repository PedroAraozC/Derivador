import React, { useState } from "react";
import "./Turnos.css";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import "cally";

function Turnero() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedDate, setSelectedDate] = useState( Date());
  const currentDate = new Date();
  const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);

  const handleChange = (date) => {
    console.log("Fecha seleccionada:", date);
    setSelectedDate(date);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Manejar envío del formulario
  };

  const handleTipoTramiteChange = (event) => {
    // Manejar cambio de tipo de trámite
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <div className="turnosContainer">
        <h2 className="turnosTitle">Solicitud de Turnos</h2>
      </div>
      <div className="select-container">
        <h4 className="tipoTramite">Tipo de tramite:</h4>

        <FormControl>
          <InputLabel id="select-label">Seleccionar</InputLabel>
          <Select
            className="selectTramite"
            labelId="selectTramite"
            value={selectedValue}
            onChange={handleTipoTramiteChange}
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
      <div className="fechaContainer">
        <h2 className="fechaTitle">Turnos Disponibles</h2>
      </div>
      <calendar-date
       value={selectedDate}
        onClick={(e) => {
          console.log("Fecha seleccionada:", selectedDate);
          handleChange( Date(selectedDate));
        }}
      >
  <calendar-month></calendar-month>
</calendar-date>
{/* <input
     type="date"
        value={selectedDate}
        onChange={(e) => {
          console.log("Fecha seleccionada:", e);
          handleChange(new Date(e.detail));
        }}
      >
</input> */}


    </>
  );
}

export default Turnero;
