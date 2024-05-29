/* eslint-disable react-hooks/exhaustive-deps */
import { Button, InputLabel, Switch, TextField } from "@mui/material"
import { useContext, useState } from "react";
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import axios from "../../../../config/axios";
import { EducaContext } from "../../../../context/EducaContext";

const AgregarUbicacion = () => {

  const [errores, setErrores] = useState({});
  const navigate = useNavigate()
  const { actualizador } = useContext(EducaContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState('');
  const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  const [formularioValues, setFormularioValues] = useState({
      nombre_ubicacion: "", 
      habilita: 0, 
   });

    // Función para validar el formulario antes de enviarlo
    const validarFormulario = () => {
      const nuevosErrores = {};

      if (!formularioValues.nombre_ubicacion || formularioValues.nombre_ubicacion.length > 40) {
        nuevosErrores.nombre_ubicacion = "Ingrese un nombre de máximo 40 caracteres";
        setSnackbarMensaje("Ingrese un nombre del autor/a de máximo 40 caracteres");
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

    const handleAgregar = async(event, ubi) => {
      event.preventDefault()
      const formularioValido = validarFormulario();
      if (formularioValido) {
          try {
              const response = await axios.post( "/admin/agregarUbicacion", ubi );
              setSnackbarMensaje("Ubicación creada.");
              setSnackbarOpen(true);
              setTimeout(() => {
                  navigate('/panel_patrimonio');
                }, 3000); 
                actualizador()
              return response.data;
            } catch (error) {
              console.error("Error al agregar la Ubicación:", error);
              throw new Error("Error al agregar la Ubicación");
            }
      } else {
        console.log('Algo salio mal :(')
        setSnackbarMensaje("Por favor, corrige los errores en el formulario.");
        setSnackbarOpen(true);
      }
    };

  return (
    <>
        <div className="container mt-3">
            <h3>Agregar Ubicación</h3>
        </div>
        <div className="container mt-3 mb-3">
            <form className="d-flex flex-column justify-content-center align-items-center formAgregarcausal" onSubmit={(event) => handleAgregar(event, formularioValues)}>
                <div>
                    <InputLabel  className="mb-2">UBICACIÓN</InputLabel>
                    <TextField
                        placeholder="Nombre del Ubicación"
                        onChange={handleInputChange}
                        name="nombre_ubicacion"
                        value={formularioValues.nombre_ubicacion}
                        sx={{width: 300, marginBottom: 2}}
                        required={true}
                        />
                </div>
                <div>
                    <InputLabel>HABILITA</InputLabel>
                    <div className="d-flex flex-column">
                        <Switch
                        checked={formularioValues.habilita === 1}
                        onChange={handleHabilitarChange}
                        name="habilita"
                        sx={{marginBottom: 5}}
                        />
                        <Button variant="contained" color="success" type="submit">AGREGAR</Button>
                    </div>
                </div>
            </form>
            {errores? (
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                    {snackbarMensaje}
                </Alert>
            </Snackbar>
            ):<></>}
        </div>
    </>
  )
}

export default AgregarUbicacion