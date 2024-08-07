/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Modal, Box, Button, Divider, Switch, Snackbar, Alert, Select, MenuItem } from "@mui/material";
import axios from "../../../config/axios";
import { EducaContext } from "../../../context/EducaContext";

const CambioTusuario = ({ empleado, modalCambioTUsuario, handleClose }) => {
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const [buttonDis, setButtonDis] = useState(false);
    const { actualizador, obtenerProcesos, procesos, obtenerTiposDeUsuarios, tusuarios } = useContext(EducaContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const [processStates, setProcessStates] = useState({});
    const [tipoDeUsuario, setTipoDeUsuario] = useState();

    useEffect(() => {
        setTipoDeUsuario(empleado?.id_tusuario);
        obtenerTiposDeUsuarios();
    }, [empleado]);

    useEffect(() => {
        setProcessStates(getInitialProcessStates());
    }, [procesos]);

    useEffect(() => {
        obtenerProcesos(tipoDeUsuario)
    }, [tipoDeUsuario])
    

    const getInitialProcessStates = () => {
        if (!Array.isArray(procesos)) return {};
        const initialStates = {};
        procesos.forEach(proceso => {
            initialStates[proceso.id_permiso_tusuario] = proceso.ver === 1 ? 1 : 0;
        });
        return initialStates;
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSwitchChange = (id) => {
        setProcessStates(prevStates => ({
            ...prevStates,
            [id]: prevStates[id] === 1 ? 0 : 1, // Cambiamos el estado contrario al actual
        }));
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        let newValue = value;
    
        setTipoDeUsuario(newValue);
    };

    const cambiarTipoDeUsuario = async () => {
        setButtonDis(true);
        let datos = {
            id_persona : empleado.id_persona,
            id : tipoDeUsuario
        }
        console.log(datos)
        try {
            const response = await axios.post("/admin/cambiarTipoDeUsuario", datos);
            console.log(response)
            setSnackbarMensaje("Usuario modificado.");
            setSnackbarOpen(true);
            actualizador();
        } catch (error) {
            console.error("Error al cambiar el Tipo de Usuario:", error);
            setSnackbarMensaje("Error al cambiar el Tipo de Usuario");
            setSnackbarOpen(true);
        } finally {
            setButtonDis(false);
        }
    };

    const handleSubmit = () => {
        cambiarTipoDeUsuario();
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

    if (!empleado) {
        return null;
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90%" : "80%",
        height: "90%",
        bgcolor: "background.paper",
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
        overflowY: 'auto',
    };

    return (
        <Modal open={modalCambioTUsuario} onClose={handleClose}>
            <Box sx={style}>
                <div className="d-flex justify-content-around align-items-center mb-3">
                    <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
                        Permisos para {empleado.nombre_persona}
                    </h2>
                    <p>Tipo de usuario :</p>
                    <Select
                        value={tipoDeUsuario}
                        onChange={handleInputChange}
                        name="id_tusuario"
                        sx={{ width: 400 }}
                        required={true}
                    >
                        {Array.isArray(tusuarios) &&
                            tusuarios.map((t) => (
                                <MenuItem
                                    key={t.id_tusuario}
                                    value={t.id_tusuario}
                                >
                                    {t.nombre_tusuario}
                                </MenuItem>
                            ))}
                    </Select>
                </div>
                <Divider />
                <div className="d-flex flex-column justify-content-center">
                    <form className="d-flex flex-column gap-3 justify-content-center align-items-center formAgregarcausal">
                        <div className="row w-100">
                            {Array.isArray(procesos) &&
                                procesos.map((pro) => (
                                    <div key={pro.id_permiso_tusuario} className="col-md-6 col-sm-12 d-flex align-items-center justify-content-between mb-2">
                                        <p className="mb-0">{pro.descripcion}</p>
                                        <div className="form-check form-switch">
                                            <Switch
                                                checked={processStates[pro.id_permiso_tusuario] === 1}
                                                onChange={() => handleSwitchChange(pro.id_permiso_tusuario)}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </form>
                    <Button
                        onClick={handleSubmit}
                        className="mt-3"
                        variant="outlined"
                        disabled={buttonDis}
                    >
                        Guardar cambios
                    </Button>
                </div>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                        {snackbarMensaje}
                    </Alert>
                </Snackbar>
            </Box>
        </Modal>
    );
};

export default CambioTusuario;
