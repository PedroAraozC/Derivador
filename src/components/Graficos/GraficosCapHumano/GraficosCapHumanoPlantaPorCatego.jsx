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
  import { Pie } from "react-chartjs-2";
  import { useEffect, useState } from "react";
  import { getRandomColor } from "../../../helpers/getRandomColor";
  import useStore from "../../../Zustand/Zustand";
  import GraficoPieEsqueleto from "../../Esqueletos/GraficoPieEsqueleto";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );

const GraficosCapHumanoPlantaPorCatego = () => {
    const { resultSearch } = useStore();
    const [arrayFiltrado, setArrayFiltrado] = useState([]);
  
    useEffect(() => {
   
    }, [resultSearch]);
  
    const data = {
      labels:  [...new Set(resultSearch.map(objeto => objeto.CODI_10))],
      datasets: [
        {
          label: "",
          data: arrayFiltrado.map((rs) => rs.cantidad),
          backgroundColor: getRandomColor(),
          hoverOffset: 4,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
        },
      },
    };
  
  return (
    <>
    {resultSearch[0].length != 0 ? (
      <Pie data={data} options={options} />
    ) : (
      <GraficoPieEsqueleto />
    )}
  </>
  )
}

export default GraficosCapHumanoPlantaPorCatego