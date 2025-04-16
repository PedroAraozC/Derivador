import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axiosPatri from "../../../../config/axiosPatrimonio";

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
      if (!selectedFile) {
        throw new Error("No se ha seleccionado ninguna imagen");
      }

      const formData = new FormData();
      formData.append('imagen_banner', selectedFile);
      
      const response = await axiosPatri.post('/admin/crearBannerImagenes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 && response.data.nombre_banner) {
        setSnackbarMensaje("Imagen de banner subida con éxito");
        setSnackbarOpen(true);
        onUploadSuccess(response.data.nombre_banner);
        
        setTimeout(() => {
          handleClose();
          setSnackbarOpen(false);
          setSelectedFile(null);
        }, 1500);
      } else {
        throw new Error("Respuesta del servidor incompleta");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setSnackbarMensaje(error.response?.data?.message || error.message);
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
          <Form.Control 
            type="file" 
            onChange={handleFileChange}
            accept="image/*"
            disabled={buttonDis}
          />
          {selectedFile && (
            <small className="text-muted">
              Archivo seleccionado: {selectedFile.name}
            </small>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={buttonDis}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleUpload}
          disabled={buttonDis || !selectedFile}
        >
          {buttonDis ? 'Subiendo...' : 'Subir Imagen'}
        </Button>
      </Modal.Footer>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="info" 
          elevation={6} 
          variant="filled"
        >
          {snackbarMensaje}
        </Alert>
      </Snackbar>
    </Modal>
  );
}

export default ModalBanner;
