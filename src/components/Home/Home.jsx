import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faNewspaper,
  faFolderOpen,
  // faMap,
} from "@fortawesome/free-regular-svg-icons";
import {
  // faBuildingCircleCheck,
  faCommentsDollar,
  faNotesMedical,
  faQrcode,
  // faCar,
  // faRoadCircleCheck,
  faTrailer,
  faMosquito,
  // faPeopleGroup,
  faUsers,
  faCat,
  faClipboardQuestion,
  faBus,
  faCashRegister,
  faKitMedical,
  faHandHoldingMedical,
  faBookTanakh,
  faChalkboardUser,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../Card/Card";
import "./Home.css";
import useStore from "../../Zustand/Zustand";
import { cuilToDni } from "../../helpers/extraerDNI";
import { useState } from "react";
// import ModalLibreDeuda from "../ModalLibreDeuda/ModalLibreDeuda";
import { useNavigate } from "react-router-dom";
import ModalMultas from "../ModalMultas/ModalMultas";
import { FaFileMedicalAlt, FaMedkit } from "react-icons/fa";

const Home = () => {
  const { user } = useStore();
  // console.log(user);
  // const handleRedirect = (url) => {
  //   window.location.href = url;
  // };

  const [openModal, setOpenModal] = useState(false);
  // const [openModalLibreDeuda, setOpenModalLibreDeuda] = useState(false);

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

  const irADIM = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://dim360.complex2real.com/login-cidituc?token=${token}&cuit=${user.documento_persona}`
    );
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

  // const irACATASTRO = () => {
  //   const token = localStorage.getItem("token");
  //   const url = new URL(
  //     `https://catastro.smt.gob.ar/?auth=${token}&destino=catastro`
  //   );
  //   url.searchParams.append("auth", token);
  //   window.open(url.toString(), "_blank");
  // };

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
      `http://consultapublica.smt.gob.ar/ext/auth/cidituc/?auth=${token}`
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

  const irAPermisosVarios = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://permisos.smt.gob.ar/?auth=${token}`
      // `https://ciudaddigital.smt.gob.ar/?destino=boletin`
    );
    // url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };
  const irAPermisos = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://portal.permisos.smt.gob.ar/?auth=${token}`
      // `https://ciudaddigital.smt.gob.ar/?destino=boletin`
    );
    // url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };
  const irAPORTALPERSONAL = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://portal.personal.smt.gob.ar/?auth=${token}`
      // `https://ciudaddigital.smt.gob.ar/?destino=boletin`
    );
    // url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };
  const irAAsitPubica = async () => {
    const tokenAsitencia = "f64b5a5a3efd8ade6bbf6c0b595d08aeef25c5fa";
    const documentoRecortado = user.documento_persona.toString().slice(2, -1);

    const resp = await fetch(
      "https://asistenciapublica.bymovi.com/api/v3/turnero/link_acceso_paciente",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `${tokenAsitencia}`,
        },
        body: JSON.stringify({
          nombre: `${user.nombre_persona} ${user.apellido_persona}`,
          documento: documentoRecortado,
          cuil: user.documento_persona,
          telefono: user.telefono_persona,
          email: user.email_persona,
          fecha_nacimiento: user.fecha_nacimiento_persona
            ? user.fecha_nacimiento_persona.toString().slice(0, 10)
            : "",
          genero: user.id_genero == 1 ? "F" : "M",
        }),
      }
    );
    const data = await resp.json();
    const url = new URL(`${data.url}`);
    window.open(url.toString(), "_blank");
  };

  // const handleOpenModal = () => {
  //   setOpenModal(true);
  // };

  // const handleOpenModalLibreDeuda = () => {
  //   setOpenModalLibreDeuda(true);
  // };

  const navigate = useNavigate();

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
          onClick={() => irACorralonConsultaPublica()}
          titulo={"Consulta de Vehículo Secuestrado"}
          descripcion={"Consulta de ingresos al corralón por Dominio."}
          Icono={<FontAwesomeIcon icon={faTrailer} />}
        />
        <Card
          onClick={() => irACONSULTAPUBLICA()}
          titulo={"Consulta Pública"}
          descripcion={"Programa de participación ciudadana"}
          Icono={<FontAwesomeIcon icon={faUsers} />}
        />
        <Card
          onClick={() => irADENGUE()}
          titulo={"Consulta sobre Dengue"}
          descripcion={"Auto consulta dengue."}
          Icono={<FontAwesomeIcon icon={faMosquito} />}
        />
        {/* <Card
          onClick={() => irACATASTRO()}
          titulo={"Dirección de Catastro y Edificación"}
          descripcion={"Sistema de consulta y autogestión"}
          Icono={<FontAwesomeIcon icon={faBuildingCircleCheck} />}
          /> */}
        <Card
          onClick={() => irACREDENCIAL()}
          titulo={"Credencial"}
          descripcion={"Ver credencial digital"}
          Icono={<FontAwesomeIcon icon={faQrcode} />}
        />
        <Card
          onClick={() => irADIM()}
          titulo={"DIM 360"}
          descripcion={"Dirección de Ingresos Municipales"}
          Icono={<FontAwesomeIcon icon={faCashRegister} />}
        />
        <Card
          onClick={() => irAEXPEDIENTES()}
          titulo={"Expedientes"}
          descripcion={"Ingreso a sistema de expedientes"}
          Icono={<FontAwesomeIcon icon={faFolderOpen} />}
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
          onClick={() => irATURNOS(1711)}
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
          onClick={() => navigate("/multas")}
          titulo={"Multas"}
          descripcion={"Consulta de Multas."}
          Icono={<FontAwesomeIcon icon={faClipboardQuestion} />}
        />
        <Card
          onClick={() => irAPermisos()}
          titulo={"Permisos Desarrollo"}
          descripcion={"Permisos Desarrollo"}
          Icono={<FontAwesomeIcon icon={faBookTanakh} />}
        />

        {user.id_tusuario == 1 && (
          <Card
            onClick={() => irAPermisosVarios()}
            titulo={"Permisos Varios"}
            descripcion={"Gestión de permisos varios"}
            Icono={<FontAwesomeIcon icon={faFolderOpen} />}
          />
        )}
        <Card
          onClick={() => irAPORTALPERSONAL()}
          titulo={"Portal de Personal"}
          descripcion={
            "Acceso a información laboral y administrativa del personal municipal."
          }
          Icono={<FontAwesomeIcon icon={faChalkboardUser} />}
        />
        <Card
          onClick={() => irACEMA()}
          titulo={"Servicios de Población Animal"}
          descripcion={"Turnos y Requsitos"}
          Icono={<FontAwesomeIcon icon={faCat} />}
        />
        <Card
          onClick={() => irATURNOS(1710)}
          titulo={"Tarjeta Ciudadana - SUBE"}
          descripcion={"Turnos para transferir saldo de ciudadana a SUBE"}
          Icono={<FontAwesomeIcon icon={faBus} />}
        />
        <Card
          onClick={() => irAAsitPubica()}
          titulo={"Turnero Asistencia Pública"}
          descripcion={"Turnos y Requsitos"}
          Icono={<FontAwesomeIcon icon={faHandHoldingMedical} />}
        />
        {/* <Card
          onClick={() => handleOpenModal()}
          titulo={"Multas de Tránsito"}
          descripcion={"Consulta de Multas por Dominio."}
          Icono={<FontAwesomeIcon icon={faCar} />}
        /> */}

        {/* <Card
          onClick={() => handleOpenModalLibreDeuda()}
          titulo={"Libre Deuda Catastro"}
          descripcion={"Solicitar Libre Deuda en Catastro y Edificación"}
          Icono={<FontAwesomeIcon icon={faRoadCircleCheck} />}
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

      <ModalMultas
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
