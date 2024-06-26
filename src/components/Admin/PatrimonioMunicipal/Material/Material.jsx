import React from "react";
import TablaMaterial from "./TablaMaterial";

const Material = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center mb-3">
      <h4 className="mt-3 mb-1">Registro de Material</h4>
      <TablaMaterial />
    </div>
  );
};

export default Material;
