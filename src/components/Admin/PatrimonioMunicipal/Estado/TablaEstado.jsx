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
import ModalEstado from "./ModalEstado";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";

const TablaEstado = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estadoSeleccionada, setEstadoSeleccionada] = useState(null);
  const { estado, obtenerEstado, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    obtenerEstado();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(
      estado?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    );
  }, [estado, page, rowsPerPage]);

  const handleCheckboxChange = (Id) => {
    const estados = estado?.find(
      (cat) => cat.id_estado === Id
    );

    setEstadoSeleccionada((prevEstado) => {
      if (!prevEstado || prevEstado.id_estado !== Id) {
        return estados;
      } else {
        return null;
      }
    });
  };

  const abrirModal = (estado) => {
    setEstadoSeleccionada(estado);
    setModalAbierto(true);
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
          disabled={estadoSeleccionada !== null}
          onClick={() => navigate("/agregar-estado")}
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          className="mx-3"
          disabled={estadoSeleccionada === null}
          onClick={() => abrirModal(estadoSeleccionada, true)}
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
                <TableCell>Nombre de Estado</TableCell>
                <TableCell>Habilitado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(estado) &&
                paginatedArray?.map((estado) => (
                  <TableRow key={estado.id_estado}>
                    <TableCell>
                      <Checkbox
                        checked={
                          estadoSeleccionada?.id_estado ===
                          estado.id_estado
                        }
                        onChange={() =>
                          handleCheckboxChange(estado.id_estado)
                        }
                      />
                    </TableCell>
                    <TableCell>{estado.id_estado}</TableCell>
                    <TableCell>{estado.nombre_estado}</TableCell>
                    <TableCell>
                      {estado.habilita == 1 ? "SI" : "NO"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
            component="div"
            count={estado?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Columnas por pagina"
          />
        </TableContainer>
        <ModalEstado
          estados={estadoSeleccionada}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
        />
      </div>
    </>
  );
};

export default TablaEstado;
