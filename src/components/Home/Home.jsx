/* eslint-disable react/prop-types */
import "./Home.css";
import useStore from "../../Zustand/Zustand";
import NuevaCard from "./NuevaCard";
import QuizIcon from '@mui/icons-material/Quiz';
import EventIcon from '@mui/icons-material/Event';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import BadgeIcon from '@mui/icons-material/Badge';
import { useEffect, useState } from "react";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [openedCard, setOpenedCard] = useState(null);
  const { user, obtenerPermisos, permisos } = useStore();

  useEffect(() => {
    obtenerPermisos(user?.id_tusuario, user?.id_persona);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const permisosHabilitados = permisos.filter(
    (permiso) =>
      permiso.ver === 1 &&
      permiso.nombre_opcion !== "EDICION DE PERFIL" &&
      permiso.nombre_opcion !== "CONFIGURACIÓN"
  );

  // 2️⃣ Divide los permisos según la categoría (opción)
  const optionsConsultas = permisosHabilitados.filter(
    (p) => p.nombre_opcion?.toUpperCase() === "CONSULTAS"
  );

  const optionsTramites = permisosHabilitados.filter(
    (p) => p.nombre_opcion?.toUpperCase() === "TRÁMITES" || p.nombre_opcion?.toUpperCase() === "TRAMITES"
  );

  const optionsTurnos = permisosHabilitados.filter(
    (p) => p.nombre_opcion?.toUpperCase() === "TURNOS"
  );

  const optionsApps = permisosHabilitados.filter(
    (p) => p.nombre_opcion?.toUpperCase() === "APLICACIONES" || p.sistema_externo === 1
  );

  // const [openModal, setOpenModal] = useState(false);

  // const handleOpenModal = () => {
  //   setOpenModal(true);
  // };

  // const handleOpenModalLibreDeuda = () => {
  //   setOpenModalLibreDeuda(true);
  // };

  // const navigate = useNavigate();

  return (
    <>
      <div className="pb-5 fondoHome">
        <div className="container pt-5 px-5">
          <h4>Hola {user.nombre_persona}, que quieres hacer hoy?</h4>
        </div>
        <div className="mt-4 d-flex gap-3 flex-wrap justify-content-center px-5">
          <div>
            <NuevaCard
              options={optionsConsultas}
              titulo={'Consultas'}
              icono={QuizIcon}
              user={user}
              cardId="consultas"
              isOpen={openedCard === "consultas"}
              onOpen={() => setOpenedCard("consultas")}
              onClose={() => setOpenedCard(null)}
            />
          </div>
          <div>
            <NuevaCard
              options={optionsTramites}
              titulo={'Trámites'}
              icono={ArrowOutwardIcon}
              user={user}
              cardId="tramites"
              isOpen={openedCard === "tramites"}
              onOpen={() => setOpenedCard("tramites")}
              onClose={() => setOpenedCard(null)}
            />
          </div>
          <div>
            <NuevaCard 
              options={optionsTurnos} 
              titulo={'Turnos'} 
              icono={EventIcon} 
              user={user}
              cardId="turnos"
              isOpen={openedCard === "turnos"}
              onOpen={() => setOpenedCard("turnos")}
              onClose={() => setOpenedCard(null)}
            />
          </div>
          {user.id_tusuario !== 3 ? (
          <div>
            <NuevaCard
              options={optionsApps}
              titulo={'Empleados'}
              icono={BadgeIcon}
              user={user}
              cardId="empleados"
              isOpen={openedCard === "empleados"}
              onOpen={() => setOpenedCard("empleados")}
              onClose={() => setOpenedCard(null)}
            />
          </div>
          ) : null
            }
        </div>
      </div>
      {/* <div className="contPadreHome">
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
            onClick={() => navigate("/el-gas-llega-a-tu-casa")}
            titulo={"El Gas Llega a tu Casa"}
            descripcion={"Acceda al servicio de gas natural domiciliario"}
            Icono={<FontAwesomeIcon icon={faHouseFire} />}
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
            descripcion={"Requisitos para Licencia de conducir"}
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
            onClick={() => irATURNOS(1510)}
            titulo={"Campus Educativo Ambiental"}
            descripcion={"Turnos para actividades en el Campus Ambiental"}
            Icono={<FontAwesomeIcon icon={faPeopleGroup} />}
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
            onClick={() => navigate("/multas")}
            titulo={"Multas"}
            descripcion={"Consulta de Multas."}
            Icono={<FontAwesomeIcon icon={faClipboardQuestion} />}
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
            onClick={() => irADIM()}
            titulo={"DIM 360"}
            descripcion={"Dirección de Ingresos Municipales"}
            Icono={<FontAwesomeIcon icon={faCashRegister} />}
          />

          <Card
            onClick={() => irACONSULTAPUBLICA()}
            titulo={"Consulta Pública"}
            descripcion={"Programa de participación ciudadana"}
            Icono={<FontAwesomeIcon icon={faUsers} />}
          />
          <Card
            onClick={() => irAPRESUPUESTOPARTICIPATIVO()}
            titulo={"Presupuesto Participativo"}
            descripcion={"Programa de presupuesto participativo."}
            Icono={<FontAwesomeIcon icon={faUsers} />}
          />

          <Card
            onClick={() => handleOpenModalLibreDeuda()}
            titulo={"Libre Deuda Catastro"}
            descripcion={"Solicitar Libre Deuda en Catastro y Edificación"}
            Icono={<FontAwesomeIcon icon={faRoadCircleCheck} />}
          />

          <Card
            onClick={() => irACEMA()}
            titulo={"Servicios de Población Animal"}
            descripcion={"Turnos y Requisitos"}
            Icono={<FontAwesomeIcon icon={faCat} />}
          />
          <Card
            onClick={() => irAAsitPubica()}
            titulo={"Turnero Asistencia Pública"}
            descripcion={"Turnos y Requisitos"}
            Icono={<FontAwesomeIcon icon={faHandHoldingMedical} />}
          />

          <Card
            // onClick={() => navigate('/via-publica')}
            onClick={() => irAPermisosVarios()}
            titulo={"Permisos Varios"}
            descripcion={"Gestión de permisos para el uso de la vía pública"}
            Icono={<FontAwesomeIcon icon={faFolderOpen} />}
          />

          {user.id_tusuario == 1 || user.id_tusuario == 24 &&
            <Card
              onClick={() => irAMAPA()}
              titulo={"Mapa Municipal"}
              descripcion={""}
              Icono={<FontAwesomeIcon icon={faMap} />}
            />
          }
        </div>

        <ModalMultas
          openDialog={openModal}
          setOpenModal={setOpenModal}
          user={user}
        />

        <ModalLibreDeuda
          openDialog={openModalLibreDeuda}
          setOpenModal={setOpenModalLibreDeuda}
          user={user}
        />
      </div> */}
    </>

  );
};

export default Home;
