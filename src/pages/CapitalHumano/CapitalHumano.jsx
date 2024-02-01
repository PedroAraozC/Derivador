/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import FormCapitalHumano from "../../components/Forms/FormCapitalHumano";
import GraficosCapHumanoPlantaMunicipal from "../../components/Graficos/GraficosCapHumano/GraficosCapHumanoPlantaMunicipal";
import GraficosCapHumanoPlantaPorReparticion from "../../components/Graficos/GraficosCapHumano/GraficosCapHumanoPlantaPorReparticion";
import useStore from "../../Zustand/Zustand";
import "./CapitalHumano.css";
import { Box, CircularProgress } from "@mui/material";
import GraficosCapHumanoPlantaPorCatego from "../../components/Graficos/GraficosCapHumano/GraficosCapHumanoPlantaPorCatego";
import TablaPorCategoria from "../../components/Tablas/CapitalHumano/TablaPorCategoria";
import TablaPlantaMunicipal from "../../components/Tablas/CapitalHumano/TablaPlantaMunicipal";
import TablaPorReparticion from "../../components/Tablas/CapitalHumano/TablaPorReparticion";

const CapitalHumano = () => {
  const { resultSearch, valuesCapHumano, setResultSearch, setValuesCapHumano } = useStore();

  useEffect(() => {
    setResultSearch([]);
    setValuesCapHumano("");
  }, []);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center container mt-5">
        <FormCapitalHumano />
        {    valuesCapHumano.includes("catego") && resultSearch[0]?.length !== 0 ? (
          <TablaPorCategoria />
        ) :  valuesCapHumano.includes("municipal") && resultSearch[0]?.length !== 0 ?(
          <TablaPlantaMunicipal />
        ) :  valuesCapHumano.includes("reparticion") && resultSearch[0]?.length !== 0? ( 
          <TablaPorReparticion/>
        ): 
        (<></>)}
      </div>
      {resultSearch[0]?.length !== 0 ? (
        <div className="container containerGrafico mb-3">
          {resultSearch[0]?.length > 0 &&
          valuesCapHumano.includes("municipal") ? (
            <GraficosCapHumanoPlantaMunicipal />
          ) : resultSearch[0]?.length > 0 &&
            valuesCapHumano.includes("reparticion") ? (
            <GraficosCapHumanoPlantaPorReparticion />
          ) : resultSearch[0]?.length > 0 &&
            valuesCapHumano.includes("catego") ? (
            <GraficosCapHumanoPlantaPorCatego />
          ) : (
            <></>
          )}
        </div>
      ) : (
        valuesCapHumano != "" && (
          <Box className="d-flex justify-content-center">
            <CircularProgress />
          </Box>
        )
      )}
    </>
  );
};

export default CapitalHumano;
