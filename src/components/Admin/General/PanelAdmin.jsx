import { Button } from "@mui/material"
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import TablaOpciones from "./TablaOpciones";
import { useState } from "react";
import EncabezadoPagina from "../../../common/EncabezadoPagina";

const PanelAdmin = () => {

    const [mostrarTabla, setMostrarTabla] = useState(false);

    const listarOpciones = async ()=>{
        setMostrarTabla(true)
    }


  return (
    <>
        <div className="container">
            <EncabezadoPagina
                sup="Configuración"
                titulo="Administrador de menú"
                subtitulo="Opciones y procesos que componen el menú del portal."
                acciones={
                    <Button
                        variant={mostrarTabla ? "outlined" : "contained"}
                        startIcon={<ListAltOutlinedIcon />}
                        onClick={listarOpciones}
                    >
                        Listar Opciones
                    </Button>
                }
            />
        </div>
        <div className="container justify-content-center">
            <div className="d-flex flex-column">
                {mostrarTabla?
                <TablaOpciones /> : <></>
                }
            </div>
        </div>
    </>
  )
}

export default PanelAdmin
