import { Alert, Button, InputLabel, MenuItem, Select, Snackbar, Switch, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import useStore from "../../../Zustand/Zustand";
import axios from "../../../config/axios";
import TablaContratacion from "./TablaContratacion";
// import { formatearFecha } from "../../../helpers/convertirFecha";

const PanelContratacion = () => {
  const [addContratacion, setAddContratacion] = useState(false);
  const [listarContrataciones, setListarContrataciones] = useState(false);
  const { obtenerInstrumentos, obtenerTiposContratacion, tiposContratacion, instrumentosC,} = useStore();
  const [archivo, setArchivo] = useState(null);
  const [formularioValues, setFormularioValues] = useState({});
  const [snackbarMensaje, setSnackbarMensaje] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [buttonDis, setButtonDis] = useState(false);
  const fileInputRef = useRef(null);
  const [errores, setErrores] = useState({});
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

// Función para validar el formulario antes de enviarlo
const validarFormulario = () => {
  const nuevosErrores = {};
  if (!formularioValues.id_tcontratacion) {
    nuevosErrores.id_tcontratacion = "El campo Tipo contratación es obligatorio";
  }
  if (!formularioValues.hora_apertura || !/^\d{2}:\d{2}:\d{2}$/.test(formularioValues.hora_apertura)) {
    nuevosErrores.hora_publica = "Ingrese una hora válida (formato: HH:MM:SS)";
    setSnackbarMensaje("Ingrese una hora válida (formato: HH:MM:SS)");
  }
  if (!formularioValues.hora_presentacion || !/^\d{2}:\d{2}:\d{2}$/.test(formularioValues.hora_presentacion)) {
    nuevosErrores.hora_designa = "Ingrese una hora válida (formato: HH:MM:SS)";
    setSnackbarMensaje("Ingrese una hora válida (formato: HH:MM:SS)");
  }
  setErrores(nuevosErrores);
  // Si hay errores, muestra el Snackbar
  if (Object.keys(nuevosErrores).length > 0) {
    setSnackbarOpen(true);
  }
  return Object.keys(nuevosErrores).length === 0; // Retorna true si no hay errores
};

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    setFormularioValues({
      ...formularioValues,
      [name]: newValue,
    });
    console.log(formularioValues);
  };

  const handleHabilitarChange = (event) => {
    setFormularioValues({
      ...formularioValues,
      habilita: event.target.checked ? 1 : 0,
    });
  };

  const handleFileInputChange = () => {
    const file = fileInputRef.current.files[0];
    setArchivo(file); // Asignar el archivo al estado
  };

  const handleAgregar = async (event, contratacion) => {
    event.preventDefault();
    const formularioValido = validarFormulario();
    if (formularioValido) {
      try {
        contratacion.archivo = archivo;
        
        console.log(contratacion)
        // Realiza la solicitud con formData
        const response = await axios.post("/admin/agregarContratacion", contratacion, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
        setSnackbarMensaje("Contratación creada.");
        setSnackbarOpen(true);
        setButtonDis(true)
        return response.data;
      } catch (error) {
        console.error("Error al agregar la contratacion:", error);
        setSnackbarMensaje("Error al agregar la contratacion.");
        setSnackbarOpen(true);
        throw new Error("Error al agregar la contratacion");
      }
    } else {
      console.log('Algo salió mal :(');
      setSnackbarMensaje("Por favor, corrige los errores en el formulario.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    obtenerTiposContratacion();
    obtenerInstrumentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="container mt-4 d-flex justify-content-around">
        <h2>Panel de Contrataciones</h2>
        <Button variant="outlined" color={addContratacion? "error" : "primary"} sx={{width: 250}} onClick={() => setAddContratacion(!addContratacion)}>
          {addContratacion? "Cancelar" : "Agregar Contratación"}
        </Button>
        <Button variant="outlined" sx={{width: 230}} onClick={() => setListarContrataciones(!listarContrataciones)}>
          Listar Contrataciones 
        </Button>
      </div>
      <div className="container mt-5 mb-5">
        {addContratacion ? (
          <>
            <form className="d-flex gap-5" onSubmit={(event) => handleAgregar(event, formularioValues)} encType="multipart/form-data">
              <div className="d-flex flex-column">
                <TextField
                  label="Nombre Contratación"
                  variant="outlined"
                  sx={{ marginTop: 5, width: 300 }}
                  onChange={handleInputChange}
                  name="nombre_contratacion"
                  value={formularioValues.nombre_contratacion}
                  required={true}
                />
                <InputLabel sx={{ marginTop: 2}}>Tipo de Contratación</InputLabel>
                <Select
                  value={formularioValues.id_tcontratacion}
                  onChange={handleInputChange}
                  name="id_tcontratacion"
                  sx={{ width: 300, marginBottom: 2 }}
                  required={true}
                >
                  {Array.isArray(tiposContratacion) &&
                    tiposContratacion.map((e) => (
                      <MenuItem
                        key={e.id_tcontratacion}
                        value={e.id_tcontratacion}
                      >
                        {e.nombre_tcontratacion}
                      </MenuItem>
                    ))}
                </Select>
                <InputLabel>Fecha Presentación</InputLabel>
                <TextField
                  type="date"
                  onChange={handleInputChange}
                  name="fecha_presentacion"
                  value={formularioValues.fecha_presentacion}
                  sx={{ width: 300, marginTop: 2 }}
                  required={true}
                />
                  <InputLabel sx={{ marginTop: 2}}>Hora Presentación</InputLabel>
                  <TextField
                    placeholder="Ej: 09:00:00"
                    onChange={handleInputChange}
                    name="hora_presentacion"
                    value={formularioValues.hora_presentacion}
                    sx={{ width: 300, marginTop: 2 }}
                    required={true}
                  />
                <TextField
                  id="standard-basic"
                  label="Num de Instrumento"
                  variant="outlined"
                  sx={{ marginTop: 5, width: 300 }}
                  onChange={handleInputChange}
                  name="num_instrumento"
                  value={formularioValues.num_instrumento}
                  required={true}
                />
                  <TextField
                    id="standard-basic"
                    label="Valor de Pliego"
                    variant="outlined"
                    sx={{ marginTop: 5, width: 300 }}
                    onChange={handleInputChange}
                    name="valor_pliego"
                    value={formularioValues.valor_pliego}
                    required={true}
                  />
              </div>
              <div className="d-flex flex-column">
              <TextField
                  id="standard-basic"
                  label="Expte"
                  variant="outlined"
                  sx={{ marginTop: 5, width: 300 }}
                  onChange={handleInputChange}
                  name="expte"
                  value={formularioValues.expte}
                  required={true}
                />
                <InputLabel sx={{ marginTop: 2}}>Tipo de Instrumento</InputLabel>
                <Select
                  value={formularioValues.id_tinstrumento}
                  onChange={handleInputChange}
                  name="id_tinstrumento"
                  sx={{ width: 300}}
                  required={true}
                >
                  {Array.isArray(instrumentosC) &&
                    instrumentosC.map((e) => (
                      <MenuItem
                        key={e.id_tinstrumento}
                        value={e.id_tinstrumento}
                      >
                        {e.nombre_tinstrumento}
                      </MenuItem>
                    ))}
                </Select>
                
                  <InputLabel sx={{ marginTop: 2}}>Fecha Apertura</InputLabel>
                  <TextField
                    type="date"
                    onChange={handleInputChange}
                    name="fecha_apertura"
                    value={formularioValues.fecha_apertura}
                    sx={{ width: 300, marginTop: 2 }}
                    required={true}
                  />
                  <InputLabel sx={{ marginTop: 2}}>Hora Apertura</InputLabel>
                  <TextField
                    placeholder="Ej: 09:00:00"
                    onChange={handleInputChange}
                    name="hora_apertura"
                    value={formularioValues.hora_apertura}
                    sx={{ width: 300, marginTop: 2 }}
                    required={true}
                  />
                  <InputLabel sx={{ marginTop: 2 }}>HABILITA</InputLabel>
                  <Switch
                    checked={formularioValues.habilita === 1}
                    onChange={handleHabilitarChange}
                    name="habilita"
                    sx={{ marginTop: 2 }}
                  />
                  <Button variant="contained" color="success" type="submit" sx={{ marginTop: 6 }} disabled={buttonDis}>AGREGAR</Button>
              </div>
              <div>
                <InputLabel sx={{ marginTop: 4 }}>NOMBRE ARCHIVO</InputLabel>
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  required={false}
                  style={{ width: 300, paddingTop: 5, paddingBottom: 30 }}
                />
              </div>
            </form>
            {errores ? (
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
              {snackbarMensaje}
            </Alert>
          </Snackbar>
        ) : <></>}
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="mb-5">
        {listarContrataciones? <>
          <TablaContratacion/>
        </> : <></>}
      </div>
    </>
  );
};

export default PanelContratacion;
