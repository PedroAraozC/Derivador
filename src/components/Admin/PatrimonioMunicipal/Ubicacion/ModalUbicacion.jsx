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

const ModalUbicacion = ({ ubicaciones, modalAbierto, handleClose }) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const { actualizador } = useContext(EducaContext);
  const [errores, setErrores] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const [formularioValues, setFormularioValues] = useState({
    nombre_ubicacion: "",
    habilita: 0,
  });
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // Función para validar el formulario antes de enviarlo
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (
      !formularioValues.nombre_ubicacion ||
      formularioValues.nombre_ubicacion.length > 30
    ) {
      nuevosErrores.nombre_ubicacion = "Ingrese un nombre de máximo 20 caracteres";
      setSnackbarMensaje(
        "Ingrese un nombre del autor/a de máximo 20 caracteres"
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
    if (ubicaciones) {
      // Si hay un estado y el modal está abierto, establece los valores del formulario
      setFormularioValues({
        id: ubicaciones.id_ubicacion,
        nombre_ubicacion: ubicaciones.nombre_ubicacion,
        habilita: ubicaciones.habilita,
      });
    }
  }, [ubicaciones]);

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
  if (!ubicaciones) {
    return null; 
  }

  const editarUbicacion = async (event) => {
    const formularioValido = validarFormulario();
    console.log(formularioValues, "aa")
    if (formularioValido) {
      try {
        const response = await axiosLici.post(
          "/admin/editarUbicacionPatrimonio",
          formularioValues
        );
        // handleClose();
        actualizador();
        setSnackbarMensaje("Ubicación editada con éxito.");
        setSnackbarOpen(true);
        return response.data;
      } catch (error) {
        console.error("Error al editar la ubicacion:", error);
        throw new Error("Error al editar la ubicacion");
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
            Detalle de la Ubicación: {ubicaciones.id_ubicacion}
          </p>
        </div>
        <Divider />
        <div className="d-flex flex-column justify-content-center">
          <form className="d-flex justify-content-around flex-column">
            <div className="w-50 d-flex flex-column gap-3 p-2">
              <InputLabel>DIRECCIÓN</InputLabel>
              <TextField
                placeholder={`${ubicaciones.nombre_ubicacion}`}
                onChange={handleInputChange}
                name="nombre_ubicacion"
                value={formularioValues.nombre_ubicacion}
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
            onClick={() => editarUbicacion()}
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

export default ModalUbicacion;
