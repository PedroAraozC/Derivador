import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Crea el contexto de Banner
export const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Función para obtener las imágenes del banner desde el backend
  const obtenerBanners = async () => {
    try {
      const response = await axios.get("/api/banners"); // Cambia esta URL por la correcta
      setBanners(response.data);
    } catch (error) {
      console.error("Error obteniendo banners:", error);
    }
  };

  useEffect(() => {
    obtenerBanners();
  }, [refresh]);

  return (
    <BannerContext.Provider value={{ banners, obtenerBanners, refresh, setRefresh }}>
      {children}
    </BannerContext.Provider>
  );
};

