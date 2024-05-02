// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import './registro.css';
import Swal from 'sweetalert2';
import { Button, Form, Modal, ModalBody, ModalFooter} from 'react-bootstrap';
//import { Navigate } from 'react-router';
// import logo from '../assets/Logo_Muni200x200.png';
// import logo2 from '../assets/logo_municipalidad.png';
// import logo3 from '../assets/logomuni_piedepagina.png';


import cdigitalApi from '../../config/axios';
import { useNavigate } from 'react-router-dom/dist';


export const Validacion = (props) => {
   
  
  // eslint-disable-next-line react/prop-types
  const { email, cerrarModal, setModalAbierto } = props;
    // eslint-disable-next-line react/prop-types
    const[datos,setDatos]= useState({email_persona:email,
    codigo_verif:undefined});
   const navigate = useNavigate();
    

    const validar = async (e)=>{
      e.preventDefault();
     


  ValidarCiudadanoDB();
  



  
        
    }



    const ValidarCiudadanoDB = async () => {
      try {
          const resp = await cdigitalApi.put("/usuarios/validar", datos);
  
          if (resp.data.ok) {
              Swal.fire({
                  position: "center",
                  icon: "success",
                  title: `¡Código correcto! Registro validado.`,
                  showConfirmButton: false,
                  timer: 2000
              });
  
              setTimeout(() => {
                  navigate("/");
              }, 2500);


            //   setTimeout(() => {
            //     window.location.href = "http://172.16.8.209/";
            // }, 2500);



          } else {
              Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: 'El código ingresado es incorrecto.',
                showCancelButton: true,
                confirmButtonText: 'Intentar de nuevo',
                cancelButtonText: 'Cancelar',
                confirmButtonColor:"#6495ED" ,
                cancelButtonColor: "#d33",
              }).then((result) => {
                  if (result.isConfirmed) { // Si el usuario hace clic en "Intentar de nuevo"
                      setModalAbierto(true);
                  }
                  else{
                    setModalAbierto(false);
                  }
              });
          }
      } catch (error) {
          console.log(error);
      }
  }
  


    const handleChange = (e) => {

     

          setDatos({
            ...datos,
            [e.target.name]:parseInt(e.target.value.slice(0, 4)) ,
            
        });

     }



  return (
    <>

       
 <Modal  show={true} onHide={cerrarModal} backdrop="static" keyboard={false}>


 <Modal.Header  >
          <Modal.Title>Le enviamos un email de validación a <strong>{datos.email_persona}</strong>  con un código de 4 dígitos</Modal.Title>
        </Modal.Header>


<ModalBody>

<Form  onSubmit={validar} className='m-1 p-3 '>
  

  <Form.Group className="mb-3" controlId="telefono">
    <Form.Label> <strong>Código de validación</strong> </Form.Label>
    <Form.Control
      type="number"
     
      name="codigo_verif"
      onChange={handleChange}
       value={datos.codigo_verif}
      required
      
    />
  </Form.Group>

<div className='text-center'>
  <Button size='md' variant="primary" type="submit" className="w-50">
 Validar
</Button>
  </div>
 
  </Form>


</ModalBody>

<ModalFooter>

</ModalFooter>
    
 </Modal>





           
           
       
       
 

   
    
    </>
  )
}