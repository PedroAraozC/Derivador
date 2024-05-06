/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Modal, Box, Button, Divider, InputLabel, MenuItem, Select, Switch, TextField, Snackbar, Alert, } from "@mui/material";
import axios from "../../../config/axios";
import useStore from "../../../Zustand/Zustand";
// import LaunchIcon from "@mui/icons-material/Launch";

const ModalContratacion = ({ contratacion, modalAbierto, handleClose, modoEdicion, }) => {

    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const { obtenerInstrumentos, obtenerTiposContratacion, tiposContratacion, instrumentosC, } = useStore();
    const fileInputRef = useRef(null);
    const [archivo, setArchivo] = useState(null);
    const [formularioValues, setFormularioValues] = useState({});
    const [errores, setErrores] = useState({});
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await obtenerInstrumentos();
                await obtenerTiposContratacion();
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modoEdicion]);

    useEffect(() => {
        if (contratacion) {
            // Si hay una convocatoria y el modal está abierto, establece los valores del formulario
            setFormularioValues({
                id: contratacion.id_contratacion,
            });
            // setDatosOld(`CONVOCATORIA_${convocatoria.num_convocatoria}_${convocatoria.anio_convocatoria}_EXPTE_${convocatoria.expte}.pdf`)
        }
    }, [contratacion]);

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
    if (!contratacion) {
        return null;
    }

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

    const handleFileInputChange = () => {
        const file = fileInputRef.current.files[0];
        setArchivo(file); // Asignar el archivo al estado
    };

    const editarContratacion = async (contratacion) => {
        try {
            contratacion.archivo = archivo;
            contratacion.oldName = datosOld
            console.log(contratacion)
            const response = await axios.put(
                "/admin/editarContratacion",
                contratacion, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            //   obtenerConvocatorias(idNivel)
            handleClose()
            setSnackbarMensaje("Contratación editada.");
            setSnackbarOpen(true);
            return response.data;
        } catch (error) {
            console.error("Error al editar la contratación:", error);
            throw new Error("Error al editar la contratación");
        }
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90%" : "1200px", // Ajusta el ancho según el dispositivo
        height: "95%",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    }

    return (
        <Modal open={modalAbierto} onClose={handleClose}>
            <Box sx={style}>
                <div className="d-flex justify-content-around align-items-center mb-3">
                    <p style={{ fontSize: "1rem", margin: 0 }}>
                        Detalle : {contratacion.id_contratacion}
                    </p>
                </div>
                <Divider />
                <div className="d-flex flex-column justify-content-center">
                    <form className="d-flex gap-5" onSubmit={(event) => editarContratacion(event, formularioValues)} encType="multipart/form-data">
                        <div className="d-flex flex-column">
                            <TextField
                                label="Nombre Contratación"
                                variant="outlined"
                                sx={{ marginTop: 5, width: 300 }}
                                onChange={handleInputChange}
                                name="nombre_contratacion"
                                value={formularioValues.nombre_contratacion}
                                required={true}
                            />
                            <InputLabel sx={{ marginTop: 2 }}>Tipo de Contratación</InputLabel>
                            <Select
                                value={formularioValues.id_tcontratacion}
                                onChange={handleInputChange}
                                name="id_tcontratacion"
                                sx={{ width: 300, marginBottom: 2 }}
                                required={true}
                            >
                                {Array.isArray(tiposContratacion) &&
                                    tiposContratacion.map((e) => (
                                        <MenuItem
                                            key={e.id_tcontratacion}
                                            value={e.id_tcontratacion}
                                        >
                                            {e.nombre_tcontratacion}
                                        </MenuItem>
                                    ))}
                            </Select>
                            <InputLabel>Fecha Presentación</InputLabel>
                            <TextField
                                type="date"
                                onChange={handleInputChange}
                                name="fecha_presentacion"
                                value={formularioValues.fecha_presentacion}
                                sx={{ width: 300, marginTop: 2 }}
                                required={true}
                            />
                            <InputLabel sx={{ marginTop: 2 }}>Hora Presentación</InputLabel>
                            <TextField
                                placeholder="Ej: 09:00:00"
                                onChange={handleInputChange}
                                name="hora_presentacion"
                                value={formularioValues.hora_presentacion}
                                sx={{ width: 300, marginTop: 2 }}
                                required={true}
                            />
                            <TextField
                                id="standard-basic"
                                label="Num de Instrumento"
                                variant="outlined"
                                sx={{ marginTop: 5, width: 300 }}
                                onChange={handleInputChange}
                                name="num_instrumento"
                                value={formularioValues.num_instrumento}
                                required={true}
                            />
                            <TextField
                                id="standard-basic"
                                label="Valor de Pliego"
                                variant="outlined"
                                sx={{ marginTop: 5, width: 300 }}
                                onChange={handleInputChange}
                                name="valor_pliego"
                                value={formularioValues.valor_pliego}
                                required={true}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <TextField
                                id="standard-basic"
                                label="Expte"
                                variant="outlined"
                                sx={{ marginTop: 5, width: 300 }}
                                onChange={handleInputChange}
                                name="expte"
                                value={formularioValues.expte}
                                required={true}
                            />
                            <InputLabel sx={{ marginTop: 2 }}>Tipo de Instrumento</InputLabel>
                            <Select
                                value={formularioValues.id_tinstrumento}
                                onChange={handleInputChange}
                                name="id_tinstrumento"
                                sx={{ width: 300 }}
                                required={true}
                            >
                                {Array.isArray(instrumentosC) &&
                                    instrumentosC.map((e) => (
                                        <MenuItem
                                            key={e.id_tinstrumento}
                                            value={e.id_tinstrumento}
                                        >
                                            {e.nombre_tinstrumento}
                                        </MenuItem>
                                    ))}
                            </Select>

                            <InputLabel sx={{ marginTop: 2 }}>Fecha Apertura</InputLabel>
                            <TextField
                                type="date"
                                onChange={handleInputChange}
                                name="fecha_apertura"
                                value={formularioValues.fecha_apertura}
                                sx={{ width: 300, marginTop: 2 }}
                                required={true}
                            />
                            <InputLabel sx={{ marginTop: 2 }}>Hora Apertura</InputLabel>
                            <TextField
                                placeholder="Ej: 09:00:00"
                                onChange={handleInputChange}
                                name="hora_apertura"
                                value={formularioValues.hora_apertura}
                                sx={{ width: 300, marginTop: 2 }}
                                required={true}
                            />
                            <InputLabel sx={{ marginTop: 2 }}>HABILITA</InputLabel>
                            <Switch
                                checked={formularioValues.habilita === 1}
                                onChange={handleHabilitarChange}
                                name="habilita"
                                sx={{ marginTop: 2 }}
                            />
                        </div>
                        <div>
                            <InputLabel sx={{ marginTop: 4 }}>NOMBRE ARCHIVO</InputLabel>
                            <input
                                type="file"
                                accept=".pdf"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                                required={false}
                                style={{ width: 300, paddingTop: 5, paddingBottom: 30 }}
                            />
                        </div>
                    </form>
                    {errores ? (
                        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                            <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                                {snackbarMensaje}
                            </Alert>
                        </Snackbar>
                    ) : <></>}

                    <Button
                        onClick={() => editarConvocatoria(formularioValues)}
                        className="mt-3"
                        variant="outlined"
                    >
                        Guardar cambios
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalContratacion;
