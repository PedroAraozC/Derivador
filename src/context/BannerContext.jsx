// import { createContext, useState, useEffect } from "react";
// import axios from "../config/axios";

// export const BannerContext = createContext();

// export const BannerProvider = ({ children }) => {
//   const [banners, setBanners] = useState([]);
//   const [refresh, setRefresh] = useState(false);

//   const obtenerBanners = async () => {
//     try {
//       const response = await axios.get("/api/banners");
//       setBanners(response.data);
//     } catch (error) {
//       console.error("Error obteniendo banners:", error);
//     }
//   };

//   useEffect(() => {
//     obtenerBanners();
//   }, [refresh]);

//   return (
//     <BannerContext.Provider value={{ banners, obtenerBanners, refresh, setRefresh }}>
//       {children}
//     </BannerContext.Provider>
//   );
// };

