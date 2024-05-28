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
// import ModalConvocatoria from "./ModalConvocatoria";
import { formatearFechaHora } from "../../../helpers/convertirFecha";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../context/EducaContext";

const TablaPatrimonioMunicipal = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] =
      useState(null);
    const { convocatoriasTabla, obtenerConvocatoriasTabla, refresh } = useContext(EducaContext);
    const [paginatedArray, setPaginatedArray] = useState([]);
    const navigate = useNavigate()
    //Funcion para listar las convocatorias
    useEffect(() => {
      obtenerConvocatoriasTabla();
    }, [refresh]);
  
    useEffect(() => {
      setPaginatedArray(convocatoriasTabla.convocatorias?.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [convocatoriasTabla, page, rowsPerPage]);
  
    const handleCheckboxChange = (convocatoriaId) => {
      const convocatoria = convocatoriasTabla.convocatorias?.find(
        (conv) => conv.id_convoca === convocatoriaId
      );
  
      setConvocatoriaSeleccionada((prevConvocatoria) => {
        if (
          !prevConvocatoria ||
          prevConvocatoria.id_convoca !== convocatoriaId
        ) {
          return convocatoria;
        } else {
          return null;
        }
      });
    };
  
    const handleEditar = () => {
      setModalAbierto(false);
      setModoEdicion(false);
      setConvocatoriaSeleccionada(null);
    };
  
    const abrirModal = (convocatoria, editar = false) => {
      setConvocatoriaSeleccionada(convocatoria);
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
            disabled={convocatoriaSeleccionada !== null}
            onClick={() => navigate('/agregar-convoca')}
          >
            NUEVO
          </Button>
          <Button
            variant="contained"
            className="mx-3"
            disabled={convocatoriaSeleccionada === null}
            onClick={() => abrirModal(convocatoriaSeleccionada, true)}
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
                  <TableCell>Nº de Convocatoria</TableCell>
                  <TableCell>Se convoca</TableCell>
                  <TableCell>Establecimiento</TableCell>
                  <TableCell>Fecha designacion</TableCell>
                  <TableCell>Habilitado</TableCell>
                  <TableCell>Ver más</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(convocatoriasTabla.convocatorias) &&
                  paginatedArray?.map((convocatoria) => (
                    <TableRow key={convocatoria.id_convoca}>
                      <TableCell>
                        <Checkbox
                          checked={
                            convocatoriaSeleccionada?.id_convoca ===
                            convocatoria.id_convoca
                          }
                          onChange={() =>
                            handleCheckboxChange(convocatoria.id_convoca)
                          }
                        />
                      </TableCell>
                      <TableCell>{convocatoria.id_convoca}</TableCell>
                      <TableCell>
                        {convocatoria.num_convocatoria} /{" "}
                        {convocatoria.anio_convocatoria}
                      </TableCell>
                      <TableCell>{convocatoria.cargo}</TableCell>
                      <TableCell>{convocatoria.nombre_establecimiento}</TableCell>
                      <TableCell>
                        {" "}
                        {formatearFechaHora(
                            convocatoria.fecha_designa,
                            convocatoria.hora_designa
                          )}
                      </TableCell>
                          <TableCell>{convocatoria.habilita2}</TableCell>
                      <TableCell align="center">
                        <VisibilityIcon
                          onClick={() => abrirModal(convocatoria)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
              component="div"
              count={convocatoriasTabla.convocatorias?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Columnas por pagina"
            />
          </TableContainer>
          <ModalConvocatoria
            convocatoria={convocatoriaSeleccionada}
            modalAbierto={modalAbierto}
            handleClose={() => setModalAbierto(false)}
            modoEdicion={modoEdicion}
            handleEditar={handleEditar}
            idNivel={convocatoriaSeleccionada}
          />
        </div>
      </>
    );
  };
  
  export default TablaPatrimonioMunicipal;
  