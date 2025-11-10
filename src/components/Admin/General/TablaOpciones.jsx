import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Modal,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreVert,
  Delete,
  Edit,
  Add,
  Key
} from "@mui/icons-material";
import Swal from "sweetalert2";
import useStore from "../../../Zustand/Zustand";
import axios from "../../../config/axios";
import AgregarProceso from "./AgregarProceso";
import PermisosProcesoModal from "./PermisosProcesoModal";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import EditarProceso from "./EditarProceso";

export default function TablaOpciones() {
  const { opciones, obtenerOpciones } = useStore();
  const [openRows, setOpenRows] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalPermisos, setModalPermisos] = useState(false);
  const [modalProceso, setModalProceso] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [nuevaOpcion, setNuevaOpcion] = useState({ nombre_opcion: "", habilita: 1 });
  const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    obtenerOpciones();
  }, [obtenerOpciones]);

  const opcionesArray = Array.isArray(opciones?.opciones)
    ? opciones.opciones
    : Array.isArray(opciones)
      ? opciones
      : [];

  const groupedOptions = opcionesArray.reduce((acc, opcion) => {
    const { nombre_opcion } = opcion;
    const existingOption = acc.find(item => item.nombre_opcion === nombre_opcion);

    if (existingOption) {
      existingOption.subItems.push(opcion);
    } else {
      acc.push({ nombre_opcion, subItems: [opcion] });
    }

    return acc;
  }, []);

  console.log(opciones)

  const handleRowClick = (nombre_opcion) => {
    setOpenRows((prev) => ({
      ...prev,
      [nombre_opcion]: !prev[nombre_opcion],
    }));
  };

  const handleDelete = async (option) => {
    const id = option.subItems[0].id_opcion;
    const result = await Swal.fire({
      title: "¿Deshabilitar opción?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.post("/admin/borrarOpcion", { id });
        Swal.fire("Hecho", "La opción fue deshabilitada", "success");
        obtenerOpciones();
      } catch (error) {
        Swal.fire("Error", "No se pudo borrar la opción", "error");
      }
    }
  };

  const handleAddOption = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/admin/altaOpcion", nuevaOpcion);
      if (res.status === 201) {
        setOpenAddModal(false);
        Swal.fire("Éxito", res.data?.message, "success");
        obtenerOpciones();
      }
    } catch {
      setOpenAddModal(false);
      Swal.fire("Error", "No se pudo agregar la opción", "error");
    }
  };

  const handleMenuOpen = (event, option) => {
    setAnchorEl(event.currentTarget);
    setSelectedOption(option);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOption(null);
  };

  const handlePermisosOpen = (proceso) => {
    setProcesoSeleccionado(proceso);
    setModalPermisos(true);
  };

  const handleProcesoOpen = (proceso) => {
    setProcesoSeleccionado(proceso);
    setModalProceso(true);
  };

  const handleOpenModal = (selectedOption) => {
    handleMenuClose(); // 🔒 cerrar el menú primero
    setSelectedOption(selectedOption);
    setTimeout(() => setIsModalOpen(true), 150); // ⏱ pequeño delay visual
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h3>Opciones del Menú</h3>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddModal(true)}>
          Nueva opción
        </Button>
      </Box>
      <div className="my-5">

        {/* Tabla principal */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Nombre de opción</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedOptions?.map((option, i) => (
                <React.Fragment key={i}>
                  <TableRow hover>
                    <TableCell width={50}>
                      <IconButton onClick={() => handleRowClick(option.nombre_opcion)}>
                        {openRows[option.nombre_opcion] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{option.nombre_opcion}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuOpen(e, option)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                      <Collapse in={openRows[option.nombre_opcion]} timeout="auto" unmountOnExit>
                        <Box margin={0}>
                          <Table size="small">
                            <TableBody>
                              {option.subItems.map((sub, idx) => (
                                <TableRow key={idx}>
                                  <TableCell />
                                  <TableCell>{sub.nombre_proceso}</TableCell>
                                  <TableCell align="right">
                                    <Tooltip title="Editar permisos">
                                      <IconButton onClick={() => handlePermisosOpen(sub)}>
                                        <Key />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar proceso">
                                      <IconButton onClick={() => handleProcesoOpen(sub)}>
                                        <Edit />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>


      {/* Menú contextual de acciones */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => alert("Editar próximamente")}>
          <Edit fontSize="small" /> &nbsp; Editar
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedOption)}>
          <Delete fontSize="small" /> &nbsp; Borrar
        </MenuItem>
        <MenuItem  onClick={()=>handleOpenModal(selectedOption)}>
          <AddCircleOutlineOutlinedIcon fontSize="small" /> &nbsp; Agregar
        </MenuItem>
      </Menu>

      {/* Modal para agregar nuevo proceso */}
      <AgregarProceso option={selectedOption} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>

      {/* Modal para editar proceso */}
      <EditarProceso option={procesoSeleccionado} isModalOpen={modalProceso} setIsModalOpen={setModalProceso} />

      {/* Modal para agregar nueva opción */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
          }}
        >
          <h3>Agregar nueva opción</h3>
          <form onSubmit={handleAddOption}>
            <TextField
              fullWidth
              label="Nombre de la opción"
              name="nombre_opcion"
              value={nuevaOpcion.nombre_opcion}
              onChange={(e) =>
                setNuevaOpcion({ ...nuevaOpcion, nombre_opcion: e.target.value })
              }
              required
              sx={{ my: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Guardar
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Modal de permisos */}
      <PermisosProcesoModal
        modalAbiertoPPro={modalPermisos}
        proceso={procesoSeleccionado}
        handleClose={() => setModalPermisos(false)}
      />
    </Box>
  );
}
