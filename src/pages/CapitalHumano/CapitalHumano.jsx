import FormCapitalHumano from '../../components/Forms/FormCapitalHumano'
import GraficosCapHumanoPlantaMunicipal from '../../components/Graficos/GraficosCapHumano/GraficosCapHumanoPlantaMunicipal';
import GraficosCapHumanoPlantaPorReparticion from '../../components/Graficos/GraficosCapHumano/GraficosCapHumanoPlantaPorReparticion';
import TablaCapitalHumano from '../../components/Tablas/TablaCapitalHumano'
import useStore from '../../components/Zustand/Zustand';
import './CapitalHumano.css'

const CapitalHumano = () => {
    const { resultSearch, valuesCapHumano } = useStore();
  return (
    <>
        <div className='layoutContainer d-flex flex-column justify-content-center align-items-center container'>
            <FormCapitalHumano/>
            <TablaCapitalHumano/>
         </div>
         <div className='container containerGrafico'>
            {resultSearch.length > 0 && valuesCapHumano.includes("municipal") ? <GraficosCapHumanoPlantaMunicipal/> : 
             resultSearch.length > 0 && valuesCapHumano.includes("reparticion") ? <GraficosCapHumanoPlantaPorReparticion/> : <></>
            }
         </div>
    </>
  )
}

export default CapitalHumano