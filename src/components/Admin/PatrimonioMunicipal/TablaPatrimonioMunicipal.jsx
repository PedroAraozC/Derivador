import { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { Alert, Button, IconButton, Snackbar, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { DerivadorContext } from "../../../context/DerivadorContext";
import ModalPatrimonio from "./ModalPatrimonio";
import DeleteIcon from "@mui/icons-material/Delete";
import "./TablaPatrimonioMunicipal.css";
import axiosPatri from "../../../config/axiosPatrimonio";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const TablaPatrimonioMunicipal = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [patrimonioSeleccionado, setPatrimonioSeleccionado] = useState(null);
  const { patrimonios, obtenerPatrimonios, refresh } = useContext(DerivadorContext);
  const [paginatedArray, setPaginatedArray] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState("");
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const { actualizador } = useContext(DerivadorContext);
  const [errores, setErrores] = useState({});
  const [buttonDis, setButtonDis] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [imagenes, setImagenes] = useState({});
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

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

  useEffect(() => {
    const handleImagenesActualizadas = async (event) => {
      const { nombrePatrimonio, nuevaImagen, nombreImagen } = event.detail;
      if (nombrePatrimonio && nuevaImagen && nombreImagen) {
        setImagenes(prev => ({
          ...prev,
          [nombrePatrimonio]: {
            ...prev[nombrePatrimonio],
            [nombreImagen]: nuevaImagen
          }
        }));
      }
    };

    window.addEventListener('imagenesActualizadas', handleImagenesActualizadas);
    return () => {
      window.removeEventListener('imagenesActualizadas', handleImagenesActualizadas);
    };
  }, []);

  useEffect(() => {
    const handleImagenesActualizadas = async (event) => {
      const { nombrePatrimonio } = event.detail;
      if (nombrePatrimonio) {
        try {
          const response = await axiosPatri.get(`admin/imagenPreviewTabla/${nombrePatrimonio}`);
          if (response.data && Object.keys(response.data).length > 0) {
            setImagenes(prev => ({
              ...prev,
              [nombrePatrimonio]: response.data
            }));
          }
        } catch (error) {
          console.error("Error al actualizar las imágenes:", error);
        }
      }
    };

    window.addEventListener('imagenesActualizadas', handleImagenesActualizadas);
    return () => {
      window.removeEventListener('imagenesActualizadas', handleImagenesActualizadas);
    };
  }, []);

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

  const handleRowExpand = async (nombrePatrimonio) => {
    setExpandedRows(prev => ({
        ...prev,
        [nombrePatrimonio]: !prev[nombrePatrimonio]
    }));

    if (!expandedRows[nombrePatrimonio]) {
        try {
            const response = await axiosPatri.get(`admin/imagenPreviewTabla/${nombrePatrimonio}`);
            
            if (response && response.data) {
                setImagenes(prev => ({
                    ...prev,
                    [nombrePatrimonio]: response.data
                }));
            } else {
                setImagenes(prev => ({
                    ...prev,
                    [nombrePatrimonio]: {}
                }));
            }
        } catch (error) {
            console.error("Error al obtener las imágenes:", error);
            setSnackbarMensaje("Error al cargar las imágenes");
            setSnackbarOpen(true);
            setImagenes(prev => ({
                ...prev,
                [nombrePatrimonio]: {}
            }));
        }
    }
  };

  const handleSelectImage = (nombreImagen, base64Image, nombrePatrimonio) => {
    if (
      imagenSeleccionada &&
      imagenSeleccionada.nombreImagen === nombreImagen &&
      imagenSeleccionada.nombrePatrimonio === nombrePatrimonio
    ) {
      setImagenSeleccionada(null);
    } else {
      setImagenSeleccionada({
        nombreImagen,
        imagen: base64Image,
        nombrePatrimonio,
      });
    }
  };

  const handleDeleteImage = async () => {
    console.log(imagenSeleccionada, "imagenSeleccionada");

    if (!imagenSeleccionada) return;

    try {
      const { nombrePatrimonio, nombreImagen } = imagenSeleccionada;

      await axiosPatri.post("/admin/eliminarImagenPatrimonio", {
        nombrePatrimonio,
        nombreImagen,
      });

      setImagenes((prev) => {
        const updatedImages = { ...prev };
        if (updatedImages[nombrePatrimonio]) {
          const newImageObject = { ...updatedImages[nombrePatrimonio] };
          delete newImageObject[nombreImagen];
          updatedImages[nombrePatrimonio] = newImageObject;
        }
        return updatedImages;
      });

      setImagenSeleccionada(null);
      setSnackbarMensaje("Imagen eliminada correctamente.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      setSnackbarMensaje("Error al eliminar la imagen.");
      setSnackbarOpen(true);
    }
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
    setPage(0);
  };

  const handleDelete = async (patri) => {
    try {
      setButtonDis(true);

      const response = await axiosPatri.post(
        "/admin/deshabilitarPatrimonio",
        { id_patrimonio: patri.id_patrimonio }
      );

      if (response.data) {
        setSnackbarMensaje("Patrimonio deshabilitado correctamente");
        setSnackbarOpen(true);
        await actualizador();
      }

    } catch (error) {
      console.error("Error al deshabilitar el patrimonio:", error);
      setSnackbarMensaje("Error al deshabilitar el patrimonio: " + 
        (error.response?.data?.message || error.message));
      setSnackbarOpen(true);
    } finally {
      setButtonDis(false);
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
                  <>
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
                      <TableCell>{patrimonio.nombre_patrimonio}</TableCell>
                      <TableCell>{patrimonio.nombre_tipologia}</TableCell>
                      <TableCell>{patrimonio.nombre_ubicacion}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {patrimonio.habilita == 1 ? "SI" : "NO"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <button
                          className="btn"
                          disabled={buttonDis || patrimonio.habilita !== 1}
                          onClick={() => handleDelete(patrimonio)}
                        >
                          <DeleteIcon className="iconDelete" />
                        </button>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            handleRowExpand(patrimonio.nombre_patrimonio)
                          }
                        >
                          {expandedRows[patrimonio.nombre_patrimonio] ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {expandedRows[patrimonio.nombre_patrimonio] && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          {imagenes.hasOwnProperty(patrimonio.nombre_patrimonio) ? (
                            Object.keys(imagenes[patrimonio.nombre_patrimonio]).length > 0 ? (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  flexWrap: "wrap",
                                }}
                              >
                                {Object.entries(imagenes[patrimonio.nombre_patrimonio]).map(
                                  ([nombreImagen, base64Image]) => (
                                    <div
                                      key={nombreImagen}
                                      style={{ textAlign: "center" }}
                                    >
                                      <img
                                        src={`data:image/jpeg;base64,${base64Image}`}
                                        alt={nombreImagen}
                                        style={{
                                          width: "150px",
                                          height: "100px",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                          cursor: "pointer",
                                          border:
                                            imagenSeleccionada?.nombreImagen === nombreImagen
                                              ? "3px solid red"
                                              : "none",
                                        }}
                                        onClick={() =>
                                          handleSelectImage(
                                            nombreImagen,
                                            base64Image,
                                            patrimonio.nombre_patrimonio
                                          )
                                        }
                                      />
                                      <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                        {nombreImagen.replace(/\.[^/.]+$/, "")}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p>No hay imágenes disponibles para este patrimonio</p>
                            )
                          ) : (
                            <p>Cargando imágenes...</p>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {expandedRows[patrimonio.nombre_patrimonio] && imagenSeleccionada && 
                      imagenSeleccionada.nombrePatrimonio === patrimonio.nombre_patrimonio && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <div className="mt-3 text-center d-flex justify-content-center gap-3">
                            <Button
                              variant="contained"
                              color="error"
                              onClick={handleDeleteImage}
                              startIcon={<DeleteIcon />}
                            >
                              Eliminar Imagen: {imagenSeleccionada.nombreImagen}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
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