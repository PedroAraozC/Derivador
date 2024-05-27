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
 import ModalTipologia from "./ModalTipologia";
import { formatearFechaHora } from "../../../../helpers/convertirFecha";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";

const TablaTipologia = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipologiaSeleccionada, setTipologiaSeleccionada] = useState(null);
  const { tipologia, obtenerTipologia, refresh } =
    useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();
  //Funcion para listar las convocatorias
  useEffect(() => {
    obtenerTipologia();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(
      tipologia?.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
      )
    );
  }, [tipologia, page, rowsPerPage]);

  const handleCheckboxChange = (tipologiaId) => {
    const tipologia = tipologia.tipologias?.find(
      (tip) => tip.id_tipologia === tipologiaId
    );

    setTipologiaSeleccionada((prevTipologia) => {
      if (!prevTipologia || prevTipologia.id_tipologia !== tipologiaId) {
        return tipologia;
      } else {
        return null;
      }
    });
  };

  const handleEditar = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setTipologiaSeleccionada(null);
  };

  const abrirModal = (tipologia, editar = false) => {
    setTipologiaSeleccionada(tipologia);
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
  console.log(tipologia)

  return (
    <>
      <div className="container d-flex justify-content-end mt-5">
        <Button
          variant="contained"
          disabled={tipologiaSeleccionada !== null}
          onClick={() => navigate("/agregar-convoca")}
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          className="mx-3"
          disabled={tipologiaSeleccionada === null}
          onClick={() => abrirModal(tipologiaSeleccionada, true)}
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
                <TableCell>Nombre de Tipologia</TableCell>
                <TableCell>Habilitado</TableCell>
                <TableCell>Ver Más</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {console.log(tipologia)}
              {Array.isArray(tipologia) &&
                paginatedArray?.map((tipologia) => (
                  <TableRow key={tipologia.id_tipologia}>
                    <TableCell>
                      <Checkbox
                        checked={
                          tipologiaSeleccionada?.id_tipologia ===
                          tipologia.id_tipologia
                        }
                        onChange={() =>
                          handleCheckboxChange(tipologia.id_tipologia)
                        }
                      />
                    </TableCell>
                    <TableCell>{tipologia.id_tipologia}</TableCell>
                    <TableCell>{tipologia.nombre_tipologia}</TableCell>
                    <TableCell>{tipologia.habilita == 1 ? 'SI':('NO')}</TableCell>
                    <TableCell align="center">
                      <VisibilityIcon
                        onClick={() => abrirModal(tipologia)}
                      />
                    </TableCell>
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
            labelRowsPerPage="Columnas por pagina"
          />
        </TableContainer>
        <ModalTipologia
          tipologia={tipologiaSeleccionada}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
          modoEdicion={modoEdicion}
          handleEditar={handleEditar}
          idNivel={tipologiaSeleccionada}
        />
      </div>
    </>
  );
};

export default TablaTipologia;
