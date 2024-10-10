import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import "./TablaBanner.css";

function TablaBanner() {
  const [banners, setBanners] = useState([
    { id: 1, imageUrl: "imagen1.jpg", enabled: true },
    { id: 2, imageUrl: "imagen2.jpg", enabled: false },
  ]);
  
  const handleEnableToggle = (id) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner.id === id ? { ...banner, enabled: !banner.enabled } : banner
      )
    );
  };

  const handleAddBanner = () => {
    const newBanner = {
      id: banners.length + 1,
      imageUrl: "new-image.jpg",
      enabled: true,
    };
    setBanners([...banners, newBanner]);
  };

  const handleDeleteBanner = (id) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  return (
    <div className="banner-table-container">
      <Button onClick={handleAddBanner}>Agregar Imagen</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Habilitado</th>
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
                <Button variant="danger" onClick={() => handleDeleteBanner(banner.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TablaBanner;
