import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faNewspaper,
  faFolderOpen,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBuildingCircleCheck,
  faCommentsDollar,
  faNotesMedical,
  faQrcode,
  faCat,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../Card/Card";
import "./Home.css";
import useStore from "../../Zustand/Zustand";
import { cuilToDni } from "../../helpers/extraerDNI";
import { useState } from "react";
import ModalMultasDominio from "../ModalMultasDominio/ModalMultasDominio";
const Home = () => {
  const { user } = useStore();
  // console.log(user);
  // const handleRedirect = (url) => {
  //   window.location.href = url;
  // };

  const [openModal, setOpenModal] = useState(false);

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
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://turnos.smt.gob.ar/?auth=${token}&destino=turnero&rep=1711`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };

  const irACEMA = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://turnos.smt.gob.ar/?auth=${token}&destino=turnero&rep=1800`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };

  const irACREDENCIAL = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://ciudaddigital.smt.gob.ar/#/credencialesCiudadano/${user.documento_persona}`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };
  const irAEXPEDIENTES = () => {
    const url = new URL(`http://181.105.6.205:8890`);

    window.open(url.toString(), "_blank");
  };
  const irACATASTRO = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://catastro.smt.gob.ar/?auth=${token}&destino=catastro`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };
  const irALICITACIONES = () => {
    const url = new URL(`https://licitaciones.smt.gob.ar`);
    window.open(url.toString(), "_blank");
  };

  const irACARNETSANIDAD = () => {
    const url = new URL(
      `http://181.105.6.205:82/cs/index_cd.php?dni=${cuilToDni(
        user.documento_persona.toString()
      )}`
    );

    window.open(url.toString(), "_blank");
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <div className="contPadreHome">
      <div className="cardsContHome">
        <Card
          onClick={() => irABOLETIN()}
          titulo={"Boletin Oficial"}
          descripcion={
            "Publicación Digital que contiene la normativa municipal y actos de gobierno"
          }
          Icono={<FontAwesomeIcon icon={faNewspaper} />}
        />
        <Card
          onClick={() => irACARNETSANIDAD()}
          titulo={"Carnet de Sanidad"}
          descripcion={"Consulta del Carnet Digital"}
          Icono={<FontAwesomeIcon icon={faNotesMedical} />}
        />
        <Card
          onClick={() => irACATASTRO()}
          titulo={"Catastro"}
          descripcion={"Catastro y Edificaciones"}
          Icono={<FontAwesomeIcon icon={faBuildingCircleCheck} />}
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
          descripcion={"Requsitos para Licencia de conducir"}
          Icono={<FontAwesomeIcon icon={faIdCard} />}
        />
        <Card
          onClick={() => irALICITACIONES()}
          titulo={"Licitaciones"}
          descripcion={
            "Convocatoria para la contratación de bienes, obras y servicios."
          }
          Icono={<FontAwesomeIcon icon={faCommentsDollar} />}
        />
        <Card
          onClick={() => handleOpenModal()}
          titulo={"Multas de Tránsito"}
          descripcion={"Consulta de Multas por Dominio"}
          Icono={<FontAwesomeIcon icon={faCar} />}
        />
        <Card
          onClick={() => irACEMA()}
          titulo={"Servicios de Población Animal"}
          descripcion={"Turnos y Requsitos"}
          Icono={<FontAwesomeIcon icon={faCat} />}
        />
      </div>

      <ModalMultasDominio
        openDialog={openModal}
        setOpenModal={setOpenModal}
        user={user}
      />
    </div>
  );
};

export default Home;
