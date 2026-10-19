import TablaTUsuarios from "./TablaTUsuarios"
import EncabezadoPagina from "../../../common/EncabezadoPagina"

const PanelTUsuarios = () => {
  return (
    <>
        <div className="container">
            <EncabezadoPagina
                sup="Configuración"
                titulo="Tipos de usuario"
                subtitulo="Roles del portal y los permisos asociados a cada uno."
            />
        </div>
        <div className="container">
            <TablaTUsuarios/>
        </div>
    </>
  )
}

export default PanelTUsuarios
