import "./Causal.css";
import TablaCausal from "./TablaCausal";

const Causal = () => {

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center mb-3">
        <h4 className="mt-3 mb-1">
          Registro de Causales
        </h4>
        <TablaCausal/>
      </div>
    </>
  );
};

export default Causal;
