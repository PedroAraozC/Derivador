/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useMemo } from "react";
import { Modal, Box, Button, Divider, Snackbar, Alert, Chip } from "@mui/material";
import axios from "../../../config/axios";
import { DerivadorContext } from "../../../context/DerivadorContext";
import TransferenciaPermisos from "../Usuarios/TransferenciaPermisos";

const PermisosTUsuario = ({ tusuario, modalPermisosAbierto, handleClose }) => {
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const [buttonDis, setButtonDis] = useState(false);
    const { actualizador, obtenerProcesos, procesos } = useContext(DerivadorContext);
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

    // Asigna (ver = 1) o quita (ver = 0) un conjunto de permisos.
    // Mantiene la semántica anterior: permisosModificados sólo lleva los que cambiaron.
    const moverPermisos = (ids, ver) => {
        setProcessStates(prevStates => {
            const nuevos = { ...prevStates };
            ids.forEach((id) => {
                nuevos[id] = ver;
            });
            return nuevos;
        });

        setPermisosModificados(prevPermisos => {
            const actualizados = [...prevPermisos];
            ids.forEach((id) => {
                const existingIndex = actualizados.findIndex(permiso => permiso.id === id);
                if (existingIndex !== -1) {
                    actualizados[existingIndex] = { ...actualizados[existingIndex], ver };
                } else {
                    actualizados.push({ id, ver });
                }
            });
            return actualizados;
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

    // Ítems de la transfer list (mismo filtro que antes: id_opcion === 4)
    const itemsPermisos = useMemo(
        () =>
            (Array.isArray(procesos) ? procesos : [])
                .filter((pro) => pro.id_opcion === 4)
                .map((pro) => ({
                    id: pro.id_permiso_tusuario,
                    descripcion: pro.descripcion,
                    detalle: pro.nombre_proceso,
                })),
        [procesos]
    );
    const cantidadAsignados = itemsPermisos.filter((item) => processStates[item.id] === 1).length;
    const hayCambios = permisosModificados.length > 0;

    if (!tusuario) {
        return null;
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "94%" : "min(1100px, 92vw)",
        maxHeight: "92vh",
        bgcolor: "background.paper",
        borderRadius: "20px",
        boxShadow: "var(--cd-sombra-modal)",
        p: { xs: 3, md: 4 },
        overflowY: 'auto',
        outline: "none",
    };

    return (
        <Modal open={modalPermisosAbierto} onClose={handleClose}>
            <Box sx={style} className="cd-modal">
                <div className="cd-modal__cabecera">
                    <div>
                        <h2 className="cd-modal__titulo">
                            Permisos del tipo de usuario
                        </h2>
                        <p className="cd-modal__sub">
                            {tusuario.nombre_tusuario} · los usuarios de este tipo heredan estos permisos.
                        </p>
                    </div>
                    <Chip
                        size="small"
                        color={cantidadAsignados > 0 ? "primary" : "default"}
                        variant={cantidadAsignados > 0 ? "filled" : "outlined"}
                        label={`${cantidadAsignados} de ${itemsPermisos.length} asignados`}
                    />
                </div>
                <Divider />

                <p className="cd-modal__ayuda">
                    Marcá uno o varios permisos y usá las flechas, o hacé doble clic sobre un permiso para moverlo.
                </p>

                <TransferenciaPermisos
                    items={itemsPermisos}
                    estaAsignado={(id) => processStates[id] === 1}
                    onMover={moverPermisos}
                    etiquetaDisponibles="Disponibles"
                    etiquetaAsignados="Asignados"
                />

                <div className="d-flex gap-2 align-items-center justify-content-end mt-4 flex-wrap">
                    {hayCambios && (
                        <span className="cd-modal__ayuda" style={{ margin: 0, marginRight: "auto" }}>
                            {permisosModificados.length} cambio{permisosModificados.length === 1 ? "" : "s"} sin guardar
                        </span>
                    )}
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                    >
                        Cerrar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
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
