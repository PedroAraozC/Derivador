import { faBowlFood, faCar } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react'
import ModalMultas from '../../components/ModalMultas/ModalMultas';
import useStore from '../../Zustand/Zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../../components/Card/Card';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import EncabezadoPagina from '../../common/EncabezadoPagina';

const Multas = () => {
    const { user } = useStore();
    const [openModal, setOpenModal] = useState(false);

    const [valoresModal, setValoresModal] = useState({asunto:"", campo:""})

    const handleOpenModal = () => {
        setOpenModal(true);
      };

      const abrirModal = (asunto,campo,destino) => {
        setValoresModal({asunto,campo,destino})
        handleOpenModal();
      }

  return (
    <>
      <div className="container">
        <EncabezadoPagina
          volver="/home"
          sup="Consultas"
          titulo="Consulta de multas"
          subtitulo="Elegí el tipo de multa. La consulta se envía por correo al Tribunal de Faltas."
        />
      </div>
      <div className='container d-flex justify-content-center flex-wrap pb-5'>
          <Card
              onClick={() => abrirModal("Consulta de Multas de Tránsito", "Dominio/DNI","tmfconsultas@smt.gob.ar")}
              titulo={"Multas de Tránsito"}
              descripcion={"Consulta de Multas por Dominio."}
              Icono={<FontAwesomeIcon icon={faCar} />}
          />

          <Card
             onClick={() => abrirModal("Consulta de Multas de Catastro", "Padrón y Domicilio","tmflibredeuda@smt.gob.ar")}
              titulo={"Multas de Catastro"}
              descripcion={"Consulta de Multas por Padrón y Domicilio."}
              Icono={<FontAwesomeIcon icon={faBuilding} />}
          />

          <Card
              onClick={() => abrirModal("Consulta de Multas de Bromatología", "CUIT y Razón Social","tmfconsultas@smt.gob.ar")}
              titulo={"Multas de Bromatología"}
              descripcion={"Consulta de Multas por CUIT y razón social."}
              Icono={<FontAwesomeIcon icon={faBowlFood} />}
          />

          <ModalMultas
              openDialog={openModal}
              setOpenModal={setOpenModal}
              user={user}
              asunto={valoresModal.asunto}
              campo={valoresModal.campo}
              destino={valoresModal.destino}
          />

      </div>
    </>
  )
}

export default Multas
