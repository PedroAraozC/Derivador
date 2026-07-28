import { useLocation, useParams } from 'react-router-dom';
import Volver from '../../common/Volver';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Derivacion from './Derivacion';
import ImageCarouselModal from './Modales/ImageCarouselModal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from '../../config/axios';
// import { notasAclaratorias, reiteracionesReclamo } from './funcionesReclamos';

function formatFechaHora(fechaISO) {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

const VerReclamo = () => {

    const markerIcon = new L.Icon({
        iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: iconShadow,
        shadowSize: [41, 41],
    });

    const { id } = useParams();
    const location = useLocation();
    const [openFotos, setOpenFotos] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [reclamo, setReclamo] = useState(null);

    const reclamoCacheado = localStorage.getItem('reclamo')
        ? JSON.parse(localStorage.getItem('reclamo'))
        : location.state?.reclamo || null;

    function parseLat(coordStr) {
        // Para latitud: -26.xxxxxxxx
        if (!coordStr) return null;
        let clean = coordStr.replace(/\./g, "");
        let sign = clean.startsWith("-") ? -1 : 1;
        clean = clean.replace("-", "");
        // Siempre los dos primeros dígitos para latitud
        let intPart = clean.slice(0, 2);
        let decPart = clean.slice(2);
        return sign * parseFloat(intPart + "." + decPart);
    }

    function parseLng(coordStr) {
        // Para longitud: -65.xxxxxxxx
        if (!coordStr) return null;
        let clean = coordStr.replace(/\./g, "");
        let sign = clean.startsWith("-") ? -1 : 1;
        clean = clean.replace("-", "");
        // Siempre los dos primeros dígitos para longitud
        let intPart = clean.slice(0, 2);
        let decPart = clean.slice(2);
        return sign * parseFloat(intPart + "." + decPart);
    }
    const lat = parseLat(reclamo?.latitud);
    const lng = parseLng(reclamo?.longitud);


    const obtenerReclamo = async (id) => {
        const { data } = await axios.get(`/reclamos/reclamoEspecifico/${id}`);
        return data;
    };

    // useEffect(() => {
    //     const fetchIndicador = async (fn, setter, nombre, id) => {
    //         try {
    //             const res = await fn(id);
    //             setter(res);
    //         } catch (error) {
    //             console.error(`Error al obtener ${nombre}:`, error);
    //         }
    //     };

    //     fetchIndicador(notasAclaratorias, setNotas, "Notas", id);
    //     fetchIndicador(reiteracionesReclamo, setReiteraciones, "Reiteraciones", id);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        if (!id) return;

        // ✔️ Si existe cache y coincide el ID
        if (reclamoCacheado?.id_reclamo === Number(id)) {
            setReclamo(reclamoCacheado);
            return;
        }

        // ❌ No existe o no coincide → backend
        const fetchReclamo = async () => {
            try {
                const data = await obtenerReclamo(id);
                setReclamo(data);
                localStorage.setItem('reclamo', JSON.stringify(data));
            } catch (error) {
                console.error("Error al obtener reclamo:", error);
            }
        };

        fetchReclamo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (!id) return;

        axios
            .get(`https://estadisticas.smt.gob.ar:8084/reclamos/imagenes/${id}`)
            .then(res => setImageUrls(res.data))
            .catch(() => setImageUrls([]));
    }, [id]);



    return (
        <>
            <div className='container'>
                <Volver />
            </div>
            <div className='d-flex gap-2 align-items-center justify-content-between container' style={{ fontSize: '.9rem' }}>
                <div>
                    <h6 className='m-0 d-flex align-items-center' style={{ fontSize: '.9rem', fontWeight: 600 }}>
                        Reclamo N° {id}
                    </h6>
                    <h6 className='m-0 d-flex align-items-center' style={{ fontSize: '.9rem', fontWeight: 600 }}>Distrito: {reclamo?.DISTRITO}</h6>
                </div>
                <div className='d-flex align-items-center'>
                    {reclamo?.foto !== 0 && (
                        <Tooltip title='Foto del ciudadano'>
                            <IconButton size='medium' color="primary" onClick={() => setOpenFotos(true)}>
                                <CameraAltIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <p className='m-0 margin-left-2'>
                        {formatFechaHora(reclamo?.fecha_hora_inicio)}
                    </p>
                </div>

            </div >
            <hr />
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-md-6' style={{ fontSize: '.9rem', lineHeight: '1.6' }}>
                        <p className='m-0'><strong>Solicitante:</strong> {reclamo?.apellido_nombre}</p>
                        <p className='m-0'><strong>Email:</strong> {reclamo?.email}</p>
                        <p className='m-0'><strong>Telefono:</strong> {reclamo?.telefono}</p>
                        <p className='m-0'><strong>Tipo Reclamo:</strong> {reclamo?.corto_treclamo}</p>
                        <p className='m-0'><strong>Asunto:</strong> {reclamo?.asunto}</p>
                        <p className='m-0'><strong>Distrito:</strong> {reclamo?.DISTRITO}</p>
                        <p className='m-0'><strong>Dirección:</strong> {reclamo?.direccion}</p>
                        <p className='m-0'><strong>Estado:</strong> {reclamo?.nombre_estado}</p>
                        <p className='m-0'><strong>Prioridad:</strong> {reclamo?.nombre_prioridad}</p>
                        <p className='m-0'><strong>Origen:</strong> {reclamo?.nombre_oreclamo}</p>
                        <p className='m-0'><strong>Detalle:</strong> {reclamo?.detalle}</p>
                        <p className='m-0'><strong>Descripción:</strong> {reclamo?.descripcion_lugar}</p>
                    </div>
                    <div className='col-12 col-md-6' style={{ fontSize: '.9rem' }}>
                        <p className='m-0'><strong>Ubicación:</strong></p>
                        {/* Aqui va el mapa */}
                        {lat && lng ? (
                            <div style={{ width: "100%", height: "250px" }}>
                                <MapContainer
                                    center={[lat, lng]}
                                    zoom={17}
                                    scrollWheelZoom={false}
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[lat, lng]} icon={markerIcon}>
                                        <Popup>
                                            {reclamo?.direccion || 'Ubicación del reclamo'}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        ) : (
                            <p>No hay coordenadas para mostrar el mapa.</p>
                        )}

                    </div>
                </div>
                <hr />
                <div>
                    <Derivacion id={id} id_treclamo={reclamo?.id_treclamo} reclamo={reclamo} />
                </div>

                <ImageCarouselModal open={openFotos} onClose={() => setOpenFotos(false)} imageUrls={imageUrls} />
            </div>
        </>
    )
}

export default VerReclamo