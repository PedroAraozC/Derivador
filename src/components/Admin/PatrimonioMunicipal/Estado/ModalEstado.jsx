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
import { DerivadorContext } from "../../../../context/DerivadorContext";
import axios from "../../../../config/axios";
import axiosLici from "../../../../config/axiosLicitaciones";
import axiosPatri from "../../../../config/axiosPatrimonio";

const ModalEstado = ({ estados, modalAbierto, handleClose }) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const { actualizador } = useContext(DerivadorContext);
  const [errores, setErrores] = useState({});
  const [buttonDis, setButtonDis] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const [formularioValues, setFormularioValues] = useState({
    nombre_estado: "",
    habilita: 0,
  });
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // Función para validar el formulario antes de enviarlo
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (
      !formularioValues.nombre_estado ||
      formularioValues.nombre_estado.length > 30
    ) {
      nuevosErrores.nombre_estado = "Ingrese un nombre de máximo 20 caracteres";
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
    if (estados) {
      // Si hay un estado y el modal está abierto, establece los valores del formulario
      setFormularioValues({
        id: estados.id_estado,
        nombre_estado: estados.nombre_estado,
        habilita: estados.habilita,
      });
    }
  }, [estados]);

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
  if (!estados) {
    return null;
  }

  const editarAutor = async (event) => {
    const formularioValido = validarFormulario();
    if (formularioValido) {
      try {
        const response = await axiosPatri.post(
          "/admin/editarEstadoPatrimonio",
          formularioValues
        );
        // handleClose();
        actualizador();
        setSnackbarMensaje("Estado editada con éxito.");
        setSnackbarOpen(true);
        setTimeout(() => {
          handleClose();
          setSnackbarOpen(false);
          setButtonDis(false);
        }, 1500);
        actualizador();
        return response.data;
      } catch (error) {
        console.error("Error al editar el estado:", error);
        throw new Error("Error al editar el estado");
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
    width: isMobile ? "94%" : "480px",
    // height: "50%",
    bgcolor: "background.paper",
    boxShadow: "var(--cd-sombra-modal)",
    p: { xs: 3, md: 4 },
    borderRadius: "20px",
    maxHeight: "92vh",
    overflowY: "auto",
    outline: "none",
  };

  return (
    <>
    <Modal open={modalAbierto} onClose={handleClose}>
      <Box sx={style} className="cd-modal">
        <div className="cd-modal__cabecera">
          <p className="cd-modal__titulo">
            Detalle del Estado: {estados.id_estado}
          </p>
        </div>
        <Divider />
        <div className="d-flex flex-column justify-content-center">
          <form className="d-flex justify-content-around flex-cd-flex flex-column flex-xxl-row gap-5 justify-content-center align-items-center formAgregarcausalolumn">
            <div className="w-100 d-flex flex-column gap-2 p-2">
              <InputLabel>ESTADO</InputLabel>
              <TextField
                placeholder={`${estados.nombre_estado}`}
                onChange={handleInputChange}
                name="nombre_estado"
                value={formularioValues.nombre_estado}
              />
            </div>
            <div className="d-flex flex-column gap-2 w-100 p-2">
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
            onClick={() => editarAutor()}
            className="mt-3"
            variant="outlined"
          >
            Guardar cambios
          </Button>
        </div>
      </Box>
    </Modal>
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
        </>
  );
};

export default ModalEstado;
