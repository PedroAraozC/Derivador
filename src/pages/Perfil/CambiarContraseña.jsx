// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
//import './registro.css';
import Swal from 'sweetalert2';
import { Button, Form, Modal, ModalBody, ModalFooter} from 'react-bootstrap';
import cdigitalApi from '../../config/axios';
import { useNavigate } from 'react-router-dom/dist';


export const CambiarContraseña = (props) => {
   
  
  // eslint-disable-next-line react/prop-types
  const {  cerrarModal, setModalAbierto } = props;
    // eslint-disable-next-line react/prop-types
    const[datos,setDatos]= useState({
        clave_actual:"",
        clave_nueva:""
    });
    const [confirmarContraseña, setConfirmarContraseña] = useState('');
   const navigate = useNavigate();
    





    const CambiarContraseñaDB = async (e) => {
        e.preventDefault();
 if( datos.clave_actual.length == 0 || datos.clave_nueva.length == 0 ){
          return Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: 'Debe ingresar una clave',   
              confirmButtonColor:"#6495ED"              
            })
      }
       
if( datos.clave_nueva !== confirmarContraseña){
            return Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: 'Las claves no coinciden',   
                confirmButtonColor:"#6495ED"             
              })
        }
        if( datos.clave_nueva == datos.clave_actual){
            return Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: 'La nueva clave debe ser diferente a la enterior', 
                confirmButtonColor:"#6495ED"                 
              })
        }
if( datos.clave_nueva.length < 6){
          return Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: 'La clave debe tener 6 caracteres como mínimo',     
              confirmButtonColor:"#6495ED"           
            })
      }

if( datos.clave_nueva.length > 30){
        return Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: 'La clave debe tener 30 caracteres como máximo',    
            confirmButtonColor:"#6495ED"             
          })
    }





        console.log(datos);
       setModalAbierto(false);

      try {
         // const resp = await cdigitalApi.put("/usuarios/validar", datos);
  
        //   if (resp.data.ok) {
        //       Swal.fire({
        //           position: "center",
        //           icon: "success",
        //           title: `Clave cambiada!`,
        //           showConfirmButton: false,
        //           timer: 2000
        //       });
  
        //       setTimeout(() => {
        //           navigate("/");
        //       }, 2500);


      



        //   } 
          
        
      } catch (error) {
          console.log(error);
      }
  }
  


    const handleChange = (e) => {

     

          setDatos({
            ...datos,
            [e.target.name]:e.target.value ,
            
        });

     }

     const handleChangePassword = (e) => {

     

        setConfirmarContraseña(e.target.value);

   }

  return (
    <>

       
 <Modal  show={true} onHide={cerrarModal} 
 //backdrop="static"
  keyboard={false}>


 <Modal.Header  >
          <Modal.Title>Cambiar clave</Modal.Title>
        </Modal.Header>


<ModalBody>

<Form  onSubmit={CambiarContraseñaDB} className='m-1 p-3 '>
  

  <Form.Group className="mb-3" controlId="clave">
    <Form.Label> Clave actual </Form.Label>
    <Form.Control
      type="password"
      name="clave_actual"
      onChange={handleChange}
       value={datos.clave_actual}
      required  
      autoFocus
    />
  </Form.Group>
  <Form.Group className="mb-3" controlId="newclave">
    <Form.Label> Nueva clave </Form.Label>
    <Form.Control
      type="password"  
      name="clave_nueva"
      onChange={handleChange}
       value={datos.clave_nueva}
      required 
      maxLength={30} 
      minLength={6}
    />
  </Form.Group>
  <Form.Group className="mb-3" controlId="confirmarclave">
    <Form.Label> Confirmar clave </Form.Label>
    <Form.Control
      type="password"  
      onChange={handleChangePassword}
       value={confirmarContraseña}
      required  
      maxLength={30} 
      minLength={6}
    />
  </Form.Group>

<div className='text-center'>
  <Button size='md' variant="primary" type="submit" className="w-50">
 Confirmar
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