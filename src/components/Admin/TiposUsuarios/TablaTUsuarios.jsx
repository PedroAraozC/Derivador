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
import ModalTUsuarios from "./ModalTUsuarios";
import ModalAgregar from "./ModalAgregar";
import PermisosTUsuario from "./PermisosTUsuario";
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import KeyOffOutlinedIcon from '@mui/icons-material/KeyOffOutlined';

const TablaTUsuarios = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [modalPermisosAbierto, setModalPermisosAbierto] = useState(false);
    const [tusuarioSeleccionado, setTusuarioSeleccionado] = useState(null);
    const { tusuarios, obtenerTiposDeUsuarios, refresh } = useContext(EducaContext);
    const [paginatedArray, setPaginatedArray] = useState([]);

    //Funcion para listar las convocatorias
    useEffect(() => {
        obtenerTiposDeUsuarios();
    }, [refresh]);

    useEffect(() => {
        setPaginatedArray(tusuarios?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [tusuarios, page, rowsPerPage]);

    const handleCheckboxChange = (tusuariosId) => {
        const tusuario = tusuarios?.find(
            (conv) => conv.id_tusuario === tusuariosId
        );

        setTusuarioSeleccionado((prevTusuario) => {
            if (
                !prevTusuario ||
                prevTusuario.id_tusuario !== tusuariosId
            ) {
                return tusuario;
            } else {
                return null;
            }
        });
    };

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
            <div className="container d-flex justify-content-end mt-3">
                <Button
                    variant="contained"
                    disabled={tusuarioSeleccionado !== null}
                    onClick={() => abrirModalAgregar(true)}
                    className="mx-3"
                >
                    NUEVO
                </Button>
                <Button
                    variant="contained"
                    disabled={tusuarioSeleccionado === null}
                    onClick={() => abrirModal(tusuarioSeleccionado, true)}
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
                                <TableCell sx={{ textAlign: 'center' }}>Permisos</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(tusuarios) &&
                                paginatedArray?.map((tusuario) => (
                                    <TableRow key={tusuario.id_tusuario}>
                                        <TableCell>
                                            <Checkbox
                                                checked={
                                                    tusuarioSeleccionado?.id_tusuario ===
                                                    tusuario.id_tusuario
                                                }
                                                onChange={() =>
                                                    handleCheckboxChange(tusuario.id_tusuario)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{tusuario.id_tusuario}</TableCell>
                                        <TableCell>
                                            {tusuario.nombre_tusuario}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{tusuario.habilita == 1 ? 'SI' : ('NO')}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                        {tusuarioSeleccionado?.id_tusuario === tusuario.id_tusuario ? (
                                            <KeyOutlinedIcon
                                                onClick={() => abrirModalPermisos(tusuario, true)}
                                                style={{ cursor: 'pointer' }}
                                                
                                                />
                                                ) : (
                                            <KeyOffOutlinedIcon style={{ cursor: 'pointer' }} />
                                                )}  
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
                        labelRowsPerPage="Columnas por pagina"
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
