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
import BotonDePago from "../BotonDePagoMacro/BotonDePago";

const ModalLibreDeuda = ({ openDialog, setOpenModal, user }) => {
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState("error");
  const [mensaje, setMensaje] = useState("Algo Explotó :/");
  const [btnState, setBtnState] = useState(false);

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
          "https://estadisticas.smt.gob.ar:5000/usuarios/obtenerLibreDeuda",
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
      setMensaje(`Por favor, ingrese la información solicitada`);
      setError("warning");
      // Aquí iría la lógica para manejar el envío del formulario
    }
    // setOpenSnackbar(false);
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
              value="Libre Deuda"
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
              Dominios / DNI
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
              inputProps={{
                maxLength: 50 // Ajusta el límite de caracteres aquí
              }}
            />
          </FormControl>
        </Box>
      </DialogContent>

      {/* Botones de acción */}
      <DialogActions className="d-flex justify-content-center">
        {/* <Button
          color="primary"
          variant="contained"
          onClick={handleSend}
          disabled={!btnState}
        >
          Enviar
        </Button> */}
        {/* <BotonDePago callbackSuccess ={"https://cidituc.smt.gob.ar/#/LibreDeudaPagoExitoso"} callbackCancel ={"https://cidituc.smt.gob.ar/#/LibreDeudaPagoRechazado"} frase={"3K/1IIpZFYIdJmk6atqNbA7iQ+bLLdqqGhAdMamkT1Y="} guid ={"62be1013-a33f-434c-8a90-6cb72fe924bf"} secretKey ={"MUNIESMDETUCUMANDIRECCIONCATASTRO_ebcb1ea7-b9de-43c5-ac3a-691cb968512b"} asunto ={"Libre Deuda"} monto ={545645} entradaUsuario={message} setOpenSnackbar={setOpenSnackbar} setMensaje={setMensaje} setError={setError}/> */}
        <BotonDePago callbackSuccess ={"http://localhost:5173/#/LibreDeudaPagoExitoso"} callbackCancel ={"http://localhost:5173/#/LibreDeudaPagoRechazado"} frase={"3K/1IIpZFYIdJmk6atqNbA7iQ+bLLdqqGhAdMamkT1Y="} guid ={"ed73ca37-2997-4c6c-b1d1-3a9853ed3344"} secretKey ={"MUNIESMDETUCUMANDIRECCIONCATASTRO_78696696-b930-4efe-b13a-7b12c96c8e30"} asunto ={"Libre Deuda"} monto ={545645} entradaUsuario={message} setOpenSnackbar={setOpenSnackbar} setMensaje={setMensaje} setError={setError} btnState={btnState} setBtnState={setBtnState} user={user}/>
        <Button
          color="error"
          variant="outlined"
          onClick={() => handleCancel()}
        >
          Cancelar
        </Button>
      </DialogActions>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Ajusta la posición del Snackbar
        style={{ bottom: "-70%" }} // Ajusta el espacio entre Snackbars
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

export default ModalLibreDeuda;
