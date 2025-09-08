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
import Swal from "sweetalert2";
import { useRef } from "react";

const GasATuCasa = () => {
  const { user } = useStore();
  const [button, setButton] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const navigate = useNavigate(); // 👈 inicializar navigate
  const [formDisabled, setFormDisabled] = useState(false);

  const inputRefs = {
    redGasVereda: useRef(null),
    localidad: useRef(null),
    barrio: useRef(null),
    nombre: useRef(null),
    apellido: useRef(null),
    dni: useRef(null),
    telefono: useRef(null),
    correo: useRef(null),
    calle: useRef(null),
    numero_sec: useRef(null),
    piso_mz: useRef(null),
    depto_casa: useRef(null),
    codigo_postal: useRef(null),
    entreCalles: useRef(null),
    cantidadPersonas: useRef(null),
    comentarios: useRef(null),
  };

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

  const existeUsuario = async () => {
    try {
      if (!user || !user.documento_persona) {
        console.warn("No hay DNI definido");
        return false;
      }
      const response = await axios.get(
        `/gas/existeUsuarioGas/${user.documento_persona}`
      );
      // console.log(response.data.existe);
      return response.data.existe;
    } catch (error) {
      console.error("Error al verificar el usuario:", error);
      return false;
    }
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

  const validateForm = async () => {
    let newErrors = {};

    // 1. Validar que redGasVereda esté seleccionado
    if (!form.redGasVereda || form.redGasVereda.trim() === "") {
      newErrors.redGasVereda = "Debe seleccionar una opción";

      await Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Debe seleccionar si la red de gas pasa por su vereda.",
        showConfirmButton: false,
        timer: 3000,
        confirmButtonColor: "#1976d2",
      });

      setTimeout(() => {
        if (inputRefs.redGasVereda?.current) {
          inputRefs.redGasVereda.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);

      setErrors(newErrors);
      return false;
    }

    // 2. Validar si redGasVereda es "No"
    if (form.redGasVereda === "No") {
      newErrors.redGasVereda = "La red de gas debe pasar por su vereda";

      await Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Si la red de gas no pasa por su vereda, en este momento no podemos realizar la conexión.",
        showConfirmButton: false,
        timer: 3000,
        confirmButtonColor: "#1976d2",
      });

      setTimeout(() => {
        if (inputRefs.redGasVereda?.current) {
          inputRefs.redGasVereda.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);

      setErrors(newErrors);
      return false;
    }

    // 3. Validar localidad (tanto si no está seleccionada como si no es la 2)
    if (
      !form.localidad ||
      form.localidad === "" ||
      parseInt(form.localidad) !== 2
    ) {
      newErrors.localidad = "Debe ser ciudadano de San Miguel de Tucumán";

      await Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "El beneficio solo está disponible para ciudadanos de Capital, San Miguel de Tucumán.",
        showConfirmButton: false,
        timer: 3000,
        confirmButtonColor: "#1976d2",
      });

      setTimeout(() => {
        if (inputRefs.localidad?.current) {
          const element = inputRefs.localidad.current;
          const scrollTarget =
            element.querySelector?.("input") ||
            element.querySelector?.('[role="combobox"]') ||
            element.querySelector?.(".MuiSelect-select") ||
            element;

          if (
            scrollTarget &&
            typeof scrollTarget.scrollIntoView === "function"
          ) {
            scrollTarget.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }, 500);

      setErrors(newErrors);
      return false;
    }

    // Resto de validaciones de campos requeridos...
    requiredFields.forEach((field) => {
      if (!isFieldDisabled(field)) {
        if (!form[field] || form[field].toString().trim() === "") {
          newErrors[field] = "Campo requerido";
        }
      }
    });

    // Validaciones específicas
    if (
      !isFieldDisabled("correo") &&
      form.correo &&
      !validateCorreo(form.correo)
    ) {
      newErrors.correo = "Correo inválido";
    }
    if (!isFieldDisabled("dni") && !/^\d+$/.test(form.dni)) {
      newErrors.dni = "El CUIL debe contener solo números";
    }
    if (!isFieldDisabled("dni") && form.dni.length > 12) {
      newErrors.dni = "Máximo 12 dígitos";
    }
    if (
      !isFieldDisabled("telefono") &&
      form.telefono &&
      form.telefono.length > 12
    ) {
      newErrors.telefono = "Máximo 12 caracteres";
    }
    if (!isFieldDisabled("telefono") && !/^\d+$/.test(form.telefono)) {
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

    // Evitar actualizar errores de campos deshabilitados
    if (
      isFieldDisabled(name) &&
      name !== "localidad" &&
      name !== "redGasVereda"
    ) {
      return;
    }

    if (name === "dni" || name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "");
      if (soloNumeros.length <= 12) {
        setForm({ ...form, [name]: soloNumeros });
        setErrors({ ...errors, [name]: "" }); // ✅ limpiar error si es válido
      }
      return;
    }

    if (name === "localidad") {
      // Mostrar alert inmediatamente si no es la localidad 2
      if (value && parseInt(value) !== 2) {
        // console.log(value, "value localidad !== 2");
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "El beneficio solo está disponible para ciudadanos de Capital, San Miguel de Tucumán.",
          showConfirmButton: false,
          timer: 3000,
          confirmButtonColor: "#1976d2",
        });
        setFormDisabled(true);
      } else if (value && parseInt(value) === 2) {
        // console.log(value, "value localidad == 2");
        setFormDisabled(false);
      }
    }

    // console.log(value, "value ");
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      if (name === "correo" && validateCorreo(value)) {
        setErrors({ ...errors, correo: "" });
      } else if (value.trim() !== "") {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const isFieldDisabled = (field) => {
    if (formDisabled) return true;
    if (
      [
        "calle",
        "numero_sec",
        "piso_mz",
        "depto_casa",
        "codigo_postal",
        "entreCalles",
        "cantidadPersonas",
      ].includes(field) &&
      form.localidad != 2
    ) {
      return true;
    }
    if (["nombre", "apellido", "dni", "telefono", "correo"].includes(field)) {
      return true; // siempre bloqueados si ya vienen del usuario
    }
    return false;
  };

  const handleRadioChange = async (e) => {
    const { name, value } = e.target;

    if (
      isFieldDisabled(name) &&
      name !== "redGasVereda" &&
      name !== "localidad"
    ) {
      return;
    }
    if (name === "redGasVereda") {
      if (value === "No") {
        await Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "Si la red de gas no pasa por su vereda, en este momento no podemos realizar la conexión.",
          showConfirmButton: false,
          timer: 3000,
          confirmButtonColor: "#1976d2",
        });

        if (inputRefs.redGasVereda?.current) {
          inputRefs.redGasVereda.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        setFormDisabled(true);
      } else if (value === "Sí" || value === "No sé") {
        setFormDisabled(false);
      }
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButton(true);

    try {
      const isValid = await validateForm();
      if (!isValid) {
        // Find the first field with error
        const firstErrorField = Object.keys(errors)[0];

        if (firstErrorField && inputRefs[firstErrorField]?.current) {
          setTimeout(() => {
            const element = inputRefs[firstErrorField].current;

            // Handle different types of MUI components
            let scrollTarget;

            if (firstErrorField === "redGasVereda") {
              // For RadioGroup, scroll to the FormControl container
              scrollTarget =
                element.closest?.(".MuiFormControl-root") || element;
            } else if (
              firstErrorField === "localidad" ||
              firstErrorField === "barrio"
            ) {
              // For Select fields
              scrollTarget =
                element.querySelector?.("input") ||
                element.querySelector?.('[role="combobox"]') ||
                element.querySelector?.(".MuiSelect-select") ||
                element;
            } else if (firstErrorField === "comentarios") {
              // For TextareaAutosize, it's already a DOM element
              scrollTarget = element;
            } else {
              // For regular TextFields
              scrollTarget =
                element.querySelector?.("input") ||
                element.querySelector?.("textarea") ||
                element;
            }

            if (
              scrollTarget &&
              typeof scrollTarget.scrollIntoView === "function"
            ) {
              scrollTarget.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });

              // Try to focus the element if it supports focus
              if (typeof scrollTarget.focus === "function") {
                scrollTarget.focus();
              }
            }
          }, 500);
        }

        setButton(false);
        return;
      }

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
      setButton(false);
    }
  };

  useEffect(() => {
    const verificarUsuario = async () => {
      if (user) {
        const existe = await existeUsuario();
        if (existe) {
          setFormDisabled(true);

          Swal.fire({
            icon: "info",
            title: "Ya estás registrado",
            text: "Tus datos ya se encuentran cargados en el sistema.",
            showConfirmButton: false,
            timer: 2500, // se cierra solo en 2.5s
          });

          setTimeout(() => {
            navigate("/home");
          }, 2600); // redirige apenas cierra el alert
        } else {
          // si no existe, cargo los datos del usuario en el formulario
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
      }
    };

    verificarUsuario();
  }, [user, navigate]);

  useEffect(() => {
    obtenerLocalidades();
    obtenerBarrios();
  }, []);

  return (
    <div className="gasATuCasa">
      <Link
        style={{
          textDecoration: "none",
          padding: 15,
          width: "fit-content",
        }}
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
            <Paper
              sx={{
                p: 2,
                pt: 0,
                borderRadius: 1,
                border: "0px solid #0000003d",
                boxShadow: "none",
              }}
            >
              <FormControl error={!!errors.redGasVereda} sx={{ width: "100%" }}>
                <FormLabel sx={{ mb: 1 }}>
                  ¿La red de gas pasa por su vereda?{" "}
                  <strong style={{ fontWeight: "800" }}>
                    Requisito excluyente
                  </strong>
                </FormLabel>
                <RadioGroup
                  name="redGasVereda"
                  value={form.redGasVereda}
                  onChange={handleRadioChange}
                  sx={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                    gap: 2,
                  }}
                  required
                  error={!formDisabled && !!errors.redGasVereda}
                  ref={inputRefs.redGasVereda}
                  // //helperText={errors.redGasVereda}
                >
                  <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                  <FormControlLabel
                    value="No sé"
                    control={<Radio />}
                    label="No sé"
                  />
                </RadioGroup>
                {/* {errors.redGasVereda && (
                  <Form//helperText>{errors.redGasVereda}</Form//helperText>
                )} */}
              </FormControl>
            </Paper>

            <TextField
              select
              label="Localidad"
              name="localidad"
              value={form.localidad}
              onChange={handleChange}
              required
              error={formDisabled && !!errors.localidad}
              inputRef={inputRefs.localidad}
              // //helperText={errors.localidad}
              sx={{ textAlign: "left" }}
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
              error={!formDisabled && !!errors.barrio}
              // //helperText={errors.barrio}
              sx={{ textAlign: "left" }}
              disabled={formDisabled}
              inputRef={inputRefs.barrio}
            >
              {barrios?.map((bar) => (
                <MenuItem key={bar.id_barrio} value={bar.id_barrio}>
                  {bar.nombre_barrio}
                </MenuItem>
              ))}
            </TextField>
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
                error={!formDisabled && !!errors.nombre}
                //helperText={errors.nombre}
                disabled={true}
                inputRef={inputRefs.nombre}
              />
              <TextField
                label="Apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                sx={{ width: "100%" }}
                error={!formDisabled && !!errors.apellido}
                //helperText={errors.apellido}
                disabled={true}
                inputRef={inputRefs.apellido}
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
              error={!formDisabled && !!errors.dni}
              //helperText={errors.dni}
              disabled={true}
              inputRef={inputRefs.dni}
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
              error={!formDisabled && !!errors.telefono}
              //helperText={errors.telefono}
              disabled={true}
              inputRef={inputRefs.telefono}
            />
            <TextField
              label="Correo electrónico"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              error={!formDisabled && !!errors.correo}
              //helperText={errors.correo}
              disabled={true}
              inputRef={inputRefs.correo}
            />

            <TextField
              label="Calle"
              name="calle"
              value={form.calle}
              onChange={handleChange}
              required
              error={!formDisabled && !!errors.calle}
              //helperText={errors.calle}
              disabled={formDisabled || form.localidad != 2}
              inputRef={inputRefs.calle}
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
                error={!formDisabled && !!errors.numero_sec}
                //helperText={errors.numero_sec}
                disabled={formDisabled || form.localidad != 2}
                inputRef={inputRefs.numero_sec}
              />

              <TextField
                label="Piso/Lote/Manzana"
                name="piso_mz"
                value={form.piso_mz}
                onChange={handleChange}
                sx={{ width: "100%" }}
                disabled={formDisabled || form.localidad != 2}
                inputRef={inputRefs.piso_mz}
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
                disabled={formDisabled || form.localidad != 2}
                inputRef={inputRefs.depto_casa}
              />

              <TextField
                label="Código postal"
                name="codigo_postal"
                value={form.codigo_postal}
                onChange={handleChange}
                sx={{ width: "100%" }}
                disabled={formDisabled || form.localidad != 2}
                inputRef={inputRefs.codigo_postal}
              />
            </div>
            <TextField
              label="Entre que calles se encuentra - Observaciones"
              name="entreCalles"
              value={form.entreCalles}
              onChange={handleChange}
              required
              error={!formDisabled && !!errors.entreCalles}
              //helperText={errors.entreCalles}
              disabled={formDisabled || form.localidad != 2}
              inputRef={inputRefs.entreCalles}
            />

            <TextField
              label="¿Cuántas personas viven en su domicilio?"
              name="cantidadPersonas"
              value={form.cantidadPersonas}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: 1 }}
              error={!formDisabled && !!errors.cantidadPersonas}
              //helperText={errors.cantidadPersonas}
              disabled={formDisabled || form.localidad != 2}
              inputRef={inputRefs.cantidadPersonas}
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
              disabled={formDisabled || form.localidad != 2}
              inputRef={inputRefs.comentarios}
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
