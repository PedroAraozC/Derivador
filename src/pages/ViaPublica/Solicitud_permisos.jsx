import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import Logo from "public/Logo_SMT_neg_4.png";
import SearchIcon from "@mui/icons-material/Search";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Box,
} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import { light } from "@mui/material/styles/createPalette";
import {
  comboMano,
  token_AUT_new,
  combopermiso,
  combopeso,
  grabarsolicitudcorreo,
} from "./Funciones_permisos";

function Solicitud_permisos() {
  const navigate = useNavigate();
  const directorio = import.meta.env.VITE_API_URL2;
  const [cuil, setCuil] = useState("");
  const [estadocuil, setEstadocuil] = useState(true);
  const [solicitante, setSolicitante] = useState("");
  const [id_persona, setId_persona] = useState("");
  const [estadosolicitante, setEstadosolicitante] = useState(true);
  const [email, setEmail] = useState("");
  const [estadoemail, setEstadoemail] = useState(true);
  const [telefono, setTelefono] = useState("");
  const [estadotelefono, setEstadotelefono] = useState(true);
  const [empresa, setEmpresa] = useState("");
  const [estadoempresa, setEstadoempresa] = useState(false);
  const [fpermiso, setFpermiso] = useState("");
  const [fsolicitud, setFsolicitud] = useState("");
  const [estadofpermiso, setEstadofpermiso] = useState(false);
  const [domicilio, setDomicilio] = useState("");
  const [estadodomicilio, setEstadodomicilio] = useState(false);
  const [id_peso, setId_peso] = useState("");
  const [peso, setPeso] = useState([]);
  const [id_mano, setId_mano] = useState("");
  const [mano, setMano] = useState([]);
  const [idtipopermiso, setIdtipopermiso] = useState("");
  const [tipopermiso, setTipopermiso] = useState([]);
  const [vehiculo, setVehiculo] = useState("");
  const [estadovehiculo, setEstadovehiculo] = useState(false);
  const [dominio, setDominio] = useState("");
  const [estadodominio, setEstadodominio] = useState(false);
  const [cant_operaciones, setCant_operaciones] = useState("");
  const [estadocantoperaciones, setEstadocantoperaciones] = useState(false);
  ////////////////////////////////////////
  const [leyepermiso, setLeyendapermiso] = useState("");
  const [leyepeso, setLeyendapeso] = useState("");
  const [leyemano, setLeyendamano] = useState("");

  ///trae datos usuarios ciudadano digital///
  useEffect(() => {
    token_AUT_new().then((data) => {
      console.log(data);
      if (data.message == "Invalid token") {
         localStorage.removeItem("token")
         navigate("/")
      }
      setSolicitante(
        data.usuarioSinContraseña.apellido_persona +
          ", " +
          data.usuarioSinContraseña.nombre_persona
      );
      setCuil(data.usuarioSinContraseña.documento_persona);
      setEmail(data.usuarioSinContraseña.email_persona);
      setTelefono(data.usuarioSinContraseña.telefono_persona);
      setId_persona(data.usuarioSinContraseña.id_persona);
    });
  }, []);
  ////////////////

  //////////////////////
  useEffect(() => {
    asignarFechaActual();
  }, []);
  ////////////////

  ///poner fecha del dia en campos fechas////
  const asignarFechaActual = () => {
    // Obtener la fecha actual
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, "0");
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const anio = hoy.getFullYear();
    const fechaActual = `${anio}-${mes}-${dia}`;
    setFpermiso(fechaActual);
    setFsolicitud(fechaActual);
  };
  /////////////////////////////////

  /////////////llena combo peso////////////////////////////
  useEffect(() => {
     combopeso(directorio).then((result) => {
      setPeso(result);
    });
    /* const data = {
      tarea: "llenacombopeso",
    };
    axios
      .post(`${directorio}permisos_1238.php`, JSON.stringify(data))
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setPeso(response.data);
        } else {
          setPeso([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      }); */

  }, []);
  /////////////////////////////

  /////////////llena combo mano////////////////////////////
  useEffect(() => {
    comboMano(directorio).then((result) => {
      setMano(result);
    });
  }, []);
  /////////////////////////////

  const mostrarCargando = () => {
    Swal.fire({
      title: "Procesando...",
      text: "Por favor espere",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // muestra el spinner
      },
      //timer: 2000, // se cierra en 2 segundos
      timerProgressBar: true,
    });
  };

  /////////////llena combo permiso////////////////////////////
  useEffect(() => {
    combopermiso(directorio).then((response) => {
      if (Array.isArray(response) && response.length > 0) {
        setTipopermiso(response);
      } else {
        setTipopermiso([]);
      }
    });
  }, []);

  ////grabar solicitud///
  const grabarsolicitud = () => {
    if (!fpermiso) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Por favor ingrese la fecha de permiso",
      });
      return;
    }
    if (!idtipopermiso) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debe seleecionar tipo de permiso",
      });
      return;
    }
    if (!empresa) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debe ingresar empresa",
      });
      return;
    }
    if (!domicilio) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debe ingresar domicilio",
      });
      return;
    }
    if (!vehiculo) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debe ingresar vehiculo",
      });
      return;
    }
    if (!dominio) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debe ingresar dominio",
      });
      return;
    }
    if (!cant_operaciones) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debe ingresar cantidad de operaciones",
      });
      return;
    }
    if (!id_peso) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debe seleccionar peso",
      });
      return;
    }
    if (!id_mano) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Debe seleccionar mano",
      });
      return;
    }
    const data = {
      tarea: "grabarsolicitudcorreo",
      fsolicitud: fsolicitud,
      id_persona: id_persona,
      fpermiso: fpermiso,
      id_permiso: idtipopermiso,
      empresa: empresa,
      domicilio: domicilio,
      vehiculo: vehiculo,
      dominio: dominio,
      cant_operaciones: cant_operaciones,
      id_peso: id_peso,
      id_mano: id_mano,
      leyepersona: solicitante,
      leyepermiso: leyepermiso,
      leyepeso: leyepeso,
      leyemano: leyemano,
      email: email,
      telefono: telefono,
    };
    mostrarCargando();
    grabarsolicitudcorreo(directorio, data)
      .then((result) => {
        Swal.close();
        if (result.estado == "ok") {
          Swal.fire({
            icon: "success",
            title: "¡Atención!",
            text: result.mensaje,
          });
          return;
          limpiarcampos();
        } else {
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: result.mensaje,
          });
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  ///////////////////////

  ///limpiar campos///
  function limpiarcampos() {
    setEmpresa("");
    setDomicilio("");
    setVehiculo("");
    setDominio("");
    setCant_operaciones("");
    setIdtipopermiso("");
    setId_peso("");
    setId_mano("");
  }
  ////////////////////////////////////

  return (
    <>
     {/*  <Grid
        container
        alignItems="center"
        style={{ backgroundColor: "#1A76D2", height: "70px" }} // altura fija
      >
        <Grid item sx={{ pl: 2 }}>
          <img
            src="/Logo_SMT_neg_4.png"
            alt="Logo SMT"
            style={{ height: "50px" }}
          />
        </Grid>
      </Grid> */}

      <Card sx={{ boxShadow: "none", border: "none", mt: 3, mx: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                  backgroundColor: "#1665C0",
                  padding: "8px 16px",
                  color: "white",
                }}
              >
                Solicitud de Permiso
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                value={fsolicitud}
                onChange={(e) => {
                  setFsolicitud(e.target.value);
                }}
                required
                label="Fecha"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{ mt: 1 }} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                required
                disabled={estadocuil}
                label="Cuil/Cuit"
                value={cuil}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (/^\d{0,11}$/.test(valor)) {
                    setCuil(valor);
                  }
                }}
                inputProps={{ maxLength: 11 }}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <TextField
                disabled={estadosolicitante}
                value={solicitante}
                label="Solicitante"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                disabled={estadoemail}
                label="Email"
                type="email"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                disabled={estadotelefono}
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value);
                }}
                label="Teléfono"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            {/* <Grid
              item
              xs={12}
              sm={6}
              md={1}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={() => validarsolicitante()}
              >
                <SearchIcon />
              </Button>
            </Grid> */}
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}></Grid>
          {/* divider horizontal */}
          <Grid sx={{ mt: 2 }}>
            <Divider />
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Columna izquierda */}
            <Grid item xs={12} md={8}>
              <Grid
                container
                spacing={2}
                sx={{ justifyContent: "space-between" }}
              >
                <Grid item xs={12} md={4}>
                  <TextField
                    type="date"
                    disabled={estadofpermiso}
                    value={fpermiso}
                    label="Fecha Permiso"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="label-tipopermiso" shrink>
                      Tipo Permiso
                    </InputLabel>
                    <Select
                      labelId="label-tipopermiso"
                      value={idtipopermiso}
                      label="Tipo Permiso"
                      displayEmpty
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setIdtipopermiso(selectedId);
                        const selectedItem = tipopermiso.find(
                          (item) => item.id_permiso === selectedId
                        );
                        setLeyendapermiso(selectedItem.permiso);
                      }}
                    >
                      <MenuItem value="">Seleccione</MenuItem>
                      {tipopermiso.map((item) => (
                        <MenuItem key={item.id_permiso} value={item.id_permiso}>
                          {item.permiso}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    disabled={estadoempresa}
                    value={empresa}
                    onChange={(e) => {
                      setEmpresa(e.target.value);
                    }}
                    label="Empresa"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    disabled={estadodomicilio}
                    value={domicilio}
                    onChange={(e) => setDomicilio(e.target.value)}
                    label="Domicilio"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    disabled={estadovehiculo}
                    value={vehiculo}
                    onChange={(e) => setVehiculo(e.target.value)}
                    label="Vehiculo"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    disabled={estadodominio}
                    value={dominio}
                    onChange={(e) => {
                      const valor = e.target.value.toUpperCase(); // Convertimos a mayúsculas
                      if (valor.length <= 7) {
                        setDominio(valor); // Solo actualiza si es <= 7 caracteres
                      }
                    }}
                    label="Dominio"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    disabled={estadocantoperaciones}
                    value={cant_operaciones}
                    onChange={(e) => {
                      const valor = e.target.value;
                      // Solo permite números con máximo 3 dígitos
                      if (/^\d{0,3}$/.test(valor)) {
                        setCant_operaciones(valor);
                      }
                    }}
                    label="Cant. Operaciones"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="label-peso" shrink>
                      Peso
                    </InputLabel>
                    <Select
                      labelId="label-peso"
                      value={id_peso}
                      label="Peso"
                      displayEmpty
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setId_peso(selectedId);
                        const selectedItem = peso.find(
                          (item) => item.id_peso === selectedId
                        );
                        setLeyendapeso(selectedItem.tpeso);
                      }}
                    >
                      <MenuItem value="">Seleccione</MenuItem>
                      {peso.map((item) => (
                        <MenuItem key={item.id_peso} value={item.id_peso}>
                          {item.tpeso}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="label-mano" shrink>
                      Mano
                    </InputLabel>
                    <Select
                      labelId="label-mano"
                      value={id_mano}
                      label="Mano"
                      displayEmpty
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setId_mano(selectedId);
                        const selectedItem = mano.find(
                          (item) => item.id_mano === selectedId
                        );
                        setLeyendamano(selectedItem.mano);
                      }}
                    >
                      <MenuItem value="">Seleccione</MenuItem>
                      {mano.map((item) => (
                        <MenuItem key={item.id_mano} value={item.id_mano}>
                          {item.mano}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            {/* Divider vertical */}
            <Grid
              item
              md={1}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Divider orientation="vertical" flexItem />
            </Grid>
            {/* Columna derecha */}
          </Grid>
        </CardContent>
        <CardActions>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} width="100%">
              <Button
                onClick={() => grabarsolicitud()}
                variant="contained"
                size="small"
                color="primary"
              >
                <CheckIcon />
                Solicitar
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#D3D3D3",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#757575",
                  },
                }}
                onClick={() => {
                  limpiarcampos();
                  navigate("/");
                }}
              >
                <ClearIcon />
                Volver
              </Button>
            </Box>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
}

export default Solicitud_permisos;
