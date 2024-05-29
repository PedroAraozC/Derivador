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
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";
import ModalUbicacion from "./ModalUbicacion";

const TablaUbicacion = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);
  const { ubicacion, obtenerUbicacion, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();
  //Funcion para listar las convocatorias
  useEffect(() => {
    obtenerUbicacion();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(
      ubicacion?.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
      )
    );
  }, [ubicacion, page, rowsPerPage]);

  const handleCheckboxChange = (Id) => {
    const ubi = ubicacion?.find(
      (cat) => cat.id_ubicacion === Id
    );

    setUbicacionSeleccionada((prevUbicacion) => {
      if (!prevUbicacion || prevUbicacion.id_ubicacion !== Id) {
        return ubi;
      } else {
        return null;
      }
    });
  };

  const abrirModal = (ubicacion) => {
    setUbicacionSeleccionada(ubicacion);
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
          disabled={ubicacionSeleccionada !== null}
          onClick={() => navigate("/agregar-ubicacion")}
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          className="mx-3"
          disabled={ubicacionSeleccionada === null}
          onClick={() => abrirModal(ubicacionSeleccionada, true)}
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
                <TableCell>Nombre de la Ubicación</TableCell>
                <TableCell>Habilitado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(ubicacion) &&
                paginatedArray?.map((ubicacion) => (
                  <TableRow key={ubicacion.id_ubicacion}>
                    <TableCell>
                      <Checkbox
                        checked={
                          ubicacionSeleccionada?.id_ubicacion ===
                          ubicacion.id_ubicacion
                        }
                        onChange={() =>
                          handleCheckboxChange(ubicacion.id_ubicacion)
                        }
                      />
                    </TableCell>
                    <TableCell>{ubicacion.id_ubicacion}</TableCell>
                    <TableCell>{ubicacion.nombre_ubicacion}</TableCell>
                    <TableCell>{ubicacion.habilita == 1 ? 'SI':('NO')}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
            component="div"
            count={ubicacion?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Columnas por pagina"
          />
        </TableContainer>
        <ModalUbicacion
          ubicaciones={ubicacionSeleccionada}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
        />
      </div>
    </>
  );
};

export default TablaUbicacion;
