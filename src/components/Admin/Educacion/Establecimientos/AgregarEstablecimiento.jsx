/* eslint-disable react-hooks/exhaustive-deps */
import { Button, InputLabel, Switch, TextField } from "@mui/material"
import { useContext, useState } from "react";
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import axios from "../../../../config/axios";
import { EducaContext } from "../../../../context/EducaContext";

const AgregarEstablecimiento = () => {
    const [errores, setErrores] = useState({});
    const navigate = useNavigate()
    const { actualizador } = useContext(EducaContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };
    const [formularioValues, setFormularioValues] = useState({
        nombre_establecimiento: "", // Nombre del establecimiento
        domicilio: "",
        telefono: "",
        nombre_autoridad: "",
        email_autoridad: "",
        habilita: 0, // Habilita
     });

      // Función para validar el formulario antes de enviarlo
      const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formularioValues.nombre_establecimiento || formularioValues.nombre_establecimiento.length > 30) {
          nuevosErrores.nombre_establecimiento = "Ingrese un nombre de establecimiento de máximo 30 caracteres";
          setSnackbarMensaje("Ingrese un nombre de establecimiento de máximo 30 caracteres");
        }
        if (formularioValues.email_autoridad && !/^\S+@\S+\.\S+$/.test(formularioValues.email_autoridad)) {
          nuevosErrores.email_autoridad = "Ingrese un email válido";
          setSnackbarMensaje("Ingrese un email válido")
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

      const handleAgregar = async(event,establecimiento) => {
        event.preventDefault()
        const formularioValido = validarFormulario();
        if (formularioValido) {
            try {
                const response = await axios.post( "/educacion/agregarEstablecimiento", establecimiento );
                console.log(response.data)

                setSnackbarMensaje("Establecimiento creado.");
                setSnackbarOpen(true);
                setTimeout(() => {
                    navigate('/establecimiento');
                  }, 3000); 
                  actualizador()
                return response.data;
              } catch (error) {
                console.error("Error al agregar el establecimiento:", error);
                throw new Error("Error al agregar el establecimiento");
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
            <h3>Agregar Establecimiento</h3>
        </div>
        <div className="container mt-3 mb-3">
            <form className="d-flex flex-column justify-content-center align-items-center formAgregarcausal" onSubmit={(event) => handleAgregar(event, formularioValues)}>
                <div>
                    <InputLabel>ESTABLECIMIENTO</InputLabel>
                    <TextField
                        placeholder="Nombre del Establecimiento"
                        onChange={handleInputChange}
                        name="nombre_establecimiento"
                        value={formularioValues.establecimiento}
                        sx={{width: 300, marginBottom: 2}}
                        required={true}
                    />
                </div>
                <div>
                    <InputLabel>DOMICILIO</InputLabel>
                    <TextField
                        placeholder="Direccion exacta"
                        onChange={handleInputChange}
                        name="domicilio"
                        value={formularioValues.domicilio}
                        sx={{width: 300, marginBottom: 2}}
                        required={true}
                    />
                </div>
                <div>
                    <InputLabel>TELEFONO</InputLabel>
                    <TextField
                        placeholder="Numero de telefono"
                        onChange={handleInputChange}
                        name="telefono"
                        value={formularioValues.telefono}
                        sx={{width: 300, marginBottom: 2}}
                        required={true}
                    />
                </div>
                <div>
                    <InputLabel>NOMBRE AUTORIDAD</InputLabel>
                    <TextField
                        placeholder="Nombre completo de la Autoridad"
                        onChange={handleInputChange}
                        name="nombre_autoridad"
                        value={formularioValues.nombre_autoridad}
                        sx={{width: 300, marginBottom: 2}}
                        required={true}
                    />
                </div>
                <div>
                    <InputLabel>EMAIL AUTORIDAD</InputLabel>
                    <TextField
                        placeholder="ejemplo@ejemplo.com"
                        onChange={handleInputChange}
                        name="email_autoridad"
                        value={formularioValues.email_autoridad}
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

export default AgregarEstablecimiento