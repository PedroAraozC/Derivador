/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EqualizerIcon from "@mui/icons-material/Equalizer";

const nf = new Intl.NumberFormat("es-AR");

const Tendencia = ({ comparacion }) => {
  if (!comparacion || comparacion.variacionPorcentual === null) {
    return <Chip size="small" label="Sin período anterior" variant="outlined" />;
  }
  const v = comparacion.variacionPorcentual;
  const subida = comparacion.tendencia === "subida";
  const baja = comparacion.tendencia === "baja";
  const color = subida ? "success" : baja ? "error" : "default";
  const Icono = subida ? TrendingUpIcon : baja ? TrendingDownIcon : TrendingFlatIcon;
  return (
    <Chip
      size="small"
      color={color}
      icon={<Icono />}
      label={`${v > 0 ? "+" : ""}${v}% vs. período anterior`}
    />
  );
};

const Kpi = ({ titulo, valor, icono, color, children }) => (
  <Card elevation={3} sx={{ height: "100%", borderTop: `4px solid ${color}` }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box sx={{ color }}>{icono}</Box>
        <Typography variant="subtitle2" color="text.secondary">
          {titulo}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight={700}>
        {valor}
      </Typography>
      <Box sx={{ mt: 1 }}>{children}</Box>
    </CardContent>
  </Card>
);

const KpiCards = ({ resumen }) => {
  if (!resumen) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
        gap: 2,
      }}
    >
      <Kpi
        titulo="Total de accesos"
        valor={nf.format(resumen.totalAccesos)}
        icono={<EqualizerIcon />}
        color="#1976d2"
      >
        <Tendencia comparacion={resumen.comparacion} />
      </Kpi>

      <Kpi
        titulo="Promedio diario"
        valor={nf.format(resumen.promedioDiario)}
        icono={<TrendingUpIcon />}
        color="#0288d1"
      >
        <Typography variant="caption" color="text.secondary">
          accesos por día en el rango
        </Typography>
      </Kpi>

      <Kpi
        titulo="Empleados"
        valor={nf.format(resumen.empleados.cantidad)}
        icono={<PersonIcon />}
        color="#2e7d32"
      >
        <Chip
          size="small"
          color="success"
          variant="outlined"
          icon={<GroupsIcon />}
          label={`${resumen.empleados.porcentaje}% del total`}
        />
      </Kpi>

      <Kpi
        titulo="No empleados"
        valor={nf.format(resumen.noEmpleados.cantidad)}
        icono={<PeopleOutlineIcon />}
        color="#ed6c02"
      >
        <Chip
          size="small"
          color="warning"
          variant="outlined"
          label={`${resumen.noEmpleados.porcentaje}% del total`}
        />
      </Kpi>
    </Box>
  );
};

export default KpiCards;
