import TablaUbicacion from "./TablaUbicacion"

const Ubicacion = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center mb-3">
            <h4 className="mt-3 mb-1">
              Registro de Ubicaciones
            </h4>
            <TablaUbicacion/>
          </div>
  )
}

export default Ubicacion