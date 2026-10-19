import { Alert, Box, Button, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Snackbar, Stack, Switch, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ListAltIcon from "@mui/icons-material/ListAlt";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useState, useEffect, useRef } from "react";
import useStore from "../../../Zustand/Zustand";
import axios from "../../../config/axiosLicitaciones";
import TablaContratacion from "./TablaContratacion";
import EncabezadoPagina from "../../../common/EncabezadoPagina";

const PanelContratacion = () => {
  const [addContratacion, setAddContratacion] = useState(false);
  const { obtenerInstrumentos, obtenerTiposContratacion, tiposContratacion, instrumentosC,} = useStore();
  const [archivo, setArchivo] = useState(null);
  const [anexo, setAnexo] = useState(null);
  const [formularioValues, setFormularioValues] = useState({});
  const [snackbarMensaje, setSnackbarMensaje] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [buttonDis, setButtonDis] = useState(false);
  const [buttonDisAnexo, setButtonDisAnexo] = useState(false);
  const [llevaAnexo, setLlevaAnexo] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputRefAnexo = useRef(null);
  const [errores, setErrores] = useState({});
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

// Función para validar el formulario antes de enviarlo
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
    const file = fileInputRefAnexo.current.files[0];
    setAnexo(file); // Asignar el archivo al estado
  };

  const handleAgregar = async (event, contratacion) => {
    event.preventDefault();
    const formularioValido = validarFormulario();
    setButtonDis(true)
    if (formularioValido) {
      try {
        contratacion.archivo = archivo;
        console.log(contratacion)
        // Realiza la solicitud con formData
        const response = await axios.post("/admin/agregarContratacion", contratacion, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
        setSnackbarMensaje("Contratación creada.");
        setSnackbarOpen(true);
        setLlevaAnexo(true)
        return response.data;
      } catch (error) {
        console.error("Error al agregar la contratacion:", error);
        setSnackbarMensaje("Error al agregar la contratacion.");
        setSnackbarOpen(true);
        throw new Error("Error al agregar la contratacion");
      }
    } else {
      setSnackbarMensaje("Por favor, corrige los errores en el formulario.");
      setSnackbarOpen(true);
      setButtonDis(false)
    }
  };

  const subirAnexo = async(e) =>{
    e.preventDefault()
    const formData = new FormData();
    formData.append('anexo', anexo);

    // Agregar num_instrumento y expte como parámetros de consulta
    const url = `/admin/agregarAnexo?num_instrumento=${formularioValues.num_instrumento}&expte=${formularioValues.expte}`;

    const config = {headers: {'Content-Type': 'multipart/form-data'}}
    setButtonDisAnexo(true);

    try{
      const data = await axios.post(url, formData, config)
      console.log(data);
      setSnackbarMensaje("Anexo agregado.");
      setSnackbarOpen(true);
    } catch(err) {
      console.log(err);
    }
}

  const cancelarContratacion = () =>{
    setAddContratacion(!addContratacion)
    setFormularioValues({})
    setButtonDis(false)
    setLlevaAnexo(false)
    setButtonDisAnexo(false);
    setArchivo(null);
    setAnexo(null);
  }

  useEffect(() => {
    obtenerTiposContratacion();
    obtenerInstrumentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react/prop-types
  const SeccionTitulo = ({ children }) => (
    <Typography variant="overline" sx={{ display: "block", color: "text.secondary", fontWeight: 600, letterSpacing: 1, mb: 1.5 }}>
      {children}
    </Typography>
  );

  return (
    <>
      <div className="container">
        <EncabezadoPagina
          sup="Configuración"
          titulo="Panel de Contrataciones"
          subtitulo="Alta, edición y publicación de licitaciones y contrataciones."
          acciones={
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
              <Button
                variant={addContratacion ? "outlined" : "contained"}
                color={addContratacion ? "error" : "primary"}
                startIcon={addContratacion ? <CloseIcon /> : <AddIcon />}
                onClick={cancelarContratacion}
              >
                {addContratacion ? "Cancelar" : "Agregar Contratación"}
              </Button>
              <Button variant="outlined" startIcon={<ListAltIcon />} onClick={() => setAddContratacion(false)}>
                Listar Contrataciones
              </Button>
            </Stack>
          }
        />

        {addContratacion ? (
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, maxWidth: 960, mx: "auto", mb: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Nueva contratación</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Completá los datos y adjuntá el pliego en PDF. Los campos marcados con * son obligatorios.
            </Typography>

            <form onSubmit={(event) => handleAgregar(event, formularioValues)} encType="multipart/form-data">
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
                    label="Valor Pliego"
                    size="small"
                    fullWidth
                    placeholder="Ej: 100000.00"
                    InputLabelProps={{ shrink: true }}
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
                    helperText="Dejar vacío si la contratación no tiene fecha límite"
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
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Pliego</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                      <Button component="label" variant="outlined" size="small" startIcon={<UploadFileIcon />}>
                        Seleccionar PDF
                        <input
                          type="file"
                          accept=".pdf"
                          ref={fileInputRef}
                          onChange={handleFileInputChange}
                          required={false}
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
                      label={<Typography variant="subtitle2">Habilitada</Typography>}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button variant="contained" color="success" type="submit" disabled={buttonDis} startIcon={<AddIcon />}>
                  Agregar
                </Button>
              </Box>
            </form>

            {llevaAnexo ? (
              <>
                <Divider sx={{ my: 3 }} />
                <SeccionTitulo>Anexo (opcional)</SeccionTitulo>
                <Box component="form" sx={{ p: 2, border: "1px dashed", borderColor: "divider", borderRadius: 2, bgcolor: "action.hover" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Button component="label" variant="outlined" size="small" startIcon={<UploadFileIcon />}>
                      Seleccionar PDF
                      <input
                        type="file"
                        accept=".pdf"
                        ref={fileInputRefAnexo}
                        onChange={handleFileInputChangeAnexo}
                        required={false}
                        hidden
                      />
                    </Button>
                    <Typography variant="body2" color={anexo ? "text.primary" : "text.secondary"} noWrap sx={{ flex: 1, minWidth: 120 }}>
                      {anexo ? anexo.name : "Ningún archivo seleccionado"}
                    </Typography>
                    <Button variant="contained" size="small" onClick={subirAnexo} disabled={buttonDisAnexo}>
                      Subir Anexo
                    </Button>
                  </Box>
                </Box>
              </>
            ) : <></>}

            {errores ? (
              <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                  {snackbarMensaje}
                </Alert>
              </Snackbar>
            ) : <></>}
          </Paper>
        ) : (
          <></>
        )}
      </div>
      <div className="mb-5">
        {!addContratacion &&  <>
          <TablaContratacion/>
        </> }
      </div>
    </>
  );
};

export default PanelContratacion;
