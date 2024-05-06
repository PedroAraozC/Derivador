import "./login.css";
import logoMuni from "../../assets/logoMuniNuevo.png";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Alert, Button, Snackbar } from "@mui/material";
import useStore from "../../Zustand/Zustand";
import { LOGIN_VALUES } from "../../helpers/constantes";
import { useNavigate } from "react-router-dom";
import { RestablecerClave } from "./RestablecerClave";
import { ReenviarValidacion } from "./ReenviarValidacion";

const Login = () => {
  const { authenticated, botonState, login, errors, setErrors } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState(LOGIN_VALUES);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAbierto2, setModalAbierto2] = useState(false);
  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);
  const abrirModal2 = () => setModalAbierto2(true);
  const cerrarModal2 = () => setModalAbierto2(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleErrors = (campos) => {
    setErrors("");
    let errores = {};
    if (!campos.dni) {
      errores.dni = "El CUIL es obligatorio";
    } else if (campos.dni.length > 11) {
      errores.dni = "El CUIL no debe poseer más de 11 digitos";
    } else if (campos.dni.length < 11) {
      errores.dni = "El CUIL debe tener 11 digitos";
    }

    if (!campos.password) {
      errores.password = "La contraseña es obligatoria";
    } else if (campos.password.length < 6) {
      errores.password = "La contraseña debe tener como mínimo 6 caracteres";
    } else if (campos.password.length > 30) {
      errores.password = "La contraseña no debe poseer más de 30 caracteres";
    }
    if (Object.keys(errores).length > 0) {
      setErrors(errores);
      return true;
    } else return false;
  };

  const handleLogin = (e) => {
    // Realizar el login con el estado y funciones proporcionadas por el store
    e.preventDefault();

    const flag = handleErrors(values);

    if (!flag) {
      login(values);
    }
  };

  useEffect(() => {
    if (authenticated) {
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  useEffect(() => {
    if (errors !== "") {
      setOpenSnackbar(true);
    }
  }, [errors]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center layoutHeight">
      <div className="box">
        <span className="borderLine"></span>
        <form onSubmit={handleLogin}>
          <img src={logoMuni} alt="logo Municipalidad" className="logoMuni" />
          <div className="inputBox w-100">
            <input
              name="dni"
              type="text"
              required="required"
              maxLength={11}
              value={values.dni}
              onChange={(e) => {
                // Filtra solo los caracteres numéricos
                const numericValue = e.target.value.replace(/\D/g, "");

                // Actualiza el estado solo si la entrada es numérica
                handleChange({
                  target: {
                    name: "dni",
                    value: numericValue,
                  },
                });
              }}
            />
            <span>Nº CUIL</span>
            <i></i>
          </div>
          <div className="inputBox w-100">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required="required"
              maxLength={30}
              value={values.password}
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={handleShowPassword}
              className="icono-password-login"
            />
            <span>Contraseña</span>
            <i></i>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-4">




          </div>
          <Button
            variant="contained"
            className="btn-light mt-4 buttonLoginColor"
            disabled={botonState}
            type="submit"
          >
            Ingresar
          </Button>
          <Button
            onClick={() => navigate("/registro")}

          >
            Registrarse

          </Button>

          <p className="datoPie mt-2 text-center ">¿Olvidó su clave? Haga click <a
            onClick={abrirModal}
          ><strong>aquí</strong></a> </p>

<p className="datoPie mb-3 text-center "> <a
            onClick={abrirModal2}
          >Reenviar email de validación</a> </p>

          <div className="d-flex flex-column justify-content-center align-items-center">
            <p className="footer p-1 m-0" style={{ fontSize: "0.7em" }}>
              Dir. de Innovación Tecnologica{" "}
              <span style={{ fontSize: "1.4em", verticalAlign: "-0.1em" }}>
                ©
              </span>{" "}
              2024
            </p>
          </div>
        </form>
      </div>
      {typeof errors == "string" ? (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Ajusta la posición del Snackbar
        >
          <Alert severity="warning">{errors}</Alert>
        </Snackbar>
      ) : (
        Object.values(errors).map((error, index) => (
          <Snackbar
            key={index}
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }} // Ajusta la posición del Snackbar
            style={{ marginTop: index * 75 }} // Ajusta el espacio entre Snackbars
          >
            <Alert severity="warning">{error}</Alert>
          </Snackbar>
        ))
      )}


      {modalAbierto && (
        <RestablecerClave

          cerrarModal={cerrarModal}
          setModalAbierto={setModalAbierto}
        />
      )}


{modalAbierto2 && (
        <ReenviarValidacion

          cerrarModal={cerrarModal2}
         
        
        />
      )}


    </div>






  );
};

export default Login;