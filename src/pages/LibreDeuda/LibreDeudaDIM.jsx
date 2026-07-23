import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
} from "@mui/material";
import {
  HomeWork as HomeWorkIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom"; 

const LibreDeudaDIM = () => {

  const navigate = useNavigate();

  const cardStyles = {
    display: "flex",
    flexDirection: "column",
    borderRadius: 3,
    minHeight: 340,
    height: "100%",
    width: "100%",
    transition: "transform .3s, box-shadow .2s",
    boxShadow: 1,
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
    width: 80,
    height: 80,
    borderRadius: "50%",
  };

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
      {/* Encabezado */}
      <Box
        sx={{ paddingTop: 0, display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center", gap: 2, paddingBottom: 3 }}
      >
        <Typography fontSize="2.5rem" fontWeight="800" color="#0076b6">
          Generar Libre Deuda
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mt={1}
          maxWidth={560}
        >
          Seleccione la categoría correspondiente para iniciar su solicitud.
        </Typography>
      </Box>

      {/* Grid de opciones */}
      <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
        {/* Opción 1: C.I.S.I. */}
        <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
          <Card
            sx={cardStyles}
            onClick={() => {
              window.open(
                "https://dimsmt.gob.ar:8443/online/consultaEstado.jsp?",
                "_blank",
              );
            }}
          >
            <CardActionArea
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
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
                  <HomeWorkIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  Libre Deuda C.I.S.I.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  maxWidth={300}
                >
                  Contribución que incide sobre los inmuebles. Solicite la
                  constancia para propiedades e inmuebles urbanos.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Opción 2: C.I.S.C.A. */}
        <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
          <Card
            sx={cardStyles}
            onClick={() => {
              window.open(
                "https://dimsmt.gob.ar:8443/online/cisca/consultaEstadoCisca.jsp?",
                "_blank",
              );
            }}
          >
            <CardActionArea
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={contentStyles}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="#0288d1" // Tono azul/cyan similar a la interfaz original
                  color="common.white"
                  className="iconBox"
                  sx={iconStyles}
                >
                  <StorefrontIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  Libre Deuda C.I.S.C.A.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  maxWidth={300}
                >
                  Contribución sobre la actividad comercial, industrial y de
                  servicios para comercios y establecimientos.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LibreDeudaDIM;
