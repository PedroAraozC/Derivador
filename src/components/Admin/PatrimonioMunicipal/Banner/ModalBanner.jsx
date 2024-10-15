import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function ModalBanner({ show, handleClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [nombreBanner, setNombreBanner] = useState(""); // Agregado para el nombre del banner

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleNombreChange = (event) => {
    setNombreBanner(event.target.value); // Maneja el cambio del nombre del banner
  };

  const handleUpload = async () => {
    console.log("Nombre del banner:", nombreBanner); // Verifica el nombre del banner
    console.log("Archivo seleccionado para subir:", selectedFile); // Verifica el archivo
  
    if (!selectedFile || !nombreBanner) return; // Verifica que ambos estén definidos
  
    const formData = new FormData();
    formData.append("imagen_banner", selectedFile);
    formData.append("nombre_banner", nombreBanner); // Agregado para enviar el nombre del banner
  
    try {
      const response = await axios.post("http://localhost:3050/admin/crearBannerImagenes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUploadSuccess(URL.createObjectURL(selectedFile)); // Notifica al componente padre que se ha subido con éxito
      handleClose(); // Cierra el modal después de la subida
      console.log(response.data.message);
    } catch (error) {
      if (error.response) {
        console.error("Error en la respuesta del servidor:", error.response.data);
      } else {
        console.error("Error al subir la imagen del banner:", error);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Subir Nueva Imagen de Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formNombreBanner" className="mb-3">
          <Form.Label>Nombre del Banner</Form.Label>
          <Form.Control type="text" value={nombreBanner} onChange={handleNombreChange} />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Seleccionar Imagen</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleUpload}>
          Subir Imagen
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalBanner;
