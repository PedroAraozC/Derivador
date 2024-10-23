import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import ModalBanner from "./ModalBanner";
import axios from "../../../../config/axios";
import "./TablaBanner.css";

function TablaBanner() {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [imagenBanner, setImagenBanner] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState('');

  const fetchBanners = async () => {
    try {
      const response = await axios.get("http://localhost:3050/admin/obtenerBanners");
      setBanners(response.data);
    } catch (error) {
      console.error("Error al obtener los banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEnableToggle = async (id, habilita) => {
    const nuevoEstado = habilita === 1 ? 0 : 1; 

    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner.id_banner === id ? { ...banner, habilita: nuevoEstado } : banner
      )
    );

    try {
      await axios.post("admin/deshabilitarBanner", { id, hab: nuevoEstado });

      setSnackbarMensaje("");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar el estado del banner:", error);
  
      setBanners((prevBanners) =>
        prevBanners.map((banner) =>
          banner.id_banner === id ? { ...banner, habilita: habilita } : banner
        )
      );
      setSnackbarMensaje("Error al actualizar el banner.");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 1500);
    }
  };

  const handleAddBanner = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUploadSuccess = (newImageUrl) => {
    const newBanner = {
      imageUrl: `/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/Banner/${newImageUrl}`,
      habilita: true,
    };
    setBanners((prevBanners) => [...prevBanners, newBanner]);
  };

  const handleShowPreview = async (banner) => {
    setIsPreviewLoading(true);
    setSelectedBanner(banner);
    try {
      const response = await axios.get(`/admin/imagenPreview`, {
        params: { banner },
      });
      setImagenBanner(response.data.banner.base64Image);
    } catch (error) {
      console.error("Error al cargar la vista previa:", error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setImagenBanner("");
    setSelectedBanner(null);
    setIsPreviewLoading(false);
  };

  return (
    <div className="banner-table-container">
      <Button onClick={handleAddBanner}>Agregar Imagen</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Habilitado</th>
            <th>Vista Previa</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.id_banner}>
              <td>
                <p>{banner.nombre_banner}</p>
              </td>
              <td>
                <Form.Check
                  type="switch"
                  checked={banner.habilita === 1}
                  onChange={() => handleEnableToggle(banner.id_banner, banner.habilita)}
                  disabled={isPreviewLoading}
                />
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleShowPreview(banner)}
                  disabled={isPreviewLoading}
                >
                  {isPreviewLoading ? "Cargando..." : "Vista Previa"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para subir la imagen */}
      <ModalBanner show={showModal} handleClose={handleCloseModal} />

      {/* Modal para mostrar vista previa de la imagen */}
      <Modal show={selectedBanner !== null && imagenBanner !== ""} onHide={handleClosePreview}>
        <Modal.Header closeButton>
          <Modal.Title>Vista Previa del Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBanner && (
            <img
              src={`data:image/jpeg;base64,${imagenBanner}`}
              alt="Vista Previa"
              style={{ width: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePreview}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Snackbar para notificaciones */}
      {snackbarOpen && (
        <div className="snackbar">{snackbarMensaje}</div>
      )}
    </div>
  );
}

export default TablaBanner;
