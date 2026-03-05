import React, { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { formatNumberAR } from "../../helpers/formatearImporte";

const ReportesConsumos = ({ consumos }) => {
  const [tipoFiltro, setTipoFiltro] = useState('items'); // 'items' o 'reparticiones'
  const [filtros, setFiltros] = useState({
    items: [],
    vehiculos: [],
    articulos: [],
    reparticiones: [],
  });
  const [fechas, setFechas] = useState({
    desde: null,
    hasta: null,
  });

  // Obtener opciones únicas para los filtros
  const opciones = useMemo(() => {
    const items = [...new Set(consumos.map(c => c.item_reparticion))].filter(Boolean);
    const vehiculos = [...new Set(consumos.map(c => c.vehiculo))].filter(Boolean);
    const articulos = [...new Set(consumos.map(c => c.articulo))].filter(Boolean);
    const reparticiones = [...new Set(consumos.map(c => c.nombre_reparticion))].filter(Boolean);
    
    return { items, vehiculos, articulos, reparticiones };
  }, [consumos]);

  // Filtrar consumos según los filtros seleccionados
  const consumosFiltrados = useMemo(() => {
    return consumos.filter(consumo => {
      const cumpleVehiculo = filtros.vehiculos.length === 0 || filtros.vehiculos.includes(consumo.vehiculo);
      const cumpleArticulo = filtros.articulos.length === 0 || filtros.articulos.includes(consumo.articulo);
      
      // Filtro por rango de fechas
      let cumpleFecha = true;
      if (fechas.desde || fechas.hasta) {
        // parseISO puede lanzar error si consumo.fecha_hora es null o inválida
        let fechaConsumo = null;
        if (consumo.fecha_hora) {
          try {
            fechaConsumo = parseISO(consumo.fecha_hora);
          } catch (e) {
            fechaConsumo = null;
          }
        }
        if (fechaConsumo) {
          if (fechas.desde && fechas.hasta) {
            cumpleFecha = isWithinInterval(fechaConsumo, {
              start: startOfDay(fechas.desde),
              end: endOfDay(fechas.hasta)
            });
          } else if (fechas.desde) {
            cumpleFecha = fechaConsumo >= startOfDay(fechas.desde);
          } else if (fechas.hasta) {
            cumpleFecha = fechaConsumo <= endOfDay(fechas.hasta);
          }
        } else {
          // si no hay fecha válida, no cumple el filtro de fechas
          cumpleFecha = false;
        }
      }
      
      // Según el tipo de filtro, aplicar el filtro correspondiente
      let cumpleTipoFiltro = true;
      if (tipoFiltro === 'items') {
        cumpleTipoFiltro = filtros.items.length === 0 || filtros.items.includes(consumo.item_reparticion);
      } else {
        cumpleTipoFiltro = filtros.reparticiones.length === 0 || filtros.reparticiones.includes(consumo.nombre_reparticion);
      }
      
      return cumpleTipoFiltro && cumpleVehiculo && cumpleArticulo && cumpleFecha;
    });
  }, [consumos, filtros, tipoFiltro, fechas]);

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const totalImporte = consumosFiltrados.reduce((sum, c) => sum + parseFloat(c.importe || 0), 0);
    const totalCantidad = consumosFiltrados.reduce((sum, c) => sum + parseFloat(c.cantidad || 0), 0);
    const totalRegistros = consumosFiltrados.length;

    // Por item
    const porItem = {};
    consumosFiltrados.forEach(c => {
      const item = c.item_reparticion || 'Sin especificar';
      if (!porItem[item]) {
        porItem[item] = { importe: 0, cantidad: 0, registros: 0 };
      }
      porItem[item].importe += parseFloat(c.importe || 0);
      porItem[item].cantidad += parseFloat(c.cantidad || 0);
      porItem[item].registros += 1;
    });

    // Por vehículo
    const porVehiculo = {};
    consumosFiltrados.forEach(c => {
      const vehiculo = c.codigo_vehiculo || 'Sin especificar';
      const nombre = c.vehiculo || 'Sin nombre';

      if (!porVehiculo[vehiculo]) {
        porVehiculo[vehiculo] = { importe: 0, cantidad: 0, registros: 0, nombreVehiculo: nombre  };
      }
      porVehiculo[vehiculo].importe += parseFloat(c.importe || 0);
      porVehiculo[vehiculo].cantidad += parseFloat(c.cantidad || 0);
      porVehiculo[vehiculo].registros += 1;
    });

    // Por artículo
    const porArticulo = {};
    consumosFiltrados.forEach(c => {
      const articulo = c.articulo || 'Sin especificar';
      if (!porArticulo[articulo]) {
        porArticulo[articulo] = { importe: 0, cantidad: 0, registros: 0 };
      }
      porArticulo[articulo].importe += parseFloat(c.importe || 0);
      porArticulo[articulo].cantidad += parseFloat(c.cantidad || 0);
      porArticulo[articulo].registros += 1;
    });

    // Por repartición
    const porReparticion = {};
    consumosFiltrados.forEach(c => {
      const reparticion = c.nombre_reparticion || 'Sin especificar';
      if (!porReparticion[reparticion]) {
        porReparticion[reparticion] = { importe: 0, cantidad: 0, registros: 0 };
      }
      porReparticion[reparticion].importe += parseFloat(c.importe || 0);
      porReparticion[reparticion].cantidad += parseFloat(c.cantidad || 0);
      porReparticion[reparticion].registros += 1;
    });

    return {
      total: { importe: totalImporte, cantidad: totalCantidad, registros: totalRegistros },
      porItem,
      porVehiculo,
      porArticulo,
      porReparticion,
    };
  }, [consumosFiltrados]);

  const handleFiltroChange = (tipo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      items: [],
      vehiculos: [],
      articulos: [],
      reparticiones: [],
    });
    setFechas({
      desde: null,
      hasta: null,
    });
  };

  const handleFechaChange = (campo, fecha) => {
    setFechas(prev => ({
      ...prev,
      [campo]: fecha
    }));
  };

  const handleTipoFiltroChange = (event) => {
    setTipoFiltro(event.target.value);
    // Limpiar filtros al cambiar tipo
    setFiltros({
      items: [],
      vehiculos: [],
      articulos: [],
      reparticiones: [],
    });
  };

  const renderTablaResumen = (datos, titulo) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>{titulo}</strong></TableCell>
            <TableCell align="right"><strong>Importe Total</strong></TableCell>
            <TableCell align="right"><strong>Cantidad Total</strong></TableCell>
            <TableCell align="right"><strong>Registros</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {console.log(Object.entries(datos)
            .sort(([,a], [,b]) => b.importe - a.importe))}
          {Object.entries(datos)
            .sort(([,a], [,b]) => b.importe - a.importe)
            .map(([nombre, datos]) => (
              <TableRow key={nombre}>
                <TableCell>{datos?.nombreVehiculo ? datos?.nombreVehiculo : nombre}</TableCell>
                <TableCell align="right">${formatNumberAR(datos.importe)}</TableCell>
                <TableCell align="right">{formatNumberAR(datos.cantidad)}</TableCell>
                <TableCell align="right">{datos.registros}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        📊 Reportes de Consumos
      </Typography>
      
      {/* Filtros */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        
        {/* Selector previo para elegir tipo de filtro */}
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Tipo de Filtro</InputLabel>
            <Select
              value={tipoFiltro}
              onChange={handleTipoFiltroChange}
              label="Tipo de Filtro"
            >
              <MenuItem value="items">Items</MenuItem>
              <MenuItem value="reparticiones">Reparticiones</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Filtro de rango de fechas */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Rango de Fechas:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Desde"
                type="date"
                value={fechas.desde ? format(fechas.desde, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleFechaChange('desde', e.target.value ? parseISO(e.target.value) : null)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Hasta"
                type="date"
                value={fechas.hasta ? format(fechas.hasta, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleFechaChange('hasta', e.target.value ? parseISO(e.target.value) : null)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2}>
          {/* Selector dinámico según el tipo elegido */}
          {tipoFiltro === 'items' ? (
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                multiple
                options={opciones.items}
                value={filtros.items}
                onChange={(event, newValue) => handleFiltroChange('items', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                      size="small"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Items"
                    placeholder="Buscar items..."
                    size="small"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Checkbox
                      checked={filtros.items.indexOf(option) > -1}
                    />
                    {option}
                  </li>
                )}
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                multiple
                options={opciones.reparticiones}
                value={filtros.reparticiones}
                onChange={(event, newValue) => handleFiltroChange('reparticiones', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                      size="small"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Reparticiones"
                    placeholder="Buscar reparticiones..."
                    size="small"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Checkbox
                      checked={filtros.reparticiones.indexOf(option) > -1}
                    />
                    {option}
                  </li>
                )}
              />
            </Grid>
          )}
          
          {/* Filtros que siempre están disponibles */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              multiple
              options={opciones.vehiculos}
              value={filtros.vehiculos}
              onChange={(event, newValue) => handleFiltroChange('vehiculos', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vehículos"
                  placeholder="Buscar vehículos..."
                  size="small"
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Checkbox
                    checked={filtros.vehiculos.indexOf(option) > -1}
                  />
                  {option}
                </li>
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              multiple
              options={opciones.articulos}
              value={filtros.articulos}
              onChange={(event, newValue) => handleFiltroChange('articulos', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Artículos"
                  placeholder="Buscar artículos..."
                  size="small"
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Checkbox
                    checked={filtros.articulos.indexOf(option) > -1}
                  />
                  {option}
                </li>
              )}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <button 
            onClick={limpiarFiltros}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Limpiar Filtros
          </button>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Resumen General */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📈 Resumen General
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  ${formatNumberAR(estadisticas.total.importe)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Importe Total
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="secondary">
                  {formatNumberAR(estadisticas.total.cantidad)} L
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cantidad Total en Litros
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {estadisticas.total.registros}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Consumos
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reportes Detallados */}
      <Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">📋 Consumo por Item</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderTablaResumen(estadisticas.porItem, "Item")}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">🚗 Consumo por Vehículo</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderTablaResumen(estadisticas.porVehiculo, "Vehículo")}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">⛽ Consumo por Tipo de Combustible</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderTablaResumen(estadisticas.porArticulo, "Artículo")}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">🏢 Consumo por Repartición</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderTablaResumen(estadisticas.porReparticion, "Repartición")}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
};

export default ReportesConsumos;
