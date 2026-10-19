import TablaTDocumento from "./TablaTDocumento"
import EncabezadoPagina from "../../../common/EncabezadoPagina"

const PanelTDocumento = () => {
  return (
    <>
        <div className="container">
            <EncabezadoPagina
                sup="Configuración"
                titulo="Tipos de documento"
                subtitulo="Documentos de identidad aceptados al registrar personas."
            />
        </div>
        <div className="container">
            <TablaTDocumento/>
        </div>
    </>
  )
}

export default PanelTDocumento
