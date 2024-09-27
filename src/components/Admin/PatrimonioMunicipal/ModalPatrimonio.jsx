/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import {
  Modal,
  Box,
  Button,
  Divider,
  InputLabel,
  Switch,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  imageListClasses,
} from "@mui/material";
import axios from "../../../config/axios";
import { EducaContext } from "../../../context/EducaContext";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import "./ModalPatrimonio.css"
import { AutoFixHigh } from "@mui/icons-material";

const ModalPatrimonio = ({ patrimonio, modalAbierto, handleClose }) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const { actualizador } = useContext(EducaContext);
  const [imagenCarrousel1, setImagenCarrousel1] = useState(null);
  const [imagenCarrousel2, setImagenCarrousel2] = useState(null);
  const [imagenCarrousel3, setImagenCarrousel3] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const fileInputRef = useRef(null);
  const [buttonDis, setButtonDis] = useState(false);
  const [errores, setErrores] = useState({});
  const {
    obtenerCategoria,
    categoria,
    obtenerAutor,
    autor,
    obtenerEstado,
    estado,
    obtenerMaterial,
    material,
    obtenerTipologia,
    tipologia,
    obtenerUbicacion,
    ubicacion,
  } = useContext(EducaContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const [formularioValues, setFormularioValues] = useState({
    nombre_patrimonio: "",
    anio_emplazamiento: "",
    descripcion: "",
    origen: "",
    id_categoria: "",
    id_tipologia: "",
    id_material: "",
    id_estado: "",
    id_autor: "",
    id_ubicacion: "",
    id_patrimonio: "",
    latylon: "",
    habilita: 0,
  });

  // Función para validar el formulario antes de enviarlo
  const validarFormulario = () => {
    const nuevosErrores = {};
    const regex =
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d(\.\d+)?|180(\.0+)?|\d{1,2}(\.\d+)?))$/;

    if (
      !formularioValues.nombre_patrimonio ||
      formularioValues.nombre_patrimonio.length > 40
    ) {
      nuevosErrores.nombre_patrimonio =
        "Ingrese un nombre de máximo 40 caracteres";
      setSnackbarMensaje(
        "Ingrese un nombre del autor/a de máximo 40 caracteres"
      );
    }
    if (
      !formularioValues.anio_emplazamiento ||
      formularioValues.anio_emplazamiento.length > 4
    ) {
      nuevosErrores.anio_emplazamiento =
        "Ingrese un año de máximo 4 caracteres";
      setSnackbarMensaje("Ingrese un año de máximo 4 caracteres");
    }
    if (!formularioValues.origen || formularioValues.origen.length > 80) {
      nuevosErrores.descripcion = "Ingrese un origen de máximo 80 caracteres";
      setSnackbarMensaje("Describa el origen en un máximo de 80 caracteres");
    }
    if (!formularioValues.latylon || !regex.test(formularioValues.latylon)) {
      nuevosErrores.latylon =
        "Ingrese coordenadas válidas en formato Latitud, Longitud";
      setSnackbarMensaje(
        "Ingrese coordenadas válidas en formato Latitud, Longitud"
      );
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

  const editarPatrimonio = async (patri) => {
    const formularioValido = validarFormulario();
    if (formularioValido) {
      setButtonDis(true);
      try {
        console.log('ID Patrimonio:', patri.id_patrimonio);
  
        // Validar ID del patrimonio
        if (!patri.id_patrimonio) {
          console.error('El valor de id_patrimonio no está definido');
          setSnackbarMensaje("El ID del patrimonio no está definido.");
          setSnackbarOpen(true);
          setButtonDis(false);
          return;
        }
  
        // Crear FormData para subir imágenes
        const formData = new FormData();
        formData.append('id_patrimonio', patri.id_patrimonio); 
        formData.append('nombre_patrimonio', patri.nombre_patrimonio);
        
        if (archivo) formData.append('imagen_card', archivo);
        if (imagenCarrousel1) formData.append('imagen_carrousel_1', imagenCarrousel1);
        if (imagenCarrousel2) formData.append('imagen_carrousel_2', imagenCarrousel2);
        if (imagenCarrousel3) formData.append('imagen_carrousel_3', imagenCarrousel3);
  
        // Enviar imágenes
        try {
          const responseImagenes = await axios.post('/admin/editarPatrimonioImagenes', formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          console.log('Respuesta del servidor (imágenes):', responseImagenes.data);
        } catch (error) {
          console.error('Error al enviar imágenes:', error);
          setSnackbarMensaje("Error al enviar imágenes.");
          setSnackbarOpen(true);
          setButtonDis(false);
          throw error;
        }
  
        // Verificar y agregar archivo si existe
        if (archivo) {
          console.log("Archivo cargado:", archivo);
          formData.append("archivo", archivo);
        } else {
          console.log("Archivo está undefined");
        }
  
        // Enviar datos del patrimonio
        const response = await axios.post('/admin/editarPatrimonio', formularioValues);
        console.log('Respuesta del servidor (datos del patrimonio):', response.data);
  
        setSnackbarMensaje("Patrimonio editado.");
        setSnackbarOpen(true);
        setTimeout(() => {
          handleClose();
          setSnackbarOpen(false);
          setButtonDis(false);
        }, 1500);
        actualizador();
        return [response.data];
      } catch (error) {
        console.error("Error al editar el patrimonio:", error);
        setSnackbarMensaje("Error al editar el patrimonio.");
        setSnackbarOpen(true);
        setButtonDis(false);
        throw new Error("Error al editar el patrimonio");
      }
    } else {
      console.log("Algo salió mal :(");
      setSnackbarOpen(true);
      setButtonDis(false);
    }
  };
  

  // const handleFileInputChange = (event) => {
  //   const file = event.target.files[0];
  //   setArchivo(file);
  // };

  const handleCarrouselFileChange = (event, setter) => {
    const file = event.target.files[0];
    setter(file);
  };

  useEffect(() => {
    obtenerCategoria();
    obtenerTipologia();
    obtenerMaterial();
    obtenerEstado();
    obtenerAutor();
    obtenerUbicacion();
  }, []);

  const conseguirLatyLon = () => {
    window.open(
      "https://support.google.com/maps/answer/18539?hl=es&co=GENIE.Platform%3DDesktop",
      "_blank"
    );
  };
  useEffect(() => {
    if (patrimonio) {
      setFormularioValues({
        id_patrimonio: patrimonio.id_patrimonio,
        nombre_patrimonio: patrimonio.nombre_patrimonio,
        anio_emplazamiento: patrimonio.anio_emplazamiento,
        descripcion: patrimonio.descripcion,
        origen: patrimonio.origen,
        latylon: patrimonio.latylon,
        id_categoria: patrimonio.id_categoria,
        id_tipologia: patrimonio.id_tipologia,
        id_material: patrimonio.id_material,
        id_estado: patrimonio.id_estado,
        id_autor: patrimonio.id_autor,
        id_ubicacion: patrimonio.id_ubicacion,
        habilita: patrimonio.habilita,
      });
    }
  }, [patrimonio]);

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
  if (!patrimonio) {
    return null;
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : "80%", // Ajusta el ancho según el dispositivo
    height: "90%",
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    overflowY: "auto"
  };

  return (
    <Modal open={modalAbierto}>
      <Box sx={style}>
        <div className="d-flex justify-content-around align-items-center mb-3">
          <p style={{ fontSize: "1rem", margin: 0 }}>
            Detalle del patrimonio: {patrimonio.id_patrimonio}
          </p>
        </div>
        <Divider />
        <div className="d-flex flex-column justify-content-center" >
          <form className="d-flex flex-column flex-xxl-row gap-5 justify-content-center align-items-center formAgregarcausal ">
            <div style={{width: "100%"}}>
              <InputLabel sx={{ marginTop: 2 }}>NOMBRE PATRIMONIO</InputLabel>
              <TextField
                placeholder="Ingrese el nombre del patrimonio..."
                onChange={handleInputChange}
                name="nombre_patrimonio"
                value={formularioValues.nombre_patrimonio}
                sx={{ width: "100%", minHeight: "56px" }} 
                required={true}
              />
              <InputLabel sx={{ marginTop: 2 }}>AÑO EMPLAZAMIENTO</InputLabel>
              <TextField
                placeholder="Ingrese el año de emplazamiento"
                onChange={handleInputChange}
                name="anio_emplazamiento"
                value={formularioValues.anio_emplazamiento}
                sx={{ width: "100%", minHeight: "56px" }}
                required={true}
              />
              <InputLabel sx={{ marginTop: 2 }}>DESCRIPCIÓN</InputLabel>
              <TextField
                placeholder="Ingrese una descripción para el patrimonio"
                onChange={handleInputChange}
                name="descripcion"
                value={formularioValues.descripcion}
                sx={{ width: "100%", minHeight: "56px" }}
                required={true}
              />
              <InputLabel sx={{ marginTop: 2 }}>ORIGEN</InputLabel>
              <TextField
                placeholder="Ingrese el origen del patrimonio"
                onChange={handleInputChange}
                name="origen"
                value={formularioValues.origen}
                sx={{ width: "100%", minHeight: "56px" }}
                required={true}
              />
              <div className="d-flex algin-items-center gap-2 mt-3 mb-2">
                <InputLabel>LATITUD y LONGITUD</InputLabel>
                <HelpOutlineOutlinedIcon
                  sx={{ cursor: "pointer" }}
                  onClick={conseguirLatyLon}
                />
              </div>
              <TextField
                placeholder="Ingrese el valor de las coordenadas"
                onChange={handleInputChange}
                name="latylon"
                value={formularioValues.latylon}
                sx={{ width: "100%", minHeight: "56px" }}
                required={true}
              />
              <div className="d-flex flex-column">
                <InputLabel sx={{ marginTop: 2 }}>HABILITA</InputLabel>
                <Switch
                  checked={formularioValues.habilita === 1}
                  onChange={handleHabilitarChange}
                  name="habilita"
                />
              </div>
            </div>
            <div style={{width: "100%"}}>
              <InputLabel sx={{ marginTop: 0 }}>TIPO DE CATEGORÍA</InputLabel>
              <Select
                value={formularioValues.id_categoria}
                onChange={handleInputChange}
                name="id_categoria"
                sx={{ width: "100%" }}
                required={true}
              >
                {Array.isArray(categoria) &&
                  categoria.map((e) => (
                    <MenuItem key={e.id_categoria} value={e.id_categoria}>
                      {e.nombre_categoria}
                    </MenuItem>
                  ))}
              </Select>
              <InputLabel sx={{ marginTop: 2 }}>TIPOLOGÍA</InputLabel>
              <Select
                value={formularioValues.id_tipologia}
                onChange={handleInputChange}
                name="id_tipologia"
                sx={{ width: "100%" }}
                required={true}
              >
                {Array.isArray(tipologia) &&
                  tipologia.map((e) => (
                    <MenuItem key={e.id_tipologia} value={e.id_tipologia}>
                      {e.nombre_tipologia}
                    </MenuItem>
                  ))}
              </Select>
              <InputLabel sx={{ marginTop: 2 }}>MATERIAL</InputLabel>
              <Select
                value={formularioValues.id_material}
                onChange={handleInputChange}
                name="id_material"
                sx={{ width: "100%" }}
                required={true}
              >
                {Array.isArray(material) &&
                  material.map((e) => (
                    <MenuItem key={e.id_material} value={e.id_material}>
                      {e.nombre_material}
                    </MenuItem>
                  ))}
              </Select>
              <InputLabel sx={{ marginTop: 2 }}>ESTADO</InputLabel>
              <Select
                value={formularioValues.id_estado}
                onChange={handleInputChange}
                name="id_estado"
                sx={{ width: "100%" }}
                required={true}
              >
                {Array.isArray(estado) &&
                  estado.map((e) => (
                    <MenuItem key={e.id_estado} value={e.id_estado}>
                      {e.nombre_estado}
                    </MenuItem>
                  ))}
              </Select>
              <InputLabel sx={{ marginTop: 2 }}>AUTOR</InputLabel>
              <Select
                value={formularioValues.id_autor}
                onChange={handleInputChange}
                name="id_autor"
                sx={{ width: "100%" }}
                required={true}
              >
                {Array.isArray(autor) &&
                  autor.map((e) => (
                    <MenuItem key={e.id_autor} value={e.id_autor}>
                      {e.nombre_autor}
                    </MenuItem>
                  ))}
              </Select>
              <InputLabel sx={{ marginTop: 2 }}>UBICACIÓN</InputLabel>
              <Select
                value={formularioValues.id_ubicacion}
                onChange={handleInputChange}
                name="id_ubicacion"
                sx={{ width: "100%" }}
                required={true}
              >
                {Array.isArray(ubicacion) &&
                  ubicacion.map((e) => (
                    <MenuItem key={e.id_ubicacion} value={e.id_ubicacion}>
                      {e.nombre_ubicacion}
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <div className="d-flex flex-column " style={{width: "100%"}}>
              <InputLabel sx={{ marginBottom: 4, textAlign: "center" }}>
                EDITAR IMAGEN CARD (900x600 px)
              </InputLabel>
              <input
                type="file"
                accept=".png, .webp, .jpg"
                ref={fileInputRef}
                onChange={(event) => setArchivo(event.target.files[0])}
                required={false}
                style={{
                  width: "100%",
                  paddingTop: 5,
                  paddingBottom: 30,
                  border: "4px dotted #ccc",
                  padding: "20px",
                }}
              />
              <InputLabel sx={{ marginTop: 2 }}>IMAGEN CARROUSEL #1</InputLabel>
              <input
                type="file"
                accept=".png, .webp, .jpg"
                onChange={(event) =>
                  handleCarrouselFileChange(event, setImagenCarrousel1)
                }
                style={{
                  width: "100%",
                  paddingTop: 5,
                  paddingBottom: 30,
                  border: "4px dotted #ccc",
                  padding: "20px",
                }}
              />
              <InputLabel sx={{ marginTop: 2 }}>IMAGEN CARROUSEL #2</InputLabel>
              <input
                type="file"
                accept=".png, .webp, .jpg"
                onChange={(event) =>
                  handleCarrouselFileChange(event, setImagenCarrousel2)
                }
                style={{
                  width: "100%",
                  paddingTop: 5,
                  paddingBottom: 30,
                  border: "4px dotted #ccc",
                  padding: "20px",
                }}
              />
              <InputLabel sx={{ marginTop: 2 }}>IMAGEN CARROUSEL #3</InputLabel>
              <input
                type="file"
                accept=".png, .webp, .jpg"
                onChange={(event) =>
                  handleCarrouselFileChange(event, setImagenCarrousel3)
                }
                style={{
                  width: "100%",
                  paddingTop: 5,
                  paddingBottom: 30,
                  border: "4px dotted #ccc",
                  padding: "20px",
                }}
              />
              {/* <TextField
                      placeholder="Ingrese la URL de la imagen para el carrousel"
                      onChange={handleInputChange}
                      name="imagen_carrousel_1"
                      value={formularioValues.imagen_carrousel_1}
                      sx={{ width: "100%",  minHeight: '56px' }}
                      required={true}
                      className="mt-5"
                    />
                <TextField
                      placeholder="Ingrese la URL de la imagen para el carrousel"
                      onChange={handleInputChange}
                      name="imagen_carrousel_2"
                      value={formularioValues.imagen_carrousel_2}
                      sx={{ width: "100%",  minHeight: '56px' }}
                      required={true}
                      className="mt-5"
                    />
                <TextField
                      placeholder="Ingrese la URL de la imagen para el carrousel"
                      onChange={handleInputChange}
                      name="imagen_carrousel_3"
                      value={formularioValues.imagen_carrousel_3}
                      sx={{ width: "100%",  minHeight: '56px' }}
                      required={true}
                      className="mt-5"
                    /> */}
            </div>
          </form>
          <Button
            onClick={() => editarPatrimonio(formularioValues)}
            className="mt-3"
            variant="outlined"
            disabled={buttonDis}
          >
            Guardar cambios
          </Button>
          {/* <form
            action="/admin/editarPatrimonio"
            method="POST"
            encType="multipart/form-data"
          >
            <input type="file" name="imagen_carrousel_1" />
            <input type="file" name="imagen_carrousel_2" />
            <input type="file" name="imagen_carrousel_3" />
            <input type="submit" value="Enviar" />
          </form> */}
        </div>
        {errores ? (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="info"
              elevation={6}
              variant="filled"
            >
              {snackbarMensaje}
            </Alert>
          </Snackbar>
        ) : (
          <></>
        )}
      </Box>
    </Modal>
  );
};

export default ModalPatrimonio;
