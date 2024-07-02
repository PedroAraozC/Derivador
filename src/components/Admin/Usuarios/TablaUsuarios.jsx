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
import { TextField } from "@mui/material";

const TablaUsuarios = () => {
    const { empleados, obtenerEmpleados, refresh } = useContext(EducaContext);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalPermisosAbierto, setModalPermisosAbierto] = useState(false);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [paginatedArray, setPaginatedArray] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        obtenerEmpleados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    useEffect(() => {
        const filteredEmpleados = empleados?.filter(e =>
            (e.nombre_persona?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            ((e.afiliado && e.afiliado.toString().toLowerCase().includes(searchTerm.toLowerCase()))) ||
            (e.email_persona?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        
        setPaginatedArray(filteredEmpleados?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [empleados, page, rowsPerPage, searchTerm]);

    const handleCheckboxChange = (empleadoId) => {
        const empleado = empleados?.find(
            (emp) => emp.id_persona === empleadoId
        );

        setEmpleadoSeleccionado(prevEmpleado => (
            prevEmpleado?.id_persona === empleadoId ? null : empleado
        ));
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
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Afiliado</TableCell>
                                <TableCell align="center">Nombre</TableCell>
                                <TableCell align="center">Repartición</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Permisos</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedArray?.map((e) => (
                                <TableRow key={e.id_persona}>
                                    <TableCell>
                                        <Checkbox
                                            checked={empleadoSeleccionado?.id_persona === e.id_persona}
                                            onChange={() => handleCheckboxChange(e.id_persona)}
                                        />
                                    </TableCell>
                                    <TableCell>{e.afiliado}</TableCell>
                                    <TableCell>{`${e.nombre_persona} ${e.apellido_persona}`}</TableCell>
                                    <TableCell>{e.nombre_reparticion}</TableCell>
                                    <TableCell>{e.email_persona}</TableCell>
                                    <TableCell align="center">
                                        {empleadoSeleccionado?.id_persona === e.id_persona ? (
                                            <KeyOutlinedIcon
                                                onClick={() => abrirModalPermisos(e)}
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
                        count={empleados?.length || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
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
