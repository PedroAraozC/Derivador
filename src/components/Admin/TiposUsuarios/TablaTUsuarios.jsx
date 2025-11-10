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
import { DerivadorContext } from "../../../context/DerivadorContext";
import ModalTUsuarios from "./ModalTUsuarios";
import ModalAgregar from "./ModalAgregar";
import PermisosTUsuario from "./PermisosTUsuario";
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';

const TablaTUsuarios = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [modalPermisosAbierto, setModalPermisosAbierto] = useState(false);
    const [tusuarioSeleccionado, setTusuarioSeleccionado] = useState(null);
    const { tusuarios, obtenerTiposDeUsuarios, refresh } = useContext(DerivadorContext);
    const [paginatedArray, setPaginatedArray] = useState([]);

    useEffect(() => {
        obtenerTiposDeUsuarios();
    }, [refresh]);

    useEffect(() => {
        setPaginatedArray(tusuarios?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [tusuarios, page, rowsPerPage]);

    const abrirModal = (tusuario) => {
        setTusuarioSeleccionado(tusuario);
        setModalAbierto(true);
    };

    const abrirModalPermisos = (tusuario) => {
        setTusuarioSeleccionado(tusuario);
        setModalPermisosAbierto(true);
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
            <div className="container d-flex justify-content-end mt-1">
                <Button
                    variant="contained"
                    onClick={abrirModalAgregar}
                    className="mx-3"
                >
                    NUEVO
                </Button>
            </div>
            <div className="mt-5 mb-5 container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Tipo de Usuario</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Habilitado</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Permisos</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Editar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(tusuarios) &&
                                paginatedArray?.map((tusuario) => (
                                    <TableRow key={tusuario.id_tusuario}>
                                        <TableCell>{tusuario.id_tusuario}</TableCell>
                                        <TableCell>{tusuario.nombre_tusuario}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {tusuario.habilita == 1 ? 'SI' : 'NO'}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <KeyOutlinedIcon
                                                onClick={() => abrirModalPermisos(tusuario)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => abrirModal(tusuario)}
                                            >
                                                Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
                        component="div"
                        count={tusuarios?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Columnas por página"
                    />
                </TableContainer>

                <ModalTUsuarios
                    tusuarios={tusuarioSeleccionado}
                    modalAbierto={modalAbierto}
                    handleClose={() => setModalAbierto(false)}
                />
                <ModalAgregar
                    modalAgregarAbierto={modalAgregarAbierto}
                    handleClose={() => setModalAgregarAbierto(false)}
                />
                <PermisosTUsuario
                    tusuario={tusuarioSeleccionado}
                    modalPermisosAbierto={modalPermisosAbierto}
                    handleClose={() => setModalPermisosAbierto(false)}
                />
            </div>
        </>
    );
};

export default TablaTUsuarios;
