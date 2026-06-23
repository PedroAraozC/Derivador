/* eslint-disable react/prop-types */
import { Doughnut } from "react-chartjs-2";

const DistribucionChart = ({ resumen }) => {
  const empleados = resumen?.empleados?.cantidad || 0;
  const noEmpleados = resumen?.noEmpleados?.cantidad || 0;

  const data = {
    labels: ["Empleados", "No empleados"],
    datasets: [
      {
        data: [empleados, noEmpleados],
        backgroundColor: ["#2e7d32", "#ed6c02"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = empleados + noEmpleados;
            const pct = total > 0 ? Math.round((ctx.parsed / total) * 1000) / 10 : 0;
            return `${ctx.label}: ${ctx.parsed.toLocaleString("es-AR")} (${pct}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div style={{ height: 340 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DistribucionChart;
