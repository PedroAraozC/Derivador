/* TablaPatrimonioMunicipal.jsx */
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
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../context/EducaContext";
import ModalPatrimonio from "./ModalPatrimonio";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../../config/axios";
import "./TablaPatrimonioMunicipal.css"

const TablaPatrimonioMunicipal = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [patrimonioSeleccionado, setPatrimonioSeleccionado] = useState(null);
  const { patrimonios, obtenerPatrimonios, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const { actualizador } = useContext(EducaContext);
  const [errores, setErrores] = useState({});
  const [buttonDis, setButtonDis] = useState(false);
  //Funcion para listar las convocatorias
  useEffect(() => {
    obtenerPatrimonios();
  }, [refresh]);

  useEffect(() => {
    const filteredPatrimonios = patrimonios?.filter((patrimonio) =>
      patrimonio.nombre_patrimonio
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setPaginatedArray(
      filteredPatrimonios?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    );
  }, [patrimonios, page, rowsPerPage, searchTerm]);

  const handleCheckboxChange = (patrimonioId) => {
    const patrimonio = patrimonios?.find(
      (conv) => conv.id_patrimonio === patrimonioId
    );

    setPatrimonioSeleccionado((prevPatrimonio) => {
      if (!prevPatrimonio || prevPatrimonio.id_patrimonio !== patrimonioId) {
        return patrimonio;
      } else {
        return null;
      }
    });
  };

  const abrirModal = (patrimonio) => {
    setPatrimonioSeleccionado(patrimonio);
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleDelete = async (patri) => {
    console.log(patri);
    try {
      setButtonDis(true);
      const response = await axios.post("/admin/deshabilitarPatrimonio", patri, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMensaje("Patrimonio deshabilitado.");
      setSnackbarOpen(true);
      actualizador();
      setButtonDis(false);
      return response.data;
    } catch (error) {
      console.error("Error al deshabilitar el patrimonio:", error);
      setSnackbarMensaje("Error al deshabilitar el patrimonio.");
      setSnackbarOpen(true);
      throw new Error("Error al deshabilitar el patrimonio");
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-end mt-3">
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          className="mx-5"
        />
        <Button
          variant="contained"
          disabled={patrimonioSeleccionado !== null}
          onClick={() => navigate("/agregar-patrimonio")}
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          className="mx-3"
          disabled={patrimonioSeleccionado === null}
          onClick={() => abrirModal(patrimonioSeleccionado, true)}
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
                <TableCell>Nombre Patrimonio</TableCell>
                <TableCell>Tipología</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Habilitado</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(patrimonios) &&
                paginatedArray?.map((patrimonio) => (
                  <TableRow key={patrimonio.id_patrimonio}>
                    <TableCell>
                      <Checkbox
                        checked={
                          patrimonioSeleccionado?.id_patrimonio ===
                          patrimonio.id_patrimonio
                        }
                        onChange={() =>
                          handleCheckboxChange(patrimonio.id_patrimonio)
                        }
                      />
                    </TableCell>
                    <TableCell>{patrimonio.id_patrimonio}</TableCell>
                    <TableCell>{patrimonio.nombre_patrimonio}</TableCell>
                    <TableCell>{patrimonio.nombre_tipologia}</TableCell>
                    <TableCell>{patrimonio.nombre_ubicacion}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {patrimonio.habilita == 1 ? "SI" : "NO"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <button className="btn" disabled={!buttonDis && patrimonio.habilita != 1} onClick={() => handleDelete(patrimonio)}><DeleteIcon className= "iconDelete" /></button>
                      </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
            component="div"
            count={patrimonios?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Columnas por pagina"
          />
        </TableContainer>
        <ModalPatrimonio
          patrimonio={patrimonioSeleccionado}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
        />
      </div>
      {errores ? (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="info"
            elevation={6}
            variant="filled"
          >
            {snackbarMensaje}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
    </>
  );
};

export default TablaPatrimonioMunicipal;
