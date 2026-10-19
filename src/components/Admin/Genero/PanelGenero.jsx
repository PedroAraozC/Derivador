import TablaGenero from "./TablaGenero"
import EncabezadoPagina from "../../../common/EncabezadoPagina"

const PanelGenero = () => {
  return (
    <>
        <div className="container">
            <EncabezadoPagina
                sup="Configuración"
                titulo="Géneros"
                subtitulo="Valores disponibles para el campo género de las personas."
            />
        </div>
        <div className="container">
            <TablaGenero/>
        </div>
    </>
  )
}

export default PanelGenero
