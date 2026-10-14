/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Modal, Box, Button, Divider, InputLabel, MenuItem, Select, Switch, TextField, Snackbar, Alert, FormControl, FormControlLabel, Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
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
            // La fecha límite es opcional: puede venir null desde la base de datos
            let fechaLimiteFormatted = "";
            if (contratacion.fecha_limite) {
                const fechaLimite = new Date(contratacion.fecha_limite);
                fechaLimiteFormatted = `${fechaLimite.getFullYear()}-${(fechaLimite.getMonth() + 1).toString().padStart(2, '0')}-${fechaLimite.getDate().toString().padStart(2, '0')}`;
            }
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
                detalle: contratacion.detalle,
                fecha_limite: fechaLimiteFormatted,
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
        width: { xs: "95%", md: 860 },
        maxWidth: "95%",
        maxHeight: "95vh",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        outline: "none",
    }

    const SeccionTitulo = ({ children }) => (
        <Typography variant="overline" sx={{ display: "block", color: "text.secondary", fontWeight: 600, letterSpacing: 1, mb: 1.5 }}>
            {children}
        </Typography>
    );

    return (
        <Modal open={modalAbierto} onClose={handleClose}>
            <Box sx={style}>
                {/* Encabezado */}
                <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, borderBottom: 1, borderColor: "divider" }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>Editar contratación</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            #{contratacion?.id_contratacion} · {contratacion?.nombre_contratacion}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small" aria-label="Cerrar">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Contenido */}
                <Box sx={{ px: 3, py: 2.5, overflowY: "auto", flex: 1 }}>
                    <form onSubmit={(event) => editarContratacion(event, formularioValues)} encType="multipart/form-data">
                        <SeccionTitulo>Datos generales</SeccionTitulo>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Nombre Contratación"
                                    size="small"
                                    fullWidth
                                    onChange={handleInputChange}
                                    name="nombre_contratacion"
                                    value={formularioValues.nombre_contratacion ?? ""}
                                    required={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small" required>
                                    <InputLabel id="label-tcontratacion">Tipo de Contratación</InputLabel>
                                    <Select
                                        labelId="label-tcontratacion"
                                        label="Tipo de Contratación"
                                        value={formularioValues.id_tcontratacion ?? ""}
                                        onChange={handleInputChange}
                                        name="id_tcontratacion"
                                    >
                                        {Array.isArray(tiposContratacion) &&
                                            tiposContratacion.map((e) => (
                                                <MenuItem key={e.id_tcontratacion} value={e.id_tcontratacion}>
                                                    {e.nombre_tcontratacion}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small" required>
                                    <InputLabel id="label-tinstrumento">Tipo de Instrumento</InputLabel>
                                    <Select
                                        labelId="label-tinstrumento"
                                        label="Tipo de Instrumento"
                                        value={formularioValues.id_tinstrumento ?? ""}
                                        onChange={handleInputChange}
                                        name="id_tinstrumento"
                                    >
                                        {Array.isArray(instrumentosC) &&
                                            instrumentosC.map((e) => (
                                                <MenuItem key={e.id_tinstrumento} value={e.id_tinstrumento}>
                                                    {e.nombre_tinstrumento}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Num de Instrumento"
                                    size="small"
                                    fullWidth
                                    onChange={handleInputChange}
                                    name="num_instrumento"
                                    value={formularioValues.num_instrumento ?? ""}
                                    required={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Expte"
                                    size="small"
                                    fullWidth
                                    onChange={handleInputChange}
                                    name="expte"
                                    value={formularioValues.expte ?? ""}
                                    required={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Valor de Pliego"
                                    size="small"
                                    fullWidth
                                    placeholder="Ej: 100000.00"
                                    onChange={handleInputChange}
                                    name="valor_pliego"
                                    value={formularioValues.valor_pliego ?? ""}
                                    required={true}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <SeccionTitulo>Fechas</SeccionTitulo>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Fecha Presentación"
                                    type="date"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleInputChange}
                                    name="fecha_presentacion"
                                    value={formularioValues.fecha_presentacion ?? ""}
                                    required={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Hora Presentación"
                                    size="small"
                                    fullWidth
                                    placeholder="09:00:00"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleInputChange}
                                    name="hora_presentacion"
                                    value={formularioValues.hora_presentacion ?? ""}
                                    required={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Fecha Apertura"
                                    type="date"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleInputChange}
                                    name="fecha_apertura"
                                    value={formularioValues.fecha_apertura ?? ""}
                                    required={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Hora Apertura"
                                    size="small"
                                    fullWidth
                                    placeholder="09:00:00"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleInputChange}
                                    name="hora_apertura"
                                    value={formularioValues.hora_apertura ?? ""}
                                    required={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Fecha Límite (opcional)"
                                    type="date"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleInputChange}
                                    name="fecha_limite"
                                    value={formularioValues.fecha_limite ?? ""}
                                    required={false}
                                    helperText="Dejar vacío si no tiene fecha límite"
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <SeccionTitulo>Documentación y detalle</SeccionTitulo>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Detalle"
                                    size="small"
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    placeholder="Información Adicional..."
                                    onChange={handleInputChange}
                                    name="detalle"
                                    value={formularioValues.detalle ?? ""}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, border: "1px dashed", borderColor: "divider", borderRadius: 2, height: "100%" }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Pliego (obligatorio)</Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                        <Button component="label" variant="outlined" size="small" startIcon={<UploadFileIcon />}>
                                            Seleccionar PDF
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                ref={fileInputRef}
                                                onChange={handleFileInputChange}
                                                required={true}
                                                hidden
                                            />
                                        </Button>
                                        <Typography variant="body2" color={archivo ? "text.primary" : "text.secondary"} noWrap sx={{ minWidth: 0 }}>
                                            {archivo ? archivo.name : "Ningún archivo seleccionado"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, height: "100%", display: "flex", alignItems: "center" }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formularioValues.habilita === 1}
                                                onChange={handleHabilitarChange}
                                                name="habilita"
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography variant="subtitle2">Habilitada</Typography>
                                            </Box>
                                        }
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </form>

                    <Divider sx={{ my: 3 }} />

                    <SeccionTitulo>Anexo (opcional)</SeccionTitulo>
                    <Box component="form" sx={{ p: 2, border: "1px dashed", borderColor: "divider", borderRadius: 2, bgcolor: "action.hover" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                            <Button component="label" variant="outlined" size="small" startIcon={<UploadFileIcon />}>
                                Seleccionar PDF
                                <input
                                    type="file"
                                    accept=".pdf"
                                    ref={anexoInputRef}
                                    onChange={handleFileInputChangeAnexo}
                                    required={false}
                                    hidden
                                />
                            </Button>
                            <Typography variant="body2" color={anexo ? "text.primary" : "text.secondary"} noWrap sx={{ flex: 1, minWidth: 120 }}>
                                {anexo ? anexo.name : "Ningún archivo seleccionado"}
                            </Typography>
                            <Button variant="contained" size="small" onClick={editarAnexo} disabled={buttonDisAnexo}>
                                Editar anexo
                            </Button>
                        </Box>
                    </Box>

                    {errores ? (
                        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                            <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                                {snackbarMensaje}
                            </Alert>
                        </Snackbar>
                    ) : <></>}
                </Box>

                {/* Pie */}
                <Box sx={{ px: 3, py: 2, display: "flex", justifyContent: "flex-end", gap: 1.5, borderTop: 1, borderColor: "divider", bgcolor: "background.default" }}>
                    <Button onClick={handleClose} variant="text" color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={() => editarContratacion(formularioValues)} variant="contained" startIcon={<SaveIcon />}>
                        Guardar cambios
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalContratacion;
