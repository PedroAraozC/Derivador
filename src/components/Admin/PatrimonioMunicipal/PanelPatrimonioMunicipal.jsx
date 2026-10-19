import { Button } from "@mui/material";
import { useState } from "react";
import Categoria from "./Categoria/Categoria";
import Tipologia from "./Tipologia/Tipologia";
import Material from "./Material/Material"
import Estado from "./Estado/Estado";
import Autor from "./Autor/Autor";
import Ubicacion from "./Ubicacion/Ubicacion";
import Patrimonio from "./Patrimonio";
import Banner from "./Banner/Banner"
import EncabezadoPagina from "../../../common/EncabezadoPagina";

const SECCIONES = [
    { id: 'patrimonios', label: 'Patrimonios' },
    { id: 'categoria', label: 'Categoría' },
    { id: 'tipologia', label: 'Tipología' },
    { id: 'material', label: 'Material' },
    { id: 'estado', label: 'Estado' },
    { id: 'autor', label: 'Autor' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'banner', label: 'Banner' },
];

const PanelEducacion = () => {
    const [tablaVisible, setTablaVisible] = useState('patrimonios');

    const verTabla = (tabla) => () => {
        setTablaVisible(tabla);
    };

    return (
        <>
            <div className="container">
                <EncabezadoPagina
                    sup="Configuración"
                    titulo="Patrimonio Municipal"
                    subtitulo="Inventario de bienes patrimoniales y sus catálogos auxiliares."
                />
                <div className="cd-encabezado__acciones mb-4">
                    {SECCIONES.map((seccion) => (
                        <Button
                            key={seccion.id}
                            size="small"
                            variant={tablaVisible === seccion.id ? 'contained' : 'outlined'}
                            onClick={verTabla(seccion.id)}
                        >
                            {seccion.label}
                        </Button>
                    ))}
                </div>
            </div>
            <div>
                {tablaVisible === 'patrimonios' && <Patrimonio />}
                {tablaVisible === 'categoria' && <Categoria />}
                {tablaVisible === 'tipologia' && <Tipologia />}
                {tablaVisible === 'material' && <Material />}
                {tablaVisible === 'estado' && <Estado />}
                {tablaVisible === 'autor' && <Autor />}
                {tablaVisible === 'ubicacion' && <Ubicacion />}
                {tablaVisible === 'banner' && <Banner />}
            </div>
        </>
    );
};

export default PanelEducacion;
