import TablaCaracter from "./TablaCaracter";

const Caracter = () => {
  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center mb-3">
        <h4 className="mt-3 mb-1">
          Registro de Caracter
        </h4>
        <TablaCaracter/>
      </div>
    </>
  )
}

export default Caracter