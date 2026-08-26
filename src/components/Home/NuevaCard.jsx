/* eslint-disable react/prop-types */
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { registrarAccesoExterno } from "../../helpers/registrarAccesoExterno";

const NuevaCard = ({
  options,
  titulo,
  icono: Icono,
  user,
  isOpen,
  onOpen,
  onClose,
}) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const opcionesOrdenadas = options?.slice().sort((a, b) =>
    (a.descripcion || "").localeCompare(b.descripcion || "", "es", {
      sensitivity: "base",
    })
  );

  const handleOptionClick = (option) => {
    const token = localStorage.getItem("token");

    if (option.sistema_externo == null) {
      navigate(`/${option.nombre_proceso}`);
      return;
    }

    registrarAccesoExterno(option.id_proceso, option.id_opcion, user);

    if (option.id_opcion === 6) {
      switch (option.nombre_proceso) {
        case "tarjeta_sube":
          irATURNOS(1710);
          break;
        case "castracion_animal":
          // irATURNOS(1800);
          irACASTRACION();
          break;
        case "campus_ambiental":
          irATURNOS(1510);
          break;
        case "catastro":
          irATURNOS(515);
          break;
        case "licencia_conducir":
          irATURNOS(1721);
          break;
        case "ficha_medica":
          irATURNOS(241);
          break;
        case "asistencia_publica":
          irAAsitPubica();
          break;
        case "revision_medica_ledesma":
          irATURNOS(1812);
          break;
        default:
          break;
      }
    } else if (option.nombre_proceso === "carnet_sanidad") {
      const url = new URL(`${option.sistema_externo}`);
      window.open(url.toString(), "_blank");
    } else {
      const url = new URL(`${option.sistema_externo}/?auth=${token}`);
      url.searchParams.append("auth", token);
      window.open(url.toString(), "_blank");
    }
  };

  const irACASTRACION = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://animales.smt.gob.ar/`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
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
    const url = new URL(`${data.url}`);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const iframe = document.createElement("iframe");
      iframe.src = url.toString();
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.zIndex = "9999";

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "✕";
      closeBtn.style.position = "fixed";
      closeBtn.style.top = "50px";
      closeBtn.style.right = "5px";
      closeBtn.style.zIndex = "10000";
      closeBtn.style.padding = "10px 15px";
      closeBtn.style.backgroundColor = "#1976d2";
      closeBtn.style.color = "white";
      closeBtn.style.border = "none";
      closeBtn.style.borderRadius = "4px";
      closeBtn.style.cursor = "pointer";

      const closeIframe = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeBtn);
        window.removeEventListener("popstate", closeIframe);
      };

      closeBtn.addEventListener("click", closeIframe);
      window.addEventListener("popstate", closeIframe);

      document.body.appendChild(iframe);
      document.body.appendChild(closeBtn);
    } else {
      window.open(url.toString(), "_blank");
    }
  };

  return (
    <Card
      ref={cardRef}
      onClick={() => handleCardClick()}
      sx={{
        width: "300px",
        borderRadius: 3,
        boxShadow: 3,
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
          maxHeight: isOpen ? "70vh" : 60,
          overflow: "hidden",
          height: "100%",
        }}
      >
        <div className="d-flex gap-2 align-items-center mb-2">
          {Icono && <Icono style={{ fontSize: 25, color: "#1976d2" }} />}
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

        <Box
          sx={{
            pointerEvents: isOpen ? "auto" : "none",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
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
                {option.descripcion || "S/N"}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NuevaCard;
