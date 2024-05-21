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
import { EducaContext } from "../../../../context/EducaContext";
import { useNavigate } from "react-router-dom";
import ModalEstablecimiento from "./ModalEstablecimiento";

const TablaEstablecimiento = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [causalSeleccionada, setcausalSeleccionada] = useState(null);
  const { arrayEstablecimientoTabla, obtenerEstablecimientoTabla, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate()
  //Funcion para listar las causales
  useEffect(() => {
    obtenerEstablecimientoTabla();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(arrayEstablecimientoTabla.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
  }, [arrayEstablecimientoTabla, page, rowsPerPage]);

  const handleCheckboxChange = (establecimientoId) => {
    const establecimiento = arrayEstablecimientoTabla.find(
      (conv) => conv.id_establecimiento === establecimientoId
    );

    setcausalSeleccionada((prevestablecimiento) => {
      if (
        !prevestablecimiento ||
        prevestablecimiento.id_establecimiento !== establecimientoId
      ) {
        return establecimiento;
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

  const abrirModal = (establecimiento, editar = false) => {
    setcausalSeleccionada(establecimiento);
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
          onClick={() => navigate('/agregar-establecimiento')}
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
                <TableCell>Nombre Establecimiento</TableCell>
                <TableCell sx={{textAlign: "center"}}>Habilitado</TableCell>
                <TableCell sx={{textAlign: "center"}}>Ver más</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(arrayEstablecimientoTabla) &&
                paginatedArray.map((establecimiento) => (
                  <TableRow key={establecimiento.id_establecimiento}>
                    <TableCell>
                      <Checkbox
                        checked={
                          causalSeleccionada?.id_establecimiento ===
                          establecimiento.id_establecimiento
                        }
                        onChange={() =>
                          handleCheckboxChange(establecimiento.id_establecimiento)
                        }
                      />
                    </TableCell>
                    <TableCell>{establecimiento.id_establecimiento}</TableCell>
                    <TableCell>{establecimiento.nombre_establecimiento}</TableCell>
                    <TableCell sx={{textAlign: "center"}}>{establecimiento.habilita2}</TableCell>

                    <TableCell align="center">
                      <VisibilityIcon
                        onClick={() => abrirModal(establecimiento)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
            component="div"
            count={arrayEstablecimientoTabla.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Columnas por pagina"
          />
        </TableContainer>
        <ModalEstablecimiento
          establecimiento={causalSeleccionada}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
          modoEdicion={modoEdicion}
          handleEditar={handleEditar}
        />
      </div>
    </>
  );
};

export default TablaEstablecimiento;
