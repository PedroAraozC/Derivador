/* eslint-disable react/prop-types */
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NuevaCard = ({ options, titulo, icono: Icono, user }) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    const opcionesOrdenadas = options
        ?.slice()
        .sort((a, b) =>
            (a.descripcion || "").localeCompare(b.descripcion || "", "es", {
                sensitivity: "base",
            })
        );

    const handleOptionClick = (option) => {
        const token = localStorage.getItem("token");

        if (option.sistema_externo == null) {
            navigate(`/${option.nombre_proceso}`);
        } else if (option.id_opcion === 6) {
            switch (option.nombre_proceso) {
                case "tarjeta_sube":
                    irATURNOS(1710);
                    break;
                case "castracion_animal":
                    irATURNOS(1800);
                    break;
                case "licencia_conducir":
                    irATURNOS(1711);
                    break;
                case "ficha_medica":
                    irATURNOS(241);
                    break;
                case "asistencia_publica":
                    irAAsitPubica();
                    break;
                default:
                    break;
            }
        } else {
            const url = new URL(`${option.sistema_externo}/?auth=${token}`);
            url.searchParams.append("auth", token);
            window.open(url.toString(), "_blank");
        }
    };

    const irATURNOS = (reparticion) => {
        const token = localStorage.getItem("token");
        const url = new URL(
            `https://turnos.smt.gob.ar/?auth=${token}&destino=turnero&rep=${reparticion}`
        );
        url.searchParams.append("auth", token);
        window.open(url.toString(), "_blank");
    };

    const irAAsitPubica = async () => {
        const tokenAsitencia = "f64b5a5a3efd8ade6bbf6c0b595d08aeef25c5fa";
        const documentoRecortado = user.documento_persona.toString().slice(2, -1);

        const resp = await fetch(
            "https://asistenciapublica.bymovi.com/api/v3/turnero/link_acceso_paciente",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": `${tokenAsitencia}`,
                },
                body: JSON.stringify({
                    nombre: `${user.nombre_persona} ${user.apellido_persona}`,
                    documento: documentoRecortado,
                    cuil: user.documento_persona,
                    telefono: user.telefono_persona,
                    email: user.email_persona,
                    fecha_nacimiento: user.fecha_nacimiento_persona
                        ? user.fecha_nacimiento_persona.toString().slice(0, 10)
                        : "",
                    genero: user.id_genero == 1 ? "F" : "M",
                }),
            }
        );
        const data = await resp.json();
        const url = new URL(`${ data.url }`);
        window.open(url.toString(), "_blank");
    };

    return (
        <Card
            onClick={() => setHovered(!hovered)}
            sx={{
                width: '250px',
                borderRadius: 3,
                boxShadow: 3,
                transition: "all 1s ease",
                cursor: "pointer",
                overflow: "hidden",
                "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.00)",
                },
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    transition: "max-height .6s ease",
                    maxHeight: hovered ? '100%' : 60,
                }}
            >
                <div className="d-flex gap-2 align-items-center mb-2">
                    {Icono && <Icono style={{ fontSize: 25, color: '#1976d2' }} />}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            color: "#1976d2",
                        }}
                    >
                        {titulo}
                    </Typography>
                </div>

                {/* Opciones que aparecen al hover */}
                <Box
                    sx={{
                        opacity: hovered ? 1 : 0,
                        transition: "opacity 1s ease",
                        pointerEvents: hovered ? "auto" : "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {opcionesOrdenadas?.map((option) => (
                        <Box
                            key={option.id_proceso}
                            onClick={() => handleOptionClick(option)}
                            sx={{
                                p: 1,
                                borderRadius: 2,
                                width: "90%",
                                "&:hover": {
                                    backgroundColor: "#f0f4ff",
                                },
                            }}
                        >
                            <Typography variant="body2" sx={{ color: "#333" }}>
                                {option.descripcion || 'S/N'}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default NuevaCard;
