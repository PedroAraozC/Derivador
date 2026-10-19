/* eslint-disable react/prop-types */
import { Chip } from "@mui/material";

// Chip de estado para las tablas: habilitado / deshabilitado.
const EstadoChip = ({
  habilitado,
  textoSi = "Habilitado",
  textoNo = "Deshabilitado",
}) => {
  const activo = Boolean(habilitado);
  return (
    <Chip
      size="small"
      label={activo ? textoSi : textoNo}
      sx={{
        bgcolor: activo ? "var(--cd-verde-bg)" : "rgba(15, 23, 42, 0.06)",
        color: activo ? "#15803d" : "var(--cd-text-2)",
        "& .MuiChip-label": { px: 1.25 },
        "&::before": {
          content: '""',
          width: 6,
          height: 6,
          borderRadius: "50%",
          ml: 1,
          bgcolor: activo ? "var(--cd-verde)" : "var(--cd-text-3)",
        },
      }}
    />
  );
};

export default EstadoChip;
