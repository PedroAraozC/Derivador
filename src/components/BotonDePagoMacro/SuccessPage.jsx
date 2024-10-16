import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axios from '../../config/axios';

const SuccessPage = () => {

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mensaje, setMensaje] = useState("Algo Explotó :/");
    const [error, setError] = useState("error");

    const handleSend = async () => {

        const obj = {...JSON.parse(localStorage.getItem("emailData")), user: JSON.parse(localStorage.getItem("user"))}
  
          try {

              const {data} = await axios.post(
                  "/usuarios/obtenerLibreDeuda",
                 obj
              );
            setOpenSnackbar(true);
            setMensaje("Consulta enviada con éxito!");
            setError("success");
    
            console.log(data);
         
            // const timer = setTimeout(() => {
            //   setOpenModal(false);
            // }, 5000);
            
          } catch (error) {
            setOpenSnackbar(true);
            setMensaje("Algo explotó! :(");
            setError("error");
            console.error("Algo salió mal :(", error);
          }

      };

      useEffect(() => {
        if(JSON.parse(localStorage.getItem("emailData"))){
            handleSend();
        }
      }, [])
      

      const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setOpenSnackbar(false);
      };

  return (
    <div>SuccessPage


<Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Ajusta la posición del Snackbar
        style={{ bottom: "-70%" }} // Ajusta el espacio entre Snackbars
      >
        <Alert
          onClose={handleClose}
          severity={error}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {mensaje}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default SuccessPage