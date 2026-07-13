import { Box, Button, IconButton, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from "react";
import { traerReclamoPorID, traerReclamosPorPersona } from "./funcionesReclamos";
import TablaReclamos from "./TablaReclamos";
import Volver from "../../common/Volver";
import useStore from "../../Zustand/Zustand";
import { useNavigate } from "react-router-dom";

const ConsultaPublica = () => {

    const user = useStore((state) => state.user);
    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [data, setData] = useState([]);

    // trae los reclamos del usuario logueado segun su id_persona
    const traerMisReclamos = async () => {
        if (!user?.id_persona) return;
        const datos = {
            id_persona: user.id_persona,
            // id_persona: 1,
        };
        const res = await traerReclamosPorPersona(datos);
        setData(Array.isArray(res) ? res : []);
    };

    useEffect(() => {
        traerMisReclamos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id_persona]);

    const handleBuscarPorId = async () => {
        const datos = {
            idreclamo: id || null,
        };
        traerReclamoPorID(datos).then((res) => {
            setData(res);
        });
    };

    const handleNuevoReclamo = () => {
        navigate("/consulta-publica/agregar-reclamo");
    };


    return (
        <div className="container">
            <Volver />
            <p>Consulta de Reclamos</p>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 2,
                }}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <TextField
                            label="ID reclamo"
                            InputLabelProps={{ shrink: true }}
                            value={id}
                            onChange={e => setId(e.target.value)}
                        />
                        <IconButton color="primary" size="large" onClick={handleBuscarPorId}>
                            <SearchIcon />
                        </IconButton>
                    </div>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleNuevoReclamo}
                    >
                        Nuevo Reclamo
                    </Button>
                </div>
            </Box>
            <p>Mis reclamos</p>
            <TablaReclamos data={data} />
        </div>
    );
};

export default ConsultaPublica;
