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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import ModalCaracter from "./ModalCaracter";
import { EducaContext } from "../../../../context/EducaContext";

const TablaCaracter = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [causalSeleccionada, setcausalSeleccionada] =
    useState(null);
  const { arrayCaracterTabla, obtenerCaracterTabla, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate()
  //Funcion para listar las causales
  useEffect(() => {
    obtenerCaracterTabla();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(arrayCaracterTabla.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
  }, [arrayCaracterTabla, page, rowsPerPage]);

  const handleCheckboxChange = (caracterId) => {
    const caracter = arrayCaracterTabla.find(
      (conv) => conv.id_caracter === caracterId
    );

    setcausalSeleccionada((prevcaracter) => {
      if (
        !prevcaracter ||
        prevcaracter.id_caracter !== caracterId
      ) {
        return caracter;
      } else {
        return null;
      }
    });
  };

  const handleEditar = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setcausalSeleccionada(null);
  };

  const abrirModal = (causal, editar = false) => {
    setcausalSeleccionada(causal);
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

  return (
    <>
      <div className="container d-flex justify-content-end mt-5">
        <Button
          variant="contained"
          disabled={causalSeleccionada !== null}
          onClick={() => navigate('/agregar-caracter')}
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          className="mx-3"
          disabled={causalSeleccionada === null}
          onClick={() => abrirModal(causalSeleccionada, true)}
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
                <TableCell>Nombre Caracter</TableCell>
                <TableCell>Habilitado</TableCell>
                <TableCell>Ver más</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(arrayCaracterTabla) &&
                paginatedArray.map((causal) => (
                  <TableRow key={causal.id_causal}>
                    <TableCell>
                      <Checkbox
                        checked={
                          causalSeleccionada?.id_caracter ===
                          causal.id_caracter
                        }
                        onChange={() =>
                          handleCheckboxChange(causal.id_caracter)
                        }
                      />
                    </TableCell>
                    <TableCell>{causal.id_caracter}</TableCell>
                    <TableCell>{causal.nombre_caracter}</TableCell>
                    <TableCell>{causal.habilita2}</TableCell>

                    <TableCell align="center">
                      <VisibilityIcon
                        onClick={() => abrirModal(causal)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
            component="div"
            count={arrayCaracterTabla.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Columnas por pagina"
          />
        </TableContainer>
        <ModalCaracter
          caracter={causalSeleccionada}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
          modoEdicion={modoEdicion}
          handleEditar={handleEditar}
        />
      </div>
    </>
  );
};

export default TablaCaracter;
