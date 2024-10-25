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
import ModalTipologia from "./ModalTipologia";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";

const TablaTipologia = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipologiaSeleccionada, setTipologiaSeleccionada] = useState(null);
  const { tipologia, obtenerTipologia, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();

  // Obtener la tipología al montar el componente o cuando `refresh` cambie
  useEffect(() => {
    obtenerTipologia();
  }, [refresh]);

  // Actualizar el array paginado cuando la tipología, la página o el número de filas cambien
  useEffect(() => {
    setPaginatedArray(
      tipologia?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    );
  }, [tipologia, page, rowsPerPage]);

  const handleCheckboxChange = (tipologiaId) => {
    const selectedTipologia = tipologia?.find((tip) => tip.id_tipologia === tipologiaId);
    
    setTipologiaSeleccionada((prevTipologia) => {
      if (!prevTipologia || prevTipologia.id_tipologia !== tipologiaId) {
        return selectedTipologia;
      }
      return null; // Si ya está seleccionada, deselecciona
    });
  };

  const abrirModal = (tipologia) => {
    setTipologiaSeleccionada(tipologia);
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
          disabled={tipologiaSeleccionada !== null}
          onClick={() => navigate("/agregar-tipologia")}
          style={{ marginRight: '10px' }} // Espaciado entre botones
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          disabled={tipologiaSeleccionada === null}
          onClick={() => abrirModal(tipologiaSeleccionada)}
        >
          EDITAR
        </Button>
      </div>
      <div className="mt-5 mb-5 container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Nombre de Tipología</TableCell>
                <TableCell align="center">Habilitado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(tipologia) &&
                paginatedArray?.map((tipologia) => (
                  <TableRow key={tipologia.id_tipologia}>
                    <TableCell align="center">
                      <Checkbox
                        checked={tipologiaSeleccionada?.id_tipologia === tipologia.id_tipologia}
                        onChange={() => handleCheckboxChange(tipologia.id_tipologia)}
                      />
                    </TableCell>
                    <TableCell align="center">{tipologia.nombre_tipologia}</TableCell>
                    <TableCell align="center">{tipologia.habilita === 1 ? 'SI' : 'NO'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
            component="div"
            count={tipologia?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Columnas por página"
          />
        </TableContainer>
        <ModalTipologia
          tipologias={tipologiaSeleccionada}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
        />
      </div>
    </>
  );
};

export default TablaTipologia;
