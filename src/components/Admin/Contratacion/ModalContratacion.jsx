/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Modal, Box, Button, Divider, InputLabel, MenuItem, Select, Switch, TextField, Snackbar, Alert, } from "@mui/material";
import axios from "../../../config/axiosLicitaciones";
import useStore from "../../../Zustand/Zustand";
// import LaunchIcon from "@mui/icons-material/Launch";

const ModalContratacion = ({ contratacion, modalAbierto, handleClose, modoEdicion, }) => {

    const { obtenerInstrumentos, obtenerTiposContratacion, tiposContratacion, instrumentosC, obtenerContrataciones } = useStore();
    const fileInputRef = useRef(null);
    const anexoInputRef = useRef(null);
    const [archivo, setArchivo] = useState(null);
    const [anexo, setAnexo] = useState(null);
    const [errores, setErrores] = useState({});
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [datosOld, setDatosOld] = useState('');
    const [formularioValues, setFormularioValues] = useState({});
    const [buttonDisAnexo, setButtonDisAnexo] = useState(false);
    const handleSnackbarClose = () => { setSnackbarOpen(false); };

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

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formularioValues.id_tcontratacion) {
            nuevosErrores.id_tcontratacion = "El campo Tipo contratación es obligatorio";
        }
        if (!formularioValues.hora_apertura || !/^\d{2}:\d{2}:\d{2}$/.test(formularioValues.hora_apertura)) {
            nuevosErrores.hora_publica = "Ingrese una hora válida (formato: HH:MM:SS)";
            setSnackbarMensaje("Ingrese una hora válida (formato: HH:MM:SS)");
        }
        if (!formularioValues.hora_presentacion || !/^\d{2}:\d{2}:\d{2}$/.test(formularioValues.hora_presentacion)) {
            nuevosErrores.hora_designa = "Ingrese una hora válida (formato: HH:MM:SS)";
            setSnackbarMensaje("Ingrese una hora válida (formato: HH:MM:SS)");
        }
        setErrores(nuevosErrores);
        // Si hay errores, muestra el Snackbar
        if (Object.keys(nuevosErrores).length > 0) {
            setSnackbarOpen(true);
        }
        return Object.keys(nuevosErrores).length === 0; // Retorna true si no hay errores
    };

    useEffect(() => {
        if (contratacion) {
            // Si hay una contratacion y el modal está abierto, establece los valores del formulario
            //Se parsea las fechas para poder establecer el valor por default segun viene de la base de datos
            const fechaPresentacion = new Date(contratacion.fecha_presentacion);
            const fechaApertura = new Date(contratacion.fecha_apertura);
            const fechaPresentacionFormatted = `${fechaPresentacion.getFullYear()}-${(fechaPresentacion.getMonth() + 1).toString().padStart(2, '0')}-${fechaPresentacion.getDate().toString().padStart(2, '0')}`;
            const fechaAperturaFormatted = `${fechaApertura.getFullYear()}-${(fechaApertura.getMonth() + 1).toString().padStart(2, '0')}-${fechaApertura.getDate().toString().padStart(2, '0')}`;
            setFormularioValues({
                id: contratacion.id_contratacion,
                nombre_contratacion: contratacion.nombre_contratacion,
                id_tcontratacion: contratacion.id_tcontratacion,
                fecha_presentacion: fechaPresentacionFormatted,
                hora_presentacion: contratacion.hora_presentacion,
                num_instrumento: contratacion.num_instrumento,
                valor_pliego: contratacion.valor_pliego,
                expte: contratacion.expte,
                id_tinstrumento: contratacion.id_tinstrumento,
                fecha_apertura: fechaAperturaFormatted,
                hora_apertura: contratacion.hora_apertura,
                habilita: contratacion.habilita,
                detalle: contratacion.detalle
            });
            setDatosOld(`CONTRATACION_${contratacion.num_instrumento}_EXPTE_${contratacion.expte}.pdf`)
        }
    }, [contratacion]);

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
    const handleFileInputChangeAnexo = () => {
        const file = anexoInputRef.current.files[0];
        setAnexo(file); // Asignar el archivo al estado
        console.log(anexo)
    };

    const editarContratacion = async (contratacion) => {

        const formularioValido = validarFormulario();
        if (formularioValido) {
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
                setSnackbarMensaje("Contratación editada.");
                setSnackbarOpen(true);
                obtenerContrataciones()
                return response.data;
            } catch (error) {
                console.error("Error al editar la contratación:", error);
                throw new Error("Error al editar la contratación");
            }
        } else {
            console.log('Algo salió mal :(');
            setSnackbarOpen(true);
        }
    };

    const editarAnexo = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('anexo', anexo);
          // Agregar num_instrumento y expte como parámetros de consulta
        let oldName = `CONTRATACION_${contratacion.num_instrumento}_EXPTE_${contratacion.expte}_ANEXO.pdf`
        const url = `/admin/editarAnexo?num_instrumento=${formularioValues.num_instrumento}&expte=${formularioValues.expte}&id=${contratacion.id_contratacion}&oldName=${oldName}`;
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        try {
            const data = await axios.post(url, formData, config)
            console.log(data);
            setSnackbarMensaje("Anexo editado.");
            setSnackbarOpen(true);
            setButtonDisAnexo(true);
        }
        catch (err) {
            console.log(err);
        }
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%", // Ajusta el ancho según el dispositivo
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
                        Detalle : {contratacion?.id_contratacion}
                    </p>
                </div>
                <Divider />
                <div className="d-flex flex-column">

                <div className="d-flex justify-content-center">
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
                            <InputLabel sx={{marginTop: 3}}>Detalle</InputLabel>
                            <textarea
                                placeholder="Información Adicional..."
                                onChange={handleInputChange}
                                name="detalle"
                                value={formularioValues.detalle}
                                style={{ width: 400, borderRadius: 5, padding: 5,  }}
                            />
                            <InputLabel sx={{marginTop: 5}}>EDITAR PLIEGO (OBLIGATORIO)</InputLabel>
                            <input
                                type="file"
                                accept=".pdf"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                                required={true}
                                style={{ width: 300, paddingTop: 5, paddingBottom: 30 }}
                            />
                        </div>
                    </form>
                    <div className="ps-4">

                    <InputLabel sx={{ marginTop: 4 }}>EDITAR ANEXO #OPCIONAL</InputLabel>
                    <form className="d-flex flex-column">
                    <input
                        type="file"
                        accept=".pdf"
                        ref={anexoInputRef}
                        onChange={handleFileInputChangeAnexo}
                        required={false}
                        style={{ width: 400, paddingTop: 5, paddingBottom: 30 }}
                        />
                    <Button variant="contained" onClick={editarAnexo} disabled={buttonDisAnexo}>Editar</Button>
                    </form>
                    {errores ? (
                        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                            <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                                {snackbarMensaje}
                            </Alert>
                        </Snackbar>
                    ) : <></>}
                    </div>
                    </div>

                    <Button
                        onClick={() => editarContratacion(formularioValues)}
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
