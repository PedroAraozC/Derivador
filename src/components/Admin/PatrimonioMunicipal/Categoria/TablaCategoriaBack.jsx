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
 import ModalCategoria from "./ModalCategoria";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";

const TablaCategoriaBack = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const { categoria, obtenerCategoria, refresh } =
    useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerCategoria();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(
      categoria?.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
      )
    );
  }, [categoria, page, rowsPerPage]);

  const handleCheckboxChange = (categoriaId) => {
    const categorias = categoria?.find(
      (cat) => cat.id_categoria === categoriaId
    );

    setCategoriaSeleccionada((prevCategoria) => {
      if (!prevCategoria || prevCategoria.id_categoria !== categoriaId) {
        return categorias;
      } else {
        return null;
      }
    });
  };

 

  const abrirModal = (categoria) => {
    setCategoriaSeleccionada(categoria);
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
          disabled={categoriaSeleccionada !== null}
          onClick={() => navigate("/agregar-categoria")}
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          className="mx-3"
          disabled={categoriaSeleccionada === null}
          onClick={() => abrirModal(categoriaSeleccionada, true)}
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
                <TableCell>Nombre de Categoria</TableCell>
                <TableCell>Habilitado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(categoria) &&
                paginatedArray?.map((categoria) => (
                  <TableRow key={categoria.id_categoria}>
                    <TableCell>
                      <Checkbox
                        checked={
                          categoriaSeleccionada?.id_categoria ===
                          categoria.id_categoria
                        }
                        onChange={() =>
                          handleCheckboxChange(categoria.id_categoria)
                        }
                      />
                    </TableCell>
                    <TableCell>{categoria.id_categoria}</TableCell>
                    <TableCell>{categoria.nombre_categoria}</TableCell>
                    <TableCell>{categoria.habilita == 1 ? 'SI':('NO')}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
            component="div"
            count={categoria?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Columnas por pagina"
          />
        </TableContainer>
        <ModalCategoria
          categorias={categoriaSeleccionada}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
        />
      </div>
    </>
  );
};

export default TablaCategoriaBack;
