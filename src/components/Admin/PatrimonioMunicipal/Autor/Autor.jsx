import TablaAutor from "./TablaAutor"

const Autor = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center mb-3">
            <h4 className="mt-3 mb-1">
              Registro de Autores
            </h4>
            <TablaAutor/>
          </div>
  )
}

export default Autor