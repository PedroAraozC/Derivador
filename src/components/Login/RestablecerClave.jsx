// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
//import './registro.css';
import Swal from 'sweetalert2';
import { Button, Form, Modal, ModalBody, ModalFooter} from 'react-bootstrap';
import cdigitalApi from '../../config/axios';




export const RestablecerClave = (props) => {
   

  // eslint-disable-next-line react/prop-types
  const { cerrarModal, setModalAbierto } = props;
    // eslint-disable-next-line react/prop-types
    const[email,setEmail]= useState("");
   
  
    





    const restablecerContraseñaDB = async (e) => {
        e.preventDefault();

 console.log(email)

      try {


         const resp = await cdigitalApi.put("/usuarios/restablecerClave", {email:email});
  
          if (resp.data.ok) {
              Swal.fire({
                  position: "center",
                  icon: "success",
                  title: resp.data.message,
                  showConfirmButton: false,
                  timer: 2000
              });
  
              setModalAbierto(false);

          } 
          else{
            Swal.fire({
              position: "center",
              icon: "error",
              title: resp.data.message,
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
 //backdrop="static"
  keyboard={false}>


 <Modal.Header  >
          <Modal.Title>Restablecer clave</Modal.Title>
        </Modal.Header>


<ModalBody>

<Form  onSubmit={restablecerContraseñaDB} className='m-1 p-3 '>
  

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





           
           
       
       
 

   
    
    </>
  )
}