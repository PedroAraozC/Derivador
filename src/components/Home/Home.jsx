import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faNewspaper,
  faFolderOpen,
} from "@fortawesome/free-regular-svg-icons";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import Card from "../Card/Card";
import "./Home.css";
import useStore from "../../Zustand/Zustand";

const Home = () => {
  const { user } = useStore();
  console.log(user);
  // const handleRedirect = (url) => {
  //   window.location.href = url;
  // };

  const irABOLETIN = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://boletinoficial.smt.gob.ar/?auth=${token}&destino=boletin`
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
  const irACREDENCIAL = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://ciudaddigital.smt.gob.ar/#/CredencialesCiudadano/${user.documento_persona}`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };
  const irAEXPEDIENTES = () => {
    const token = localStorage.getItem("token");
    const url = new URL(``);
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };

  return (
    <div className="contPadre">
      <div className="cardsCont">
        <Card
          onClick={() => irABOLETIN()}
          titulo={"Boletin Oficial"}
          descripcion={
            "Publicación Digital que contiene la normativa municipal y actos de gobierno"
          }
          Icono={<FontAwesomeIcon icon={faNewspaper} />}
        />
        <Card
          onClick={() => irACREDENCIAL()}
          titulo={"Credencial"}
          descripcion={"Ingreso a credencial propia"}
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
      </div>
    </div>
  );
};

export default Home;
