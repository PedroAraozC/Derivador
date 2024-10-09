/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
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
} from "@mui/material";
import { EducaContext } from "../../../../context/EducaContext";
import axios from "../../../../config/axios";
import axiosLici from "../../../../config/axiosLicitaciones";

const ModalCategoria = ({ categorias, modalAbierto, handleClose }) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const { actualizador } = useContext(EducaContext);
  const [errores, setErrores] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const [formularioValues, setFormularioValues] = useState({
    nombre_categoria: "",
    habilita: 0,
  });
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // Función para validar el formulario antes de enviarlo
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (
      !formularioValues.nombre_categoria ||
      formularioValues.nombre_categoria.length > 20
    ) {
      nuevosErrores.nombre_categoria =
        "Ingrese un nombre de máximo 20 caracteres";
      setSnackbarMensaje(
        "Ingrese un nombre de la categoria de máximo 20 caracteres"
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

  useEffect(() => {
    if (categorias) {
      // Si hay un estado y el modal está abierto, establece los valores del formulario
      setFormularioValues({
        id: categorias.id_categoria,
        nombre_categoria: categorias.nombre_categoria,
        habilita: categorias.habilita,
      });
    }
  }, [categorias]);

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
  if (!categorias) {
    return null;
  }

  const editarCategoria = async (event, categoria) => {
    // event.preventDefault();
    const formularioValido = validarFormulario();
    if (formularioValido) {
      try {
        console.log(formularioValues)
        const response = await axiosLici.post(
          "/admin/editarCategoriaPatrimonio",
          formularioValues
        );
        // handleClose();
        actualizador();
        setSnackbarMensaje("Categoria editada con éxito.");
        setSnackbarOpen(true);
        return response.data;
      } catch (error) {
        console.error("Error al editar la categoria:", error);
        throw new Error("Error al editar la categoria");
      }
    } else {
      console.log("Algo salio mal :(");
      setSnackbarMensaje("Por favor, corrige los errores en el formulario.");
      setSnackbarOpen(true);
    }
  };

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
            Detalle de la Categoria: {categorias.id_categoria}
          </p>
        </div>
        <Divider />
        <div className="d-flex flex-column justify-content-center">
          <form className="d-flex justify-content-around flex-column">
            <div className="w-50 d-flex flex-column gap-3 p-2">
              <InputLabel>ESTADO</InputLabel>
              <TextField
                placeholder={`${categorias.nombre_categoria}`}
                onChange={handleInputChange}
                name="nombre_categoria"
                value={formularioValues.nombre_categoria}
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
            onClick={() => editarCategoria()}
            className="mt-3"
            variant="outlined"
          >
            Guardar cambios
          </Button>
        </div>
        {errores ? (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "left"}} // Ajusta la posición del Snackbar
            style={{ bottom: "-70%", position:"absolute"}}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="info"
              elevation={6}
              variant="filled"
              sx={{ width: "100%" }}
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

export default ModalCategoria;
