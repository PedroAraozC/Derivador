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
import ModalEstado from "./ModalEstado";
import { formatearFechaHora } from "../../../../helpers/convertirFecha";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";

const TablaEstado = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [estadoSeleccionada, setEstadoSeleccionada] = useState(null);
  const { estado, obtenerEstado, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();
  //Funcion para listar las convocatorias
  useEffect(() => {
    obtenerEstado();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(
      estado?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    );
  }, [estado, page, rowsPerPage]);

  const handleCheckboxChange = (categoriaId) => {
    const estado = estado.estados?.find(
      (cat) => cat.id_estado === estadoId
    );

    setEstadoSeleccionada((prevEstado) => {
      if (!prevEstado || prevEstado.id_estado !== estadoId) {
        return estado;
      } else {
        return null;
      }
    });
  };

  const handleEditar = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setEstadoSeleccionada(null);
  };

  const abrirModal = (estado, editar = false) => {
    setEstadoSeleccionada(estado);
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
  console.log(estado);

  return (
    <>
      <div className="container d-flex justify-content-end mt-5">
        <Button
          variant="contained"
          disabled={estadoSeleccionada !== null}
          onClick={() => navigate("/agregar-convoca")}
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
                <TableCell>Ver Más</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(estado)}
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
                    <TableCell align="center">
                      <VisibilityIcon onClick={() => abrirModal(estado)} />
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
          categoria={estadoSeleccionada}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
          modoEdicion={modoEdicion}
          handleEditar={handleEditar}
          idNivel={estadoSeleccionada}
        />
      </div>
    </>
  );
};

export default TablaEstado;
