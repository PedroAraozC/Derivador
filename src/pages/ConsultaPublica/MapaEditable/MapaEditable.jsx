/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import './mapa.css';
import axios from "../../../config/axiosAC";
import { DerivadorContext } from "../../../context/DerivadorContext";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point as turfPoint } from "@turf/helpers";
import distritos from "../../../../distritosNuevo.json"

const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ✅ Modificado: ahora hace reverse geocoding al hacer click
const LocationSelector = ({ setMarkerPosition, setFormularioValues }) => {
    useMapEvents({
        async click(e) {
            const coords = [e.latlng.lat, e.latlng.lng];
            setMarkerPosition(coords);

            try {
                const { data } = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?lat=${coords[0]}&lon=${coords[1]}&format=json`
                );

                setFormularioValues((prev) => ({
                    ...prev,
                    coordenadas: coords,
                    direccion: data?.display_name || "Dirección desconocida",
                }));
            } catch (err) {
                console.error("Error en reverse geocoding:", err);
                setFormularioValues((prev) => ({
                    ...prev,
                    coordenadas: coords,
                    direccion: "Dirección no encontrada",
                }));
            }
        },
    });

    return null;
};

const MapCenterUpdater = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 18); // animate zoom y centrado 🚀
        }
    }, [position, map]);

    return null;
};

const MapaEditable = ({ datos, markerPosition, setMarkerPosition, setFormularioValues, setErrors }) => {
    const { user } = useContext(DerivadorContext);
    const [buttonDis, setButtonDis] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [imagenes, setImagenes] = useState([]);
    const navigate = useNavigate();

    const obtenerDistritoPorCoordenadas = (lat, lng) => {
        if (isNaN(lat) || isNaN(lng)) return null;

        const punto = turfPoint([lng, lat]); // 👈 Turf usa [lng, lat]

        for (const feature of distritos.features) {
            const dentro = booleanPointInPolygon(punto, feature);

            if (dentro) {
                return {
                    id: feature.properties.ID,
                    nombre: feature.properties.NOMBRE || null,
                    feature
                };
            }
        }
        return null; // No pertenece a ningún distrito
    };

    const validarFormulario = (formularioValues) => {

        const camposObligatorios = ["id_treclamo", "id_oreclamo", "asunto", "coorde1", "coorde2", "apellido_nombre", "id_categoria", "telefono"];

        let nuevosErrores = {};

        camposObligatorios.forEach((campo) => {
            if (!formularioValues[campo]) {
                nuevosErrores[campo] = "Campo requerido";
            }
        });

        // 🔹 Validación teléfono (exactamente 10 números)
        const telefonoLimpio = formularioValues.telefono.replace(/\D/g, "");

        if (telefonoLimpio.length !== 10) {
            nuevosErrores.telefono = "El teléfono debe tener exactamente 10 números";
        }

        const cantidadImagenes = formularioValues.imagenes?.length || 0;

        if (
            (formularioValues.id_treclamo == 77 || formularioValues.id_treclamo == 100) &&
            cantidadImagenes === 0
        ) {
            nuevosErrores.imagenes = "Se requiere al menos una imagen para este tipo de reclamo";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setSnackbarMensaje("Error en formulario, revisalo por favor");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);

            // ⬅️ DEVUELVE los errores hacia NuevoReclamo
            setErrors(nuevosErrores);

            return false;
        }

        // Si no hay errores, limpiar en NuevoReclamo
        setErrors({});
        return true;
    };

    const handleGuardar = async () => {
        setButtonDis(true);

        const { coordenadas, ...restoDatos } = datos;
        const [coorde1, coorde2] = coordenadas || [null, null];
        const distrito = obtenerDistritoPorCoordenadas(coorde1, coorde2);
        const datosParaValidar = {
            ...restoDatos,
            coorde1,
            coorde2,
            id_distrito: distrito ? distrito.id : null,
            imagenes,
            foto: imagenes.length > 0,
        };

        // 🟠 Validación específica: reclamos que requieren foto
        if (
            (datosParaValidar.id_treclamo == 77 || datosParaValidar.id_treclamo == 100) &&
            imagenes.length === 0
        ) {
            setButtonDis(false);
            Swal.fire({
                icon: "warning",
                title: "Falta imagen",
                text: "Este tipo de reclamo requiere al menos una imagen.",
            });
            return;
        }

        if (!validarFormulario(datosParaValidar)) {
            setButtonDis(false);
            Swal.fire({
                icon: "warning",
                title: "Formulario incompleto",
                text: "Por favor completa todos los campos requeridos antes de continuar.",
            });
            return;
        }

        const formData = new FormData();

        Object.entries(restoDatos).forEach(([key, value]) => {
            formData.append(key, value);
        });

        formData.append("coorde1", coorde1);
        formData.append("coorde2", coorde2);
        formData.append("id_persona", user.id_persona);
        formData.append("id_distrito", distrito ? distrito.id : "");

        if (imagenes && imagenes.length > 0) {
            imagenes.forEach((imagen) => {
                formData.append("imagenes", imagen);
            });
        }

        formData.append("foto", imagenes.length > 0 ? "true" : "false");

        try {
            const { data } = await axios.post("/reclamos/altaReclamo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Respuesta del servidor:", data);

            Swal.fire({
                icon: "success",
                title: "Reclamo enviado",
                text: "Tu reclamo fue añadido exitosamente.",
                timer: 2000,
                showConfirmButton: false,
            });

            setTimeout(() => {
                setButtonDis(true);
                navigate('/ver_reclamo/' + data.id_reclamo);
            }, 1500);

        } catch (error) {
            console.error("Error en dar de alta el reclamo:", error);
            Swal.fire({
                icon: "error",
                title: "Error al enviar reclamo",
                text: "Hubo un problema al intentar dar de alta el reclamo. Intenta nuevamente.",
            });

            setButtonDis(false);
        }
    };

    const handleImagenesChange = (event) => {
        const files = Array.from(event.target.files);
        if (imagenes.length + files.length > 3) {
            setSnackbarMensaje("Solo puedes subir hasta 3 imágenes.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }
        setImagenes([...imagenes, ...files]);
    };

    const handleBuscarDireccion = async () => {
        if (!datos.direccion) return;

        try {
            const query = `${datos.direccion}, San Miguel de Tucumán, Departamento Capital, Tucumán, T4000, Argentina`;
            const { data } = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`
            );


            if (!data || data.length === 0) {
                setSnackbarMensaje("No se encontró esa dirección.");
                setSnackbarSeverity("warning");
                setSnackbarOpen(true);
                return;
            }

            const info = data[0];
            const lat = parseFloat(info.lat);
            const lon = parseFloat(info.lon);
            const coords = [lat, lon];

            setMarkerPosition(coords);

            setFormularioValues((prev) => ({
                ...prev,
                coordenadas: coords,
                direccion: datos.direccion,
            }));

        } catch (err) {
            console.error("Error en geocoding directo:", err);
            setSnackbarMensaje("Error buscando dirección");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const eliminarImagen = (index) => {
        setImagenes(imagenes.filter((_, i) => i !== index));
    };

    const obtenerDireccionPorCoords = async (lat, lon) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

        const resp = await fetch(url);
        const data = await resp.json();

        return data.display_name || null;
    };

    const pegarCoordenadas = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const [lat, lon] = text.split(",").map(coord => parseFloat(coord.trim()));

            if (isNaN(lat) || isNaN(lon)) {
                setSnackbarMensaje("El texto del portapapeles no tiene formato de coordenadas.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }

            const coords = [lat, lon];
            setMarkerPosition(coords);

            const direccion = await obtenerDireccionPorCoords(lat, lon);

            setFormularioValues((prev) => ({
                ...prev,
                coordenadas: coords,
                direccion: direccion || "",
            }));

        } catch (err) {
            console.error("Error al pegar coordenadas:", err);
            setSnackbarMensaje("No se pudo acceder al portapapeles.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    const [coordA, coordB] = datos.coordenadas || [null, null];
    const telefonoLimpio = (datos.telefono || "").replace(/\D/g, "");
    const requiereImagen = datos.id_treclamo == 77 || datos.id_treclamo == 100;
    const formularioCompleto =
        !!datos.id_categoria &&
        !!datos.id_treclamo &&
        !!datos.id_oreclamo &&
        !!datos.asunto &&
        !!datos.apellido_nombre &&
        !!coordA &&
        !!coordB &&
        telefonoLimpio.length === 10 &&
        (!requiereImagen || imagenes.length > 0);

    return (
        <div className="w-100">
            <div className="mb-2">
                <div className="d-flex gap-2 mb-3 align-items-center">
                    <input
                        type="text"
                        value={datos.direccion || ""}
                        onChange={(e) =>
                            setFormularioValues((prev) => ({
                                ...prev,
                                direccion: e.target.value,
                            }))
                        }
                        className="form-control"
                        placeholder="Buscar dirección..."
                    />
                    <Button
                        variant="outlined"
                        className="mt-1"
                        onClick={handleBuscarDireccion}
                    >
                        Buscar
                    </Button>
                </div>
                <div className="input-group mb-2">
                    <input
                        type="text"
                        value={datos.direccion}
                        className="form-control"
                        disabled
                    />
                </div>
                <Button
                    variant="outlined"
                    className="mt-1"
                    onClick={pegarCoordenadas}
                >
                    Pegar coordenadas
                </Button>
            </div>

            <MapContainer
                center={markerPosition || [-26.8227, -65.2226]}
                zoom={16}
                scrollWheelZoom={true}
                style={{ height: "300px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {markerPosition && (
                    <Marker position={markerPosition} icon={customIcon}>
                        <Popup>Ubicación</Popup>
                    </Marker>
                )}
                {/* 🆕 Aquí centramos cuando cambia markerPosition */}
                <MapCenterUpdater position={markerPosition} />
                {/* ✅ Ahora el click guarda coords y también la dirección */}
                <LocationSelector setMarkerPosition={setMarkerPosition} setFormularioValues={setFormularioValues} />
            </MapContainer>

            <div className="p-3 border border-1 border-primary rounded mt-3">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagenesChange}
                    disabled={imagenes.length >= 3}
                />
            </div>

            <div className="imagenes-preview">
                {imagenes.map((imagen, index) => (
                    <div key={index} className="imagen-container">
                        <img src={URL.createObjectURL(imagen)} alt={`Preview ${index}`} className="imagen-preview" />
                        <button onClick={() => eliminarImagen(index)} className="eliminar-imagen">
                            X
                        </button>
                    </div>
                ))}
            </div>

            <Button onClick={handleGuardar} disabled={buttonDis || !formularioCompleto} variant="contained" className="mt-3 mb-5">
                Guardar
            </Button>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMensaje}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default MapaEditable;
