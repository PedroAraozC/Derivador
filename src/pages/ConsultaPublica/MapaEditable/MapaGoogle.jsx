/* eslint-disable react/prop-types */
import { useState, useContext, useRef } from "react";
import { Button } from "@mui/material";
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "../../config/axios";
import { ACContext } from "../../context/ACContext";
import "./mapa.css";
import Swal from "sweetalert2";

const libraries = ["places"];
const mapContainerStyle = {
    width: "100%",
    height: "300px",
};
const centerDefault = { lat: -26.8227, lng: -65.2226 }; // San Miguel de Tucumán

const MapaGoogle = ({ datos, markerPosition, setMarkerPosition, setFormularioValues }) => {
    const { user } = useContext(ACContext);
    const [buttonDis, setButtonDis] = useState(false);
    const [imagenes, setImagenes] = useState([]);
    const autocompleteRef = useRef(null);

    // ✅ Cargar Google Maps con API key
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY, // pon tu API key en .env
        libraries,
    });

    const validarFormulario = (formularioValues) => {
        const camposObligatorios = ["id_treclamo", "id_oreclamo", "asunto", "coorde1", "coorde2", "apellido_nombre"];
        const camposFaltantes = camposObligatorios.filter((campo) => !formularioValues[campo]);

        if (camposFaltantes.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Error en formulario",
                text: "Revisalo por favor, faltan campos obligatorios.",
                confirmButtonColor: "#d33",
            });
            return false;
        }

        return true;
    };

    const handleGuardar = async () => {
        setButtonDis(true);
        const { coordenadas, ...restoDatos } = datos;
        const [coorde1, coorde2] = coordenadas || [null, null];

        const datosParaValidar = {
            ...restoDatos,
            coorde1,
            coorde2,
            imagenes,
            foto: imagenes.length > 0,
        };

        if (!validarFormulario(datosParaValidar)) {
            setButtonDis(false);
            return;
        }

        const formData = new FormData();

        Object.entries(restoDatos).forEach(([key, value]) => {
            formData.append(key, value);
        });

        formData.append("coorde1", coorde1);
        formData.append("coorde2", coorde2);
        formData.append("id_persona", user.id_persona);

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
                title: "Éxito",
                text: "Reclamo añadido exitosamente.",
                confirmButtonColor: "#3085d6",
            });
            setTimeout(() => {
                setButtonDis(true);
            }, 1500);
        } catch (error) {
            console.error("Error en dar de alta el reclamo:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error en dar de alta el reclamo.",
                confirmButtonColor: "#d33",
            });
            setButtonDis(false);
        }

    };

    const handleImagenesChange = (event) => {
        const files = Array.from(event.target.files);
        if (imagenes.length + files.length > 3) {
            Swal.fire({
                icon: "error",
                title: "Límite de imágenes",
                text: "Solo puedes subir hasta 3 imágenes.",
                confirmButtonColor: "#d33",
            });
            return;
        }
        setImagenes([...imagenes, ...files]);
    };


    const eliminarImagen = (index) => {
        setImagenes(imagenes.filter((_, i) => i !== index));
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const coords = [location.lat(), location.lng()];
                setMarkerPosition(coords);
                setFormularioValues((prev) => ({
                    ...prev,
                    coordenadas: coords,
                    direccion: place.formatted_address,
                }));
            }
        }
    };

    if (loadError) return <div>Error cargando mapa</div>;
    if (!isLoaded) return <div>Cargando mapa...</div>;

    return (
        <div className="w-100">
            <div className="mb-2">
                <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={onPlaceChanged}
                >
                    <input
                        type="text"
                        placeholder="Buscar dirección..."
                        className="form-control"
                    />
                </Autocomplete>
                <input type="text" value={datos.direccion || ""} className="form-control mt-2" disabled />
            </div>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={
                    markerPosition
                        ? { lat: markerPosition[0], lng: markerPosition[1] }
                        : centerDefault
                }
                zoom={16}
                onClick={(e) => {
                    const coords = [e.latLng.lat(), e.latLng.lng()];
                    setMarkerPosition(coords);

                    // ✅ Reverse geocoding con Google
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: { lat: coords[0], lng: coords[1] } }, (results, status) => {
                        if (status === "OK" && results[0]) {
                            setFormularioValues((prev) => ({
                                ...prev,
                                coordenadas: coords,
                                direccion: results[0].formatted_address,
                            }));
                        }
                    });
                }}
            >
                {markerPosition && (
                    <Marker position={{ lat: markerPosition[0], lng: markerPosition[1] }} />
                )}
            </GoogleMap>

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
                        <img
                            src={URL.createObjectURL(imagen)}
                            alt={`Preview ${index}`}
                            className="imagen-preview"
                        />
                        <button onClick={() => eliminarImagen(index)} className="eliminar-imagen">
                            X
                        </button>
                    </div>
                ))}
            </div>

            <Button onClick={handleGuardar} disabled={buttonDis} variant="contained" className="mt-3 mb-5">
                Guardar
            </Button>
        </div>
    );
};

export default MapaGoogle;
