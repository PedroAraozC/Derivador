/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material"
import useStore from "../../Zustand/Zustand";
import { useEffect } from "react";
import CardLicitacion from "./CardLicitacion";

const Licitaciones = () => {
  const { obtenerContratacionesFront, contratacionesFront } = useStore();

  useEffect(() => {
    obtenerContratacionesFront()
  }, [])

  console.log(contratacionesFront)

  return (
    <>
      <div className="container mt-5 mb-5">
        <h2>Licitaciones y Compras</h2>
        <div className="d-flex gap-3 mt-5 align-items-center">
          Filtros:
          <Button size="large" color="primary" variant="outlined">Todas</Button>
          <Button size="large" color="success" variant="contained">Privadas</Button>
          <Button size="large" variant="contained">Públicas</Button>
          <Button size="large" color="secondary" variant="contained">Concursos de Precio</Button>
          <Button size="large" color="error" variant="contained">Compra Directa</Button>
        </div>
        <div className="mt-5 d-flex flex-wrap gap-4">
          {Array.isArray(contratacionesFront) &&
            contratacionesFront.map((contratacion) => (
              <CardLicitacion key={contratacion.id} contratacion={contratacion} />
            ))}
        </div>
      </div>
    </>
  )
}

export default Licitaciones