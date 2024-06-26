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
  import { coloresCategoriasFun } from "../../../helpers/constantes";
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


const GraficosCapHumanoFuncionarios = () => {
    const { resultSearch } = useStore();
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
      let sumatoriaPorCodi10 = {};

      // Itera sobre cada objeto y realiza la sumatoria
      resultSearch[0].forEach((objeto) => {
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

      for (let clave in sumatoriaPorCodi10) {
        if (parseInt(clave) < 50) {
          delete sumatoriaPorCodi10[clave];
        }
      }

      setCategorias(sumatoriaPorCodi10);
    }, [resultSearch]);
  
    const data = {
      labels: Object.keys(categorias),
      datasets: [
        {
          label: "",
          data: Object.values(categorias),
          backgroundColor: Object.keys(categorias).map((cat) => coloresCategoriasFun[cat]),
          hoverOffset: 4,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Configuración para ocultar los labels
          position: "top"
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
          <p className="text-center"><b>Total por Categoría</b></p>
          <div className="d-flex justify-content-center flex-wrap">
            {
              Object.entries(categorias).map(([propiedad, valor], index) => ( 
              <div key={index}>
               <p style={{"background-color":`${coloresCategoriasFun[propiedad]}`,"color":"white","border-radius":"5px"}} className="me-3 px-1"> {propiedad}: {isNaN(valor)? 0 : valor} </p>
              </div>
            ))
            }
           
          </div>
          <Pie data={data} options={options} />
        </div>
        {/* se repite el div por el tema del width */}
        <div className="d-flex-col w-50 d-none d-sm-block">
          <p className="text-center"><b>Total por Categoría</b></p>
          <div className="d-flex justify-content-center flex-wrap">
            {
              Object.entries(categorias).map(([propiedad, valor], index) => ( 
              <div key={index}>
              <p style={{"background-color":`${coloresCategoriasFun[propiedad]}`,"color":"white","border-radius":"5px"}} className="me-2 px-1">{propiedad}: {isNaN(valor)? 0 : valor} </p>
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

export default GraficosCapHumanoFuncionarios