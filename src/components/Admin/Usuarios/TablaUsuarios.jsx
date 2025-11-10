import { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { DerivadorContext } from "../../../context/DerivadorContext";
import CambioTusuario from "./CambioTusuario";
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import { TextField } from "@mui/material";
import PermisosEspecificos from "./PermisosEspecificos";

const TablaUsuarios = () => {
    const { empleados, obtenerEmpleados, refresh } = useContext(DerivadorContext);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalPermisosAbierto, setModalPermisosAbierto] = useState(false);
    const [modalCambioTUsuario, setModalCambioTUsuario] = useState(false);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [paginatedArray, setPaginatedArray] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        obtenerEmpleados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    useEffect(() => {
        const filteredEmpleados = empleados?.filter(e => {
            const nombreCompleto = `${e.nombre_persona} ${e.apellido_persona}`;
            return (
                nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (e.afiliado && e.afiliado.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (e.documento_persona && e.documento_persona.toString().toLowerCase().includes(searchTerm.toLowerCase()))
            );
        });

        setPaginatedArray(filteredEmpleados?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [empleados, page, rowsPerPage, searchTerm]);

    const abrirModalCambioTUsuario = (empleado) => {
        setEmpleadoSeleccionado(empleado);
        setModalCambioTUsuario(true);
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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    return (
        <>
            <div className="mt-5 mb-5 container">
                <TextField
                    label="Buscar..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-5"
                    fullWidth
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Afiliado</TableCell>
                                <TableCell align="left">Nombre</TableCell>
                                <TableCell align="left">Repartición</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedArray?.map((e) => (
                                <TableRow key={e.id_persona}>
                                    <TableCell>{e.afiliado}</TableCell>
                                    <TableCell align="left">{`${e.nombre_persona} ${e.apellido_persona}`}</TableCell>
                                    <TableCell align="left">{e.nombre_reparticion}</TableCell>
                                    <TableCell align="left">{e.email_persona}</TableCell>
                                    <TableCell align="center">
                                        <KeyOutlinedIcon
                                            onClick={() => abrirModalCambioTUsuario(e)}
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                            titleAccess="Cambiar tipo de usuario"
                                        />
                                        <AccessibilityNewOutlinedIcon
                                            onClick={() => abrirModalPermisos(e)}
                                            style={{ cursor: 'pointer' }}
                                            titleAccess="Editar permisos específicos"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
                        component="div"
                        count={empleados?.length || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                    />
                </TableContainer>

                {/* Modales */}
                <CambioTusuario
                    empleado={empleadoSeleccionado}
                    modalCambioTUsuario={modalCambioTUsuario}
                    handleClose={() => setModalCambioTUsuario(false)}
                />
                <PermisosEspecificos
                    empleado={empleadoSeleccionado}
                    modalPermisosAbierto={modalPermisosAbierto}
                    handleClose={() => setModalPermisosAbierto(false)}
                />
            </div>
        </>
    );
};

export default TablaUsuarios;
