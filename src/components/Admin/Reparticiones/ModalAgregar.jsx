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
        item: "",
        nombre_reparticion: "",
        depende: "",
        secretaria: "",
        vigente_desde: "",
        vigente_hasta: "",
        habilita: 0,
    });
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    // Función para validar el formulario antes de enviarlo
    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formularioValues.nombre_reparticion || formularioValues.nombre_reparticion.length > 100) {
            nuevosErrores.nombre_reparticion = "Ingrese un nombre de máximo 100 caracteres";
            setSnackbarMensaje("Ingrese un nombre de item de máximo 100 caracteres");
        }
        if (!formularioValues.item || formularioValues.item.length > 4) {
            nuevosErrores.item = "Ingrese un item de máximo 4 caracteres";
            setSnackbarMensaje("Ingrese un nombre de item de máximo 4 caracteres");
        }
        if (!formularioValues.depende || formularioValues.depende.length > 4) {
            nuevosErrores.depende = "Ingrese un de máximo 4 caracteres";
            setSnackbarMensaje("Ingrese un de máximo 4 caracteres");
        }
        if (!formularioValues.secretaria || formularioValues.secretaria.length > 4) {
            nuevosErrores.secretaria = "Ingrese un máximo de 4 caracteres";
            setSnackbarMensaje("Ingrese un máximo de 4 caracteres");
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


    const agregarTDocumento = async (rep) => {
        const formularioValido = validarFormulario();
        if (formularioValido) {
            try {
                const response = await axios.post(
                    "/admin/altaReparticion",
                    rep
                );
                handleClose()
                actualizador()
                return response.data;
            } catch (error) {
                console.error("Error al agregar la reparticion:", error);
                throw new Error("Error al agregar la reparticion");
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
        height: "70%",
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
                        Agregar Reparticion
                    </p>
                </div>
                <Divider />
                <div className="d-flex flex-column justify-content-center">
                    <form className="d-flex justify-content-around">
                        <div className="w-50 d-flex flex-column gap-3 p-2">
                            <InputLabel>Item</InputLabel>
                            <TextField
                                placeholder='Ej: 110'
                                onChange={handleInputChange}
                                name="item"
                                value={formularioValues.item}
                            />
                            <InputLabel>Nombre Reparticion</InputLabel>
                            <TextField
                                placeholder='Ej: Direccion de Innovación Tecnologica'
                                onChange={handleInputChange}
                                name="nombre_reparticion"
                                value={formularioValues.nombre_reparticion}
                            />
                                <InputLabel>Depende</InputLabel>
                                <TextField
                                    placeholder='Ej: 200'
                                    onChange={handleInputChange}
                                    name="item"
                                    value={formularioValues.item}
                                />
                                <InputLabel>Secretaria</InputLabel>
                                <TextField
                                    placeholder='Ej: 100'
                                    onChange={handleInputChange}
                                    name="nombre_reparticion"
                                    value={formularioValues.nombre_reparticion}
                                />
                        </div>
                        <div className="w-50 d-flex flex-column gap-3 p-2">
                            <InputLabel>Vigente desde</InputLabel>
                            <TextField
                                type="date"
                                onChange={handleInputChange}
                                name="vigente_desde"
                                value={formularioValues.vigente_desde}
                                sx={{ width: 400,  minHeight: '56px' }}
                                required={true}
                            />
                            <InputLabel>Vigente hasta</InputLabel>
                            <TextField
                                type="date"
                                onChange={handleInputChange}
                                name="vigente_hasta"
                                value={formularioValues.vigente_hasta}
                                sx={{ width: 400,  minHeight: '56px' }}
                                required={true}
                            />
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
                        onClick={() => agregarTDocumento(formularioValues)}
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