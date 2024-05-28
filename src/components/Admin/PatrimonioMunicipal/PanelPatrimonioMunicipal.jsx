import { Button } from "@mui/material";
// import Establecimiento from "../Educacion/Establecimientos/TablaEstablecimiento";
// import Caracter from "./Caracter/Caracter";
// import Causal from "./Causal/Causal";
// import Convocatorias from "./Convocatorias/Convocatorias";
import { useState } from "react";
import Categoria from "./Categoria/Categoria";
import Tipologia from "./Tipologia/Tipologia";
import Material from "./Material/Material"
import Estado from "./Estado/Estado";

const PanelEducacion = () => {
    const [tablaVisible, setTablaVisible] = useState(null);

    const verTabla = (tabla) => () => {
        setTablaVisible(tabla);
    };

    return (
        <>
            <div className="container mt-5 d-flex justify-content-between mb-5">
                <h2>Panel Patrimonio Municipal</h2>
                <Button variant="outlined" onClick={verTabla('categoria')}>Categoria</Button>
                <Button variant="outlined" onClick={verTabla('tipologia')}>Tipologia</Button>
                <Button variant="outlined" onClick={verTabla('material')}>Material</Button>
                <Button variant="outlined" onClick={verTabla('estado')}>Estado</Button>
                <Button variant="outlined" onClick={verTabla('autor')}>Autor</Button>
                <Button variant="outlined" onClick={verTabla('ubicacion')}>Ubicacion</Button>
            </div>
            <div>
                {tablaVisible === 'categoria' && <Categoria />}
                {tablaVisible === 'tipologia' && <Tipologia />}
                {tablaVisible === 'material' && <Material />}
                {tablaVisible === 'estado' && <Estado />}
                {tablaVisible === 'causal' && <Causal />}
            </div>
        </>
    );
};

export default PanelEducacion;
