// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import React, { forwardRef, useRef, useState } from "react";
import "./registro.css";
import Swal from "sweetalert2";
import { Col, Container, Form, Row } from "react-bootstrap";
//import logo from '../assets/logo1.png';
import logo2 from "../../assets/Logo_SMT_neg_4.png";
import logo3 from "../../assets/Logo_SMT_neg_3.png";
import { FaEye, FaEyeSlash, FaCalendar } from "react-icons/fa";
import { Validacion } from "./Validacion";
import cdigitalApi from "../../config/axios";
import { useEffect } from "react";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useStore from "../../Zustand/Zustand";
import { Terminos } from "./Terminos";
import { ArrowBack } from "@mui/icons-material";

export const Registro = () => {
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [flagBoton, setFlagBoton] = useState(false);
  const { authenticated } = useStore();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (authenticated) {
  //       const token = localStorage.getItem("token");

  //       const url = new URL(`https://cidituc.smt.gob.ar/`);

  //       url.searchParams.append("auth", token);
  //       url.searchParams.append("destino", "derivador");

  //       window.location.href = url.toString();
  //   }
  // }, [authenticated]);  

  const [modalAbierto2, setModalAbierto2] = useState(false);

  const abrirModal = () => {
    setModalAbierto(true);
  };
  const abrirModal2 = () => {
    setModalAbierto2(true);
  };
  const cerrarModal = () => setModalAbierto(false);
  const cerrarModal2 = () => setModalAbierto2(false);
  const [formData, setFormData] = useState({
    documento_persona: "",
    nombre_persona: "",
    apellido_persona: "",
    email_persona: "",
    clave: "",
    telefono_persona: "",
    domicilio_persona: null,
    id_provincia: 1,
    localidad_persona: null,
    id_pais: 1,
    fecha_nacimiento_persona: "",
    id_genero: "",
    validado: false,
    habilita: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [paises, setPaises] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState([]);
  const datePickerRef = useRef(null);

  useEffect(() => {
    obtenerDatosDB();
  }, []);

  moment.tz.setDefault("America/Buenos_Aires");
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);

  function validarCUIL(cuil) {
 
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

  function validarClave(clave) {
    // La expresión regular busca al menos un número (\d) y al menos una letra mayúscula ([A-Z])
    const regex = /^(?=.*\d)(?=.*[A-Z])/;
    return regex.test(clave);
  }

  const obtenerDatosDB = async () => {
    try {
      // const paisesDB = await cdigitalApi.get("/ciudadanoDigital/paises");
      // const provinciasDB = await cdigitalApi.get(
      //   "/ciudadanoDigital/provincias"
      // );
      const generosDB = await cdigitalApi.get("/ciudadanoDigital/genero");
      // const documentoDB = await cdigitalApi.get("/ciudadanoDigital/documento");

      // setPaises(paisesDB.data.ciudadanos);
      // setProvincias(provinciasDB.data.ciudadanos);
      setGeneros(generosDB.data.ciudadanos);
      // setTipoDocumento(documentoDB.data.ciudadanos);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleTogglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFlagBoton(true);
    let diferenciaTiempo =
      maxDate.getTime() - formData.fecha_nacimiento_persona.getTime();
    let edad = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24 * 365));
    const cuilValidado = validarCUIL(formData.documento_persona);

    // ! Verificar Email
     const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const patronEmail =
    //   /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|net|org|gov|edu|info)$/i;

    if (!cuilValidado) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "El CUIL ingresado no es valido",
        confirmButtonColor: "#6495ED",
      });
    }

    if (!patronEmail.test(formData.email_persona)) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "El correo electronico que ingresaste no es válido",
        confirmButtonColor: "#6495ED",
      });
    }
    // ! Verificar que las contraseñas sean iguales
    if (formData.clave !== confirmarContraseña) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "Las claves no coinciden",
        confirmButtonColor: "#6495ED",
      });
    }

    if (formData.clave.length < 8) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "La clave debe tener 8 caracteres como mínimo",
        confirmButtonColor: "#6495ED",
      });
    }

    if (formData.clave.length > 25) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "La clave debe tener 25 caracteres como máximo",
        confirmButtonColor: "#6495ED",
      });
    }

    if (!validarClave(formData.clave)) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "La clave debe contener al menos una mayúscula y un número",
        confirmButtonColor: "#6495ED",
      });
    }

    if (formData.documento_persona.length < 11) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "El CUIL no puede tener menos de 11 dígitos",
        confirmButtonColor: "#6495ED",
      });
    }

    if (formData.telefono_persona < 0) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "El nro de celular no puede ser negativo",
        confirmButtonColor: "#6495ED",
      });
    }

    if (formData.documento_persona < 0) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "El DNI no puede ser negativo",
        confirmButtonColor: "#6495ED",
      });
    }

    if (formData.telefono_persona.length != 10) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "El nro de celular debe tener 10 dígitos sin guiones ejemplo: 3814123456",
        confirmButtonColor: "#6495ED",
      });
    }

    //   if( formData.id_provincia == 0){
    //     return Swal.fire({
    //         icon: 'error',
    //         title: '¡Ups!',
    //         text: 'Debe seleccionar una provincia',
    //         confirmButtonColor:"#6495ED"
    //       })
    // }
    // if( formData.id_pais == 0){
    //   return Swal.fire({
    //       icon: 'error',
    //       title: '¡Ups!',
    //       text: 'Debe seleccionar un país',
    //       confirmButtonColor:"#6495ED"
    //     })
    // }

    if (formData.id_genero == 0) {
      setFlagBoton(false);
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "Debe seleccionar un género",
        confirmButtonColor: "#6495ED",
      });
    }
    // if( formData.id_tdocumento == 0){
    //   return Swal.fire({
    //       icon: 'error',
    //       title: '¡Ups!',
    //       text: 'Debe seleccionar un tipo de documento',
    //       confirmButtonColor:"#6495ED"
    //     })
    // }

    // if (edad < 14) {
    //   setFlagBoton(false);
    //   return Swal.fire({
    //     icon: "error",
    //     title: "¡Ups!",
    //     text: "Debe ser mayor de 14 años para registrarse",
    //     confirmButtonColor: "#6495ED",
    //   });
    // }

    try {
  
      const resp2 = await cdigitalApi.get(
        `/usuarios/email/${formData.email_persona} `
      );
  
  
      if (resp2.data.ciudadano) {
        setFlagBoton(false);
        return Swal.fire({
          icon: "error",
          title: "¡Ups!",
          text: "El Email ingresado ya se encuentra registrado",
          confirmButtonColor: "#6495ED",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "Algo salió mal",
        confirmButtonColor: "#6495ED",
      });
    }

    // setFlagBoton(true);

    AgregarCiudadanoDB(formData);

  };

const validarCuilUsuarioExistente=async(value)=>{

  try {
    const resp = await cdigitalApi.get(
      `/usuarios/dni/${value} `
    );
 

    if (resp.data.ciudadano) {
       Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "El CUIL ingresado ya se encuentra registrado",
        showConfirmButton:false
      });


      setTimeout(() => {
   
         window.location.reload();
    
    }, 1000);


    }

  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "¡Ups!",
      text: "Algo salió mal",
      confirmButtonColor: "#6495ED",
    });
  }

}

  const handlePaste = (e) => {
    // Cancelar el evento para evitar que se pegue el texto
    e.preventDefault();
    // Puedes mostrar un mensaje o tomar otra acción aquí si lo deseas
  };

  const handleChange = (e, lon) => {
    let value = e.target.value; // Eliminar espacios en blanco alrededor del valor

    if (
     
      
      e.target.name === "id_genero"
    ) {
      value = value !== "" ? parseInt(value.slice(0, lon), 10) : ""; // Convertir a número si no está vacío
    } 
    
    else if (
     
      e.target.name === "documento_persona" & value.length==11
      
    ) 
    {

      validarCuilUsuarioExistente(value)

      value = value !== "" ? parseInt(value.slice(0, lon), 10) : ""; // Convertir a número si no está vacío


    } 

    else if (e.target.type === "number") {
      value = value.slice(0, lon); // Limitar la longitud si es necesario
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleNumberKeyDown = (e) => {
    if (e.target.type === "number" && e.key === "-") {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    const input = e.target;
    const { selectionStart } = input;
    // Permite la eliminación de los guiones
    if (e.key === "Backspace" || e.key === "Delete") {
      if (selectionStart === 3 || selectionStart === 6) {
        e.preventDefault();
        const newValue =
          input.value.slice(0, selectionStart - 1) +
          input.value.slice(selectionStart);
        input.value = newValue;
        // Restaura la posición del cursor
        input.setSelectionRange(selectionStart - 1, selectionStart - 1);
      }
    }
  };

  const handleChangeRaw = (e) => {
    const input = e.target.value;
    const maxLength = 11; // Longitud máxima de la fecha completa "dd-mm-aaaa"

    // Evita realizar más modificaciones si ya se alcanzó la longitud máxima
    if (input?.length === maxLength) {
      e.preventDefault();
      return;
    }

    let formattedDate = input;
    // Inserta automáticamente un guión después de los primeros dos dígitos
    if (input?.length === 2 && input.charAt(1) !== "-") {
      formattedDate += "-";
    }
    // Inserta automáticamente un guión después de los siguientes dos dígitos
    if (input?.length === 5 && input.charAt(4) !== "-") {
      formattedDate += "-";
    }
    // Actualiza el valor del input con el formato deseado

    if(input.length >= 10 ){
      
      if(new Date().getFullYear() - input.slice(-4) >= 100){
        e.target.value = "";
        Swal.fire({
          icon: "error",
          title: "Fecha Incorrecta",
          text: "No se puede registrar personas mayores a 100 años",
          confirmButtonColor: "#6495ED",
        });
          return;
      }else if(new Date().getFullYear() - input.slice(-4) <=16){
        e.target.value = "";
        Swal.fire({
          icon: "error",
          title: "Fecha Incorrecta",
          text: "Debe ser mayor de 16 años",
          confirmButtonColor: "#6495ED",
        });
          return;
      }
    }
    e.target.value = formattedDate;
  };

  const AgregarCiudadanoDB = async (data) => {
    try {
      const resp = await cdigitalApi.post("/usuarios/registro", data);

      if (resp.data.ok) 
      {
        setFlagBoton(false);
        return abrirModal();
      }
   
      else {
        setFlagBoton(false);
        Swal.fire({
          position: "center",
          icon: "error",
          title: `¡Ups! `,
          text: "Algo salió mal!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      
    } catch (error) {
      setFlagBoton(false);
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: `¡Ups! `,
        text: "Algo salió mal!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <header>
        <div className="bannerRegistro d-flex ">
          <div className="">
            <img src={logo2} alt="Logo 1" className="logo  mt-3 mb-3 ms-2" />
          </div>
        </div>
      </header>

      <h1 className=" text-center mt-4 titulo">Registro del Ciudadano Digital</h1>
 
      

      <Container fluid className="mt-4  pb-2">
        <Row className="justify-content-center ">
          <Col xs={12} md={8} className="mt-2 pt-3 main mb-3 pb-3">
            <Form onSubmit={handleRegister} className="m-1 p-3 ">
              <Row>
                <Col xs={12} md={6}>
                  {generos.length == 0 ? (
                    <Skeleton count={5} height={40} className="esqueleto" />
                  ) : (
                    <div>
                      <Form.Group className="mb-3" controlId="dni">
                        <Form.Label>
                          <strong>CUIL</strong>
                        </Form.Label>

                        <Form.Control
                          type="number"
                          placeholder="Ej: 20162345686"
                          onChange={(e) => handleChange(e, 11)}
                          onKeyDown={handleNumberKeyDown}
                          value={formData.documento_persona}
                          name="documento_persona"
                          required
                          className="custom-input-number input"
                          autoFocus
                          onPaste={handlePaste}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="nombre">
                        <Form.Label>
                          {" "}
                          <strong>Nombre </strong>{" "}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ej: Juan "
                          name="nombre_persona"
                          onChange={handleChange}
                          maxLength={50}
                          minLength={2}
                          required
                          value={formData.nombre_persona}
                          className="input"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3 " controlId="apellido">
                        <Form.Label>
                          {" "}
                          <strong>Apellido</strong>{" "}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ej: Perez"
                          name="apellido_persona"
                          onChange={handleChange}
                          maxLength={50}
                          minLength={2}
                          required
                          value={formData.apellido_persona}
                          className="input"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="genero">
                        <Form.Label>
                          {" "}
                          <strong>Género</strong>{" "}
                        </Form.Label>
                        <Form.Select
                          type="number"
                          onChange={(e) => handleChange(e, 2)}
                          value={formData.id_genero} // Convirtiendo a número aquí
                          name="id_genero"
                          maxLength={2}
                          required
                          className="input"
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
                        <Form.Label>
                          {" "}
                          <strong>Email </strong>{" "}
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Ej: juan@ejemplo.com"
                          name="email_persona"
                          onChange={handleChange}
                          maxLength={70}
                          required
                          value={formData.email_persona}
                          className="input"
                          onPaste={handlePaste}
                        />
                      </Form.Group>
                    </div>
                  )}
                </Col>

                <Col xs={12} md={6}>
                  {
                  generos.length == 0 ? (
                    <Skeleton count={5} height={40} className="esqueleto" />
                  ) : (
                    <div>
                      <Form.Group
                        className=" d-flex flex-column"
                        controlId="clave"
                      >
                        <Form.Label>
                          {" "}
                          <strong>Clave</strong>{" "}
                        </Form.Label>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Escriba una clave"
                          name="clave"
                          onChange={handleChange}
                          value={formData.clave}
                          minLength={6}
                          maxLength={30}
                          required
                          className="input"
                          onPaste={handlePaste}
                          title="* La clave debe tener al menos 8 caracteres y debe contener al menos una mayúscula y un número"
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

                      <Form.Group
                        className=" d-flex flex-column"
                        controlId="confirmarClave"
                      >
                        <Form.Label>
                          {" "}
                          <strong>Confirmar Clave</strong>{" "}
                        </Form.Label>
                        <Form.Control
                          type={showPassword2 ? "text" : "password"}
                          placeholder="Repetir clave"
                          onChange={(e) =>
                            setConfirmarContraseña(e.target.value)
                          }
                          minLength={6}
                          maxLength={30}
                          required
                          className="input"
                          onPaste={handlePaste}
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

                      {/* <Form.Group className="mb-3" controlId="domicilio">
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
  </Form.Group> */}

                      <Form.Group as={Row} controlId="nacimiento">
                        <Form.Label>
                          {" "}
                          <strong> Fecha de nacimiento</strong>
                        </Form.Label>
                        <DatePicker
                          selected={formData.fecha_nacimiento_persona}
                          onChange={(date) => {
                            setFormData({
                              ...formData,
                              fecha_nacimiento_persona: date,
                            });
                          }}
                          onPaste={handlePaste}
                          // onKeyDown={(e) => {
                          //   e.preventDefault(); // Evita que se escriba en el input
                          // }}

                          // dateFormat="yyyy-MM-dd"
                          dateFormat="dd-MM-yyyy"
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                          placeholderText="Ej: 12-05-1990"
                          className="form-control input "
                          required
                          locale={es}
                          timeZone="America/Buenos_Aires"
                          maxDate={maxDate}
                          minDate={minDate}
                          onChangeRaw={handleChangeRaw}
                          onKeyDown={handleKeyDown}
                          ref={datePickerRef}
                        />

                        <div className="d-flex justify-content-end">
                          <FaCalendar
                            onClick={() => {
                              // Abre el calendario cuando se hace clic en el icono de calendario
                              datePickerRef.current.setOpen(true);
                            }}
                            className="calendar"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="celular">
                        <Form.Label>
                          {" "}
                          <strong>Celular</strong>{" "}
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ej: 3813456789"
                          name="telefono_persona"
                          onChange={(e) => handleChange(e, 10)}
                          onKeyDown={handleNumberKeyDown}
                          value={formData.telefono_persona}
                          required
                          className="custom-input-number input"
                          onPaste={handlePaste}
                        />
                      </Form.Group>

                      <div className="mt-5 pt-1 d-flex flex-row justify-content-center justify-content-md-start">
                        <Form.Check
                          type="checkbox"
                          id="default-checkbox"
                          label={
                            <Form.Check.Label>
                              Acepto los{" "}
                              <a
                                className="text-blue"
                                style={{ cursor: "pointer" }}
                                onClick={abrirModal2}
                              >
                                términos y condiciones
                              </a>
                            </Form.Check.Label>
                          }
                          required
                          bsPrefix="custom-checkbox"
                        />
                      </div>

                      {/* <Form.Group className="mb-3" controlId="Provincia">
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
</Form.Group> */}

                      {/* <Form.Group className="mb-3" controlId="Pais">
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
  </Form.Group> */}

                      {/* <Form.Group className="mb-3" controlId="Localidad">
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
   
   
</Form.Group> */}
                    </div>
                  )}
                </Col>
              </Row>

              <Row>
                <Col className="text-center mt-3">
                  <div className=' gap-2"'>
                    <Button
                      size="lg"
                      variant="contained"
                      type="submit"
                      className="boton"
                      disabled={flagBoton? true: false}
                    >
                      Enviar
                    </Button>
                  </div>
                  
                </Col>
                
              </Row>
            </Form>
          </Col>
        
        </Row>

       
      </Container>
      <div className="text-center">
        <Button onClick={()=>navigate("/*")} color="error" variant="contained" className=" boton "><ArrowBack />   salir</Button>
        </div>

      {/* <footer className="footerregistro d-flex flex-row  justify-content-center justify-content-sm-between  ">
        <div className="col-xs-12 text-center">
          <img
            src={logo3}
            alt="Logo 1"
            className="logo3 mt-3 ms-2 mx-auto mb-2"
          />
        </div>
        <div className="mt-4 me-3 d-none d-md-block">
          <p className="text-light">
            Desarrollado por: Dirección de Innovación Tecnológica
          </p>
        </div>
      </footer> */}

      {modalAbierto && (
        <Validacion
          email={formData.email_persona}
          cerrarModal={cerrarModal}
          setModalAbierto={setModalAbierto}
        />
      )}

      {modalAbierto2 && <Terminos cerrarModal={cerrarModal2} />}
    </>
  );
};