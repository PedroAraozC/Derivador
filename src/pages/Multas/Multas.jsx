import { faBowlFood, faCar } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react'
import ModalMultasDominio from '../../components/ModalMultas/ModalMultas';
import useStore from '../../Zustand/Zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../../components/Card/Card';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';

const Multas = () => {
    const { user } = useStore();
    const [openModal, setOpenModal] = useState(false);

    const [valoresModal, setValoresModal] = useState({asunto:"", campo:""})

    const handleOpenModal = () => {
        setOpenModal(true);
      };

      const abrirModal = (asunto,campo) => {
        setValoresModal({asunto,campo})
        handleOpenModal();
      }

  return (
      <div className='d-flex justify-content-center'>
          <Card
              onClick={() => abrirModal("Consulta de Multas de Tránsito", "Dominio/DNI")}
              titulo={"Multas de Tránsito"}
              descripcion={"Consulta de Multas por Dominio."}
              Icono={<FontAwesomeIcon icon={faCar} />}
          />

          <Card
             onClick={() => abrirModal("Consulta de Multas de Catastro", "Padrón/Domicilio")}
              titulo={"Multas de Catastro"}
              descripcion={"Consulta de Multas por Padrón y Domicilio."}
              Icono={<FontAwesomeIcon icon={faBuilding} />}
          />

          <Card
              onClick={() => abrirModal("Consulta de Multas de Bromatología", "CUIT/Razon Social")}
              titulo={"Multas de Bromatología"}
              descripcion={"Consulta de Multas por CUIT y razón social."}
              Icono={<FontAwesomeIcon icon={faBowlFood} />}
          />

          <ModalMultasDominio
              openDialog={openModal}
              setOpenModal={setOpenModal}
              user={user}
              asunto={valoresModal.asunto}
              campo={valoresModal.campo}
          />

      </div>
  )
}

export default Multas