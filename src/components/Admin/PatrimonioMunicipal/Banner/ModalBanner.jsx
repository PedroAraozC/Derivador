import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../../../../config/axios";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function ModalBanner({ show, handleClose, actualizador, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [buttonDis, setButtonDis] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setButtonDis(true);

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("imagen_banner", selectedFile);
      } else {
        throw new Error("No se ha seleccionado ninguna imagen");
      }

      const response = await axios.post("http://localhost:3050/admin/crearBannerImagenes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const imageUrl = response.data.imageUrl; // Asegúrate de que el backend devuelva la URL de la imagen
        setSnackbarMensaje("Imagen de banner subida con éxito.");
        setSnackbarOpen(true);

        onUploadSuccess(imageUrl); // Pasa la URL al componente padre para actualizar la tabla
        setTimeout(() => {
          handleClose();
          setSnackbarOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error al subir la imagen de banner:", error);
      setSnackbarMensaje("Error al subir la imagen de banner.");
      setSnackbarOpen(true);
    } finally {
      setButtonDis(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Subir Nueva Imagen de Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Seleccionar Imagen</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={buttonDis}>
          Subir Imagen
        </Button>
      </Modal.Footer>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" elevation={6} variant="filled">
          {snackbarMensaje}
        </Alert>
      </Snackbar>
    </Modal>
  );
}

export default ModalBanner;
