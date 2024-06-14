/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Modal, Box, Button, Divider, InputLabel, Switch, TextField, Snackbar, Alert } from "@mui/material";
import { EducaContext } from "../../../context/EducaContext";
import axios from "../../../config/axios";

const ModalAgregar = ({ modalAgregarAbierto, handleClose }) => {
    
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const { actualizador } = useContext(EducaContext);
    const [errores, setErrores] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const [formularioValues, setFormularioValues] = useState({
        nombre_tusuario: "",
        observacion: "",
        habilita: 0,
    });
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    // Función para validar el formulario antes de enviarlo
    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formularioValues.nombre_tusuario || formularioValues.nombre_tusuario.length > 30) {
            nuevosErrores.nombre_tusuario = "Ingrese un nombre de máximo 30 caracteres";
            setSnackbarMensaje("Ingrese un nombre del autor/a de máximo 30 caracteres");
        }
        if (!formularioValues.observacion || formularioValues.observacion.length > 140) {
            nuevosErrores.observacion = "Ingrese un nombre de máximo 140 caracteres";
            setSnackbarMensaje("Ingrese un nombre del autor/a de máximo 140 caracteres");
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


    useEffect(() => {
        const handleResize = () => {
            setDeviceWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    
    const isMobile = deviceWidth <= 600;


    const agregarTusuario = async (tusu) => {
        const formularioValido = validarFormulario();
        if (formularioValido) {
            try {
                const response = await axios.post(
                    "/admin/altaTUsuarios",
                    tusu
                );
                handleClose()
                actualizador()
                return response.data;
            } catch (error) {
                console.error("Error al agregar el tipo de usuario:", error);
                throw new Error("Error al agregar el tipo de usuario");
            }
        } else {
            console.log('Algo salio mal :(')
            setSnackbarOpen(true);
        }
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90%" : "1200px",
        height: "50%",
        bgcolor: "background.paper",
        border: "none",
        borderRadius: "8px",
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={modalAgregarAbierto} onClose={handleClose}>
            <Box sx={style}>
                <div className="d-flex justify-content-around align-items-center mb-3">
                    <p style={{ fontSize: "1rem", margin: 0 }}>
                        Agregar Tipo de Usuario
                    </p>
                </div>
                <Divider />
                <div className="d-flex flex-column justify-content-center">
                    <form className="d-flex justify-content-around flex-column">
                        <div className="w-50 d-flex flex-column gap-3 p-2">
                            <InputLabel>Nombre</InputLabel>
                            <TextField
                                placeholder='Ej: Administrador'
                                onChange={handleInputChange}
                                name="nombre_tusuario"
                                value={formularioValues.nombre_tusuario}
                            />
                        </div>
                        <div className="w-50 d-flex flex-column gap-3 p-2">
                            <InputLabel>Observacion</InputLabel>
                            <TextField
                                placeholder='Max 140 caracteres'
                                onChange={handleInputChange}
                                name="observacion"
                                value={formularioValues.observacion}
                            />
                        </div>
                        <div className="d-flex flex-column gap-3 w-50 p-2">
                            <div className="d-flex align-items-center">
                                <p className="m-0">Habilita:</p>
                                <Switch
                                    checked={formularioValues.habilita === 1}
                                    onChange={handleHabilitarChange}
                                    name="habilita"
                                />
                            </div>
                        </div>
                    </form>
                    <Button
                        onClick={() => agregarTusuario(formularioValues)}
                        className="mt-3"
                        variant="outlined"
                    >
                        Agregar
                    </Button>
                </div>
                {errores ? (
                    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                        <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                            {snackbarMensaje}
                        </Alert>
                    </Snackbar>
                ) : <></>}
            </Box>
        </Modal>
    )
}

export default ModalAgregar;