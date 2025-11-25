import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Box,
  Typography,
  Checkbox,
  Button,
  Toolbar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "../../config/axios";
import logo2 from "../../assets/Logo_SMT_neg_4.png";

const VehiculosTable = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [reparticiones, setReparticiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]); // filas seleccionadas
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [originalCodigo, setOriginalCodigo] = useState(null); // Para mantener el código original
  const [formData, setFormData] = useState({
    codigo: "",
    patente: "",
    detalle: "",
    item: "",
  });
  const [selectedReparticion, setSelectedReparticion] = useState(null);
  
  // Estados para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });

  // Funciones para manejar notificaciones
  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/combustibles/vehiculos");
      setVehiculos(data);
      setFilteredVehiculos(data);
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReparticiones = async () => {
    try {
      const { data } = await axios.get("/combustibles/ciudadDigital/reparticiones");
      
      // Eliminar duplicados basándose en el item (mantener el primero)
      const reparticionesUnicas = data.filter((reparticion, index, self) => 
        index === self.findIndex(r => r.item === reparticion.item)
      );
      
      setReparticiones(reparticionesUnicas);
    } catch (error) {
      console.error("Error al obtener reparticiones:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchReparticiones();
  }, []);

  // Filtro de búsqueda
  useEffect(() => {
    const filtered = vehiculos.filter((vehiculo) =>
      vehiculo.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.codigo.toString().includes(searchTerm) ||
      vehiculo.item.toString().includes(searchTerm)
    );
    setFilteredVehiculos(filtered);
    setPage(0); // Reset page when searching
  }, [searchTerm, vehiculos]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // Seleccionar todos los vehículos filtrados
      const newSelected = filteredVehiculos.map((row) => row.codigo);
      setSelected(newSelected);
      return;
    }
    // Deseleccionar todos
    setSelected([]);
  };

  const handleClick = (codigo) => {
  
    const selectedIndex = selected.indexOf(codigo);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, codigo);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (codigo) => selected.indexOf(codigo) !== -1;

  const handleDelete = async () => {
    try {
      // Eliminar cada vehículo seleccionado individualmente
      for (const codigo of selected) {
        await axios.delete(`/combustibles/vehiculos/${codigo}`);
      }
      fetchData();
      setSelected([]);
      setSearchTerm(""); // Limpiar filtro después de eliminar
      showNotification(`Se eliminaron ${selected.length} vehículo(s) correctamente`, "success");
    } catch (error) {
      console.error("Error al eliminar vehículos:", error);
      const errorMessage = error.response?.data?.error || "Error al eliminar vehículos";
      showNotification(errorMessage, "error");
    }
  };

  // Funciones para el modal de alta/edición
  const handleOpenDialog = (vehiculo = null) => {
    if (vehiculo) {
      setEditingVehiculo(vehiculo);
      setOriginalCodigo(vehiculo.codigo); // Guardar el código original
      
      // Buscar la repartición correspondiente al item del vehículo
      const reparticionEncontrada = reparticiones.find(rep => rep.item == vehiculo.item);
      
      setFormData({
        codigo: vehiculo.codigo,
        patente: vehiculo.patente,
        detalle: vehiculo.detalle,
        item: vehiculo.item.toString(),
      });
      setSelectedReparticion(reparticionEncontrada || null);
    } else {
      setEditingVehiculo(null);
      setOriginalCodigo(null);
      setFormData({
        codigo: "",
        patente: "",
        detalle: "",
        item: "",
      });
      setSelectedReparticion(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVehiculo(null);
    setOriginalCodigo(null);
    setSelectedReparticion(null);
    setFormData({
      codigo: "",
      patente: "",
      detalle: "",
      item: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReparticionChange = (event, newValue) => {
    setSelectedReparticion(newValue);
    setFormData(prev => ({
      ...prev,
      item: newValue ? newValue.item.toString() : ""
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingVehiculo) {
        // Editar vehículo existente - usar el código original como ID
        await axios.put(`/combustibles/vehiculos/${originalCodigo}`, formData);
        showNotification("Vehículo actualizado correctamente", "success");
      } else {
        // Crear nuevo vehículo
        await axios.post("/combustibles/vehiculos", formData);
        showNotification("Vehículo creado correctamente", "success");
      }
      fetchData();
      setSearchTerm(""); // Limpiar filtro después de crear/editar
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar vehículo:", error);
      const errorMessage = error.response?.data?.error || "Error al guardar vehículo";
      showNotification(errorMessage, "error");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <Box
        component="header"
        sx={{
          bgcolor: "#1976d2",
          py: 2,
          px: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src={logo2} alt="Logo" style={{ height: 60 }} />
        <Typography variant="h6" color="white" sx={{ ml: 2 }}>
          Gestión de Vehículos
        </Typography>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        {/* Toolbar con búsqueda y botones */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <TextField
              placeholder="Buscar vehículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm("")}
                      edge="end"
                    >
                      ×
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              color="primary"
            >
              Nuevo Vehículo
            </Button>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle1">
              {selected.length > 0
                ? `${selected.length} seleccionados`
                : "Sin selección"}
            </Typography>
            {selected.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            )}
          </Box>
        </Toolbar>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < filteredVehiculos.length
                    }
                    checked={
                      filteredVehiculos.length > 0 &&
                      selected.length === filteredVehiculos.length &&
                      filteredVehiculos.every(row => selected.includes(row.codigo))
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Patente</TableCell>
                <TableCell>Detalle</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Repartición</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVehiculos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.codigo);
                  return (
                    <TableRow
                      key={row.codigo}
                      hover
                      role="checkbox"
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox 
                          checked={isItemSelected}
                          onClick={() => handleClick(row.codigo)}
                        />
                      </TableCell>
                      <TableCell>{row.codigo}</TableCell>
                      <TableCell>{row.patente}</TableCell>
                      <TableCell>{row.detalle}</TableCell>
                      <TableCell>{row.item}</TableCell>
                      <TableCell>{row.nombre_reparticion}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(row)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <TablePagination
          component="div"
          count={filteredVehiculos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Modal para crear/editar vehículo */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingVehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Patente"
                name="patente"
                value={formData.patente}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Detalle"
                name="detalle"
                value={formData.detalle}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={reparticiones}
                getOptionLabel={(option) => option.nombre_reparticion || ""}
                value={selectedReparticion}
                onChange={handleReparticionChange}
                isOptionEqualToValue={(option, value) => option.item === value?.item}
                getOptionKey={(option) => `${option.item}-${option.nombre_reparticion}`}
                filterOptions={(options, { inputValue }) => {
                  return options.filter(option =>
                    option.nombre_reparticion.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Repartición"
                    required
                    placeholder="Buscar repartición..."
                  />
                )}
                noOptionsText="No se encontraron reparticiones"
                loading={reparticiones.length === 0}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingVehiculo ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VehiculosTable;
