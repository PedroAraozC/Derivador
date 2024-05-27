// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import "./Perfil.css";
import Swal from 'sweetalert2';
import { Button, Form, Modal, ModalBody, ModalFooter} from 'react-bootstrap';
import cdigitalApi from '../../config/axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';




export const CambiarContraseña = (props) => {
   

  // eslint-disable-next-line react/prop-types
  const { documento, cerrarModal, setModalAbierto } = props;
    // eslint-disable-next-line react/prop-types
    const[datos,setDatos]= useState({
      documento_persona:documento,
        clave_actual:"",
        clave_nueva:""
    });
    const [confirmarContraseña, setConfirmarContraseña] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
   
    function validarClave(clave) {
      // La expresión regular busca al menos un número (\d) y al menos una letra mayúscula ([A-Z])
      const regex = /^(?=.*\d)(?=.*[A-Z])/;
      return regex.test(clave);
    }

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };
    const handleTogglePassword2 = () => {
      setShowPassword2(!showPassword2);
    };
    const handleTogglePassword3 = () => {
      setShowPassword3(!showPassword3);
    };


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
if( datos.clave_nueva.length < 8){
          return Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: 'La clave debe tener 8 caracteres como mínimo',     
              confirmButtonColor:"#6495ED"           
            })
      }

if( datos.clave_nueva.length > 25){
        return Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: 'La clave debe tener 30 caracteres como máximo',    
            confirmButtonColor:"#6495ED"             
          })
    }
    if (!validarClave(datos.clave_nueva)) {
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "La clave debe contener al menos una mayúscula y un número",
        confirmButtonColor: "#6495ED",
      });
    }

      try {


         const resp = await cdigitalApi.put("/usuarios/editarClave", datos);
  
          if (resp.data.ok) {
              Swal.fire({
                  position: "center",
                  icon: "success",
                  title: resp.data.message,
                  showConfirmButton: false,
                  timer: 2000
              });
  
              setModalAbierto(false);
              setTimeout(() => {
                window.location.href = 'https://turnos.smt.gob.ar/';
              }, 3000);

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
      type={showPassword ? "text" : "password"}
      name="clave_actual"
      onChange={handleChange}
       value={datos.clave_actual}
      required  
      autoFocus
      
    />
      <div className="d-flex justify-content-end">
                          {showPassword ? (
                            <FaEyeSlash
                              onClick={handleTogglePassword}
                              className="ojo"
                            />
                          ) : (
                            <FaEye
                              onClick={handleTogglePassword}
                              className="ojo"
                            />
                          )}
                        </div>
  </Form.Group>
  <Form.Group className="mb-3" controlId="newclave">
    <Form.Label> Nueva clave </Form.Label>
    <Form.Control
      type={showPassword2 ? "text" : "password"}
      name="clave_nueva"
      onChange={handleChange}
       value={datos.clave_nueva}
      required 
      maxLength={30} 
      minLength={6}
      title="* La clave debe tener al menos 8 caracteres y debe contener al menos una mayúscula y un número"
    />
         <div className="d-flex justify-content-end">
                          {showPassword2 ? (
                            <FaEyeSlash
                              onClick={handleTogglePassword2}
                              className="ojo"
                            />
                          ) : (
                            <FaEye
                              onClick={handleTogglePassword2}
                              className="ojo"
                            />
                          )}
                        </div>
  </Form.Group>
  <Form.Group className="mb-3" controlId="confirmarclave">
    <Form.Label> Confirmar clave </Form.Label>
    <Form.Control
        type={showPassword3 ? "text" : "password"}
      onChange={handleChangePassword}
       value={confirmarContraseña}
      required  
      maxLength={30} 
      minLength={6}
    />
      <div className="d-flex justify-content-end">
                          {showPassword3 ? (
                            <FaEyeSlash
                              onClick={handleTogglePassword3}
                              className="ojo"
                            />
                          ) : (
                            <FaEye
                              onClick={handleTogglePassword3}
                              className="ojo"
                            />
                          )}
                        </div>
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