/* eslint-disable react/prop-types */
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageCarouselModal from './Modales/ImageCarouselModal';
import axios from '../../config/axios';
import Swal from 'sweetalert2';
import { derivacionInicial, movimientosReclamo } from './funcionesReclamos';


const Derivacion = ({ id }) => {

    function formatFecha(fechaISO) {
        if (!fechaISO) return "";
        const fecha = new Date(fechaISO);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
    }

    const [derivacion, setDerivacion] = useState('');
    const [movimientos, setMovimientos] = useState([]);
    const [openFotos, setOpenFotos] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        if (id) {
            cargarIndicadores(id);
        }
    }, [id]);

    const cargarIndicadores = async (id) => {
        const fetchIndicador = async (fn, setter, nombre, id) => {
            try {
                const res = await fn(id);
                setter(res);
            } catch (error) {
                console.error(`Error al obtener ${nombre}:`, error);
            }
        };

        await fetchIndicador(derivacionInicial, setDerivacion, "Derivaciones", id);
        await fetchIndicador(movimientosReclamo, setMovimientos, "Movimientos", id);
    };

    const movimientosPorDerivacion = movimientos?.reduce((acc, movimiento) => {
        const id = movimiento.id_derivacion;
        if (!acc[id]) {
            acc[id] = [];
        }
        acc[id].push(movimiento);
        return acc;
    }, {});

    const colores = [
        "#f8f9fa", // gris claro
        "#e3f2fd", // azul muy claro
        "#e8f5e9", // verde muy claro
        "#fff3e0", // naranja muy claro
        "#fce4ec", // rosa claro
    ];

    const funcionArmarUrls = async (mov) => {
        try {
            const response = await axios.get(
                `/movimientos/imagenes/${mov.id_reclamo}/${mov.id_movi}`
            );

            // response.data ya contiene las URLs absolutas de las imágenes
            setImageUrls(response.data);
            setOpenFotos(true);
        } catch (error) {
            console.error("Error al obtener las imágenes del movimiento:", error);

            Swal.fire({
                icon: "error",
                title: "Error al cargar imágenes",
                text: "No se pudieron obtener las fotos de este movimiento.",
                confirmButtonColor: "#3085d6",
            });
        }
    };

    return (
        <>
            <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small">
                    <TableHead>
                        <TableCell sx={{ fontSize: '.8rem' }}>Derivación automatica e inicial a : <strong>{derivacion?.nombre_oficina}</strong> de <strong>{derivacion?.nombre_reparti}</strong></TableCell>
                        <TableCell>Ingreso</TableCell>
                        <TableCell>Egreso</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Foto</TableCell>
                    </TableHead>
                    {Object.entries(movimientosPorDerivacion).map(([id_derivacion, movimientosGrupo], index) => (
                        <TableBody key={id_derivacion}>
                            <TableRow>
                                <TableCell colSpan={6} sx={{ backgroundColor: colores[index % colores.length], fontWeight: "bold" }}>
                                    Derivación a {movimientosGrupo[0]?.nombre_oficina} - {movimientosGrupo[0]?.nombre_reparti}
                                </TableCell>
                            </TableRow>

                            {movimientosGrupo.map((movimiento, indexMov) => (
                                <TableRow key={movimiento.id_movi || indexMov} sx={{ backgroundColor: colores[index % colores.length] }}>
                                    <TableCell sx={{ fontSize: ".7rem" }}>
                                        <p className="mb-0">
                                            <strong>Sector-Repartición:</strong> {movimiento.nombre_reparti} - {movimiento.nombre_oficina}
                                        </p>
                                        <p className="mb-0"><strong>Detalle:</strong> {movimiento.detalle_movi}</p>
                                        <p className="mb-0"><strong>Motivo:</strong> {movimiento.nombre_motivo}</p>
                                        {movimiento?.nombre_usuingreso && movimiento?.apellido_usuingreso && (
                                            <p className="mb-0">
                                                <strong>Interviene en Ingreso:</strong> {`${movimiento.nombre_usuingreso} ${movimiento.apellido_usuingreso}`}
                                            </p>
                                        )}

                                        {movimiento?.nombre_usuegreso && movimiento?.apellido_usuegreso && (
                                            <p className="mb-0">
                                                <strong>Interviene en Egreso:</strong> {`${movimiento.nombre_usuegreso} ${movimiento.apellido_usuegreso}`}
                                            </p>
                                        )}

                                    </TableCell>
                                    <TableCell sx={{ fontSize: ".7rem" }}>{formatFecha(movimiento.fecha_ingreso)}</TableCell>
                                    <TableCell sx={{ fontSize: ".7rem" }}>{formatFecha(movimiento.fecha_egreso)}</TableCell>
                                    <TableCell sx={{ fontSize: ".7rem" }}>{movimiento.nombre_estado}</TableCell>
                                    
                                        <TableCell sx={{ fontSize: ".7rem", textAlign: "center" }}>-</TableCell>

                                    <TableCell sx={{ fontSize: ".7rem" }}>
                                        {movimiento.foto == 1 && (
                                            <>
                                                <Tooltip title="Tiene foto">
                                                    <CameraAltIcon className="text-primary ms-2" onClick={() => funcionArmarUrls(movimiento)} />
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ))}


                    {!movimientos && (
                        <TableRow>
                            <TableCell>No hay movimientos registrados.</TableCell>
                        </TableRow>
                    )}
                </Table>
            </TableContainer>
            <ImageCarouselModal open={openFotos} onClose={() => setOpenFotos(false)} imageUrls={imageUrls} />
        </>

    )
}

export default Derivacion