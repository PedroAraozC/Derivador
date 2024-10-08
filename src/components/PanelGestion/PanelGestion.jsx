/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { EducaContext } from "../../context/EducaContext";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, CircularProgress, Box } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useStore from "../../Zustand/Zustand";

const PanelGestion = () => {
    const { obtenerLinksPanelGestion, linksPanelGestion } = useContext(EducaContext);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [paginatedArray, setPaginatedArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authenticated, user } = useStore();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    useEffect(() => {
        if(authenticated){
            let id = user?.id_persona;
            obtenerLinksPanelGestion(id);
        }
    }, [authenticated]);

    useEffect(() => {
        if (linksPanelGestion.length > 0) {
            setPaginatedArray(linksPanelGestion.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
            setLoading(false); // Detener el spinner cuando los datos están disponibles
        }
    }, [linksPanelGestion, page, rowsPerPage]);

    const irAlLink = (enlace) => {
        const token = localStorage.getItem("token");
        const url = new URL(enlace.enlaces_link);
        url.searchParams.append("auth", token);
        window.open(url.toString(), "_blank");
    };

    return (
        <>
            <div className="container mt-5">
                <h2>Panel de Gestión</h2>
            </div>
            <div className="mt-5 mb-5 container">
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>ENLACE</TableCell>
                                    <TableCell>LINK</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(linksPanelGestion) &&
                                    paginatedArray.map((enlace) => (
                                        <TableRow key={enlace.id_enlace}>
                                            <TableCell>{enlace.id_enlace}</TableCell>
                                            <TableCell>{enlace.enlaces_nombre}</TableCell>
                                            <TableCell style={{cursor: 'pointer'}} onClick={() => irAlLink(enlace)}>
                                                <OpenInNewIcon/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
                            component="div"
                            count={linksPanelGestion?.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Enlaces por pagina"
                        />
                    </TableContainer>
                )}
            </div>
        </>
    );
};

export default PanelGestion;
