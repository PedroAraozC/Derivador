import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import ModalBanner from "./ModalBanner";
import "./TablaBanner.css";

function TablaBanner() {
  const [banners, setBanners] = useState([
    { id: 1, imageUrl: "imagen1.jpg", enabled: true },
    { id: 2, imageUrl: "imagen2.jpg", enabled: false },
  ]);
  const [showModal, setShowModal] = useState(false);

  const handleEnableToggle = (id) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner.id === id ? { ...banner, enabled: !banner.enabled } : banner
      )
    );
  };


  const handleAddBanner = () => {
    setShowModal(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
  };

  const handleUploadSuccess = (newImageUrl) => {
    const newBanner = {
      id: banners.length + 1,
      imageUrl: newImageUrl, // Imagen recién subida
      enabled: true,
    };
    setBanners([...banners, newBanner]); // Añade el nuevo banner a la tabla
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
            <tr key={banner.id}>
              <td>{banner.imageUrl}</td>
              <td>
                <Form.Check
                  type="switch"
                  checked={banner.enabled}
                  onChange={() => handleEnableToggle(banner.id)}
                />
              </td>
              <td>
                <Button variant="primary">Vista Previa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal separado para subir la imagen */}
      <ModalBanner
        show={showModal}
        handleClose={handleCloseModal}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}

export default TablaBanner;
