
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import './registro.css';
import Swal from 'sweetalert2';
import {  Col, Container, Form, Row } from 'react-bootstrap';
//import logo from '../assets/logo1.png';
import logo2 from '../../assets/Logo_SMT_neg_4.png';
import logo3 from '../../assets/Logo_SMT_neg_3.png';
import { FaEye, FaEyeSlash} from "react-icons/fa";
import { Validacion } from './Validacion';
import cdigitalApi from '../../config/axios';
import { useEffect } from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Button} from '@mui/material';



export const Registro = () => {
   
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const abrirModal = () => {
      console.log("Abriendo modal...");
      setModalAbierto(true);
  };
  const cerrarModal=() => setModalAbierto(false)
    
  const[formData, setFormData]= useState({
      
      documento_persona:"",
      nombre_persona:"",
      apellido_persona:"",
      email_persona:"",
      clave:"",
      telefono_persona:"",
      domicilio_persona:"",
      id_provincia:"",
      localidad_persona:"",
      id_pais:"",
      fecha_nacimiento_persona:"",
      id_genero:"",
      validado:false,
      habilita:false
      
    })
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [paises,setPaises] = useState([]);
  const [provincias,setProvincias] = useState([]);
  const [generos,setGeneros] = useState([]);
  const [tipoDocumento,setTipoDocumento] = useState([]);
  

  useEffect(() => {
 
    obtenerDatosDB();
  }, []);

  moment.tz.setDefault('America/Buenos_Aires');
  const maxDate = new Date();


  function validarCUIL(cuil) {
    // Verificar que el CUIL tenga 11 dígitos
    // if (cuil.length !== 11 || !/^\d+$/.test(cuil)) {
    //     return false;
    // }
    var cuilStr = cuil.toString();
    // Extraer los primeros 10 dígitos
    var digitos = cuilStr.substring(0, 10);

    // Extraer el dígito verificador
    var digitoVerificador = parseInt(cuilStr.charAt(10));

    // Definir los pesos para cada posición
    var pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

    // Calcular la suma de productos
    var suma = 0;
    for (var i = 0; i < 10; i++) {
        suma += parseInt(digitos.charAt(i)) * pesos[i];
    }

    // Calcular el residuo de la división por 11
    var residuo = suma % 11;

    // Calcular el dígito verificador esperado
    var digitoEsperado = residuo === 0 ? 0 : 11 - residuo;

    // Si el residuo es 0, el dígito esperado es 0
    if (residuo === 0) {
        digitoEsperado = 0;
    } else {
        digitoEsperado = 11 - residuo;
    }

    // Verificar si el dígito verificador coincide
    return digitoVerificador === digitoEsperado;
}

 
    const obtenerDatosDB= async()=>{ try {
      const paisesDB = await cdigitalApi.get("/ciudadanoDigital/paises");
      const provinciasDB = await cdigitalApi.get("/ciudadanoDigital/provincias");
      const generosDB = await cdigitalApi.get("/ciudadanoDigital/genero");
      const documentoDB = await cdigitalApi.get("/ciudadanoDigital/documento");
     
      setPaises(paisesDB.data.ciudadanos);
      setProvincias(provinciasDB.data.ciudadanos);
      setGeneros(generosDB.data.ciudadanos);
      setTipoDocumento(documentoDB.data.ciudadanos);
      
    } catch (error) {
      console.log(error);
      
    }
  }
  

 const handleTogglePassword = () => {
      setShowPassword(!showPassword);
      
    };
 const handleTogglePassword2 = () => {
      setShowPassword2(!showPassword2);
    };

 const handleRegister = async (e)=>{
      e.preventDefault();
  
   const cuilValidado=validarCUIL(formData.documento_persona)
   console.log(cuilValidado) 
        // ! Verificar Email
        const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!cuilValidado){
          return Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: 'El CUIL ingresado no es valido',  
              confirmButtonColor:"#6495ED"               
            })
      }


 if(!patronEmail.test(formData.email_persona)){
            return Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: 'El correo electronico que ingresaste no es válido',  
                confirmButtonColor:"#6495ED"               
              })
        }
        // ! Verificar que las contraseñas sean iguales
if( formData.clave !== confirmarContraseña){
            return Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: 'Las claves no coinciden',   
                confirmButtonColor:"#6495ED"              
              })
        }

        if( formData.clave.length < 6){
          return Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: 'La clave debe tener 5 caracteres como mínimo',    
              confirmButtonColor:"#6495ED"             
            })
      }

      if( formData.clave.length > 30){
        return Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: 'La clave debe tener 30 caracteres como máximo',    
            confirmButtonColor:"#6495ED"             
          })
    }


 if( formData.documento_persona.length < 11){
          return Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: 'El CUIL no puede tener menos de 11 dígitos', 
              confirmButtonColor:"#6495ED"                
            })
      }

      if( formData.telefono_persona <0){
        return Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: 'El nro de celular no puede ser negativo',   
            confirmButtonColor:"#6495ED"              
          })
    }

    if( formData.documento_persona <0){
      return Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: 'El DNI no puede ser negativo',  
          confirmButtonColor:"#6495ED"               
        })
  }



 if( formData.telefono_persona.length != 10){
        return Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: 'El nro de celular debe tener 10 dígitos sin guiones ejemplo: 3814123456',
            confirmButtonColor:"#6495ED"                 
          })
    }


  if( formData.id_provincia == 0){
    return Swal.fire({
        icon: 'error',
        title: '¡Ups!',
        text: 'Debe seleccionar una provincia',
        confirmButtonColor:"#6495ED"                 
      })
}
if( formData.id_pais == 0){
  return Swal.fire({
      icon: 'error',
      title: '¡Ups!',
      text: 'Debe seleccionar un país',   
      confirmButtonColor:"#6495ED"              
    })
}

if( formData.id_genero == 0){
  return Swal.fire({
      icon: 'error',
      title: '¡Ups!',
      text: 'Debe seleccionar un género',  
      confirmButtonColor:"#6495ED"               
    })
}
// if( formData.id_tdocumento == 0){
//   return Swal.fire({
//       icon: 'error',
//       title: '¡Ups!',
//       text: 'Debe seleccionar un tipo de documento', 
//       confirmButtonColor:"#6495ED"                
//     })
// }


try{
  const resp=await cdigitalApi.get(`/usuarios/dni/${formData.documento_persona} `);
  const resp2=await cdigitalApi.get(`/usuarios/email/${formData.email_persona} `);


 if(resp.data.ciudadano){
  return Swal.fire({
    icon: 'error',
    title: '¡Ups!',
    text: 'El CUIL ingresado ya se encuentra registrado',  
    confirmButtonColor:"#6495ED"              
  })

}
if(resp2.data.ciudadano){
  return Swal.fire({
    icon: 'error',
    title: '¡Ups!',
    text: 'El Email ingresado ya se encuentra registrado',  
    confirmButtonColor:"#6495ED"               
  })

}

}

catch(error)
{
console.log(error);
}
console.log(formData);
 AgregarCiudadanoDB(formData);
//  setFormData({
//   documento_persona: "",
//   id_tdocumento: "",
//   nombre_persona: "",
//   apellido_persona: "",
//   email_persona: "",
//   clave: "",
//   telefono_persona: "",
//   domicilio_persona: "",
//   id_provincia: "",
//   localidad_persona: "",
//   id_pais: "",
//   fecha_nacimiento_persona: "",
//   id_genero: "",
//   validado: false,
//   habilita: false,
// });

        
    }

    const handleChange = (e, lon) => {
      let value = e.target.value; // Eliminar espacios en blanco alrededor del valor
      
      if (e.target.name === "id_provincia" || e.target.name === "id_pais" || e.target.name === "documento_persona" ||e.target.name==="id_genero" ) {
        value = value !== "" ? parseInt(value.slice(0, lon), 10) : ""; // Convertir a número si no está vacío
      } else if (e.target.type === "number") {
        value = value.slice(0, lon); // Limitar la longitud si es necesario
      }
      
      setFormData({
        ...formData,
        [e.target.name]: value,
      });
    };


    
    
    

 const AgregarCiudadanoDB= async (data) =>
       {
       
           try{
               await cdigitalApi.post("/usuarios/registro",data);
               
               Swal.fire({
                position: "center",
                icon: "success",
                title: `Formulario enviado! Pendiente de validación `,
                showConfirmButton: false,
                timer: 2500
              });
              abrirModal();
             
           }
       
           catch(error)
           {
           console.log(error);
           }
    }

   
return (
    <>
   
<header>
<div className='bannerRegistro d-flex '>
      <div className=''>
        <img src={logo2} alt="Logo 1" className='logo  mt-3 mb-3 ms-2' />
        
      </div>
    
    </div>
</header>

  
<h1 className=' text-center mt-2 titulo'>Registro del ciudadano</h1>
        
        <Container fluid >

      <Row className='justify-content-center ' >
     <Col xs={12} md={8}  className='mt-2 pt-3 main mb-3 pb-3'>

   
  <Form  onSubmit={handleRegister} className='m-1 p-3 '>

      <Row>
<Col xs={12} md={6}>
{paises.length==0 ||provincias.length==0 || generos.length==0 || tipoDocumento.length==0   ? ( <Skeleton count={7} height={37} className='esqueleto'/>) : (

<div>


<Form.Group className="mb-3" controlId="dni">
  <Form.Label ><strong>CUIL (sin guiones)</strong></Form.Label>
  

    <Form.Control
     
      type="number"
      placeholder="Ej: 20162345686"
      onChange={(e) => handleChange(e, 11)}
      value={formData.documento_persona}
      name="documento_persona"
      required
      className="custom-input-number input" 
      autoFocus
    />

  
</Form.Group>

<Form.Group className="mb-3" controlId="nombre">
    <Form.Label> <strong>Nombre </strong> </Form.Label>
    <Form.Control
      type="text"
      placeholder="Ej: Juan "
      name='nombre_persona'
      onChange={handleChange}
      maxLength={50}
      minLength={2}
      required
      value={formData.nombre_persona}
      className='input'
    />
     
  </Form.Group>

  <Form.Group className="mb-3 " controlId="apellido">
    <Form.Label> <strong>Apellido</strong> </Form.Label>
    <Form.Control
      type="text"
      placeholder="Ej: Perez"
      name='apellido_persona'
      onChange={handleChange}
      maxLength={50}
      minLength={2}
      required
      value={formData.apellido_persona}
      className='input'
    />
     
  </Form.Group>

  <Form.Group className="mb-3" controlId="genero">
  <Form.Label> <strong>Genero</strong> </Form.Label>
  <Form.Select 
    type="number"    
    onChange={(e) => handleChange(e, 2)}
    value={(formData.id_genero)} // Convirtiendo a número aquí
    name="id_genero"
    maxLength={2}
    required
    className='input'
  >
     <option value={0}>SELECCIONE GENERO</option>
      {generos.map((genero, index) => (
        <option key={index} value={genero.id_genero}>
          {genero.nombre_genero}
        </option>
      ))}

  </Form.Select>
</Form.Group>

  <Form.Group className="mb-3" controlId="email">
    <Form.Label> <strong>Email </strong> </Form.Label>
    <Form.Control
      type="email"
      placeholder="Ej: juan@ejemplo.com"
      name="email_persona"
      onChange={handleChange}
      maxLength={70}
      required
      value={formData.email_persona}
      className='input'
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="celular">
    <Form.Label> <strong>Celular</strong> </Form.Label>
    <Form.Control
      type="number"
      placeholder="Ej: 3813456789"
      name="telefono_persona"
      onChange={(e)=>handleChange(e,10)}
      value={formData.telefono_persona}
      required
      className="custom-input-number input" 
    />
  </Form.Group>
</div>


)
}

</Col>

<Col xs={12} md={6}> 
{paises.length==0 ||provincias.length==0 || generos.length==0 || tipoDocumento.length==0  ? ( <Skeleton count={7} height={37} className='esqueleto'/>) :(
<div>
<Form.Group className=" d-flex flex-column" controlId="clave">
  <Form.Label> <strong>Clave</strong> </Form.Label>
    <Form.Control
     type={showPassword ? 'text' : 'password'}
      placeholder='Escriba una clave '
      name="clave"
      onChange={handleChange}
      value={formData.clave}
      minLength={6} 
      maxLength={30}
      required
      className='input'
    />
  <div className="d-flex justify-content-end">
  {showPassword ? (
          <FaEyeSlash
            onClick={handleTogglePassword}
            className='ojo'
            
          />
        ) : (
          <FaEye
            onClick={handleTogglePassword}
            className='ojo'
            
          />
        )}
  </div>
</Form.Group>

<Form.Group className=" d-flex flex-column" controlId="confirmarClave">
    <Form.Label> <strong>Confirmar Clave</strong> </Form.Label>
    <Form.Control
      type={showPassword2 ? 'text' : 'password'}
      placeholder='Repetir clave'
      onChange={(e) => setConfirmarContraseña(e.target.value)}
      minLength={6} 
      maxLength={30}
      required
      className='input'
    />
     <div className="d-flex justify-content-end">
  {showPassword2 ? (
          <FaEyeSlash
            onClick={handleTogglePassword2}
            className='ojo'
            
          />
        ) : (
          <FaEye
            onClick={handleTogglePassword2}
            className='ojo'
            
          />
        )}
  </div>
  </Form.Group>

  <Form.Group className="mb-3" controlId="domicilio">
    <Form.Label> <strong> Domicilio</strong></Form.Label>
    <Form.Control
      type="text"
      placeholder='Ej: Mendoza 345'
      onChange={handleChange}
      value={formData.domicilio_persona}
      name="domicilio_persona"
      maxLength={120}
      required
      className='input'
    />
  </Form.Group>

  <Form.Group as={Row} className="mb-3" controlId="nacimiento">
    <Form.Label> <strong> Fecha de nacimiento</strong></Form.Label>
    <DatePicker
         selected={formData.fecha_nacimiento_persona}    
      onChange={(date) =>{   setFormData({
        ...formData,
        fecha_nacimiento_persona: date,
      });} 
      
      }
          
         
          dateFormat="yyyy-MM-dd"
          showYearDropdown
         scrollableYearDropdown
          yearDropdownItemNumber={100}
          placeholderText="Selecciona una fecha"
          className="form-control input "
          required
          locale={es}
          timeZone="America/Buenos_Aires"
          maxDate={maxDate}
      
          
          
          
        />
  </Form.Group>

  <Form.Group className="mb-3" controlId="Provincia">
  <Form.Label> <strong>Provincia</strong> </Form.Label>
  <Form.Select 
    type="number"    
    onChange={(e) => handleChange(e, 2)}
    value={(formData.id_provincia)} // Convirtiendo a número aquí
    name="id_provincia"
    maxLength={2}
    required
    className='input'
  >
  <option value={0}>SELECCIONE PROVINCIA</option>
      {provincias.map((provincia, index) => (
        <option key={index} value={provincia.id_provincia}>
          {provincia.nombre_provincia}
        </option>
      ))}
  </Form.Select>
</Form.Group>

<Form.Group className="mb-3" controlId="Pais">
    <Form.Label> <strong>Pais</strong> </Form.Label>
    
 <Form.Select 
 type="number"    

 onChange={(e)=>handleChange(e,2)}
 value={formData.id_pais}
 name="id_pais"
 maxLength={2}
 required
 className='input'
 >
     <option value={0}>SELECCIONE PAIS</option>
      {paises.map((pais, index) => (
        <option key={index} value={pais.id_pais}>
          {pais.nombre_pais}
        </option>
      ))}
      
      
    </Form.Select>
  </Form.Group>


  <Form.Group className="mb-3" controlId="Localidad">
    <Form.Label> <strong>Localidad</strong> </Form.Label>
    
 <Form.Control
 
 type="text"    
 onChange={handleChange}
 value={formData.localidad_persona}
 name="localidad_persona"
 placeholder='Ej: San Miguel de Tucumán'
 maxLength={60}
 required
 className='input'
 
 />
   
   
</Form.Group>
</div>
)
      }
</Col>

      </Row>

<Row>
<Col className='text-center mt-2'>
<div className='className="d-grid gap-2"'>
  <Button size='lg'variant="contained" type="submit" className="w-50">
 Enviar
</Button>
  </div>

</Col>
<div className=" mt-4 ">
        <Form.Check
          type="checkbox"
          id="default-checkbox"
          label="Acepto los términos y condiciones"
          required
          
          bsPrefix="custom-checkbox" 
         
          
        />
        
      </div>

   
</Row>

 
  </Form>

   
     </Col>
         
      </Row>


    </Container>
   

<footer
 className='footerregistro d-flex flex-row  justify-content-center justify-content-sm-between'
 >
  <div  className='col-xs-12 text-center' >

  <img src={logo3} alt="Logo 1"className='logo3 mt-3 ms-2 mx-auto mb-2' />
  </div>
  <div className='mt-4 me-3 d-none d-sm-block'>
    <p className='text-light'>Desarrollado por: Dirección de Innovación Tecnológica</p>
  </div>

</footer>

{modalAbierto && (
  <Validacion 
  email={formData.email_persona}
  cerrarModal={cerrarModal}
  setModalAbierto={setModalAbierto}
  />
)}       
           
    
    </>
  )
}