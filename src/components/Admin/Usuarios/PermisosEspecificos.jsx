/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useMemo } from "react";
import { Modal, Box, Button, Divider, Snackbar, Alert, Chip, CircularProgress } from "@mui/material";
import axios from "../../../config/axios";
import { DerivadorContext } from "../../../context/DerivadorContext";
import TransferenciaPermisos from "./TransferenciaPermisos";

const PermisosEspecificos = ({ empleado, modalPermisosAbierto, handleClose, desactivarCheckbox }) => {
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const [buttonDis, setButtonDis] = useState(false);
    const [loading, setLoading] = useState(true);  // Estado para el loader
    const { actualizador, obtenerProcesosSinId, ProcesosSinId, existeEnPermisoPersona, permisosPorPersona } = useContext(DerivadorContext);
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
        desactivarCheckbox?.();
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

    // Asigna (ver = 1) o quita (ver = 0) un conjunto de permisos
    const moverPermisos = (ids, ver) => {
        setProcessStates(prevStates => {
            const nuevos = { ...prevStates };
            ids.forEach((id) => {
                nuevos[id] = ver;
            });
            return nuevos;
        });
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
            setTimeout(() => {
                handleCloseModal();
                setSnackbarOpen(false);
            }
            , 2000);
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

    // Ítems que muestra la transfer list (mismo filtro que antes: id_opcion === 4)
    const itemsPermisos = useMemo(
        () =>
            (Array.isArray(ProcesosSinId) ? ProcesosSinId : [])
                .filter((pro) => pro.id_opcion === 4)
                .map((pro) => ({
                    id: pro.id_proceso,
                    descripcion: pro.descripcion,
                    detalle: pro.nombre_proceso,
                })),
        [ProcesosSinId]
    );
    const cantidadAsignados = itemsPermisos.filter((item) => processStates[item.id] === 1).length;

    if (!empleado) {
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
        <Modal
            open={modalPermisosAbierto}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") return;
            }}
        >
            <Box sx={style} className="cd-modal">
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <div className="cd-modal__cabecera">
                            <div>
                                <h2 className="cd-modal__titulo">Permisos específicos</h2>
                                <p className="cd-modal__sub">
                                    {empleado.nombre_persona} {empleado.apellido_persona}
                                    {empleado.nombre_tusuario ? ` · ${empleado.nombre_tusuario}` : ""}
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
                            <Button
                                onClick={handleCloseModal}
                                variant="outlined"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
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
