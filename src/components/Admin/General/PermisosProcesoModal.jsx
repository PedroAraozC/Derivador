/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Modal, Box, Button, Divider, Switch, Snackbar, Alert } from "@mui/material";
import axios from "../../../config/axios";
import { EducaContext } from "../../../context/EducaContext";
import img from '../../../assets/logoMuni-sm.png'
import './loader.css'

const PermisosProcesoModal = ({ modalAbiertoPPro, handleClose, proceso }) => {
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const [buttonDis, setButtonDis] = useState(false);
    const { actualizador, obtenerPermisosPorTUsuarios, permisosTUsuarios } = useContext(EducaContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const [processStates, setProcessStates] = useState({});
    const [permisosModificados, setPermisosModificados] = useState([]);
    const [loading, setLoading] = useState()
    
    useEffect(() => {
        setProcessStates(getInitialProcessStates());
        setPermisosModificados([]);
    }, [permisosTUsuarios]);
    
    useEffect(() => {
        setLoading(true)
        obtenerPermisosPorTUsuarios(proceso?.id_proceso);
    }, [proceso]);
    
    const getInitialProcessStates = () => {
        if (!Array.isArray(permisosTUsuarios)) return {};
        const initialStates = {};
        permisosTUsuarios.forEach(proceso => {
            initialStates[proceso.id_permiso_tusuario] = proceso.ver === 1 ? 1 : 0;
        });
        setLoading(false)
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
            permisos: permisosModificados
        }
        try {
            const response = await axios.post("/admin/editarPermisosPorTUsuarios", datos);
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

    if (!proceso) {
        return null;
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90%" : "80%",
        height: "60%",
        bgcolor: "background.paper",
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
        overflowY: 'auto',
    };


    return (
        <Modal open={modalAbiertoPPro} onClose={handleClose}>
            <Box sx={style}>
                <div className="d-flex justify-content-around align-items-center mb-3">
                    <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
                        Permisos para {proceso.descripcion}
                    </h2>
                </div>
                <Divider />
                <div className="d-flex flex-column justify-content-center">
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <img src={img} className="loaderMuni"/>
                        </div>
                    ): (
                        <form className="d-flex flex-column gap-3 justify-content-center align-items-center formAgregarcausal mt-5">
                            <div className="row w-100">
                                {Array.isArray(permisosTUsuarios) &&
                                    permisosTUsuarios.map((tu) => (
                                        <div key={tu.id_permiso_tusuario} className="col-md-6 col-sm-12 d-flex align-items-center justify-content-between mb-2">
                                            <p className="mb-0">{tu.nombre_tusuario}</p>
                                            <div className="form-check form-switch">
                                                <Switch
                                                    checked={processStates[tu.id_permiso_tusuario] === 1}
                                                    onChange={() => handleSwitchChange(tu.id_permiso_tusuario)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </form>
                    )}
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

export default PermisosProcesoModal;
