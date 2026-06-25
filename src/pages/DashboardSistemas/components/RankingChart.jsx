/* eslint-disable react/prop-types */
import { Bar } from "react-chartjs-2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";

const nf = new Intl.NumberFormat("es-AR");

/**
 * Ranking reutilizable: barra horizontal + tabla.
 * items: [{ label, accesos }]
 */
const RankingChart = ({
  items = [],
  color = "#1976d2",
  etiquetaColumna = "Nombre",
  etiquetaValor = "Accesos",
}) => {
  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        Sin datos para el rango seleccionado.
      </Typography>
    );
  }

  const data = {
    labels: items.map((i) => i.label),
    datasets: [
      {
        label: etiquetaValor,
        data: items.map((i) => i.accesos),
        backgroundColor: color,
        borderRadius: 4,
        maxBarThickness: 26,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  const total = items.reduce((acc, i) => acc + i.accesos, 0);

  return (
    <Box>
      <div style={{ height: Math.max(220, items.length * 34) }}>
        <Bar data={data} options={options} />
      </div>

      <TableContainer sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{etiquetaColumna}</TableCell>
              <TableCell align="right">{etiquetaValor}</TableCell>
              <TableCell align="right">%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((i, idx) => (
              <TableRow key={`${i.label}-${idx}`}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{i.label}</TableCell>
                <TableCell align="right">{nf.format(i.accesos)}</TableCell>
                <TableCell align="right">
                  {total > 0 ? Math.round((i.accesos / total) * 1000) / 10 : 0}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RankingChart;
