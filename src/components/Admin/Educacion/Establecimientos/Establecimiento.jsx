import TablaEstablecimiento from "./TablaEstablecimiento";

const Establecimiento = () => {
  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center mb-3">
        <h4 className="mt-3 mb-1">
          Registro de Establecimientos
        </h4>
        <TablaEstablecimiento/>
      </div>
    </>
  )
}

export default Establecimiento