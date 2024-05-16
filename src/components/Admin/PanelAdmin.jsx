import { Button } from "@mui/material"
import TablaOpciones from "./TablaOpciones";
import { useState } from "react";

const PanelAdmin = () => {

    const [mostrarTabla, setMostrarTabla] = useState(false);

    const listarOpciones = async ()=>{
        setMostrarTabla(true)
    }
    

  return (
    <>
        <div className="container d-flex align-items-center gap-3 mt-5">
            <h2 className="m-0">ADMINISTRADOR MENU</h2>
            <Button variant="contained" onClick={listarOpciones}>Listar Opciones</Button>
        </div>
        <div className="container justify-content-center mt-5">
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