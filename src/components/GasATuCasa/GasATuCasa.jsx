import {
  TextField,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Box,
  Paper,
  MenuItem,
  FormControl,
  FormHelperText,
  TextareaAutosize,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./GasATuCasa.css";
import axios from "../../config/axios";
import useStore from "../../Zustand/Zustand";
import { ArrowBack } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom"; // 👈 agregar useNavigate

const GasATuCasa = () => {
  const { user } = useStore();
  const [button, setButton] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const navigate = useNavigate(); // 👈 inicializar navigate
  const [formDisabled, setFormDisabled] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    correo: "",
    entreCalles: "",
    barrio: "",
    localidad: "",
    redGasVereda: "",
    cantidadPersonas: "",
    comentarios: "",
    calle: "",
    numero_sec: "",
    piso_mz: "",
    depto_casa: "",
    codigo_postal: "",
  });

  const [errors, setErrors] = useState([]);

  const [localidades, setLocalidades] = useState([]);
  const [barrios, setBarrios] = useState([]);

  const validateCorreo = (value) => {
    // Validación básica de correo
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const requiredFields = [
    "nombre",
    "apellido",
    "dni",
    "telefono",
    "correo",
    "localidad",
    "barrio",
    "calle",
    "numero_sec",
    "entreCalles",
    "redGasVereda",
    "cantidadPersonas",
  ];
  const validateForm = () => {
    let newErrors = {};

    requiredFields.forEach((field) => {
      if (!form[field] || form[field].toString().trim() === "") {
        newErrors[field] = "Campo requerido";
      }
    });

    // Validaciones específicas
    if (form.correo && !validateCorreo(form.correo)) {
      newErrors.correo = "Correo inválido";
    }
    if (!/^\d+$/.test(form.dni)) {
      newErrors.dni = "El CUIL debe contener solo números";
    }
    if (form.dni.length > 12) {
      newErrors.dni = "Máximo 12 dígitos";
    }
    if (form.telefono && form.telefono.length > 12) {
      newErrors.telefono = "Máximo 12 caracteres";
    }
    if (!/^\d+$/.test(form.telefono)) {
      newErrors.telefono = "El Teléfono debe contener solo números";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const obtenerLocalidades = async () => {
    try {
      const response = await axios.get("/gas/localidades");
      const data = await response.data.localidades;
      setLocalidades(data || []);
    } catch (error) {
      console.error("Error al obtener las localidades:", error);
    }
  };

  const obtenerBarrios = async () => {
    try {
      const response = await axios.get("/gas/barrios");
      const data = await response.data.barrios;
      setBarrios(data || []);
    } catch (error) {
      console.error("Error al obtener los barrios:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dni" || name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "");
      if (soloNumeros.length <= 12) {
        setForm({ ...form, [name]: soloNumeros });
      }
      return;
    }

    setForm({ ...form, [name]: value });

    if (name === "correo") {
      setErrors({
        ...errors,
        correo: validateCorreo(value) ? "" : "Correo inválido",
      });
    }
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    setButton(true);
    try {
      e.preventDefault();
      if (!validateForm()) return;

      await axios.post("/gas/altaPersonaGas", { form });

      setSnackbarMensaje("¡Formulario enviado con éxito!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setForm({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        correo: "",
        entreCalles: "",
        barrio: "",
        localidad: "",
        redGasVereda: "",
        cantidadPersonas: "",
        comentarios: "",
        calle: "",
        numero_sec: "",
        piso_mz: "",
        depto_casa: "",
        codigo_postal: "",
      });

      setFormDisabled(true); // 👈 bloquea campos

      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setSnackbarMensaje("Error al enviar el formulario. Intente nuevamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setButton(false);
    }
  };

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nombre: user.nombre_persona || "",
        apellido: user.apellido_persona || "",
        dni: user.documento_persona || "",
        telefono: user.telefono_persona || "",
        correo: user.email_persona || "",
        calle: user.domicilio_persona || "",
        numero_sec: user.numero_sec || "",
        piso_mz: user.piso_mz || "",
        depto_casa: user.depto_casa || "",
        codigo_postal: user.codigo_postal || "",
        entreCalles: user?.entreCalles || "",
        barrio: user.id_barrio || "",
        localidad: user.id_localidad || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    obtenerLocalidades();
    obtenerBarrios();
  }, []);

  return (
    <div className="gasATuCasa">
      <Link
        style={{ textDecoration: "none", padding: 15, width: "fit-content" }}
        to="/home"
      >
        <ArrowBack /> VOLVER
      </Link>
      <div className="maintenance-container">
        <div className="maintenance-content">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 4,
              mb: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            <h1>El Gas llega a tu casa</h1>
            <p style={{ textAlign: "justify" }}>
              <strong>
                El proyecto <em>"EL GAS LLEGA A TU CASA"</em>
              </strong>{" "}
              tiene como objetivo facilitar la instalación de gas natural dentro
              de los domicilios (<strong>intralote</strong>).
              <br />
              Para poder acceder al servicio, la red de distribución de gas debe
              pasar por la vereda de la vivienda. La intervención incluye la
              instalación interna completa y la colocación del medidor.
            </p>

            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                sx={{ width: "100%" }}
                error={!!errors.nombre}
                helperText={errors.nombre}
                disabled={formDisabled}
              />
              <TextField
                label="Apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                sx={{ width: "100%" }}
                error={!!errors.apellido}
                helperText={errors.apellido}
                disabled={formDisabled}
              />
            </div>
            <TextField
              label="CUIL"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              required
              inputProps={{
                maxLength: 12,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              error={!!errors.dni}
              helperText={errors.dni}
              disabled={formDisabled}
            />
            <TextField
              label="Teléfono"
              name="telefono"
              inputProps={{
                maxLength: 12,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              value={form.telefono}
              onChange={handleChange}
              required
              error={!!errors.telefono}
              helperText={errors.telefono}
              disabled={formDisabled}
            />
            <TextField
              label="Correo electrónico"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              error={!!errors.correo}
              helperText={errors.correo}
              disabled={formDisabled}
            />
            <TextField
              select
              label="Localidad"
              name="localidad"
              value={form.localidad}
              onChange={handleChange}
              required
              error={!!errors.localidad}
              helperText={errors.localidad}
              sx={{ textAlign: "left" }}
              disabled={formDisabled}
            >
              {localidades?.map((loc) => (
                <MenuItem key={loc.id_localidad} value={loc.id_localidad}>
                  {loc.nombre_localidad}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Barrio"
              name="barrio"
              value={form.barrio}
              onChange={handleChange}
              required
              error={!!errors.barrio}
              helperText={errors.barrio}
              sx={{ textAlign: "left" }}
              disabled={formDisabled}
            >
              {barrios?.map((bar) => (
                <MenuItem key={bar.id_barrio} value={bar.id_barrio}>
                  {bar.nombre_barrio}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Calle"
              name="calle"
              value={form.calle}
              onChange={handleChange}
              required
              error={!!errors.calle}
              disabled={formDisabled}
              helperText={errors.calle}
            />

            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="Nro/Sector"
                name="numero_sec"
                value={form.numero_sec}
                onChange={handleChange}
                required
                sx={{ width: "100%" }}
                error={!!errors.numero_sec}
                helperText={errors.numero_sec}
                disabled={formDisabled}
              />

              <TextField
                label="Piso/Lote/Manzana"
                name="piso_mz"
                value={form.piso_mz}
                onChange={handleChange}
                sx={{ width: "100%" }}
                disabled={formDisabled}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="Depto/Casa"
                name="depto_casa"
                value={form.depto_casa}
                onChange={handleChange}
                sx={{ width: "100%" }}
                disabled={formDisabled}
              />

              <TextField
                label="Código postal"
                name="codigo_postal"
                value={form.codigo_postal}
                onChange={handleChange}
                sx={{ width: "100%" }}
                disabled={formDisabled}
              />
            </div>
            <TextField
              label="Entre que calles se encuentra - Observaciones"
              name="entreCalles"
              value={form.entreCalles}
              onChange={handleChange}
              required
              error={!!errors.entreCalles}
              helperText={errors.entreCalles}
              disabled={formDisabled}
            />
            <Paper
              sx={{
                p: 2,
                borderRadius: 1,
                border: "1px solid #0000003d",
                boxShadow: "none",
              }}
            >
              <FormControl error={!!errors.redGasVereda} sx={{ width: "100%" }}>
                <FormLabel sx={{ mb: 1 }}>
                  ¿La red de gas pasa por su vereda? (requisito excluyente)
                </FormLabel>
                <RadioGroup
                  name="redGasVereda"
                  value={form.redGasVereda}
                  onChange={handleRadioChange}
                  sx={{ flexDirection: "column" }}
                  required
                  error={!!errors.redGasVereda}
                  helperText={errors.redGasVereda}
                  disabled={formDisabled}
                >
                  <FormControlLabel
                    value="Sí"
                    control={<Radio />}
                    label="Sí"
                    disabled={formDisabled}
                  />
                  <FormControlLabel
                    value="No"
                    control={<Radio />}
                    label="No"
                    disabled={formDisabled}
                  />
                  <FormControlLabel
                    value="No sé"
                    control={<Radio />}
                    label="No sé"
                    disabled={formDisabled}
                  />
                </RadioGroup>
                {/* {errors.redGasVereda && (
                  <FormHelperText>{errors.redGasVereda}</FormHelperText>
                )} */}
              </FormControl>
            </Paper>
            <TextField
              label="¿Cuántas personas viven en su domicilio?"
              name="cantidadPersonas"
              value={form.cantidadPersonas}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: 1 }}
              error={!!errors.cantidadPersonas}
              helperText={errors.cantidadPersonas}
              disabled={formDisabled}
            />
            <TextareaAutosize
              minRows={4}
              maxRows={6}
              placeholder="Comentarios adicionales"
              name="comentarios"
              value={form.comentarios}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "1rem",
                borderRadius: "8px",
                color: "rgba(0, 0, 0, 0.87)",
                border: "1px solid #c4c4c4",
                outline: "none",
                resize: "none",
              }}
              onFocus={(e) => (e.target.style.border = "2px solid #1976d2")}
              onBlur={(e) => (e.target.style.border = "1px solid #c4c4c4")}
              disabled={formDisabled}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={button}
              color="primary"
              className="submit-button"
            >
              Enviar
            </Button>
          </Box>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={600000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMensaje}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GasATuCasa;
