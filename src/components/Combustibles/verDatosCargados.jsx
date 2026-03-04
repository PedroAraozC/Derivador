import React, { useEffect, useState, useMemo } from "react";
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
} from "@mui/material";
import axios from "../../config/axios";
import logo2 from "../../assets/Logo_SMT_neg_4.png";
import moment from "moment-timezone";
import ReportesConsumos from "./ReportesConsumos";
import { formatNumberAR } from "../../helpers/formatearImporte";

const ConsumosTable = () => {
  const [consumos, setConsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]); // filas seleccionadas
  // rango de fechas para borrar
  const [deleteRange, setDeleteRange] = useState({ desde: "", hasta: "" });

  // filtrado local según rango de fechas seleccionado para borrar
  const consumosFiltrados = useMemo(() => {
    if (!deleteRange.desde && !deleteRange.hasta) return consumos;

    return consumos.filter((row) => {
      const fecha = moment
        .tz(row.fecha_hora, "YYYY-MM-DD HH:mm:ss", "America/Argentina/Buenos_Aires")
        .format("YYYY-MM-DD");

      if (deleteRange.desde && deleteRange.hasta) {
        return fecha >= deleteRange.desde && fecha <= deleteRange.hasta;
      } else if (deleteRange.desde) {
        return fecha >= deleteRange.desde;
      } else if (deleteRange.hasta) {
        return fecha <= deleteRange.hasta;
      }
      return true;
    });
  }, [consumos, deleteRange]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/combustibles/consumos");
      setConsumos(data);
    } catch (error) {
      console.error("Error al obtener consumos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // seleccionar sólo los que aparecen en la tabla (posiblemente filtrados)
      const base = deleteRange.desde || deleteRange.hasta ? consumosFiltrados : consumos;
      const newSelected = base.map((row) => row.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDelete = async () => {
    try {
      await axios.post("/combustibles/consumos/eliminar", { ids: selected }); 
      fetchData();
      setSelected([]);
    } catch (error) {
      console.error("Error al eliminar consumos:", error);
    }
  };

  const handleDeleteRange = async () => {
    if (!deleteRange.desde || !deleteRange.hasta) return;

    // ids de los consumos que aparecen en la tabla filtrada
    const idsAEliminar = consumosFiltrados.map(r => r.id);
    if (idsAEliminar.length === 0) return;

    try {
      await axios.post("/combustibles/consumos/eliminar", { ids: idsAEliminar });
      fetchData();
      setDeleteRange({ desde: "", hasta: "" });
      setSelected([]);
    } catch (error) {
      console.error("Error al eliminar consumos por rango de fechas:", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        {/* Toolbar con botones borrar y rango de fechas */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="subtitle1">
              {selected.length > 0
                ? `${selected.length} seleccionados`
                : "Sin selección"}
            </Typography>
            {selected.length > 0 && (
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                Eliminar seleccionados
              </Button>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <TextField
              label="Desde"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={deleteRange.desde}
              onChange={(e) => setDeleteRange(prev => ({ ...prev, desde: e.target.value }))}
            />
            <TextField
              label="Hasta"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={deleteRange.hasta}
              onChange={(e) => setDeleteRange(prev => ({ ...prev, hasta: e.target.value }))}
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteRange}
              disabled={!(deleteRange.desde && deleteRange.hasta)}
            >
              Eliminar por rango
            </Button>
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
                      selected.length < consumosFiltrados.length
                    }
                    checked={
                      consumosFiltrados.length > 0 &&
                      selected.length === consumosFiltrados.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Importe</TableCell>
                <TableCell>Patente</TableCell>
                <TableCell>Vehículo</TableCell>
                <TableCell>Repartición</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Artículo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Remito</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consumosFiltrados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      role="checkbox"
                      selected={isItemSelected}
                      onClick={() => handleClick(row.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{row.cliente_id}</TableCell>
                      <TableCell>
                        {moment.tz(row.fecha_hora, "YYYY-MM-DD HH:mm:ss", "America/Argentina/Buenos_Aires")
                          .format("DD/MM/YYYY HH:mm")}
                      </TableCell>
                      <TableCell>${formatNumberAR(row.importe)}</TableCell>
                      <TableCell>{row.patente}</TableCell>
                      <TableCell>{row.vehiculo}</TableCell>
                      <TableCell>{row.nombre_reparticion}</TableCell>
                      <TableCell>{row.item_reparticion}</TableCell>
                      <TableCell>{row.articulo}</TableCell>
                      <TableCell>{row.cantidad}</TableCell>
                      <TableCell>{row.remito}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <TablePagination
          component="div"
          count={consumosFiltrados.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Componente de Reportes */}
      <ReportesConsumos consumos={consumos} />
    </>
  );
};

export default ConsumosTable;
