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
import ModalMaterial from "./ModalMaterial";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";

const TablaMaterial = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const { material, obtenerMaterial, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    obtenerMaterial();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(
      material?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    );
  }, [material, page, rowsPerPage]);

  const handleCheckboxChange = (materialId) => {
    const materiales = material?.find(
      (mat) => mat.id_material === materialId
    );

    setMaterialSeleccionado((prevMaterial) => {
      if (!prevMaterial || prevMaterial.id_material !== materialId) {
        return materiales;
      } else {
        return null;
      }
    });
  };

  const abrirModal = (material) => {
    setMaterialSeleccionado(material);
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
          disabled={materialSeleccionado !== null}
          onClick={() => navigate("/agregar-material")}
        >
          NUEVO
        </Button>
        <Button
          variant="contained"
          className="mx-3"
          disabled={materialSeleccionado === null}
          onClick={() => abrirModal(materialSeleccionado, true)}
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
                <TableCell>Nombre de Material</TableCell>
                <TableCell>Habilitado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(material) &&
                paginatedArray?.map((material) => (
                  <TableRow key={material.id_material}>
                    <TableCell>
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
                    <TableCell>{material.id_material}</TableCell>
                    <TableCell>{material.nombre_material}</TableCell>
                    <TableCell>
                      {material.habilita == 1 ? "SI" : "NO"}
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
            labelRowsPerPage="Columnas por pagina"
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
