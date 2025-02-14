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
            setMensaje("Consulta enviada con éxito. Revise su casilla de correo mas tarde..");
            setError("success");
    
            console.log(data);
         
           setTimeout(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('emailData');
            // window.location.href = 'https://cidituc.smt.gob.ar/#/home';
            window.location.href = 'http://localhost:5173/#/home';
            }, 5000);
            
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
    <div>

      <h4 className='text-center mt-4'>Pago realizado con éxtio. El tribunal de faltas le va a responder al correo indicado en su cuenta de Ciudadano Digital.</h4>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
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