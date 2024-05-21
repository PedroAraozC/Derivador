/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Modal, Box, Button, Divider, InputLabel, Switch, TextField } from "@mui/material";
import { EducaContext } from "../../../../context/EducaContext";
import axios from "../../../../config/axios";

const ModalEstablecimiento = ({
  establecimiento,
  modalAbierto,
  handleClose,
  modoEdicion
}) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const { actualizador } = useContext(EducaContext);
  const [formularioValues, setFormularioValues] = useState({
    id: "",
    nombre_establecimiento: "",
    habilita: 0,
  });
  

  useEffect(() => {
    if (establecimiento) {
      // Si hay una causal y el modal está abierto, establece los valores del formulario
      setFormularioValues({
        id: establecimiento.id_establecimiento,
        nombre_establecimiento: establecimiento.nombre_establecimiento,
        domicilio: establecimiento.domicilio,
        telefono: establecimiento.telefono,
        nombre_autoridad: establecimiento.nombre_autoridad,
        email_autoridad: establecimiento.email_autoridad,
        habilita: establecimiento.habilita,
      });
    }
  }, [establecimiento]);

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
  if (!establecimiento) {
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
        "/educacion/editarEstablecimiento",
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
    height: "80%",
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
            Detalle del establecimiento: {establecimiento.nombre_establecimiento}
          </p>
        </div>
        <Divider />
        <div className="d-flex flex-column justify-content-center">
          {!modoEdicion ? (
            <>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>ID establecimiento:</b> {establecimiento.id_establecimiento} /{" "}
                {establecimiento.nombre_establecimiento}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Establecimiento:</b> {establecimiento.nombre_establecimiento}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Domicilio:</b> {establecimiento.domicilio}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Telefono:</b> {establecimiento.telefono}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Autoridad:</b> {establecimiento.nombre_autoridad}
              </p>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Email de la Autoridad:</b> {establecimiento.email_autoridad}
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
              <form className="d-flex flex-column justify-content-around">
                <div className="w-50 d-flex flex-column p-2">
                  <InputLabel>ESTABLECIMIENTO</InputLabel>
                  <TextField
                    placeholder={`${establecimiento.nombre_establecimiento}`}
                    onChange={handleInputChange}
                    name="nombre_establecimiento"
                    value={formularioValues.nombre_establecimiento}
                  />
                </div>
                <div className="w-50 d-flex flex-column p-2">
                  <InputLabel>DOMICILIO</InputLabel>
                      <TextField
                          placeholder="Direccion exacta"
                          onChange={handleInputChange}
                          name="domicilio"
                          value={formularioValues.domicilio}
                          sx={{width: 300, marginBottom: 2}}
                          required={true}
                      />
                </div>
                <div className="w-50 d-flex flex-column p-2">
                  <InputLabel>TELEFONO</InputLabel>
                  <TextField
                        placeholder="Numero de telefono"
                        onChange={handleInputChange}
                        name="telefono"
                        value={formularioValues.telefono}
                        sx={{width: 300, marginBottom: 2}}
                        required={true}
                    />
                </div>
                <div className="w-50 d-flex flex-column p-2">
                    <InputLabel>NOMBRE AUTORIDAD</InputLabel>
                    <TextField
                        placeholder="Nombre completo de la Autoridad"
                        onChange={handleInputChange}
                        name="nombre_autoridad"
                        value={formularioValues.nombre_autoridad}
                        sx={{width: 300, marginBottom: 2}}
                        required={true}
                    />
                </div>
                <div className="w-50 d-flex flex-column p-2">
                    <InputLabel>EMAIL AUTORIDAD</InputLabel>
                    <TextField
                        placeholder="ejemplo@ejemplo.com"
                        onChange={handleInputChange}
                        name="email_autoridad"
                        value={formularioValues.email_autoridad}
                        sx={{width: 300, marginBottom: 2}}
                        required={true}
                    />
                </div>
                <div className="d-flex flex-column w-50 p-2">
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

export default ModalEstablecimiento;
