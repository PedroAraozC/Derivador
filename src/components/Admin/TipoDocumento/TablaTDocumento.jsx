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
import ModalTUsuarios from "./ModalTDocumento";
import ModalAgregar from "./ModalAgregar";


const TablaTDocumento = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [tdocumentoSeleccionado, setTDocumentoSeleccionado] = useState(null);
    const { tdocumentos, obtenerTiposDeDocumento, refresh } = useContext(EducaContext);
    const [paginatedArray, setPaginatedArray] = useState([]);

    //Funcion para listar las convocatorias
    useEffect(() => {
        obtenerTiposDeDocumento();
    }, [refresh]);

    useEffect(() => {
        setPaginatedArray(tdocumentos?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [tdocumentos, page, rowsPerPage]);

    const handleCheckboxChange = (tdocumentosId) => {
        const tdocumento = tdocumentos?.find(
            (conv) => conv.id_tdocumento === tdocumentosId
        );

        setTDocumentoSeleccionado((prevTDocumento) => {
            if (
                !prevTDocumento ||
                prevTDocumento.id_tdocumento !== tdocumentosId
            ) {
                return tdocumento;
            } else {
                return null;
            }
        });
    };

    const abrirModal = (tdocumento) => {
        setTDocumentoSeleccionado(tdocumento);
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
                    disabled={tdocumentoSeleccionado !== null}
                    onClick={() => abrirModalAgregar(true)}
                >
                    NUEVO
                </Button>
                <Button
                    variant="contained"
                    className="mx-3"
                    disabled={tdocumentoSeleccionado === null}
                    onClick={() => abrirModal(tdocumentoSeleccionado, true)}
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
                            {Array.isArray(tdocumentos) &&
                                paginatedArray?.map((tdocumento) => (
                                    <TableRow key={tdocumento.id_tdocumento}>
                                        <TableCell>
                                            <Checkbox
                                                checked={
                                                    tdocumentoSeleccionado?.id_tdocumento ===
                                                    tdocumento.id_tdocumento
                                                }
                                                onChange={() =>
                                                    handleCheckboxChange(tdocumento.id_tdocumento)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{tdocumento.id_tdocumento}</TableCell>
                                        <TableCell>
                                            {tdocumento.nombre_tdocumento}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{tdocumento.habilita == 1 ? 'SI' : ('NO')}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
                        component="div"
                        count={tdocumentos?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Columnas por pagina"
                    />
                </TableContainer>
                <ModalTUsuarios
                    tdocumentos={tdocumentoSeleccionado}
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

export default TablaTDocumento;
