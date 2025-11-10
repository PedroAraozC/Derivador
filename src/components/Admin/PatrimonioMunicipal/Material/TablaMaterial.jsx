/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DerivadorContext } from "../../../../context/DerivadorContext";
import ModalMaterial from "./ModalMaterial";

const TablaMaterial = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const { material, obtenerMaterial, refresh } = useContext(DerivadorContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();

  // Obtener materiales al montar el componente o cuando refresh cambie
  useEffect(() => {
    obtenerMaterial();
  }, [refresh]);

  // Actualizar el array paginado según la página y las filas por página
  useEffect(() => {
    setPaginatedArray(
      material?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    );
  }, [material, page, rowsPerPage]);

  // Manejar el cambio de estado del checkbox
  const handleCheckboxChange = (materialId) => {
    const materialSeleccionado = material?.find(
      (mat) => mat.id_material === materialId
    );

    setMaterialSeleccionado((prevMaterial) => {
      return prevMaterial?.id_material !== materialId
        ? materialSeleccionado
        : null; // Deseleccionar si ya está seleccionado
    });
  };

  // Abrir modal para editar material
  const abrirModal = (material) => {
    setMaterialSeleccionado(material);
    setModalAbierto(true);
  };

  // Manejar el cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar el cambio de filas por página
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
          disabled={materialSeleccionado !== null}
          onClick={() => navigate("/agregar-material")}
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          className="mx-3"
          disabled={materialSeleccionado === null}
          onClick={() => abrirModal(materialSeleccionado)}
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
                <TableCell align="center">Nombre de Material</TableCell>
                <TableCell align="center">Habilitado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(material) &&
                paginatedArray?.map((material) => (
                  <TableRow key={material.id_material}>
                    <TableCell align="center">
                      <Checkbox
                        checked={
                          materialSeleccionado?.id_material ===
                          material.id_material
                        }
                        onChange={() =>
                          handleCheckboxChange(material.id_material)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">{material.nombre_material}</TableCell>
                    <TableCell align="center">
                      {material.habilita === 1 ? "SI" : "NO"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Todas", value: -1 }]}
            component="div"
            count={material?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Columnas por página"
          />
        </TableContainer>
        <ModalMaterial
          materiales={materialSeleccionado}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
        />
      </div>
    </>
  );
};

export default TablaMaterial;
