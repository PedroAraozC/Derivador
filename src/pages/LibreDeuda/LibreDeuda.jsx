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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";

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
    <Box backgroundColor="#f5f5f5b7" minHeight="90dvh" p={{ xs: 2, md: 0.5 }}>
      <div className="d-flex justify-content-between align-items-center ">
        <div
          className="no-print"
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            marginTop: 20,
            marginLeft: 25,
          }}
        >
          <ArrowBackIcon sx={{ color: "black", marginRight: 1 }} />
          <span style={{ color: "black", fontSize: "1rem" }}>Volver</span>
        </div>
      </div>
      <Box
        sx={{
          paddingTop: 0,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          paddingBottom: 3,
        }}
      >
        <Typography fontSize="2.5rem" fontWeight="800" color="#0076b6">
          Portal de Libre Deuda
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mt={1}
          maxWidth={560}
        >
          Seleccione la operación que desea realizar.
        </Typography>
      </Box>

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
