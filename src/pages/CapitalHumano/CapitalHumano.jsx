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
import GraficosCapHumanoFuncionarios from "../../components/Graficos/GraficosCapHumano/GraficosCapHumanoFuncionarios";
import TablaPorFuncionarios from "../../components/Tablas/CapitalHumano/TablaPorFuncionarios";
import TablaPorSecretaria from "../../components/Tablas/CapitalHumano/TablaPorSecretaria";
import TablaPorCategoriaYSec from "../../components/Tablas/CapitalHumano/TablaPorCategoriaYSec";
import GraficosCapHumanoPlantaPorCategoYSec from "../../components/Graficos/GraficosCapHumano/GraficosCapHumanoPlantaPorCategoYSec";
import TablaPorFuncionariosYSec from "../../components/Tablas/CapitalHumano/TablaPorFuncionariosYSec";
import GraficosCapHumanoFuncionariosYSec from "../../components/Graficos/GraficosCapHumano/GraficosCapHumanoFuncionariosYSec";
import GraficosCapHumanoPlantaPorSecretaria from "../../components/Graficos/GraficosCapHumano/GraficosCapHumanoPlantaPorSecretaria";

const CapitalHumano = () => {
  const { resultSearch, valuesCapHumano, setResultSearch, setValuesCapHumano, flagCategoriasFuncionarios } = useStore();

  useEffect(() => {
    setResultSearch([]);
    setValuesCapHumano("");
  }, []);
console.log(valuesCapHumano);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center container mt-5">
        <FormCapitalHumano />
        {    valuesCapHumano.includes("porsecretaria")&&
        resultSearch[0]?.length !== 0 ?
        <TablaPorSecretaria/>
        : valuesCapHumano.includes("categosec") &&
        resultSearch[0]?.length !== 0 &&
        flagCategoriasFuncionarios ? (
          <TablaPorFuncionariosYSec />)
        :
        valuesCapHumano.includes("catego") &&
        resultSearch[0]?.length !== 0 &&
        flagCategoriasFuncionarios ? (
          <TablaPorFuncionarios />
        ) 
        
        : valuesCapHumano.includes("categosec") &&
        resultSearch[0]?.length !== 0 ?
          <TablaPorCategoriaYSec/>
        : valuesCapHumano.includes("catego") &&
          resultSearch[0]?.length !== 0 ? (
          <TablaPorCategoria />
        ) 
        : valuesCapHumano.includes("municipal") &&
          resultSearch[0]?.length !== 0 ? (
          <TablaPlantaMunicipal />
        ) : valuesCapHumano.includes("reparticion") &&
          resultSearch[0]?.length !== 0 ? (
          <TablaPorReparticion />
        ) : (
          <></>
        )}
      </div>
      {resultSearch[0]?.length !== 0 ? (
        <div className="container containerGrafico mb-3">
          {resultSearch[0]?.length > 0 &&
          valuesCapHumano.includes("municipal") ? (
            <GraficosCapHumanoPlantaMunicipal />
          ) : resultSearch[0]?.length > 0 &&
            valuesCapHumano.includes("reparticion") ? (
            <GraficosCapHumanoPlantaPorReparticion />
          ): resultSearch[0]?.length > 0 && valuesCapHumano.includes("plantaporsecretaria") ?
            <GraficosCapHumanoPlantaPorSecretaria/>
            : resultSearch[0]?.length > 0 &&
            valuesCapHumano.includes("categosec") &&
            !flagCategoriasFuncionarios ?
            <GraficosCapHumanoPlantaPorCategoYSec/>
          : resultSearch[0]?.length > 0 &&
            valuesCapHumano.includes("catego") &&
            !flagCategoriasFuncionarios ? (
            <GraficosCapHumanoPlantaPorCatego />
          ) 
          : resultSearch[0]?.length > 0 &&
          valuesCapHumano.includes("categosec") &&
          !flagCategoriasFuncionarios ?
          <GraficosCapHumanoFuncionariosYSec/>
          : resultSearch[0]?.length > 0 &&
            valuesCapHumano.includes("catego") &&
            flagCategoriasFuncionarios ? (
            <GraficosCapHumanoFuncionarios />
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
