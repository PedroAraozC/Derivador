/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Modal, Box, Button, Divider, InputLabel, Switch, TextField, Snackbar, Alert } from "@mui/material";
import { EducaContext } from "../../../../context/EducaContext";
import axios from "../../../../config/axios";

const ModalAutor = ({autor, modalAbierto, handleClose}) => {

  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const { actualizador } = useContext(EducaContext);
  const [errores, setErrores] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState('');
  const [formularioValues, setFormularioValues] = useState({
    id: "",
    nombre_autor: "",
    descripcion_autor: "",
    habilita: 0,
  });
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
// Función para validar el formulario antes de enviarlo
const validarFormulario = () => {
  const nuevosErrores = {};

  if (!formularioValues.nombre_autor || formularioValues.nombre_autor.length > 30) {
    nuevosErrores.nombre_autor = "Ingrese un nombre del autor/a de máximo 30 caracteres";
    setSnackbarMensaje("Ingrese un nombre del autor/a de máximo 30 caracteres");
  }

  setErrores(nuevosErrores);

  // Si hay errores, muestra el Snackbar
  if (Object.keys(nuevosErrores).length > 0) {
    setSnackbarOpen(true);
  }

  return Object.keys(nuevosErrores).length === 0; // Retorna true si no hay errores
};


  useEffect(() => {
    if (autor) {
      // Si hay un autor y el modal está abierto, establece los valores del formulario
      setFormularioValues({
        id: autor.id_autor,
        nombre_autor: autor.nombre_autor,
        descripcion_autor: autor.descripcion_autor,
        habilita: autor.habilita,
      });
    }
  }, [autor]);

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
  if (!autor) {
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

  const editarAutor = async (event, autor) => {
    event.preventDefault()
    const formularioValido = validarFormulario();
    if (formularioValido) {
      try {
        const response = await axios.post(
          "/admin/editarAutor",
          autor
        );
        handleClose()
        actualizador()
        return response.data;
      } catch (error) {
        console.error("Error al editar el autor:", error);
        throw new Error("Error al editar el autor");
      }
    } else {
      console.log('Algo salio mal :(')
      setSnackbarMensaje("Por favor, corrige los errores en el formulario.");
      setSnackbarOpen(true);
    }};

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : "1200px", // Ajusta el ancho según el dispositivo
    height: "50%",
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
            Detalle del Autor: {autor.id_autor}
          </p>
        </div>
        <Divider />
        <div className="d-flex flex-column justify-content-center">
              <form className="d-flex justify-content-around flex-column">
                <div className="w-50 d-flex flex-column gap-3 p-2">
                  <InputLabel>AUTOR</InputLabel>
                  <TextField
                    placeholder={`${autor.nombre_autor}`}
                    onChange={handleInputChange}
                    name="nombre_autor"
                    value={formularioValues.nombre_autor}
                  />
                </div>
                <div className="w-50 d-flex flex-column gap-3 p-2">
                    <InputLabel> DESCRIPCIÓN</InputLabel>
                    <textarea
                        placeholder="Descripción del Autor/a"
                        onChange={handleInputChange}
                        name="descripcion_autor"
                        value={formularioValues.descripcion_autor}
                        style={{width: 300, marginBottom: 2, border: '1px solid #ccc', borderRadius: 4, minHeight: '100px', minWidth: '100%'}}
                    />
                </div>
                <div className="d-flex flex-column gap-3 w-50 p-2">
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
                  onClick={() => editarAutor(formularioValues)}
                  className="mt-3"
                  variant="outlined"
                >
                  Guardar cambios
                </Button>
        </div>
        {errores? (
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                    {snackbarMensaje}
                </Alert>
            </Snackbar>
            ):<></>}
      </Box>
    </Modal>
  )
}

export default ModalAutor