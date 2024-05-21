/* eslint-disable react-hooks/exhaustive-deps */
import { Button, InputLabel, Switch, TextField } from "@mui/material"
import { useContext, useState } from "react";
import './Causal.css'
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";
import axios from "../../../../config/axios";

const AgregarCausal = () => {
    const [errores, setErrores] = useState({});
    const navigate = useNavigate()
    const { actualizador } = useContext(EducaContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };
    const [formularioValues, setFormularioValues] = useState({
        nombre_causal: "", // Nombre del causal
        habilita: 0, // Habilita
     });

      // Función para validar el formulario antes de enviarlo
      const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formularioValues.nombre_causal || formularioValues.nombre_causal.length > 30) {
          nuevosErrores.nombre_causal = "Ingrese un nombre de causal de máximo 30 caracteres";
          setSnackbarMensaje("Ingrese un nombre de causal de máximo 30 caracteres");
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

      const handleAgregar = async(event,causal) => {
        event.preventDefault()
        const formularioValido = validarFormulario();
        if (formularioValido) {
            try {
                const response = await axios.post( "/educacion/agregarCausal", causal );
                console.log(response.data)

                setSnackbarMensaje("Causal creada.");
                setSnackbarOpen(true);
                setTimeout(() => {
                    navigate('/causal');
                  }, 3000); 
                  actualizador()
                return response.data;
              } catch (error) {
                console.error("Error al agregar la causal:", error);
                throw new Error("Error al agregar la causal");
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
            <h3>Agregar Causal</h3>
        </div>
        <div className="container mt-3 mb-3">
            <form className="d-flex flex-column justify-content-center align-items-center formAgregarcausal" onSubmit={(event) => handleAgregar(event, formularioValues)}>
                <div>
                    <InputLabel>CAUSAL</InputLabel>
                    <TextField
                        placeholder="Nombre de la Causal"
                        onChange={handleInputChange}
                        name="nombre_causal"
                        value={formularioValues.causal}
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

export default AgregarCausal