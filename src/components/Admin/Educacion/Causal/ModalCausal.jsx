/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Modal, Box, Button, Divider, InputLabel, Switch, TextField } from "@mui/material";
import "./Causal.css";
import { EducaContext } from "../../../../context/EducaContext";
import axios from "../../../../config/axios";

const ModalCausal = ({
  causal,
  modalAbierto,
  handleClose,
  modoEdicion
}) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const { actualizador } = useContext(EducaContext);
  const [formularioValues, setFormularioValues] = useState({
    id: "",
    causal: "",
    habilita: 0,
  });
  

  useEffect(() => {
    if (causal) {
      // Si hay una causal y el modal está abierto, establece los valores del formulario
      setFormularioValues({
        id: causal.id_causal,
        nombre_causal: causal.nombre_causal,
        habilita: causal.habilita,
      });
    }
  }, [causal]);

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
  if (!causal) {
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

  const editarcausal = async (causal) => {
    try {
      const response = await axios.post(
        "/educacion/editarCausal",
        causal
      );
      handleClose()
      actualizador()
      return response.data;
    } catch (error) {
      console.error("Error al editar la causal:", error);
      throw new Error("Error al editar la causal");
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
            Detalle de la causal: {causal.id_causal}
          </p>
        </div>
        <Divider />
        <div className="d-flex flex-column justify-content-center">
          {!modoEdicion ? (
            <>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>ID Causal:</b> {causal.id_causal} /{" "}
                {causal.id_causal}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Nombre Causal:</b> {causal.nombre_causal}
              </p>
              <Button
                  onClick={handleClose}
                  className="mt-3"
                  variant="outlined"
                >
                  Cerrar
                </Button>
            </>
          ) : (
            <>
              <form className="d-flex justify-content-around">
                <div className="w-50 d-flex flex-column gap-3 p-2">
                  <InputLabel>CAUSAL</InputLabel>
                  <TextField
                    placeholder={`${causal.nombre_causal}`}
                    onChange={handleInputChange}
                    name="nombre_causal"
                    value={formularioValues.causal}
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
                  onClick={() => editarcausal(formularioValues)}
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

export default ModalCausal;
