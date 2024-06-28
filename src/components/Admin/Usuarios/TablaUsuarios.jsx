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
import Checkbox from "@mui/material/Checkbox";
import { EducaContext } from "../../../context/EducaContext";
import PermisosUsuario from "./PermisosUsuario";
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import KeyOffOutlinedIcon from '@mui/icons-material/KeyOffOutlined';

const TablaUsuarios = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalPermisosAbierto, setModalPermisosAbierto] = useState(false);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const { empleados, obtenerEmpleados, refresh } = useContext(EducaContext);
    const [paginatedArray, setPaginatedArray] = useState([]);

    //Funcion para listar las convocatorias
    useEffect(() => {
        obtenerEmpleados();
    }, [refresh]);

    useEffect(() => {
        setPaginatedArray(empleados?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [empleados, page, rowsPerPage]);

    const handleCheckboxChange = (empleadosId) => {
        const empleado = empleados?.find(
            (conv) => conv.id_persona === empleadosId
        );

        setEmpleadoSeleccionado((prevEmpleado) => {
            if (
                !prevEmpleado ||
                prevEmpleado.id_persona !== prevEmpleado
            ) {
                return empleado;
            } else {
                return null;
            }
        });
    };

    const abrirModalPermisos = (empleado) => {
        setEmpleadoSeleccionado(empleado);
        setModalPermisosAbierto(true);
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
            <div className="mt-5 mb-5 container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Afiliado</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Nombre</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Reparticion</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Email</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Permisos</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(empleados) &&
                                paginatedArray?.map((e) => (
                                    <TableRow key={e.id_persona}>
                                        <TableCell>
                                            <Checkbox
                                                checked={
                                                    empleadoSeleccionado?.id_persona ===
                                                    e.id_persona
                                                }
                                                onChange={() =>
                                                    handleCheckboxChange(e.id_persona)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {e.afiliado}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{e.nombre_persona} {e.apellido_persona}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{e.nombre_reparticion}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{e.email_persona}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                        {empleadoSeleccionado?.id_persona === e.id_persona ? (
                                            <KeyOutlinedIcon
                                                onClick={() => abrirModalPermisos(e, true)}
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
                        count={empleados?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Columnas por pagina"
                    />
                </TableContainer>
                <PermisosUsuario
                    empleado={empleadoSeleccionado}
                    modalPermisosAbierto={modalPermisosAbierto}
                    handleClose={() => setModalPermisosAbierto(false)}
                />
            </div>
        </>
    );
};

export default TablaUsuarios;
