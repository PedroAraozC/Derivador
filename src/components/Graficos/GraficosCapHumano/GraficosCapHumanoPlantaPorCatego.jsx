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
  import { coloresCategoriasMun } from "../../../helpers/constantes";
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
    const [categorias, setCategorias] = useState([]);
  
    useEffect(() => {
     console.log(resultSearch);

     let sumatoriaPorCodi10 = {};

// Itera sobre cada objeto y realiza la sumatoria
resultSearch[0].forEach(objeto => {
  const codi10 = objeto.CODI_10;
  const valor = objeto[""];

  // Si ya hay una entrada para este CODI_10, suma el valor
  if (sumatoriaPorCodi10[codi10]) {
    sumatoriaPorCodi10[codi10] += valor;
  } else {
    // Si no hay una entrada, crea una nueva
    sumatoriaPorCodi10[codi10] = valor;
  }
});

sumatoriaPorCodi10[18] += (sumatoriaPorCodi10[15] || 0) + (sumatoriaPorCodi10[16] || 0) + (sumatoriaPorCodi10[17] || 0);

// Elimina las entradas de 15, 16 y 17
delete sumatoriaPorCodi10[15];
delete sumatoriaPorCodi10[16];
delete sumatoriaPorCodi10[17];

for (let clave in sumatoriaPorCodi10) {
  if (parseInt(clave) >= 50) {
    delete sumatoriaPorCodi10[clave];
  }
}

setCategorias(sumatoriaPorCodi10)
console.log("Valores actualizados:", sumatoriaPorCodi10);
    }, [resultSearch]);
  
    const data = {
      labels: Object.keys(categorias),
      datasets: [
        {
          label: "",
          data: Object.values(categorias),
          backgroundColor: Object.keys(categorias).map((cat) => coloresCategoriasMun[cat]),
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
      <>
        <div className="d-flex-col w-100 d-sm-none">
          <div className=" d-flex justify-content-center">
            {
              Object.entries(categorias).map(([propiedad, valor], index) => ( 
              <div key={index}>
               <p className="me-3"> {propiedad}: {valor} </p>
              </div>
            ))
            }
           
           
          </div>
          <Pie data={data} options={options} />
        </div>
        {/* se repite el div por el tema del width */}
        <div className="d-flex-col w-50 d-none d-sm-block">
          <div className=" d-flex justify-content-center">
            {
              Object.entries(categorias).map(([propiedad, valor], index) => ( 
              <div key={index}>
              <p className="me-3"> {propiedad}: {valor} </p>
              </div>
            ))
            }
           
           
          </div>
          <Pie data={data} options={options} />
        </div>
      </>
    ) : (
      <GraficoPieEsqueleto />
    )}
  </>
  )
}

export default GraficosCapHumanoPlantaPorCatego