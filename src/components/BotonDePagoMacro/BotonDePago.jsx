import React from 'react'
import botonPago from "../../assets/macro-pago.png";
import { Button } from '@mui/material';

const BotonDePago = ({callbackSuccess,callbackCancel,frase,guid,secretKey, asunto, monto, user, entradaUsuario, setOpenSnackbar, setMensaje, setError, btnState, setBtnState}) => {

    const handlePaymentClick = () => {

        if (entradaUsuario.trim() !== "") {
            setBtnState(true);
        const emailData = {
            message: entradaUsuario.toUpperCase(),
            recipient: "tmfconsultas@smt.gob.ar",
            subjet: "Consulta de Multas de Tránsito",
          };
          localStorage.setItem("emailData",JSON.stringify(emailData))
          localStorage.setItem("user",JSON.stringify(user))
    
    
        // const secretKey = "MUNIESMDETUCUMANDIRECCIONCATASTRO_78696696-b930-4efe-b13a-7b12c96c8e30";
        //!const secretKey = "MUNIESMDETUCUMANDIRECCIONCATASTRO_ebcb1ea7-b9de-43c5-ac3a-691cb968512b";
        // const guid = "ed73ca37-2997-4c6c-b1d1-3a9853ed3344"; // Informado por la entidad bancaria
       //! const guid = "62be1013-a33f-434c-8a90-6cb72fe924bf"; // Informado por la entidad bancaria
        // const callbackSuccess = "http://localhost:5173/#/finalizarCargaCarpeta";
       //! const callbackSuccess= "https://catastro.smt.gob.ar/#/finalizarCargaCarpeta" ;// Cambiar por lo que corresponda
        // const callbackCancel = "http://localhost:5173/#/pagoErrorForm1"; 
       //! const callbackCancel = "https://catastro.smt.gob.ar/#/pagoErrorForm1";  // Cambiar por lo que corresponda
        const comercio = guid;
       //! const frase = "3K/1IIpZFYIdJmk6atqNbA7iQ+bLLdqqGhAdMamkT1Y=";
        let sucursalComercio = ""; // Inicialmente vacío
  
        const id = (Math.floor(Math.random() * 1000000)).toString(); // Generar ID único
        const transaccionId = "T" + "0".repeat(7 - id.length) + id;
    
        // Encriptar los valores
        const encryptedCallbackSuccess = AESEncrypter.encryptString(callbackSuccess, secretKey);
        const encryptedCallbackCancel = AESEncrypter.encryptString(callbackCancel, secretKey);
        const encryptedSucursalComercio = AESEncrypter.encryptString(sucursalComercio, secretKey);
        const encryptedMonto = AESEncrypter.encryptString(monto.toFixed(2), secretKey);
    
        // Crear un formulario oculto y enviarlo automáticamente
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandboxpp.asjservicios.com.ar';
        // form.action = 'https://botonpp.macroclickpago.com.ar/';
        // form.target="_blank";
        
        // Agregar los campos ocultos
        form.appendChild(createHiddenInput('CallbackSuccess', encryptedCallbackSuccess));
        form.appendChild(createHiddenInput('CallbackCancel', encryptedCallbackCancel));
        form.appendChild(createHiddenInput('Comercio', comercio));
        // form.appendChild(createHiddenInput('guid', guid));
        // form.appendChild(createHiddenInput('frase', frase));
        form.appendChild(createHiddenInput('SucursalComercio', encryptedSucursalComercio));
        form.appendChild(createHiddenInput('TransaccionComercioId', transaccionId));
        form.appendChild(createHiddenInput('Monto', encryptedMonto));
        form.appendChild(createHiddenInput('Producto[0]', asunto));
        form.appendChild(createHiddenInput('MontoProducto[0]', '100'));
    
        document.body.appendChild(form);
        form.submit();

        setBtnState(false);

    } else {
        setOpenSnackbar(true);
        setMensaje(`Por favor, ingrese la información solicitada`);
        setError("warning");
        // Aquí iría la lógica para manejar el envío del formulario
      }

      };
    
      const createHiddenInput = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        return input;
      };

  return (
    <Button
    disabled={btnState}
      variant="text"
       type="submit"
       onClick={handlePaymentClick}
      style={{
        padding: 0,
        width: "200px",
        height: "100px",
      }}
    >
      <img
        src={botonPago}
        alt="Icono del botón"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Button>
  )
}

export default BotonDePago