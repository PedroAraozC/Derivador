import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalEliminar = ({ open, handleClose, handleDelete }) => {
  return (
    <Modal
      open={open}
      //   onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Confirmar desactivación de cuenta
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 3 }}>
          ¿Está seguro de que quiere desactivar su cuenta de <b>CiDiTuc</b>?
        </Typography>
        <div className="modal-buttons d-flex justify-content-between">
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Desactivar
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalEliminar;
