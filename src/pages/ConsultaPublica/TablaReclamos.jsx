/* eslint-disable react/prop-types */
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    CircularProgress,
    Box,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useNavigate } from 'react-router-dom';
import { ListarCategorias, ListarColoresEstados, ListarEstados } from './funcionesReclamos';

const TablaReclamos = ({ data }) => {
    const formatearFecha = (valor) => {
        if (!valor) return '';

        const fecha = new Date(valor);
        if (Number.isNaN(fecha.getTime())) return '';

        return new Intl.DateTimeFormat('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
        }).format(fecha);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    // filtros
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [estados, setEstados] = useState([]);
    const [colores, setColores] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        ListarCategorias().then((res) => setCategorias(res));
        ListarEstados().then((res) => setEstados(res));
        ListarColoresEstados().then((res) => setColores(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const verReclamo = (id, row) => {
        localStorage.setItem("reclamo", JSON.stringify(row));
        navigate(`/ver_reclamo/${id}`, { state: { reclamo: row } });
    };

    // aplicar filtros
    const filteredData = data
        ? data.filter((row) => {
            const matchCategoria = categoriaFiltro
                ? row.nombre_categoria === categoriaFiltro
                : true;

            const matchEstado = estadoFiltro
                ? row.nombre_estado === estadoFiltro
                : true;

            const matchBusqueda = busqueda
                ? row.id_reclamo.toString().includes(busqueda) ||
                row.apellido_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                (row.direccion && row.direccion.toLowerCase().includes(busqueda.toLowerCase()))
                : true;

            return matchCategoria && matchEstado && matchBusqueda;
        })
        : [];

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).sort((a, b) => b.id_reclamo - a.id_reclamo);

    return (
        <>
            {data && data.length > 0 && (
                <Box display="flex" gap={2} mb={2}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Categoria</InputLabel>
                        <Select
                            value={categoriaFiltro}
                            label="Categoria"
                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                        >
                            <MenuItem value="">Todas</MenuItem>
                            {categorias?.filter(cat => cat.habilita === 1).sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria)).map((cat) => (
                                <MenuItem key={cat.id_categoria} value={cat.nombre_categoria}>
                                    {cat.nombre_categoria}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={estadoFiltro}
                            label="Estado"
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {estados?.filter(est => est.habilita === 1).sort((a, b) => a.id_estado - b.id_estado)
                                .map((est) => (
                                    <MenuItem key={est.id_estado} value={est.nombre_estado}>
                                        {est.nombre_estado}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <TextField
                        size="small"
                        label="Buscar ID, Solicitante, Direccion"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        sx={{ width: 300 }}
                    />

                </Box>
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden', marginY: 2 }}>
                <TableContainer sx={{ maxHeight: 700 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Solicitante / Dirección</TableCell>
                                <TableCell>Asunto</TableCell>
                                <TableCell>Categoria / Tipo de Reclamo</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Fecha Inicio</TableCell>
                                <TableCell>Opciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!data ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Box py={2}>
                                            <CircularProgress size={20} />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No hay datos
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((row) => (
                                    <TableRow
                                        key={row.id_reclamo}
                                        style={{
                                            backgroundColor:
                                                colores?.find(c => c.id_estado === row.id_estado)?.color || "white"
                                        }}
                                    >
                                        <TableCell sx={{ fontSize: 11 }}>{row.id_reclamo}</TableCell>
                                        <TableCell sx={{ fontSize: 11 }}>{row.apellido_nombre} / {row.direccion?.substring(0, 40)}{row.direccion?.length > 40 ? '...' : ''}</TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: 11,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: 150,
                                            }}
                                            title={row.asunto}
                                        >
                                            {row.asunto}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 11 }}>
                                            {row.nombre_categoria} / {row.nombre_treclamo}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 11 }}>{row.nombre_estado}</TableCell>
                                        <TableCell sx={{ fontSize: 11 }}>
                                            {formatearFecha(row.fecha_ingreso || row.fecha_inicio)}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 11 }}>
                                            <IconButton onClick={() => verReclamo(row.id_reclamo, row)}>
                                                <VisibilityIcon fontSize="small" color="action" />
                                            </IconButton>
                                            {row.foto !== 0 &&
                                                <IconButton onClick={() => verReclamo(row.id_reclamo, row)}>
                                                    <CameraAltIcon fontSize="small" color="action" />
                                                </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Paginación */}
                {filteredData.length > 0 && (
                    <TablePagination
                        component="div"
                        count={filteredData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 15, 25]}
                        labelRowsPerPage="Filas por página"
                    />
                )}
            </Paper>
        </>
    );
};

export default TablaReclamos;
