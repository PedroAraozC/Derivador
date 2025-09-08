/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Modal, Box, Button, Divider, Switch, Snackbar, Alert } from "@mui/material";
import axios from "../../../config/axios";
import { EducaContext } from "../../../context/EducaContext";

const PermisosTUsuario = ({ tusuario, modalPermisosAbierto, handleClose }) => {
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const [buttonDis, setButtonDis] = useState(false);
    const { actualizador, obtenerProcesos, procesos } = useContext(EducaContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const [processStates, setProcessStates] = useState({});
    const [permisosModificados, setPermisosModificados] = useState([]);

    useEffect(() => {
        obtenerProcesos(tusuario?.id_tusuario);
    }, [tusuario]);

    useEffect(() => {
        setProcessStates(getInitialProcessStates());
        setPermisosModificados([]);
    }, [procesos]);

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

        setPermisosModificados(prevPermisos => {
            const existingIndex = prevPermisos.findIndex(permiso => permiso.id === id);
            if (existingIndex !== -1) {
                const updatedPermisos = [...prevPermisos];
                updatedPermisos[existingIndex] = { ...updatedPermisos[existingIndex], ver: processStates[id] === 1 ? 0 : 1 }; // Actualizamos el estado contrario al actual
                return updatedPermisos;
            } else {
                return [...prevPermisos, { id, ver: processStates[id] === 1 ? 0 : 1 }]; // Agregamos el nuevo permiso con el estado contrario al actual
            }
        });
    };

    const editarPermisos = async () => {
        setButtonDis(true);
        let datos = {
            id: tusuario.id_tusuario,
            permisos: permisosModificados
        }
        console.log(datos)
        try {
            const response = await axios.post("/admin/editarPermisosTUsuarios", datos);
            console.log(response)
            setSnackbarMensaje("Permisos editados.");
            setSnackbarOpen(true);
            actualizador();
        } catch (error) {
            console.error("Error al editar los permisos:", error);
            setSnackbarMensaje("Error al editar los permisos");
            setSnackbarOpen(true);
        } finally {
            setButtonDis(false);
        }
    };

    const handleSubmit = () => {
        editarPermisos();
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

    if (!tusuario) {
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
        <Modal open={modalPermisosAbierto} onClose={handleClose}>
            <Box sx={style}>
                <div className="d-flex justify-content-around align-items-center mb-3">
                    <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
                        Permisos para {tusuario.nombre_tusuario}
                    </h2>
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

export default PermisosTUsuario;
