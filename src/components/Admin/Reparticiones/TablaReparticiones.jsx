/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { EducaContext } from "../../../context/EducaContext";
import ModalReparticiones from "./ModalReparticiones";
import ModalAgregar from "./ModalAgregar";


const TablaReparticiones = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [reparticionSeleccionado, setReparticionSeleccionado] = useState(null);
    const { reparticiones, obtenerReparticiones, refresh } = useContext(EducaContext);
    const [paginatedArray, setPaginatedArray] = useState([]);

    //Funcion para listar las convocatorias
    useEffect(() => {
        obtenerReparticiones();
    }, [refresh]);

    useEffect(() => {
        setPaginatedArray(reparticiones?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [reparticiones, page, rowsPerPage]);

    const handleCheckboxChange = (reparticionesId) => {
        const reparticion = reparticiones?.find(
            (conv) => conv.id_reparticion === reparticionesId
        );

        setReparticionSeleccionado((prevReparticion) => {
            if (
                !prevReparticion ||
                prevReparticion.id_reparticion !== reparticionesId
            ) {
                return reparticion;
            } else {
                return null;
            }
        });
    };

    const abrirModal = (reparticion) => {
        setReparticionSeleccionado(reparticion);
        setModalAbierto(true);
    };
    const abrirModalAgregar = () => {
        setModalAgregarAbierto(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    return (
        <>
            <div className="container d-flex justify-content-end mt-3">
                <Button
                    variant="contained"
                    disabled={reparticionSeleccionado !== null}
                    onClick={() => abrirModalAgregar(true)}
                >
                    NUEVO
                </Button>
                <Button
                    variant="contained"
                    className="mx-3"
                    disabled={reparticionSeleccionado === null}
                    onClick={() => abrirModal(reparticionSeleccionado, true)}
                >
                    EDITAR
                </Button>
            </div>
            <div className="mt-5 mb-5 container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Tipo de Usuario</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Habilitado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(reparticiones) &&
                                paginatedArray?.map((reparti) => (
                                    <TableRow key={reparti.id_reparticion}>
                                        <TableCell>
                                            <Checkbox
                                                checked={
                                                    reparticionSeleccionado?.id_reparticion ===
                                                    reparti.id_reparticion
                                                }
                                                onChange={() =>
                                                    handleCheckboxChange(reparti.id_reparticion)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{reparti.id_reparticion}</TableCell>
                                        <TableCell>
                                            {reparti.nombre_reparticion}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{reparti.habilita == 1 ? 'SI' : ('NO')}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
                        component="div"
                        count={reparticiones?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Columnas por pagina"
                    />
                </TableContainer>
                <ModalReparticiones
                    reparticiones={reparticionSeleccionado}
                    modalAbierto={modalAbierto}
                    handleClose={() => setModalAbierto(false)}
                />
                <ModalAgregar
                    modalAgregarAbierto={modalAgregarAbierto}
                    handleClose={() => setModalAgregarAbierto(false)}
                />
            </div>
        </>
    );
};

export default TablaReparticiones;
