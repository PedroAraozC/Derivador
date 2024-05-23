/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import {
  Modal,
  Box,
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { formatearFechaHora } from "../../../../helpers/convertirFecha";
import "./Convocatorias.css";
import { EducaContext } from "../../../../context/EducaContext";
import axios from "../../../../config/axios";

const ModalConvocatoria = ({
  convocatoria,
  modalAbierto,
  handleClose,
  modoEdicion,
  idNivel,
}) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const fileInputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);
  const [formularioValues, setFormularioValues] = useState({
    id: "",
    nivel: "",
    cargo: "",
    establecimiento: "",
    causal: "",
    expte: "",
    caracter: "",
    fecha: "",
    hora: "",
    archivo: "",
    habilita: 0,
  });
  const [datosOld, setDatosOld] = useState("");
  console.log(datosOld);
  const {
    arrayNiveles,
    obtenerNiveles,
    arrayEstablecimientos,
    obtenerEstablecimientos,
    obtenerCausal,
    arrayCausal,
    obtenerCaracter,
    arrayCaracter,
    obtenerConvocatorias,
  } = useContext(EducaContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await obtenerNiveles();
        await obtenerEstablecimientos();
        await obtenerCausal();
        await obtenerCaracter();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modoEdicion]);

  useEffect(() => {
    if (convocatoria) {
      // Si hay una convocatoria y el modal está abierto, establece los valores del formulario
      setFormularioValues({
        id: convocatoria.id_convoca,
        nivel: convocatoria.id_nivel,
        cargo: convocatoria.cargo,
        establecimiento: convocatoria.id_establecimiento,
        causal: convocatoria.id_causal,
        expte: convocatoria.expte,
        caracter: convocatoria.id_caracter,
        fecha: fechaHora,
        habilita: convocatoria.habilita,
        hora: convocatoria.hora_designa,
        num_convocatoria: convocatoria.num_convocatoria,
        anio_convocatoria: convocatoria.anio_convocatoria,
      });
      setDatosOld(
        `CONVOCATORIA_${convocatoria.num_convocatoria}_${convocatoria.anio_convocatoria}_EXPTE_${convocatoria.expte}.pdf`
      );
    }
  }, [convocatoria]);

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
  if (!convocatoria) {
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

  const editarConvocatoria = async (convocatoria) => {
    try {
      convocatoria.archivo = archivo;
      convocatoria.oldName = datosOld;
      console.log(convocatoria);
      const response = await axios.put(
        "/educacion/editarConvocatoria",
        convocatoria,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      obtenerConvocatorias(idNivel);
      handleClose();
      return response.data;
    } catch (error) {
      console.error("Error al editar la convocatoria:", error);
      throw new Error("Error al editar la convocatoria");
    }
  };

  const fechaHora = formatearFechaHora(convocatoria.fecha_designa);
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
  };
  return (
    <Modal open={modalAbierto} onClose={handleClose}>
      <Box sx={style}>
        <div className="d-flex justify-content-around align-items-center mb-3">
          <p style={{ fontSize: "1rem", margin: 0 }}>
            Detalle de la Convocatoria: {convocatoria.id_convoca}
          </p>
        </div>
        <Divider />
        <div className="d-flex flex-column justify-content-center">
          {!modoEdicion ? (
            <>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Convocatoria Nº:</b> {convocatoria.num_convocatoria} /{" "}
                {convocatoria.anio_convocatoria}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Nivel:</b> {convocatoria.nombre_nivel}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Detalle:</b> {convocatoria.cargo}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Establecimiento:</b> {convocatoria.nombre_establecimiento}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Domicilio:</b> {convocatoria.domicilio}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Localidad:</b> San Miguel de Tucumán
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Causal:</b> {convocatoria.nombre_causal}{" "}
                {convocatoria.detalle_causal}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Expediente Nº:</b> {convocatoria.expte}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Caracter:</b> {convocatoria.nombre_caracter}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Fecha / Hora designacion:</b> {fechaHora} /{" "}
                {convocatoria.hora_designa}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Lugar designacion:</b> Jujuy 259
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Texto de la Convocatoria:</b>{" "}
                <a href={convocatoria.archivo}>
                  <LaunchIcon style={{ cursor: "pointer" }} />
                </a>
              </p>
              <Button onClick={handleClose} className="mt-3" variant="outlined">
                Cerrar
              </Button>
            </>
          ) : (
            <>
              <form className="d-flex justify-content-around">
                <div className="w-50 d-flex flex-column gap-3 p-2">
                  <InputLabel id="demo-simple-select-label">{`${convocatoria.nombre_nivel}`}</InputLabel>
                  <Select
                    name="nivel"
                    value={formularioValues.nivel}
                    onChange={handleInputChange}
                  >
                    {Array.isArray(arrayNiveles) &&
                      arrayNiveles.map((n) => (
                        <MenuItem key={n.id_nivel} value={n.id_nivel}>
                          {n.nombre_nivel}
                        </MenuItem>
                      ))}
                  </Select>
                  <InputLabel>CARGO</InputLabel>
                  <TextField
                    placeholder={`${convocatoria.cargo}`}
                    onChange={handleInputChange}
                    name="cargo"
                    value={formularioValues.cargo}
                  />
                  <InputLabel>ESTABLECIMIENTO</InputLabel>
                  <Select
                    value={formularioValues.establecimiento}
                    onChange={handleInputChange}
                    name="establecimiento"
                  >
                    {Array.isArray(arrayEstablecimientos) &&
                      arrayEstablecimientos.map((e) => (
                        <MenuItem
                          key={e.id_establecimiento}
                          value={e.id_establecimiento}
                        >
                          {e.nombre_establecimiento}
                        </MenuItem>
                      ))}
                  </Select>
                  <InputLabel>CAUSAL</InputLabel>
                  <Select
                    value={formularioValues.causal}
                    onChange={handleInputChange}
                    name="causal"
                  >
                    {Array.isArray(arrayCausal) &&
                      arrayCausal.map((c) => (
                        <MenuItem key={c.id_causal} value={c.id_causal}>
                          {c.nombre_causal}
                        </MenuItem>
                      ))}
                  </Select>
                  <InputLabel>EXPEDIENTE</InputLabel>
                  <TextField
                    placeholder={`${convocatoria.expte}`}
                    onChange={handleInputChange}
                    name="expte"
                    value={formularioValues.expte}
                  />
                </div>
                <div className="d-flex flex-column gap-3 w-50 p-2">
                  <InputLabel>CARACTER</InputLabel>
                  <Select
                    value={formularioValues.caracter}
                    onChange={handleInputChange}
                    name="caracter"
                  >
                    {Array.isArray(arrayCaracter) &&
                      arrayCaracter.map((car) => (
                        <MenuItem key={car.id_caracter} value={car.id_caracter}>
                          {car.nombre_caracter}
                        </MenuItem>
                      ))}
                  </Select>
                  <InputLabel>FECHA DESIGNACION</InputLabel>
                  <TextField
                    type="date"
                    onChange={handleInputChange}
                    name="fecha"
                    value={formatearFechaHora(formularioValues.fecha)}
                  />
                  <InputLabel>HORA DESIGNACION</InputLabel>
                  <TextField
                    onChange={handleInputChange}
                    name="hora"
                    value={formularioValues.hora}
                    placeholder="Ej: 09:00:00"
                  />
                  <InputLabel>NOMBRE ARCHIVO</InputLabel>
                  <input
                    type="file"
                    onChange={handleFileInputChange}
                    accept=".pdf"
                    ref={fileInputRef}
                  />
                  <div className="d-flex align-items-center">
                    <p className="m-0">Habilita:</p>
                    <Switch
                      checked={formularioValues.habilita === 1}
                      onChange={handleHabilitarChange}
                      name="habilita"
                    />
                  </div>
                </div>
              </form>

              <Button
                onClick={() => editarConvocatoria(formularioValues)}
                className="mt-3"
                variant="outlined"
              >
                Guardar cambios
              </Button>
            </>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ModalConvocatoria;
