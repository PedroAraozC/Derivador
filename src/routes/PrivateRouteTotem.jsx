import { Navigate } from "react-router-dom";
import useStore from "../Zustand/Zustand";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

// eslint-disable-next-line react/prop-types
const PrivateRouteTotem = ({ children }) => {
  const { getAuth, authenticated, loading,user } = useStore();
  
  useEffect(() => {
    getAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  
  useEffect(() => {
   
    if(localStorage.getItem("token")){
      if(localStorage.getItem("destino") == "credencial"){

        const token = localStorage.getItem("token");
        const reparticion = localStorage.getItem("reparticion")
        const destino = localStorage.getItem("destino");

        const url = new URL(`https://ciudaddigital.smt.gob.ar/#/credencialesCiudadano/${user?.documento_persona}`);
        // const url = new URL(`http://181.105.6.205:91/`);
        url.searchParams.append("auth", token);
        url.searchParams.append("totem", true);
        // url.searchParams.append("rep", reparticion);
        // url.searchParams.append("destino", destino);

        console.log(url.toString()); 
        console.log(destino);
        window.location.href = url.toString();

      }
      if(localStorage.getItem("destino") == "turnero"){

        const token = localStorage.getItem("token");
        const reparticion = localStorage.getItem("reparticion")
        const destino = localStorage.getItem("destino");

        const url = new URL(`https://turnos.smt.gob.ar/`);
        // const url = new URL(`http://181.105.6.205:91/`);
        url.searchParams.append("auth", token);
        url.searchParams.append("totem", true);
        // url.searchParams.append("rep", reparticion);
        // url.searchParams.append("destino", destino);

        console.log(url.toString()); 
        console.log(destino);
        window.location.href = url.toString();

      }
    //   else if(localStorage.getItem("destino") == "google"){
    //     const token = localStorage.getItem("token");
    //     const url = new URL(`https://www.google.com/?hl=es`);
    //     // url.searchParams.append("auth", token);
    //     window.location.href = url.toString();
    //   }else if(localStorage.getItem("destino") == "boletin"){
    //     const token = localStorage.getItem("token");
    //     const destino = localStorage.getItem("destino");
    //     const url = new URL(`https://boletinoficial.smt.gob.ar/`);
    //     url.searchParams.append("auth", token);
    //     url.searchParams.append("destino", destino);
    //     window.location.href = url.toString();

    //   }else if(localStorage.getItem("destino") == "catastro"){
    //     const token = localStorage.getItem("token");
    //     const destino = localStorage.getItem("destino");
    //     const url = new URL(`https://catastro.smt.gob.ar/`);
    //     url.searchParams.append("auth", token);
    //     url.searchParams.append("destino", destino);
    //     window.location.href = url.toString();
    //   }else if(localStorage.getItem("destino") == "gaf"){
    //     const token = localStorage.getItem("token");
    //     const destino = localStorage.getItem("destino");
    //      const url = new URL(`http://181.105.6.205:9005/`);
    //      //const url = new URL(`http://localhost:5173`);
    //     url.searchParams.append("auth", token);
    //     url.searchParams.append("destino", destino);
    //     window.location.href = url.toString();
    //   }else{
    //     const token = localStorage.getItem("token");
    //     const url = new URL(`https://smt.gob.ar/`);
    //     url.searchParams.append("auth", token);
    //     window.location.href = url.toString();
    //   }
    }
  }, [authenticated])

  // useEffect(() => {
   
  //   if(localStorage.getItem("token") && localStorage.getItem("destino")){
      
  //     const token = localStorage.getItem("token");
  //     const reparticion = localStorage.getItem("reparticion")
  //     const destino = localStorage.getItem("destino");

  //     const url = new URL(`https://${destino}.smt.gob.ar/`);
  //     url.searchParams.append("auth", token);
  //     url.searchParams.append("rep", reparticion);
  //     url.searchParams.append("destino", destino);

  //     window.location.href = url.toString();
  //   }else{

  //     const url = new URL(`https://smt.gob.ar/`);
  //     window.location.href = url.toString();
  //   }
  // }, [authenticated])

  return loading ? (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  ) : !authenticated ? (
    children
  ) : (
    <Box sx={{ display: "flex" }}>
    <CircularProgress />
  </Box>
  );
};

export default PrivateRouteTotem;