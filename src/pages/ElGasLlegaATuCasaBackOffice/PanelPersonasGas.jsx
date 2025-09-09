import TablaPersonasGas from "./TablaPersonasGas";

const PanelPersonasGas = () => {
  return (
    <>
      <div className="container  mt-5 text-center">
        <h2> Panel Administrador</h2>
        <h4>"El Gas Llega A Tu Casa"</h4>
      </div>
      <div className="w-100">
        <TablaPersonasGas />
      </div>
    </>
  );
};

export default PanelPersonasGas;
