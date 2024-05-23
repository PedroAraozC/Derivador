import { Button } from "@mui/material";
import Establecimiento from "./Establecimientos/Establecimiento";
import Caracter from "./Caracter/Caracter";
import Causal from "./Causal/Causal";
import Convocatorias from "./Convocatorias/Convocatorias";
import { useState } from "react";

const PanelEducacion = () => {
    const [tablaVisible, setTablaVisible] = useState(null);

    const verTabla = (tabla) => () => {
        setTablaVisible(tabla);
    };

    return (
        <>
            <div className="container mt-5 d-flex justify-content-between mb-5">
                <h2>Panel Educación</h2>
                <Button variant="outlined" onClick={verTabla('convocatorias')}>Convocatorias</Button>
                <Button variant="outlined" onClick={verTabla('establecimientos')}>Establecimientos</Button>
                <Button variant="outlined" onClick={verTabla('caracter')}>Caracter</Button>
                <Button variant="outlined" onClick={verTabla('causal')}>Causal</Button>
            </div>
            <div>
                {tablaVisible === 'convocatorias' && <Convocatorias />}
                {tablaVisible === 'establecimientos' && <Establecimiento />}
                {tablaVisible === 'caracter' && <Caracter />}
                {tablaVisible === 'causal' && <Causal />}
            </div>
        </>
    );
};

export default PanelEducacion;
