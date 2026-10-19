import { Box, Button, InputAdornment, Skeleton, TextField } from "@mui/material"
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useState } from "react";
import EncabezadoPagina from "../../common/EncabezadoPagina";
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
        <div className="container">
          <EncabezadoPagina
            sup="Configuración"
            titulo="Tribunal Municipal de Faltas"
            subtitulo="Montos vigentes por concepto de infracción."
            acciones={
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => abrirModalAgregar(true)}>
                Nuevo
              </Button>
            }
          />
          <TextField
            label="Buscar por concepto"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 420 } }}
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