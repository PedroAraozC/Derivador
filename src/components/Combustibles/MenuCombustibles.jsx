import { faCar, faFileUpload, faChartBar } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useStore from '../../Zustand/Zustand';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../../components/Card/Card';
import { Link } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const MenuCombustibles = () => {
  const openHashRouteInNewTab = (hashPath) => {
    const base = window.location.href.split('#')[0];
    window.open(`${base}#${hashPath}`, '_blank');
  };

  const handleImportarExcel = () => openHashRouteInNewTab('/importarExcelCombustibles');
  const handleGestionarVehiculos = () => openHashRouteInNewTab('/leerDatosVehiculos');
  const handleVerInformes = () => openHashRouteInNewTab('/leerDatosCombustibles');

  return (
    <>
      <Link style={{ textDecoration: 'none' }} to="/home"><ArrowBack/> VOLVER</Link>
      <div className='d-flex justify-content-center'>
        <Card
          onClick={handleImportarExcel}
          titulo={"Importar Consumos"}
          descripcion={"Cargar consumos de combustibles desde un archivo excel."}
          Icono={<FontAwesomeIcon icon={faFileUpload} />}
        />

        <Card
          onClick={handleGestionarVehiculos}
          titulo={"Gestionar Vehículos"}
          descripcion={"Administración de los vehículos registrados."}
          Icono={<FontAwesomeIcon icon={faCar} />}
        />

        <Card
          onClick={handleVerInformes}
          titulo={"Ver Informes de Consumos"}
          descripcion={"Visualizar informes detallados de consumos de combustibles."}
          Icono={<FontAwesomeIcon icon={faChartBar} />}
        />
      </div>
    </>
  )
}

export default MenuCombustibles