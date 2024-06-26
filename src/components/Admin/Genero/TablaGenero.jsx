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
import ModalGenero from "./ModalGenero";
import ModalAgregar from "./ModalAgregar";


const TablaGenero = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
    const { generos, obtenerGeneros, refresh } = useContext(EducaContext);
    const [paginatedArray, setPaginatedArray] = useState([]);

    //Funcion para listar las convocatorias
    useEffect(() => {
        obtenerGeneros();
    }, [refresh]);

    useEffect(() => {
        setPaginatedArray(generos?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [generos, page, rowsPerPage]);

    const handleCheckboxChange = (generoId) => {
        const genero = generos?.find(
            (conv) => conv.id_genero === generoId
        );

        setGeneroSeleccionado((prevGenero) => {
            if (
                !prevGenero ||
                prevGenero.id_genero !== generoId
            ) {
                return genero;
            } else {
                return null;
            }
        });
    };

    const abrirModal = (genero) => {
        setGeneroSeleccionado(genero);
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
                    disabled={generoSeleccionado !== null}
                    onClick={() => abrirModalAgregar(true)}
                >
                    NUEVO
                </Button>
                <Button
                    variant="contained"
                    className="mx-3"
                    disabled={generoSeleccionado === null}
                    onClick={() => abrirModal(generoSeleccionado, true)}
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
                                <TableCell>Nombre Género</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Habilitado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(generos) &&
                                paginatedArray?.map((genero) => (
                                    <TableRow key={genero.id_genero}>
                                        <TableCell>
                                            <Checkbox
                                                checked={
                                                    generoSeleccionado?.id_genero ===
                                                    genero.id_genero
                                                }
                                                onChange={() =>
                                                    handleCheckboxChange(genero.id_genero)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{genero.id_genero}</TableCell>
                                        <TableCell>
                                            {genero.nombre_genero}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{genero.habilita == 1 ? 'SI' : ('NO')}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
                        component="div"
                        count={generos?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Columnas por pagina"
                    />
                </TableContainer>
                <ModalGenero
                    generos={generoSeleccionado}
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

export default TablaGenero;
