/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalContratacion from "./ModalContratacion";
import Checkbox from "@mui/material/Checkbox";
import useStore from "../../../Zustand/Zustand";
import Swal from "sweetalert2";
import axios from "../../../config/axios";

const TablaContratacion = () => {
    // eslint-disable-next-line no-unused-vars
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [contratacionSeleccionada, setContratacionSeleccionada] = useState(null);
    const [paginatedArray, setPaginatedArray] = useState([]);
    const { obtenerContrataciones, contrataciones } = useStore();

    //Funcion para listar las contrataciones
    useEffect(() => {
        obtenerContrataciones();
    }, []);

    useEffect(() => {
        setPaginatedArray(contrataciones.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [contrataciones, page, rowsPerPage]);

    const handleCheckboxChange = (contratacionId) => {
        const contratacion = contrataciones.find(
            (cont) => cont.id_contratacion === contratacionId
        );

        setContratacionSeleccionada((prevContratacion) => {
            if (
                !prevContratacion ||
                prevContratacion.id_contratacion !== contratacionId
            ) {
                return contratacion;
            } else {
                return null;
            }
        });
    };

    const handleEditar = () => {
        setModalAbierto(false);
        setModoEdicion(false);
        setContratacionSeleccionada(null);
    };

    const abrirModal = (contratacion, editar = false) => {
        setContratacionSeleccionada(contratacion);
        setModalAbierto(true);
        setModoEdicion(editar);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleBorrar = async (contratacion) => {
        let id = contratacion.id_contratacion
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, bórralo"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post("/admin/borrarContratacion", { id });
                    console.log(response.data);
                    // Si deseas hacer algo después de eliminar el elemento, puedes hacerlo aquí
                    // Por ejemplo, actualizar la tabla o mostrar una notificación
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "Tu contratación ha sido deshabilitada.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error("Error al deshabilitar la contratación:", error);
                    throw new Error("Error al deshabilitar la contratación");
                }
            }
        });
    };

    return (
        <>
            <div className="mt-5 mb-5 container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre de Contratacion</TableCell>
                                <TableCell>Expte</TableCell>
                                <TableCell align="center">Tipo</TableCell>
                                <TableCell align="center">Habilitado</TableCell>
                                <TableCell align="center">Ver más</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(contrataciones) &&
                                paginatedArray.map((contratacion) => (
                                    <TableRow key={contratacion.id_contratacion}>
                                        <TableCell>
                                            <Checkbox
                                                checked={
                                                    contratacionSeleccionada?.id_contratacion ===
                                                    contratacion.id_contratacion
                                                }
                                                onChange={() =>
                                                    handleCheckboxChange(contratacion.id_contratacion)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{contratacion.id_contratacion}</TableCell>
                                        <TableCell>{contratacion.nombre_contratacion}</TableCell>
                                        <TableCell>{contratacion.expte}</TableCell>
                                        <TableCell align="center">{contratacion.id_tcontratacion}</TableCell>
                                        <TableCell align="center">{contratacion.habilita === 1 ? "Habilitado" : "Deshabilitado"}</TableCell>
                                        <TableCell align="center">
                                            <DeleteIcon className="mx-2" onClick={()=> handleBorrar(contratacion.id_contratacion)}/>
                                            <EditIcon onClick={ ()=> abrirModal(contratacion)}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
                        component="div"
                        count={contrataciones.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Columnas por pagina"
                    />
                </TableContainer>
                <ModalContratacion
                    contratacion={contratacionSeleccionada}
                    modalAbierto={modalAbierto}
                    handleClose={() => setModalAbierto(false)}
                    modoEdicion={modoEdicion}
                    handleEditar={handleEditar}
                />
            </div>
        </>
    );
};

export default TablaContratacion;
