/* eslint-disable react/prop-types */
import { Doughnut } from "react-chartjs-2";

const GeneroChart = ({ genero }) => {
  const mujeres = genero?.mujeres?.cantidad || 0;
  const hombres = genero?.hombres?.cantidad || 0;

  const data = {
    labels: ["Mujeres", "Hombres"],
    datasets: [
      {
        data: [mujeres, hombres],
        backgroundColor: ["#ad1457", "#1565c0"],
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
            const total = mujeres + hombres;
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

export default GeneroChart;
