import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fotoDefault from "../../assets/person.svg";
import "./Perfil.css";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import useStore from "../../Zustand/Zustand";
import cdigitalApi from "../../config/axios";
import DatePicker from "react-datepicker";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import Swal from "sweetalert2";
import { CambiarContraseña } from "../../pages/Perfil/CambiarContraseña";
import { ArrowBack, AssignmentInd, Badge } from "@mui/icons-material";
import { FaCalendar, FaIdCard } from "react-icons/fa";
import moment from "moment-timezone";
import "react-datepicker/dist/react-datepicker.css";
import ModalEliminar from "../../components/ModalEliminar/ModalEliminar";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const { user, updateUser, logout, getAuth } = useStore();
  // const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [saveChanges, setSaveChanges] = useState(false);
  // JSON.parse(localStorage.getItem("saveChanges")) || false);

  const [formData, setFormData] = useState({
    documento_persona: user.documento_persona,
    nombre_persona: user.nombre_persona,
    apellido_persona: user.apellido_persona,
    email_persona: user.email_persona,
    telefono_persona: user.telefono_persona,
    domicilio_persona: user.domicilio_persona,
    localidad_persona: user.localidad_persona,
    fecha_nacimiento_persona: user.fecha_nacimiento_persona,
  });

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modal2Abierto, setModal2Abierto] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const abrirModal = () => setModalAbierto(true);
  const abrirModal2 = () => setModal2Abierto(true);
  const cerrarModal = () => setModalAbierto(false);
  const cerrarModal2 = () => setModal2Abierto(false);
  const abrirModalEliminarCuenta = () => setModalOpen(true);
  const cerrarModalEliminarCuenta = () => setModalOpen(false);

  const datePickerRef = useRef(null);

  moment.tz.setDefault("America/Buenos_Aires");

  const currentDate = new Date();
  const maxDate = new Date();
maxDate.setFullYear(currentDate.getFullYear() - 16);
  const usuario = user;

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

    if(input?.length >= 10 ){
      
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







    // Actualiza el valor del input con el formato deseado
    e.target.value = formattedDate;
  };

  function formatDate(dateString) {
    const parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const handlePaste = (e) => {
    // Cancelar el evento para evitar que se pegue el texto
    e.preventDefault();
    // Puedes mostrar un mensaje o tomar otra acción aquí si lo deseas
  };
  //   const validarEmail=async ()=>{

  //     if(usuario.validado==1){

  // return Swal.fire({text:"Su email ya está validado!",
  // confirmButtonColor:"#1F89F6"});

  //     }

  // try {

  //   await cdigitalApi.post(`/usuarios/email`,{email_persona:user.email_persona,documento_persona:user.documento_persona});
  // abrirModal();

  // }
  // catch(error)
  // {
  // console.log(error);
  // }

  //   }

  const actualizarUsuarioConFormData = (objeto1, objeto2) => {
    for (const key in objeto2) {
      // eslint-disable-next-line no-prototype-builtins
      if (objeto2.hasOwnProperty(key) && objeto1.hasOwnProperty(key)) {
        // Verificar si el valor del campo es de tipo string
        if (typeof objeto2[key] === "string") {
          // Aplicar toUpperCase() al valor del campo
          objeto1[key] = objeto2[key].toUpperCase();
        } else {
          // Si no es de tipo string, asignar el valor sin modificar
          objeto1[key] = objeto2[key];
        }
      }
    }
  };

  const volver = () => {
    //  const rep=localStorage.getItem("rep")
    //  const token=localStorage.getItem("token")

    window.location.href = `https://${localStorage.getItem(
      "origin"
    )}.smt.gob.ar/`;
  };

  const handleChange = (e, lon) => {
    let value = e.target.value; // Eliminar espacios en blanco alrededor del valor

    if (e.target.name === "documento_persona") {
      value = value !== "" ? parseInt(value.slice(0, lon), 10) : ""; // Convertir a número si no está vacío
    } else if (e.target.type === "number") {
      value = value.slice(0, lon); // Limitar la longitud si es necesario
    }else if (e.target.name == "nombre_persona"){
      value = value.replace(/[^A-Za-z\s]/g, '') 
    }
    else if (e.target.name == "apellido_persona"){
      value = value.replace(/[^A-Za-z\s]/g, '') 
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  // const validator = () => {
  //   setValidado(!validado);

  // };

  const EditarCiudadanoDB = async (data) => {
    try {
      setSaveChanges(true);
      const resp = await cdigitalApi.put(`/usuarios/editarUsuario`, data);

      if (resp.data.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Perfil actualizado! `,
          showConfirmButton: false,
          timer: 2500,
        });

        actualizarUsuarioConFormData(user, data);
        console.log(user);

        updateUser(user);
        setIsEditing(!isEditing);

        //  localStorage.setItem("saveChanges", JSON.stringify(true));

        setTimeout(() => {
          window.location.href = `https://${localStorage.getItem(
            "origin"
          )}.smt.gob.ar/`;
        }, 3000);
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `Ups! `,
          text: "algo salió mal",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Ups! `,
        text: "algo salió mal",
        showConfirmButton: false,
        timer: 2500,
      });
    }
    setSaveChanges(false);
  };

  const handleEditDatos = async (e) => {
    e.preventDefault();

    // ! Verificar Email
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let diferenciaTiempo =
    maxDate.getTime() - formData.fecha_nacimiento_persona.getTime();
  let edad = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24 * 365));

    if (!patronEmail.test(formData.email_persona)) {
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "El correo electronico que ingresaste no es válido",
        confirmButtonColor: "#6495ED",
      });
    }

    //  if( formData.documento_persona.length > 8){
    //           return Swal.fire({
    //               icon: 'error',
    //               title: '¡Ups!',
    //               text: 'El DNI no puede tener mas de 8 dígitos',
    //             })
    //       }

    if (
      formData.telefono_persona.length == 0 ||
      formData.nombre_persona.length == 0 ||
      formData.apellido_persona.length == 0 ||
      formData.documento_persona.length == 0 ||
      formData.email_persona.length == 0
    ) {
      return Swal.fire({
        icon: "error",
        title: "¡Ups!",
        text: "No puede haber campos vacíos",
        confirmButtonColor: "#6495ED",
      });
    } else if (formData.nombre_persona.length > 50) {
      return Swal.fire({
        icon: "warning",
        title: "¡Ups!",
        text: "El Nombre no puede tener mas de 50 caracteres",
        confirmButtonColor: "#6495ED",
      });
    } else if (formData.apellido_persona.length > 30) {
      return Swal.fire({
        icon: "warning",
        title: "¡Ups!",
        text: "El Apellido no puede tener mas de 30 caracteres",
        confirmButtonColor: "#6495ED",
      });
    } else if (formData.telefono_persona < 0) {
      return Swal.fire({
        icon: "warning",
        title: "¡Ups!",
        text: "El nro de celular no puede ser negativo",
        confirmButtonColor: "#6495ED",
      });
    } else if (formData.telefono_persona.length != 10) {
      return Swal.fire({
        icon: "warning",
        title: "¡Ups!",
        text: "El nro de celular debe tener 10 dígitos sin guiones ejemplo: 3814123456",
        confirmButtonColor: "#6495ED",
      });
    } else if (formData.email_persona.length > 60) {
      return Swal.fire({
        icon: "warning",
        title: "¡Ups!",
        text: "El email no debe tener más de 60 dígitos",
        confirmButtonColor: "#6495ED",
      });
    } else if (formData.documento_persona < 0) {
      return Swal.fire({
        icon: "warning",
        title: "¡Ups!",
        text: "El CUIL no puede ser negativo",
        confirmButtonColor: "#6495ED",
      });
    }
    //  else if (formData.documento_persona.length !== 10) {
    //   return Swal.fire({
    //     icon: "warning",
    //     title: "¡Ups!",
    //     text: "El CUIL debe tener 10 digitos sin guiones ejemplo: 30655342946",
    //     confirmButtonColor: "#6495ED",
    //   });
    // }
    EditarCiudadanoDB(formData);
  };

  const goToCredencial = () => {
    const url = new URL(
      `https://ciudaddigital.smt.gob.ar/#/credencialesCiudadano/${user.documento_persona}`
    );
    window.open(url.toString());
  };
  const eliminarCuenta = async () => {
    try {
      const resp = await cdigitalApi.patch(`/usuarios/desactivar`, {
        data: { documento_persona: formData.documento_persona },
      });
      if (resp.data.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Cuenta desactivada`,
          showConfirmButton: false,
          timer: 2500,
        });
        logout();
        // Aquí puedes manejar cualquier lógica adicional después de eliminar la cuenta
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `Ups! `,
          text: "Algo salió mal",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Ups! `,
        text: "Algo salió mal",
        showConfirmButton: false,
        timer: 2500,
      });
    } finally {
      cerrarModalEliminarCuenta();
    }
  };

  useEffect(() => {
    getAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" d-flex align-items-center justify-content-center flex-column">
      <div className="d-flex flex-column p-2 mt-5 contenedorPerfil">
        <div className="d-flex py-4 px-2 justify-content-between align-items-center gap-3">
          <img src={fotoDefault} alt="Foto de perfil" className="fotoPerfil" />
          {/* {usuario.validado==1 ? (
            <div className="d-flex align-items-center justify-content-center gap-2">
              <p className="m-0">Usuario validado: </p>
              <FontAwesomeIcon icon={faCheck}  />
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center gap-2">
              <p className="m-0">Usuario validado: </p>
              <FontAwesomeIcon icon={faXmark}  />
            </div>
          )} */}
        </div>

        {isEditing ? (
          <div className="px-2">
            <p className="datoUsuario">Nombre/s:</p>{" "}
            <p>{usuario.nombre_persona}</p>
            <p className="datoUsuario">Apellido/s:</p>{" "}
            <p>{usuario.apellido_persona}</p>
            <p className="datoUsuario">CUIL:</p>{" "}
            <p>{usuario.documento_persona}</p>
            <p className="datoUsuario">Fecha nacimiento:</p>{" "}
            <p>{formatDate(usuario.fecha_nacimiento_persona.split("T")[0])}</p>
            {/* <p className="datoUsuario">Localidad:</p> <p> {usuario.localidad_persona}</p>
            <p className="datoUsuario">Domicilio:</p> <p> {usuario.domicilio_persona}</p> */}
            <p className="datoUsuario">Telefono:</p>{" "}
            <p> {usuario.telefono_persona}</p>
            <p className="datoUsuario">Email:</p> <p>{usuario.email_persona}</p>
            <p className="datoUsuario">Clave:</p> <p> ***********</p>
          </div>
        ) : (
          <form className="px-2 d-flex flex-column formEdit">
            <p className="datoUsuario">Nombre/s:</p>
            <input
              type="text"
              placeholder="Nombre"
              className="inputEditPerfil"
              onChange={handleChange}
              value={formData.nombre_persona}
              name="nombre_persona"
              autoFocus
            />
            <p className="datoUsuario">Apellidos:</p>
            <input
              type="text"
              placeholder="Apellido"
              className="inputEditPerfil"
              onChange={handleChange}
              value={formData.apellido_persona}
              name="apellido_persona"
            />
            {/* <p className="datoUsuario">DNI:</p>
            <input type="number" placeholder="Documento" className="inputEditPerfil" 
             onChange={(e) => handleChange(e, 8)} value={formData.documento_persona} name="documento_persona"/> */}
            {/* <p className="datoUsuario">Localidad:</p>
            <input type="text" placeholder="Localidad" className="inputEditPerfil" 
             onChange={handleChange} value={formData.localidad_persona} name="localidad_persona"/> */}
            {/* <p className="datoUsuario">Domicilio:</p>
            <input type="text" placeholder="Domicilio" className="inputEditPerfil"
             onChange={handleChange} value={formData.domicilio_persona} name="domicilio_persona"/> */}
            <p className="datoUsuario">Telefono:</p>
            <input
              type="number"
              placeholder="Telefono o Celular"
              className="inputEditPerfil"
              onChange={(e) => handleChange(e, 10)}
              value={formData.telefono_persona}
              name="telefono_persona"
            />
            <p className="datoUsuario">Email:</p>
            <input
              type="email"
              placeholder="Correo electronico"
              className="inputEditPerfil"
              onChange={handleChange}
              value={formData.email_persona}
              name="email_persona"
            />

            <p className="datoUsuario">Fecha de Nacimiento</p>

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
              yearDropdownItemNumber={70}
              className="inputEditPerfil w-100"
              required
              // locale={es}
              timeZone="America/Buenos_Aires"
              maxDate={maxDate}
              onChangeRaw={handleChangeRaw}
              onKeyDown={handleKeyDown}
              ref={datePickerRef}
              
            />

            <p className="datoPie mt-2 text-center ">
              ¿Desea cambiar su clave? Haga click{" "}
              <a onClick={abrirModal2}>
                <strong>aquí</strong>
              </a>{" "}
            </p>

            {/* <p className="datoUsuario">Contraseña:</p>
            <input type="password" placeholder="Contraseña nueva" className="inputEditPerfil"
             onChange={handleChange} value={formData.clave} name="clave" required/>
<p className="datoUsuario">Confirmar contraseña:</p>
            <input type="password" placeholder="Confirmar contraseña" className="inputEditPerfil" 
             onChange={(e) => setConfirmarContraseña(e.target.value)} required/> */}
          </form>
        )}

        <div
          className={
            isEditing
              ? "d-flex justify-content-center"
              : "d-flex justify-content-center"
          }
        >
          {isEditing ? (
            <>
              {" "}
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outlined"
              >
                <EditIcon className="me-2" color="primary" /> Editar datos
              </Button>
              {/* <Button onClick={validarEmail} variant="outlined">
                  <MarkEmailReadIcon className="me-2" color="primary"  /> Validar email
                   </Button> */}
              <Button
                color="success"
                onClick={goToCredencial}
                variant="contained"
                className="text-center ms-2"
              >
                {" "}
                <AssignmentInd className="me-2" /> Ver credencial{" "}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEditDatos}
              variant="outlined"
              className="text-center"
              disabled={saveChanges}
            >
              <SaveIcon
                className="me-2"
                color={saveChanges ? "disabled" : "primary"}
              />{" "}
              Guardar Cambios
            </Button>
          )}
        </div>
      </div>
      <p className="eliminarCuenta" onClick={abrirModalEliminarCuenta}>
        ¿Desactivar Cuenta de CiDITuc?
      </p>
      <div className="d-flex mb-3 ">
        <Button onClick={volver} variant="contained" className="text-center">
          <ArrowBack className="me-2" color={"white"} /> Volver
        </Button>
      </div>
      <ModalEliminar
        open={modalOpen}
        handleClose={cerrarModalEliminarCuenta}
        handleDelete={eliminarCuenta}
      />
      {modal2Abierto && (
        <CambiarContraseña
          documento={user.documento_persona}
          cerrarModal={cerrarModal2}
          setModalAbierto={setModal2Abierto}
        />
      )}
    </div>
  );
};

export default Perfil;
