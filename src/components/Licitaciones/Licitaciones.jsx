import { Button } from "@mui/material";
import useStore from "../../Zustand/Zustand";
import { useEffect, useState } from "react";
import CardLicitacion from "./CardLicitacion";

const Licitaciones = () => {
  const { obtenerContratacionesFront, contratacionesFront } = useStore();
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    obtenerContratacionesFront();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrarContrataciones = () => {
    switch (filtro) {
      case 1:
        return contratacionesFront.filter(contratacion => contratacion.id_tcontratacion === 1);
      case 2:
        return contratacionesFront.filter(contratacion => contratacion.id_tcontratacion === 2);
      case 3:
        return contratacionesFront.filter(contratacion => contratacion.id_tcontratacion === 3);
      case 4:
        return contratacionesFront.filter(contratacion => contratacion.id_tcontratacion === 4);
      default:
        return contratacionesFront;
    }
  };

  const handleFiltroClick = (tipo) => {
    setFiltro(tipo);
  };

  return (
    <>
      <div className="container mt-5 mb-5">
        <h2>Licitaciones y Compras</h2>
        <div className="d-flex flex-wrap gap-3 mt-5 align-items-center">
          Busqueda:
          <Button size="large" variant={filtro === 'Todas' ? "contained" : "outlined"} onClick={() => handleFiltroClick('')}>Todos</Button>
          <Button size="large" variant={filtro === 1 ? "contained" : "outlined"} onClick={() => handleFiltroClick(1)}>Privadas</Button>
          <Button size="large" variant={filtro === 2 ? "contained" : "outlined"} onClick={() => handleFiltroClick(2)}>Públicas</Button>
          <Button size="large" variant={filtro === 3 ? "contained" : "outlined"} onClick={() => handleFiltroClick(3)}>Concurso de Precio</Button>
          <Button size="large" variant={filtro === 4 ? "contained" : "outlined"} onClick={() => handleFiltroClick(4)}>Compra Directa</Button>
        </div>
        <div className="mt-5 d-flex flex-wrap gap-4 justify-content-center">
          {Array.isArray(contratacionesFront) &&
            filtrarContrataciones().map((contratacion, index) => (
              <CardLicitacion key={index} contratacion={contratacion} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Licitaciones;
