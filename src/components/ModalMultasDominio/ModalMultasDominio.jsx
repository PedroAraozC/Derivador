import React from "react";
import {
  Box,
  Input,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  TextField,
  TextareaAutosize,
} from "@mui/material";

const ModalMultasDominio = ({ openDialog }) => {
  return (
    <div>
      <Dialog
        className=""
        disableBackdropClick={true}
        open={openDialog}
      >
        <DialogContent disableBackdropClick={true}>
          <Box
            component="form"
            id="form"
            noValidate
            encType="multipart/form-data"
            autoComplete="on"
            className="container"
          >
            {/* Campo para el destinatario (correo electrónico) */}
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="email">Para</InputLabel>
              <Input id="email" type="email" placeholder="ejemplo@correo.com" />
            </FormControl>

            {/* Campo para el asunto */}
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="subject">Asunto</InputLabel>
              <Input id="subject" value={"Consulta de Multa por Dominio"} />
            </FormControl>

            {/* Campo para el cuerpo del mensaje */}
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="message">Descripcion</InputLabel>
              <TextareaAutosize
                id="message"
                minRows={4}
                placeholder="Escribe tu mensaje aquí..."
                style={{ width: '100%' }}
              />
            </FormControl>
          </Box>
        </DialogContent>

        {/* Botones de acción */}
        <DialogActions>
          <Button color="primary" variant="contained">
            Enviar
          </Button>
          <Button color="error" variant="contained">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalMultasDominio;
