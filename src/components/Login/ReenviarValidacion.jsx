// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
//import './registro.css';
import Swal from 'sweetalert2';
import { Button, Form, Modal, ModalBody, ModalFooter} from 'react-bootstrap';
import cdigitalApi from '../../config/axios';
import { Validacion } from '../Registro/Validacion';




export const ReenviarValidacion = (props) => {
   

  // eslint-disable-next-line react/prop-types
  const { cerrarModal } = props;
    // eslint-disable-next-line react/prop-types
    const[email,setEmail]= useState("");
   

    const [modalAbiertoValidar, setModalAbiertoValidar] = useState(false);
   
    const abrirModalValidar = () => setModalAbiertoValidar(true);
   
    const cerrarModalValidar=() => setModalAbiertoValidar(false);
  
    
    const validar = async (e) => {
        e.preventDefault();

      try {

       
         const resp =  await cdigitalApi.post(`/usuarios/email`,{email_persona:email});
        

          if (resp.data.ok) {

        abrirModalValidar();

          } 
          else{
            Swal.fire({
              position: "center",
              icon: "error",
              title: resp.data.mge,
              showConfirmButton: false,
              timer: 2000
          });
          }
          
        
      } 
      
      catch (error) {
          console.log(error);
      }
  }
  


    const handleChange = (e) => {

     

          setEmail(
            e.target.value 
            
        );

     }



  return (
    <>

       
 <Modal  show={true} onHide={cerrarModal} 
  >


 <Modal.Header closeButton >
          <Modal.Title>Reenviar email de validación</Modal.Title>
        </Modal.Header>


<ModalBody>

<Form  onSubmit={validar} className='m-1 p-3 '>
  

  <Form.Group className="mb-3" controlId="email">
    <Form.Label> Ingrese su email </Form.Label>
    <Form.Control
      type="email"
      name="email"
      onChange={handleChange}
       value={email}
      required  
      autoFocus
    />
  </Form.Group>



<div className='text-center'>
  <Button size='md' variant="primary" type="submit" className="w-50">
 ENVIAR
</Button>
  </div>
 
  </Form>


</ModalBody>

<ModalFooter>

</ModalFooter>
    
 </Modal>



 {modalAbiertoValidar && (
  <Validacion 
  email={email}
  cerrarModal={cerrarModalValidar}
  setModalAbierto={setModalAbiertoValidar}
  /> 
)} 

           
           
       
       
 

   
    
    </>
  )
}