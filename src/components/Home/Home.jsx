import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faIdCard,
  faNewspaper,
  // faFolderOpen,
} from "@fortawesome/free-regular-svg-icons";
import { 
  // faBuildingCircleCheck,
   faCommentsDollar, faNotesMedical, faQrcode, 
   faUserPlus} from "@fortawesome/free-solid-svg-icons";
import Card from "../Card/Card";
import "./Home.css";
import useStore from "../../Zustand/Zustand";
import { cuilToDni } from "../../helpers/extraerDNI";
import fondoSMT from  "/src/assets/fondosmt.png"; 
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useStore();
  // console.log(user);
  // const handleRedirect = (url) => {
  //   window.location.href = url;
  // };

  const navigate=useNavigate()

  const irABOLETIN = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://boletinoficial.smt.gob.ar/?auth=${token}&destino=boletin`
      // `https://ciudaddigital.smt.gob.ar/?destino=boletin`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };

  const irATURNOS = () => {
    localStorage.setItem("destino","turnero")

    navigate("/login")
  };
  const irACREDENCIAL = () => {
localStorage.setItem("destino","credencial")

navigate("/login")



  };

  const irABOLETASUELDO = () => {
    
    // const url = new URL(
    //   `http://localhost/genarchi/autoconsulta.php`
    // );
  
    window.location.href = `http://localhost/genarchi/autoconsulta.php`;
    
    
      };

  const irAREGISTRO = () => {
    
 navigate("/registro")
  };
  // const irAEXPEDIENTES = () => {
  //   const token = localStorage.getItem("token");
  //   const url = new URL(``);
  //   url.searchParams.append("auth", token);
  //   window.open(url.toString(), "_blank");
  // };
  // const irACATASTRO = () => {
  //   const token = localStorage.getItem("token");
  //   const url = new URL(`https://catastro.smt.gob.ar/#/?auth=${token}&destino=catastro`);
  //   url.searchParams.append("auth", token);
  //   window.open(url.toString(), "_blank");
  // };
  const irALICITACIONES = () => {
    const url = new URL(`https://licitaciones.smt.gob.ar`);
    window.open(url.toString(), "_blank");
  };

  const irACARNETSANIDAD = () => {

    const url = new URL(
      `http://181.105.6.205:82/cs/index_cd.php?dni=${cuilToDni(user.documento_persona.toString())}`
    );
    
    window.open(url.toString(), "_blank");
  }

  return (
    <div style={{backgroundImage:`url(${fondoSMT})`, backgroundSize: '125%',   height: '100vh', backgroundPosition: 'center',}}>
        <div className="text-center d-flex  justify-content-center">
      <h1 className="text-center pt-5 position-absolute">TERMINAL DE AUTOGESTION</h1>
      </div> 
    <div className="contPadreHome" >
   
      <div className="cardsContHome">
        {/* <Card
          onClick={() => irABOLETIN()}
          titulo={"Boletin Oficial"}
          descripcion={
            "Publicación Digital que contiene la normativa municipal y actos de gobierno"
          }
          Icono={<FontAwesomeIcon icon={faNewspaper} />}
        /> */}

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
        {/* <Card
          onClick={() => irAEXPEDIENTES()}
          titulo={"Expedientes"}
          descripcion={"Ingreso a sistema de expedientes"}
          Icono={<FontAwesomeIcon icon={faFolderOpen} />}
        /> */}
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
        {/* <Card
          onClick={() => irACATASTRO()}
          titulo={"Catastro"}
          descripcion={"Catastro y Edificaciones"}
          Icono={<FontAwesomeIcon icon={faBuildingCircleCheck} />}
        /> */}
        {/* <Card
          onClick={() => irALICITACIONES()}
          titulo={"Licitaciones"}
          descripcion={"Convocatoria para la contratación de bienes, obras y servicios."}
          Icono={<FontAwesomeIcon icon={faCommentsDollar} />}
        />
        <Card
          onClick={() => irACARNETSANIDAD()}
          titulo={"Carnet de Sanidad"}
          descripcion={"Consulta del Carnet Digital"}
          Icono={<FontAwesomeIcon icon={faNotesMedical}/>}
        /> */}
      </div>
    </div>
    </div>

  );
};

export default Home;
