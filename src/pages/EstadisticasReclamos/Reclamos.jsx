import useStore from "../../Zustand/Zustand";
import GraficoReclamos from "../../components/Graficos/GraficosReclamos/GraficoReclamos";
import FormReclamos from "../../components/Forms/FormReclamos";
import { useEffect } from "react";
import TablaPorCategoria from "../../components/Tablas/Reclamos/TablaPorCategoria";
import TablaPorCategoriaYEstado from "../../components/Tablas/Reclamos/TablaPorCategoriaYEstado";
import TablaPorOficina from "../../components/Tablas/Reclamos/TablaPorOficina";
import TablaPorEstados from "../../components/Tablas/Reclamos/TablaPorEstados";
import TablaPorOrigen from "../../components/Tablas/Reclamos/TablaPorOrigen";
import TablaPorDerivacion from "../../components/Tablas/Reclamos/TablaPorDerivacion";
import { Box, CircularProgress } from "@mui/material";

const Reclamos = () => {
  const {
    resultSearch,
    setResultSearch,
    setValuesGraficos,
    valuesGraficos,
    formFlagReclamos,
  } = useStore();
  useEffect(() => {
    setResultSearch([]);
    setValuesGraficos({ procedimiento: "", desde: "", hasta: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormReclamos />
      {formFlagReclamos ? (
        <>
          <div className="d-flex flex-column justify-content-center align-items-center container mt-2">
            {valuesGraficos.procedimiento == "sp_reclamos_por_categoria" &&
            resultSearch[0]?.length !== 0 ? (
              <TablaPorCategoria />
            ) : valuesGraficos.procedimiento ==
                "sp_reclamos_por_categoria_estado" &&
              resultSearch[0]?.length !== 0 ? (
              <TablaPorCategoriaYEstado />
            ) : valuesGraficos.procedimiento ==
                "sp_reclamos_por_estado_sec_repar_oficina_cuadro" &&
              resultSearch[0]?.length !== 0 ? (
              <TablaPorOficina />
            ) : valuesGraficos.procedimiento == "sp_reclamos_por_estados" &&
              resultSearch[0]?.length !== 0 ? (
              <TablaPorEstados />
            ) : valuesGraficos.procedimiento == "sp_reclamos_por_origen" &&
              resultSearch[0]?.length !== 0 ? (
              <TablaPorOrigen />
            ) : valuesGraficos.procedimiento == "sp_reclamos_por_rep_deriva" &&
              resultSearch[0]?.length !== 0 ? (
              <TablaPorDerivacion />
            ) : (
              <></>
            )}
          </div>
          {resultSearch[0]?.length !== 0 && <GraficoReclamos />}
        </>
      ) : (
        <Box className="d-flex justify-content-center">
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default Reclamos;
