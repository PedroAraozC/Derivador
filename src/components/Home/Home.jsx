import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faIdCard,
  faFolderOpen,
} from "@fortawesome/free-regular-svg-icons";
import {
  faQrcode,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import Card from "../Card/Card";
import "./Home.css";
import useStore from "../../Zustand/Zustand";
import fondoSMT from "/src/assets/fondosmt.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useStore();

  const navigate = useNavigate()

  const irATURNOS = () => {
    localStorage.setItem("destino", "turnero")

    navigate("/login")
  };

  const irACREDENCIAL = () => {
    localStorage.setItem("destino", "credencial")
    navigate("/login")
  };

  const irABOLETASUELDO = () => {
    window.location.href = `http://localhost/genarchi/autoconsulta.php`;
  };

  const irAREGISTRO = () => {

    navigate("/registro")
  };

  const irAEXPEDIENTES = () => {
    window.location.href = `http://172.16.10.137:8889/?totem=true`;
  };


  return (
    <div style={{backgroundImage:`url(${fondoSMT})`, backgroundSize: '125%',   height: '100vh', backgroundPosition: 'center',}}>
        <div className="text-center d-flex  justify-content-center">
      <h1 className="text-center pt-5 position-absolute">TERMINAL DE AUTOGESTION</h1>
      </div> 
    <div className="contPadreHome" >
   
      <div className="cardsContHome">
          <Card
            onClick={() => irAREGISTRO()}
            titulo={"Registro"}
            descripcion={"Registrarse como ciudadano digital"}
            Icono={<FontAwesomeIcon icon={faUserPlus} />}
          />
          <Card
            onClick={() => irACREDENCIAL()}
            titulo={"Credencial"}
            descripcion={"Ver credencial digital"}
            Icono={<FontAwesomeIcon icon={faQrcode} />}
          />
          <Card
          onClick={() => irAEXPEDIENTES()}
          titulo={"Expedientes"}
          descripcion={"Ingreso a sistema de expedientes"}
          Icono={<FontAwesomeIcon icon={faFolderOpen} />}
        />
          <Card
            onClick={() => irATURNOS()}
            titulo={"Licencia de Conducir"}
            descripcion={"Solicitar turno para Licencia de conducir"}
            Icono={<FontAwesomeIcon icon={faIdCard} />}
          />

          <Card
            onClick={() => irABOLETASUELDO()}
            titulo={"Recibo de sueldo"}
            descripcion={"Imprimir recibo de sueldo"}
            Icono={<FontAwesomeIcon icon={faFileLines} />}
          />
      </div>
    </div>
    <h6 className="text-center ubicacionPieHome">Dirección de Innovación Tecnológica - 2024</h6>
    </div>

  );
};

export default Home;
