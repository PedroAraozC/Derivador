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
// import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";
import ModalAutor from "./ModalAutor";

const TablaAutor = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [autorSeleccionado, setAutorSeleccionado] = useState(null);
  const { autor, obtenerAutor, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();
  //Funcion para listar las convocatorias
  useEffect(() => {
    obtenerAutor();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(
      autor?.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
      )
    );
  }, [autor, page, rowsPerPage]);

  const handleCheckboxChange = (Id) => {
    const categoria = autor?.find(
      (cat) => cat.id_autor === Id
    );

    setAutorSeleccionado((prevCategoria) => {
      if (!prevCategoria || prevCategoria.id_autor !== Id) {
        return categoria;
      } else {
        return null;
      }
    });
  };

  const abrirModal = (autor) => {
    setAutorSeleccionado(autor);
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
          disabled={autorSeleccionado !== null}
          onClick={() => navigate("/agregar-autor")}
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          className="mx-3"
          disabled={autorSeleccionado === null}
          onClick={() => abrirModal(autorSeleccionado, true)}
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
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Habilitado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(autor) &&
                paginatedArray?.map((autor) => (
                  <TableRow key={autor.id_autor}>
                    <TableCell>
                      <Checkbox
                        checked={
                          autorSeleccionado?.id_autor ===
                          autor.id_autor
                        }
                        onChange={() =>
                          handleCheckboxChange(autor.id_autor)
                        }
                        // onClick={()=>abrirModal(autor)}
                      />
                    </TableCell>
                    <TableCell>{autor.id_autor}</TableCell>
                    <TableCell>{autor.nombre_autor}</TableCell>
                    <TableCell>{autor.descripcion_autor}</TableCell>
                    <TableCell>{autor.habilita == 1 ? 'SI':('NO')}</TableCell>
                    
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
            component="div"
            count={autor?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Columnas por pagina"
          />
        </TableContainer>
        <ModalAutor
          autor={autorSeleccionado}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
        />
      </div>
    </>
  );
};

export default TablaAutor;
