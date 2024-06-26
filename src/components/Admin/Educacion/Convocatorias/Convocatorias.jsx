import TablaConvocatoriasBack from "./TablaConvocatoriaBack";

const Convocatorias = () => {

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center mb-3">
        <h4 className="mt-3 mb-1">
          Registro de Convocatorias
        </h4>
        <TablaConvocatoriasBack/>
      </div>
      
    </>
  );
};

export default Convocatorias;
