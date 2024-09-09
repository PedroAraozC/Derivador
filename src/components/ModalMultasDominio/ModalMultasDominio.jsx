import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import axios from "../../config/axios";

const ModalMultasDominio = ({ openDialog, setOpenModal, user }) => {
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState("error");
  const [mensaje, setMensaje] = useState("Algo Explotó :/");
  const [btnState, setBtnState] = useState(true);

  const handleSend = async () => {
    if (message.trim() !== "") {
      setBtnState(false);
      try {
        const emailData = {
          user,
          message: message.toUpperCase(),
          recipient: "tmfconsultas@smt.gob.ar",
          subjet: "Consulta de Multas de Tránsito",
        };
        const reslut = await axios.post(
          "https://estadisticas.smt.gob.ar:5000/usuarios/consultaMulta",
          emailData
        );
        setOpenSnackbar(true);
        setMensaje("Consulta enviada con éxito!");
        setError("success");

        console.log(reslut.data);
        console.log("Mensaje enviado:", message, email.value, user);
        const timer = setTimeout(() => {
          setOpenModal(false);
        }, 5000);
      } catch (error) {
        setOpenSnackbar(true);
        setMensaje("Algo explotó! :(");
        setError("error");
        console.error("Algo salió mal :(", error);
      }
    } else {
      setOpenSnackbar(true);
      setMensaje(`Por favor, completa la descripción`);
      setError("warning");
      // Aquí iría la lógica para manejar el envío del formulario
    }
    setOpenSnackbar(false);
    setBtnState(true);
    setMessage("");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
    setMessage("");
  };
  return (
    <Dialog
      open={openDialog}
      className="w-100"
      // onClose={() => setOpenModal(false)}
    >
      <DialogContent>
        <Box
          component="form"
          id="form"
          noValidate
          encType="multipart/form-data"
          autoComplete="on"
          className="container w-100"
        >
          {/* Campo para el destinatario (correo electrónico) */}
          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="email" style={{ fontWeight: "bold" }}>
              Para
            </InputLabel>
            <Input
              disabled
              id="email"
              type="email"
              style={{ fontWeight: "bold" }}
              value="tmfconsultas@smt.gob.ar"
            />
          </FormControl>

          {/* Campo para el asunto */}
          <FormControl required fullWidth margin="normal">
            <InputLabel style={{ fontWeight: "bold" }} htmlFor="subject">
              Asunto
            </InputLabel>
            <Input
              style={{ fontWeight: "bold" }}
              id="subject"
              value="Consulta de Multas de Tránsito"
              disabled
            />
          </FormControl>

          {/* Campo para el cuerpo del mensaje */}
          <FormControl required fullWidth className="mt-3">
            <InputLabel
              htmlFor="message"
              style={{
                fontWeight: "bold",
                fontSize: "small",
                marginTop: "0px",
                paddingTop: "0px",
              }}
            >
              Dominio/s
            </InputLabel>
            <Input
              id="message"
              minRows={4}
              placeholder="Escriba el dominio solicitado aquí..."
              autoFocus
              resize={"none"}
              value={message}
              onChange={(e) => setMessage(e.target.value.toUpperCase())}
              style={{
                // width: "100%",
                // padding: "5px",
                // marginTop: "46px",
                resize: "none",
                fieldSizing: "content",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            />
          </FormControl>
        </Box>
      </DialogContent>

      {/* Botones de acción */}
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSend}
          disabled={!btnState}
        >
          Enviar
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => handleCancel()}
          disabled={!btnState}
        >
          Cancelar
        </Button>
      </DialogActions>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Ajusta la posición del Snackbar
        style={{ bottom: -750 }} // Ajusta el espacio entre Snackbars
      >
        <Alert
          onClose={handleClose}
          severity={error}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {mensaje}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ModalMultasDominio;
