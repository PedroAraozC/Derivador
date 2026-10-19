import TablaReparticiones from "./TablaReparticiones"
import EncabezadoPagina from "../../../common/EncabezadoPagina"

const PanelReparticiones = () => {
  return (
    <>
        <div className="container">
            <EncabezadoPagina
                sup="Configuración"
                titulo="Reparticiones"
                subtitulo="Áreas y dependencias municipales habilitadas en el portal."
            />
        </div>
        <div className="container">
            <TablaReparticiones/>
        </div>
    </>
  )
}

export default PanelReparticiones
