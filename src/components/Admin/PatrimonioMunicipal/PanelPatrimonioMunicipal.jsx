import { Button } from "@mui/material";
import { useState } from "react";
import Categoria from "./Categoria/Categoria";
import Tipologia from "./Tipologia/Tipologia";
import Material from "./Material/Material"
import Estado from "./Estado/Estado";
import Autor from "./Autor/Autor";
import Ubicacion from "./Ubicacion/Ubicacion";
import Patrimonio from "./Patrimonio";

const PanelEducacion = () => {
    const [tablaVisible, setTablaVisible] = useState('patrimonios');

    const verTabla = (tabla) => () => {
        setTablaVisible(tabla);
    };

    return (
        <>
            <div className="px-5 mt-5 d-flex justify-content-center flex-wrap gap-3 mb-5">
                <h2>Panel Patrimonio Municipal</h2>
                <Button variant="outlined" onClick={verTabla('patrimonios')}>Patrimonios</Button>
                <Button variant="outlined" onClick={verTabla('categoria')}>Categoria</Button>
                <Button variant="outlined" onClick={verTabla('tipologia')}>Tipologia</Button>
                <Button variant="outlined" onClick={verTabla('material')}>Material</Button>
                <Button variant="outlined" onClick={verTabla('estado')}>Estado</Button>
                <Button variant="outlined" onClick={verTabla('autor')}>Autor</Button>
                <Button variant="outlined" onClick={verTabla('ubicacion')}>Ubicacion</Button>
            </div>
            <div>
                {tablaVisible === 'patrimonios' && <Patrimonio />}
                {tablaVisible === 'categoria' && <Categoria />}
                {tablaVisible === 'tipologia' && <Tipologia />}
                {tablaVisible === 'material' && <Material />}
                {tablaVisible === 'estado' && <Estado />}
                {tablaVisible === 'autor' && <Autor />}
                {tablaVisible === 'ubicacion' && <Ubicacion />}
            </div>
        </>
    );
};

export default PanelEducacion;
