import React, { useEffect, useState } from 'react'
import iconoError from "../../assets/error-icon.png"

const ErrorPage = () => {
    const [countdown, setCountdown] = useState(5); // Inicializa el conteo regresivo en 5 segundos

    localStorage.removeItem('user');
    localStorage.removeItem('emailData');

    useEffect(() => {
      // Configura un temporizador que actualice el conteo regresivo cada segundo
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Cuando el conteo regresivo llegue a 0 o menos, redirige a la nueva URL
            clearInterval(timer);
            // window.location.href = 'http://localhost:5173/#/veredas';
            window.location.href = 'https://cidituc.smt.gob.ar/#/home';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
      // Limpia el temporizador si el componente se desmonta
      return () => clearInterval(timer);
    }, []);
  
    return (
      <div className='text-center mt-5'>
        <h1>No se pudo procesar el pago</h1>
  
        <img
          style={{
            width: "10%",
            objectFit: "cover",
          }}
          src={iconoError}
          alt=""
          className='mt-3 mb-4'
        />
  
        <h2 className='mb-5'>Intente nuevamente más tarde</h2>
  
        <div className='mt-4'>
          {countdown > 0 ? (
            <h5>Será redirigido en: {countdown} segundos</h5>
          ) : (
            <p>Redirigiendo...</p>
          )}
        </div>
      </div>
    );
}

export default ErrorPage