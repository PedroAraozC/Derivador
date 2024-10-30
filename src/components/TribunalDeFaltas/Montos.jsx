import { Box, Button, Skeleton, TextField } from "@mui/material"
import { useState } from "react";
import ModalAgregarCalle from "./ModalAgregarMonto";
import TablaCalles from "./TablaMontos";
import axios from "../../config/axios";
import useGet from "../../hooks/useGet";

const Montos = () => {

    // const [oficinas, setOficinas] = useState([]);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const abrirModalAgregar = () => {
        setModalAgregarAbierto(true);
    };
 
    const [{ montos }, loadingMontos, getMontos, setMontos] = useGet(
        "/usuarios/montos",
        axios
      );

      const [{ tiposDeMontos }, loadingMontosTipo, getMontosTipo, setMontosTipo] = useGet(
        "/usuarios/montosTipo",
        axios
      );

      //FILTRO DE CALLES
      const [searchTerm, setSearchTerm] = useState("");

      const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredMontos = montos?.filter((calle) =>
        calle.monto_det.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
      <>
        <div className="container d-flex justify-content-between align-items-center mt-3 gap-3">
          <h2>Tribunal Municipal de Faltas</h2>
          <Button variant="contained" onClick={() => abrirModalAgregar(true)}>
            Nuevo
          </Button>
        </div>

        <div className="mt-3 d-flex justify-content-center">
          <TextField
            label="Concepto"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              width: {
                xs: 300, // Ancho para pantallas pequeñas (mobile)
                sm: 400, // Ancho para pantallas pequeñas-medias
                md: 500, // Ancho para pantallas medianas
                lg: 600, // Ancho para pantallas grandes
              },
            }}
          />
        </div>

        {!loadingMontos && !loadingMontosTipo && (
          <ModalAgregarCalle
            modalAgregarAbierto={modalAgregarAbierto}
            handleClose={() => setModalAgregarAbierto(false)}
            setMontos={setMontos}
            callesTipo={tiposDeMontos}
            getCalles={getMontos}
          />
        )}
        {!loadingMontos && !loadingMontosTipo ? (
          <TablaCalles
            calles={filteredMontos}
            setCalles={setMontos}
            callesTipo={tiposDeMontos}
            getCalles={getMontos}
          />
        ) : (
          <div className="d-flex justify-content-center">
            <Box className="mt-3" sx={{ width: 600 }}>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          </div>
        )}
      </>
    );
}

export default Montos