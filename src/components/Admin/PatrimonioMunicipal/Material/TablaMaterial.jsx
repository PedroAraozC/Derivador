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
import ModalMaterial from "./ModalMaterial";
import { formatearFechaHora } from "../../../../helpers/convertirFecha";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { EducaContext } from "../../../../context/EducaContext";

const TablaMaterial = () => {
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const { material, obtenerMaterial, refresh } = useContext(EducaContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();
  //Funcion para listar las convocatorias
  useEffect(() => {
    obtenerMaterial();
  }, [refresh]);

  useEffect(() => {
    setPaginatedArray(
      material?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    );
  }, [material, page, rowsPerPage]);

  const handleCheckboxChange = (materialId) => {
    const material = material.materiales?.find(
      (mat) => mat.id_material === materialId
    );

    setMaterialSeleccionado((prevMaterial) => {
      if (!prevMaterial || prevMaterial.id_material !== materialId) {
        return material;
      } else {
        return null;
      }
    });
  };

  const handleEditar = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setMaterialSeleccionado(null);
  };

  const abrirModal = (material, editar = false) => {
    setMaterialSeleccionado(material);
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
  // console.log(material)

  return (
    <>
      <div className="container d-flex justify-content-end mt-5">
        <Button
          variant="contained"
          disabled={materialSeleccionado !== null}
          onClick={() => navigate("/agregar-convoca")}
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
                <TableCell>Ver Más</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(material)}
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
                    <TableCell align="center">
                      <VisibilityIcon onClick={() => abrirModal(material)} />
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
          categoria={materialSeleccionado}
          modalAbierto={modalAbierto}
          handleClose={() => setModalAbierto(false)}
          modoEdicion={modoEdicion}
          handleEditar={handleEditar}
          idNivel={materialSeleccionado}
        />
      </div>
    </>
  );
};

export default TablaMaterial;
