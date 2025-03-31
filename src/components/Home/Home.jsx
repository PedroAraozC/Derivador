import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faNewspaper,
  faFolderOpen,
  // faMap,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBuildingCircleCheck,
  faCommentsDollar,
  faNotesMedical,
  faQrcode,
  faCar,
  faRoadCircleCheck,
  faTrailer,
  faMosquito,
  faPeopleGroup,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../Card/Card";
import "./Home.css";
import useStore from "../../Zustand/Zustand";
import { cuilToDni } from "../../helpers/extraerDNI";
import { useState } from "react";
import ModalMultasDominio from "../ModalMultasDominio/ModalMultasDominio";
import ModalLibreDeuda from "../ModalLibreDeuda/ModalLibreDeuda";
const Home = () => {
  const { user } = useStore();
  // console.log(user);
  // const handleRedirect = (url) => {
  //   window.location.href = url;
  // };

  const [openModal, setOpenModal] = useState(false);
  const [openModalLibreDeuda, setOpenModalLibreDeuda] = useState(false);

  const irABOLETIN = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://boletinoficial.smt.gob.ar/?auth=${token}&destino=boletin`
      // `https://ciudaddigital.smt.gob.ar/?destino=boletin`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };

  const irATURNOS = (reparticion) => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://turnos.smt.gob.ar/?auth=${token}&destino=turnero&rep=${reparticion}`
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
    const url = new URL(`http://181.105.6.205:9008`);

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


  const irACONSULTAPUBLICA = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `http://consultapublica.smt.gob.ar:9085/ext/auth/cidituc/?auth=${token}`
    );
    // url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };

  // const irAMAPA = () => {
  //   const token = localStorage.getItem("token");
  //   const url = new URL(
  //     `https://mapa.smt.gob.ar/?auth=${token}`
  //   );
  //   url.searchParams.append("auth", token);
  //   window.open(url.toString(), "_blank");
  // };

  const irACorralonConsultaPublica = () => {
    const url = new URL(`http://181.105.6.205:9007/#/consultaPublicaCorralon`);

    window.open(url.toString(), "_blank");
  };

  const irADENGUE = () => {
    // const token = localStorage.getItem("token");
    const url = new URL(
      `https://test.smt.gob.ar/`
      // `https://ciudaddigital.smt.gob.ar/?destino=boletin`
    );
    // url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleOpenModalLibreDeuda = () => {
    setOpenModalLibreDeuda(true);
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
          titulo={"Dirección de Catastro y Edificación"}
          descripcion={"Sistema de consulta y autogestión"}
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
          onClick={() => irATURNOS(1711)}
          titulo={"Licencia de Conducir"}
          descripcion={"Requsitos para Licencia de conducir"}
          Icono={<FontAwesomeIcon icon={faIdCard} />}
        />
        <Card
          onClick={() => irATURNOS(241)}
          titulo={"Ficha Médica Escolar"}
          descripcion={
            "Turnos para obtención de ficha médica en inicio escolar"
          }
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
          descripcion={"Consulta de Multas por Dominio."}
          Icono={<FontAwesomeIcon icon={faCar} />}
        />

        <Card
          onClick={() => irACorralonConsultaPublica()}
          titulo={"Consulta de Vehículo Secuestrado"}
          descripcion={"Consulta de ingresos al corralón por Dominio."}
          Icono={<FontAwesomeIcon icon={faTrailer} />}
        />
        <Card
          onClick={() => irADENGUE()}
          titulo={"Consulta sobre Dengue"}
          descripcion={"Auto consulta dengue."}
          Icono={<FontAwesomeIcon icon={faMosquito} />}
        />

<Card
          onClick={() => irACONSULTAPUBLICA()}
          titulo={"Consulta pública"}
          descripcion={"Programa de participación ciudadana"}
          Icono={<FontAwesomeIcon icon={faUsers} />}
        />

        {/* <Card
          onClick={() => handleOpenModalLibreDeuda()}
          titulo={"Libre Deuda Catastro"}
          descripcion={"Solicitar Libre Deuda en Catastro y Edificación"}
          Icono={<FontAwesomeIcon icon={faRoadCircleCheck} />}
        /> */}

        {/* <Card
          onClick={() => irACEMA()}
          titulo={"Servicios de Población Animal"}
          descripcion={"Turnos y Requsitos"}
          Icono={<FontAwesomeIcon icon={faCat} />}
        /> */}

        {/* {user.id_tusuario == 1 || user.id_tusuario == 24 &&
          <Card
            onClick={() => irAMAPA()}
            titulo={"Mapa Municipal"}
            descripcion={""}
            Icono={<FontAwesomeIcon icon={faMap} />}
          />
      } */}
      </div>

      <ModalMultasDominio
        openDialog={openModal}
        setOpenModal={setOpenModal}
        user={user}
      />

      {/* <ModalLibreDeuda
  openDialog={openModalLibreDeuda}
  setOpenModal={setOpenModalLibreDeuda}
  user={user}
/> */}
    </div>
  );
};

export default Home;
