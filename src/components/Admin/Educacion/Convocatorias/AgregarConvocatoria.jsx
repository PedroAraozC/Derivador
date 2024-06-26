/* eslint-disable react-hooks/exhaustive-deps */
import { Button, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react";
import { formatearFechaHora } from "../../../../helpers/convertirFecha";
import './Convocatorias.css'
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";
import axios from "../../../../config/axios";

const AgregarConvocatoria = () => {
  const [errores, setErrores] = useState({});
  const navigate = useNavigate()
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);
  const [snackbarMensaje, setSnackbarMensaje] = useState('');
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const [formularioValues, setFormularioValues] = useState({
    id_nivel: "", // ID del nivel
    num_convocatoria: "", // Año de la convocatoria
    anio_convocatoria: "", // Año de la convocatoria
    cargo: "", // Cargo
    id_establecimiento: "", // ID del establecimiento
    id_causal: "", // ID de la causal
    detalle_causal: "", // Detalle de la causal
    expte: "", // Número de expediente
    id_caracter: "", // ID del carácter
    fecha_publica: "", // Fecha de publicación
    hora_publica: "", // Hora de publicación
    fecha_designa: "", // Fecha de designación
    hora_designa: "", // Hora de designación
    habilita: 0, // Habilita
  });
  const { arrayNiveles, obtenerNiveles, arrayEstablecimientos, obtenerEstablecimientos, obtenerCausal, arrayCausal, obtenerCaracter, arrayCaracter } = useContext(EducaContext);

  // Función para validar el formulario antes de enviarlo
  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formularioValues.id_nivel) {
      nuevosErrores.id_nivel = "El campo NIVEL es obligatorio";
    }
    if (!formularioValues.anio_convocatoria || !/^\d{4}$/.test(formularioValues.anio_convocatoria)) {
      nuevosErrores.anio_convocatoria = "Ingrese un año válido (formato: YYYY)";
      setSnackbarMensaje("Ingrese un año válido (formato: YYYY)");
    }
    if (!formularioValues.hora_publica || !/^\d{2}:\d{2}:\d{2}$/.test(formularioValues.hora_publica)) {
      nuevosErrores.hora_publica = "Ingrese una hora válida (formato: HH:MM:SS)";
      setSnackbarMensaje("Ingrese una hora válida (formato: HH:MM:SS)");
    }
    if (!formularioValues.hora_designa || !/^\d{2}:\d{2}:\d{2}$/.test(formularioValues.hora_designa)) {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await obtenerNiveles();
        await obtenerEstablecimientos();
        await obtenerCausal();
        await obtenerCaracter();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleFileInputChange = () => {
    const file = fileInputRef.current.files[0];
    setArchivo(file); // Asignar el archivo al estado
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

  const handleAgregar = async (event, convocatoria) => {
    event.preventDefault();
    const formularioValido = validarFormulario();
    if (formularioValido) {
      try {
        convocatoria.archivo = archivo;
        
        console.log(convocatoria)
        // Realiza la solicitud con formData
        const response = await axios.post("/educacion/agregarConvocatoria", convocatoria, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log(response.data);
        setSnackbarMensaje("Convocatoria creada.");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/convocatorias');
        }, 3000);
        return response.data;
      } catch (error) {
        console.error("Error al agregar la convocatoria:", error);
        throw new Error("Error al agregar la convocatoria");
      }
    } else {
      console.log('Algo salió mal :(');
      setSnackbarMensaje("Por favor, corrige los errores en el formulario.");
      setSnackbarOpen(true);
    }
  };
  

  return (
    <>
      <div className="container mt-3">
        <h3>Agregar Convocatorias</h3>
      </div>
      <div className="container mt-3 mb-3">
        <form className="d-flex gap-2 justify-content-center formAgregarConvocatoria" onSubmit={(event) => handleAgregar(event, formularioValues)} encType="multipart/form-data">
          <div>
            <InputLabel>NIVEL</InputLabel>
            <Select
              name="id_nivel"
              value={formularioValues.id_nivel}
              onChange={handleInputChange}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            >
              {Array.isArray(arrayNiveles) &&
                arrayNiveles.map((n) => (
                  <MenuItem key={n.id_nivel} value={n.id_nivel}>
                    {n.nombre_nivel}
                  </MenuItem>
                ))}
            </Select>
            <InputLabel>Nº CONVOCATORIA</InputLabel>
            <TextField
              placeholder="Ej: 3..."
              onChange={handleInputChange}
              name="num_convocatoria"
              value={formularioValues.num_convocatoria}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            />
            <InputLabel>DETALLE CAUSAL</InputLabel>
            <TextField
              placeholder="Ingrese aqui el detalle"
              onChange={handleInputChange}
              name="detalle_causal"
              value={formularioValues.detalle_causal}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            />
            <InputLabel>NOMBRE ARCHIVO</InputLabel>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              required={true}
              style={{width: 300, paddingTop: 5, paddingBottom: 30}}
            />
            <InputLabel>ESTABLECIMIENTO</InputLabel>
            <Select
              value={formularioValues.id_establecimiento}
              onChange={handleInputChange}
              name="id_establecimiento"
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            >
              {Array.isArray(arrayEstablecimientos) &&
                arrayEstablecimientos.map((e) => (
                  <MenuItem
                    key={e.id_establecimiento}
                    value={e.id_establecimiento}
                  >
                    {e.nombre_establecimiento}
                  </MenuItem>
                ))}
            </Select>
            <InputLabel>FECHA DESIGNACION</InputLabel>
            <TextField
              type="date"
              onChange={handleInputChange}
              name="fecha_designa"
              value={formatearFechaHora(formularioValues.fecha_designa)}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            />
            <InputLabel>FECHA PUBLICACION</InputLabel>
            <TextField
              type="date"
              onChange={handleInputChange}
              name="fecha_publica"
              value={formatearFechaHora(formularioValues.fecha_publica)}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            />

            <InputLabel>HABILITA</InputLabel>
            <div className="">
              <Switch
                checked={formularioValues.habilita === 1}
                onChange={handleHabilitarChange}
                name="habilita"
                sx={{ marginBottom: 5 }}
              />
            </div>
          </div>
          <div className="d-flex flex-column">
            <InputLabel>CARACTER</InputLabel>
            <Select
              value={formularioValues.id_caracter}
              onChange={handleInputChange}
              name="id_caracter"
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            >
              {Array.isArray(arrayCaracter) &&
                arrayCaracter.map((car) => (
                  <MenuItem key={car.id_caracter} value={car.id_caracter}>
                    {car.nombre_caracter}
                  </MenuItem>
                ))}
            </Select>
            <InputLabel>EXPEDIENTE</InputLabel>
            <TextField
              placeholder="Nº EXPEDIENTE"
              onChange={handleInputChange}
              name="expte"
              value={formularioValues.expte}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            />
            <InputLabel>AÑO</InputLabel>
            <TextField
              placeholder="2024"
              onChange={handleInputChange}
              name="anio_convocatoria"
              value={formularioValues.anio_convocatoria}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            />
            <InputLabel>CARGO</InputLabel>
            <TextField
              placeholder="Maestra Inicial..."
              onChange={handleInputChange}
              name="cargo"
              value={formularioValues.cargo}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            />

            <InputLabel>CAUSAL</InputLabel>
            <Select
              value={formularioValues.id_causal}
              onChange={handleInputChange}
              name="id_causal"
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            >
              {Array.isArray(arrayCausal) &&
                arrayCausal.map((c) => (
                  <MenuItem key={c.id_causal} value={c.id_causal}>
                    {c.nombre_causal}
                  </MenuItem>
                ))}
            </Select>
            <InputLabel>HORA DESIGNACION</InputLabel>
            <TextField
              placeholder="Ej: 09:00:00"
              onChange={handleInputChange}
              name="hora_designa"
              value={formularioValues.hora_designa}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            />
            <InputLabel>HORA PUBLICACION</InputLabel>
            <TextField
              placeholder="Ej: 09:00:00"
              onChange={handleInputChange}
              name="hora_publica"
              value={formularioValues.hora_publica}
              sx={{ width: 300, marginBottom: 2 }}
              required={true}
            />
            <Button variant="contained" color="success" type="submit">AGREGAR</Button>

          </div>
        </form>
        {errores ? (
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
              {snackbarMensaje}
            </Alert>
          </Snackbar>
        ) : <></>}
      </div>
    </>
  )
}

export default AgregarConvocatoria