import "./login.css";
import logoMuni from '../../assets/logomuni_piedepagina.png'
import { useContext, useEffect, useState } from "react";
// import { COMContext } from "../../context/COMContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import useStore from "../../Zustand/Zustand";


export const Login = () => {
  // const { login, authenticated, botonState } = useContext(COMContext);
  const { login } = useStore();
 const location = useLocation();
 const navigate = useNavigate();

  // const { handleChange, handleSubmit, values, setValues, errors } = useForm(
  //   LOGIN_VALUES,
  //   login,
  //   validationLogin
  // );
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  // useEffect(() => {
  //   if (authenticated) {
  //     navigate("/home");
  //   }
  // }, [authenticated]);

const handleLogin = () =>{
  login()
  navigate("/home")
}

  return (
    <div className="d-flex justify-content-center align-items-center layoutHeight">
      <div className="box">
        <span className="borderLine"></span>
        <form 
        // onSubmit={handleSubmit}
        >
          <img src={logoMuni}
           alt="logo Municipalidad"
           className="logoMuni" />
          <div className="inputBox">
            <input
              name="nombreUsuario"
              // value={values.nombreUsuario}
              // onChange={handleChange}
              type="text"
              required="required"
              maxLength={15}
            />
            <span>Nombre de Usuario</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              name="contraseña"
              // value={values.contraseña}
              // onChange={handleChange}
              type={showPassword ? "text" : "password"}
              required="required"
              maxLength={30}
            />
            {
            // values.contraseña && 
            (
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                onClick={handleShowPassword}
                className="icono-password-login"
              />
            )} 
            <span>Contraseña</span>
            <i></i>
          </div>
          {/* {Object.keys(errors).length !== 0 &&
            Object.values(errors).map((error, index) => (
              <Alert variant="danger" className="mt-3" key={index}>
                {error}
              </Alert>
            ))} */}
         
          <Button variant="contained"
            className="btn-light mt-4"
            onClick={handleLogin}
          >Ingresar</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
