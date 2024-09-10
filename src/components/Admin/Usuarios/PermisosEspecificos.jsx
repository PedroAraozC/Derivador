/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Modal, Box, Button, Divider, Switch, Snackbar, Alert } from "@mui/material";
import axios from "../../../config/axios";
import { EducaContext } from "../../../context/EducaContext";
import { Spinner } from "react-bootstrap";

const PermisosEspecificos = ({ empleado, modalPermisosAbierto, handleClose }) => {
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const [buttonDis, setButtonDis] = useState(false);
    const [loading, setLoading] = useState(true);  // Estado para el loader
    const { actualizador, obtenerProcesosSinId, ProcesosSinId, existeEnPermisoPersona, permisosPorPersona } = useContext(EducaContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const [processStates, setProcessStates] = useState({});
    const [permisosModificados, setPermisosModificados] = useState([]);

    // Sincroniza el estado processStates con los permisos actuales del usuario
    useEffect(() => {
        if (permisosPorPersona?.length > 0) {
            const initialStates = {};
            permisosPorPersona.forEach(permiso => {
                initialStates[permiso.id_proceso] = permiso.ver; // Asigna el valor de 'ver' al estado
            });
            setProcessStates(initialStates);
        }
        setLoading(false);  // Desactiva el loader una vez que se cargan los permisos
    }, [permisosPorPersona]);

    useEffect(() => {
        if (empleado) {
            existeEnPermisoPersona(empleado?.id_persona);
            setPermisosModificados([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empleado]);

    useEffect(() => {
        obtenerProcesosSinId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Restablece los estados al cerrar el modal
    const handleCloseModal = () => {
        setProcessStates({});
        setPermisosModificados([]);
        handleClose();
    };

    // Sincroniza el array de permisosModificados completo
    useEffect(() => {
        if (ProcesosSinId.length > 0) {
            const allPermissions = ProcesosSinId.map(proceso => ({
                id: proceso.id_proceso,
                ver: processStates[proceso.id_proceso] || 0
            }));
            setPermisosModificados(allPermissions);
        }
    }, [processStates, ProcesosSinId]);

    const handleSwitchChange = (id) => {
        setProcessStates(prevStates => ({
            ...prevStates,
            [id]: prevStates[id] === 1 ? 0 : 1,
        }));
        console.log(permisosModificados)
    };

    const establecerPermisosEspeciales = async () => {
        setButtonDis(true);
        let datos = {
            id_persona: empleado.id_persona,
            permisos: permisosModificados
        };
        try {
            const response = await axios.post("/admin/establecerPermisosEspecificos", datos);
            console.log(response)
            setSnackbarMensaje("Permisos modificados.");
            setSnackbarOpen(true);
            actualizador();
        } catch (error) {
            console.error("Error al cambiar los permisos:", error);
            setSnackbarMensaje("Error al cambiar los permisos");
            setSnackbarOpen(true);
        } finally {
            setButtonDis(false);
        }
    };
    
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = () => {
        establecerPermisosEspeciales();
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
        <Modal open={modalPermisosAbierto} onClose={handleCloseModal}>
            <Box sx={style}>
                {loading ? (
                    <Spinner/>
                ) : (
                    <>
                        <div className="d-flex justify-content-around align-items-center mb-3">
                            <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
                                Permisos específicos de {empleado.nombre_persona}
                            </h2>
                            <p className="m-0" style={{fontSize: '1.3rem'}}>{empleado.nombre_tusuario}</p>
                        </div>
                        <Divider />
                        <div className="d-flex flex-column justify-content-center">
                            <form className="d-flex flex-column gap-3 justify-content-center align-items-center formAgregarcausal">
                                <div className="row w-100">
                                    {Array.isArray(ProcesosSinId) &&
                                        ProcesosSinId.map((pro) => (
                                            <div key={pro.id_proceso} className="col-md-6 col-sm-12 d-flex align-items-center justify-content-between mb-2">
                                                <p className="mb-0">{pro.descripcion}</p>
                                                <div className="form-check form-switch">
                                                    <Switch
                                                        checked={processStates[pro.id_proceso] === 1}
                                                        onChange={() => handleSwitchChange(pro.id_proceso)}
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
                    </>
                )}
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                        {snackbarMensaje}
                    </Alert>
                </Snackbar>
            </Box>
        </Modal>
    );
};

export default PermisosEspecificos;
