import TablaUsuarios from "./TablaUsuarios"
import EncabezadoPagina from "../../../common/EncabezadoPagina"

const PanelUsuarios = () => {
  return (
    <>
        <div className="container">
            <EncabezadoPagina
                sup="Configuración"
                titulo="Usuarios"
                subtitulo="Empleados registrados, su tipo de usuario y permisos específicos."
            />
        </div>
        <div className="container">
            <TablaUsuarios/>
        </div>
    </>
  )
}

export default PanelUsuarios
