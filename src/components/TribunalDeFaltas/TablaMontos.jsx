/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import DeleteIcon from '@mui/icons-material/Delete';
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';
import { Alert, Snackbar } from "@mui/material";
import ModalEditarOficina from "./ModalEditarMonto";
import axios from "../../config/axios";

const TablaCalles = ({calles, setCalles, callesTipo, getCalles}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [calleSeleccionada, setCalleSeleccionada] = useState(null);
    const [paginatedArray, setPaginatedArray] = useState([]);
  
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    // const [refresh, setRefresh] = useState(false);

    // const actualizador = () =>{
    //     setRefresh(!refresh)
    // }
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    const abrirModalEditar = (oficina) => {
        setCalleSeleccionada(oficina)
        setModalEditarAbierto(true);
    };

    // Función para listar las oficinaes
    // useEffect(() => {
    //     traercalles().then(res => setcalles(res));
    // }, []);

    useEffect(() => {
        setPaginatedArray(calles?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [calles, page, rowsPerPage]);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const deshabilitarCalle = async (ofi) => {
        let datos = {id: ofi.idMonto}
        try {
            const response = await axios.post("/usuarios/deshabilitarMonto", datos);
            setSnackbarMensaje('Deshabilitada con exito');
            setSnackbarOpen(true);
            getCalles();
            return response.data;
        } catch (error) {
            console.error("Error al deshabilitar la Calle:", error);
            setSnackbarMensaje('Error al deshabilitar la Calle');
            setSnackbarOpen(true);
            throw new Error("Error al agregar la Calle");
        }
    };

    return (
        <>
            <div className="mt-3 mb-5 container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">ID</TableCell>
                                <TableCell>Concepto</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell align="center">Habilitado</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(calles) &&
                                paginatedArray.map((ofi) => (
                                    <TableRow 
                                        key={ofi.idcalle}
                                        sx={{ height: '26px' }}
                                    >
                                        <TableCell align="center">{ofi.idMonto}</TableCell>
                                        <TableCell>{ofi.monto_det}</TableCell>
                                    <TableCell>{Number(ofi.precio)}</TableCell>
                              
                                        <TableCell align="center">{ofi.estado === 1 ? "Habilitado" : "Deshabilitado"}</TableCell>
                                        <TableCell align="center">
                                            <EditIcon onClick={() => abrirModalEditar(ofi)} sx={{cursor: 'pointer'}}/>
                                            <DeleteIcon onClick={ofi.estado === 1 ? () => deshabilitarCalle(ofi) : ()=>console.log("e")} sx={{marginLeft: 2, cursor: 'pointer'}}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
                        component="div"
                        count={calles?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                        sx={{margin: 0, padding: 0}}
                    />
                </TableContainer>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                        {snackbarMensaje}
                    </Alert>
                </Snackbar>
               
                <ModalEditarOficina
                    modalEditarAbierto={modalEditarAbierto}
                    handleClose={() => setModalEditarAbierto(false)}
                    calleSeleccionada={calleSeleccionada}
                    setCalles={setCalles}
                    callesTipo={callesTipo} getCalles={getCalles}
                    setCalleSeleccionada={setCalleSeleccionada}
                />
                
            </div>
        </>
    );
};

export default TablaCalles;
