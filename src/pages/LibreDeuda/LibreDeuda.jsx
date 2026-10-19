import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Link,
  Button,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import EncabezadoPagina from "../../common/EncabezadoPagina";

const LibreDeuda = () => {
  const navigate = useNavigate();

  const cardStyles = {
    display: "flex",
    flexDirection: "column",
    borderRadius: 3,
    minHeight: 340,
    height: "100%",
    transition: "transform .3s, box-shadow .2s",
    boxShadow: 1,
    width: "100%",
    overflow: "hidden",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 6,
    },
    "&:hover .iconBox": {
      transform: "scale(1.15)",
    },
  };

  const contentStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    textAlign: "center",
    py: 4,
    px: 3,
    height: "100%",
    width: "100%",
  };

  const iconStyles = {
    transition: "transform .35s",
    width: 90,
    height: 90,
    borderRadius: "50%",
  };

  const token = localStorage.getItem("token");

  return (
    <Box minHeight="90dvh" px={{ xs: 2, md: 3 }} pb={6}>
      <div className="container">
        <EncabezadoPagina
          volver
          sup="Trámites"
          titulo="Portal de Libre Deuda"
          subtitulo="Seleccione la operación que desea realizar."
        />
      </div>

      <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={cardStyles}>
            <CardActionArea
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              /* 3. Evento corregido */
              onClick={() => navigate("/libre-deuda-dim")}
            >
              <CardContent sx={contentStyles}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="primary.main"
                  color="common.white"
                  className="iconBox"
                  sx={iconStyles}
                >
                  <DescriptionIcon sx={{ fontSize: 60 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  DIM
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  maxWidth={300}
                >
                  Inicie una nueva solicitud de libre deuda de impuestos
                  municipales para obtener su constancia.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={cardStyles}>
            <CardActionArea
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={() => {
                window.open(
                  `https://libredeudatmf.smt.gob.ar/?auth=${token}`,
                  "_blank",
                );
              }}
            >
              <CardContent sx={contentStyles}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="primary.main"
                  color="common.white"
                  className="iconBox"
                  sx={iconStyles}
                >
                  <PrivacyTipIcon sx={{ fontSize: 65 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  Infracciones
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  maxWidth={300}
                >
                  Inicie una nueva solicitud de libre deuda de infracciones de
                  catastro y tránsito.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LibreDeuda;
