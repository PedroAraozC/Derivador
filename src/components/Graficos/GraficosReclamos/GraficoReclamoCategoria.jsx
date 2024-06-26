/* eslint-disable react/prop-types */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./GraficoReclamos.css";
import { Bar } from "react-chartjs-2";
import { formatearFecha } from "../../../helpers/convertirFecha";
import GraficoBarraEsqueleto from "../../Esqueletos/GraficoBarraEsqueleto";
import {coloresCategorias} from '../../../helpers/constantes'
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const getRandomColor = () => `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

const GraficoReclamoCategoria = ({ data }) => {
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Reclamos por Categoría",
      },
    },
  };

  const labels = [
    `${formatearFecha(data.values.desde)} - ${formatearFecha(data.values.hasta)}`,
  ];

  const dataCategoria = {
    labels,
    // eslint-disable-next-line no-unused-vars
    datasets: data.resultSearch[0]?.map((categoria, index) => ({
      label: `${categoria.nombre_categoria}`,
      data: labels.map(() => categoria.cantidad),
      borderColor: coloresCategorias[categoria.nombre_categoria] || getRandomColor(),
      backgroundColor: coloresCategorias[categoria.nombre_categoria] || getRandomColor(),
    })),
  };

  return (
    <>
      {data.resultSearch[0]?.length !== 0 ? (
        <div className="w-100">
          <Bar data={dataCategoria} options={options} />
        </div>
      ) : (
        <GraficoBarraEsqueleto />
      )}
    </>
  );
};

export default GraficoReclamoCategoria;
