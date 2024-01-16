import useStore from "../../Zustand/Zustand";
import GraficoReclamos from "../../components/Graficos/GraficosReclamos/GraficoReclamos";
import FormReclamos from '../../components/Forms/FormReclamos'
import { useEffect } from "react";


const Reclamos = () => {

 const { resultSearch, setResultSearch,valuesGraficos,setValuesGraficos } = useStore();
console.log(valuesGraficos);
 useEffect(() => {
  setResultSearch([])
  setValuesGraficos({procedimiento: "",
  desde: "",
  hasta: "",})
}, [])

  return (
    <>
        <FormReclamos/>
        {resultSearch.length !== 0 && <GraficoReclamos />}
    </>
  )
}

export default Reclamos