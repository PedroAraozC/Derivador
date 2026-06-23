/* eslint-disable react/prop-types */
import { Line } from "react-chartjs-2";

const EvolucionChart = ({ evolucion }) => {
  const serie = evolucion?.serie || [];

  const data = {
    labels: serie.map((p) => p.periodo),
    datasets: [
      {
        label: "Total accesos",
        data: serie.map((p) => p.accesos),
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: serie.length > 40 ? 0 : 3,
      },
      {
        label: "Empleados",
        data: serie.map((p) => p.empleados),
        borderColor: "#2e7d32",
        backgroundColor: "transparent",
        tension: 0.3,
        pointRadius: serie.length > 40 ? 0 : 2,
      },
      {
        label: "No empleados",
        data: serie.map((p) => p.noEmpleados),
        borderColor: "#ed6c02",
        backgroundColor: "transparent",
        tension: 0.3,
        pointRadius: serie.length > 40 ? 0 : 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { ticks: { maxRotation: 45, autoSkip: true } },
    },
  };

  return (
    <div style={{ height: 340 }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default EvolucionChart;
