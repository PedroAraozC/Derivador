import "./login.css";
import logoMuni from "../../assets/logoMuniNuevo.png";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Alert, Button, Snackbar } from "@mui/material";
import useStore from "../../Zustand/Zustand";
import { LOGIN_VALUES } from "../../helpers/constantes";
import { useLocation, useNavigate } from "react-router-dom";
import { RestablecerClave } from "./RestablecerClave";
import { ReenviarValidacion } from "./ReenviarValidacion";

/**
 * Aplicaciones externas que se autentican a través de Derivador.
 *
 * Cada una llega como `/login?next=<clave>` y vuelve a la URL de su variable de
 * entorno con el token en `auth`. Sumar una aplicación es agregar una entrada
 * acá y su variable al .env: el flujo de abajo no se toca.
 *
 * Es un Map y no un objeto a propósito: con un objeto, un `next` como
 * `constructor` devolvería algo heredado del prototipo y el flujo arrancaría
 * con una configuración inexistente.
 */
const APPS_EXTERNAS = new Map([
  ["urbania", { nombre: "UrbanIA", callbackUrl: import.meta.env.VITE_APP_URBANIA_CALLBACK_URL }],
  [
    "elcop",
    {
      nombre: "el Portal del Becario de ELCOP",
      callbackUrl: import.meta.env.VITE_APP_ELCOP_CALLBACK_URL
    }
  ]
]);

/**
 * Regreso de respaldo, por si la variable de entorno no llega al build.
 *
 * Vite hornea las VITE_* al compilar y `.env.production` hoy solo define
 * VITE_MIGUE_API_URL: sin este respaldo el build sale con el regreso vacio y el
 * ingreso corta con "Falta configurar el regreso" YA con el usuario
 * autenticado. Paso en produccion con UrbanIA el 2026-08-10.
 *
 * La variable, cuando existe, sigue mandando: esto es solo la red de seguridad.
 * Si se agregan las VITE_APP_*_CALLBACK_URL a .env.production, este mapa deja
 * de usarse solo.
 *
 * ELCOP quedaba sin respaldo por no conocer su dominio, y le paso lo mismo: el
 * bundle desplegado de cidituc.smt.gob.ar sale con `callbackUrl: void 0` para
 * las dos aplicaciones. El dominio es landing-elcop.vercel.app, confirmado por
 * ELCOP, y es distinto del patron del resto porque no es un subdominio de
 * smt.gob.ar.
 */
const RESPALDO_CALLBACK = new Map([
  ["urbania", "https://urban-ia-kappa.vercel.app/auth/cidituc/callback"],
  ["elcop", "https://landing-elcop.vercel.app/auth/cidituc/callback"]
]);

/**
 * En local el regreso sale del .env.local de cada quien: el respaldo apunta a
 * produccion y sacaria al desarrollador de su entorno en medio de una prueba.
 */
function regresoDe(next, callbackUrl) {
  if (callbackUrl) return callbackUrl;
  const { hostname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;
  return RESPALDO_CALLBACK.get(next) ?? null;
}

const Login = () => {
  const { authenticated, botonState, login, errors, setErrors } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState(LOGIN_VALUES);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // La aplicación externa que pidió el ingreso, o null si es un login normal.
  const appExterna = APPS_EXTERNAS.get(queryParams.get("next")) ?? null;
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAbierto2, setModalAbierto2] = useState(false);
  // const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);
  // const abrirModal2 = () => setModalAbierto2(true);
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

  const handleLogin = async (e) => {
    // Realizar el login con el estado y funciones proporcionadas por el store
    e.preventDefault();

    const flag = handleErrors(values);

    if (!flag) {
      const result = await login(values);

      if (result?.token && appExterna) {
        const { nombre, callbackUrl } = appExterna;
        const regreso = regresoDe(queryParams.get("next"), callbackUrl);
        if (!regreso) {
          // "hacia" y no "a": los nombres de las aplicaciones pueden empezar con
          // artículo, y "a el Portal del Becario" queda mal escrito.
          setErrors(`Falta configurar el regreso hacia ${nombre}.`);
          return;
        }

        const url = new URL(regreso);
        url.searchParams.set("auth", result.token);
        const state = queryParams.get("state");
        if (state) url.searchParams.set("state", state);

        // Derivador solo intermedia la autenticación. La aplicación recibe el
        // token una vez y Derivador no conserva una sesión reutilizable.
        localStorage.removeItem("token");
        window.location.replace(url.toString());
      }
    }
  };

  useEffect(() => {
    if (appExterna) {
      // Obliga a ingresar las credenciales en cada ingreso a una aplicación
      // externa, incluso si otra persona usó Derivador antes en este navegador.
      localStorage.removeItem("token");
    }
  }, [appExterna]);

  useEffect(() => {
    if (authenticated && !appExterna) {
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, appExterna]);

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
          {/* <Button
            onClick={() => navigate("/registro")}

          >
            Registrarse

          </Button> */}

          {/* <p className="datoPie mt-2 text-center ">¿Olvidó su clave? Haga click <a
            onClick={abrirModal}
          ><strong>aquí</strong></a> </p>

          <p className="datoPie mb-3 text-center "> <a
            onClick={abrirModal2}
          >Reenviar email de validación</a> </p> */}

          <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <p className="footer p-1 m-0" style={{ fontSize: "0.7em" }}>
              Dir. de Innovación Tecnologica{" "}
              <span style={{ fontSize: "1.8em", verticalAlign: "-0.1em" }}>
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
