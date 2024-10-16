import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../../../../config/axios";

function ModalBanner({ show, handleClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [buttonDis, setButtonDis] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");

  // Función para manejar el cambio de archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Archivo seleccionado:", file); // Verifica si el archivo se está seleccionando correctamente
    setSelectedFile(file);
  };
  
  const handleUpload = async (event) => {
    event.preventDefault();
    setButtonDis(true);
  
    try {
      const formData = new FormData();
      // Solo incluir el archivo
      if (selectedFile) {
        formData.append("imagen_banner", selectedFile); // Asegúrate de que este nombre coincida
      } else {
        throw new Error("No se ha seleccionado ninguna imagen");
      }
  
      // Envía la imagen al backend
      const response = await axios.post("http://localhost:3050/admin/crearBannerImagenes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Imagen subida correctamente", response.data);
    } catch (error) {
      console.error("Error en la respuesta del servidor:", error.response?.data || error.message);
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
    </Modal>
  );
}

export default ModalBanner;
