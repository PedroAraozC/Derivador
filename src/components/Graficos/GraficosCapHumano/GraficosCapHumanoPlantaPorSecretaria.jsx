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
  // import { getRandomColor } from "../../../helpers/getRandomColor";
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
  
  const GraficosCapHumanoPlantaPorSecretaria = () => {
    const { resultSearch } = useStore();
    const [arrayFiltrado, setArrayFiltrado] = useState([]);
  
    useEffect(() => {
      const newArray = [];
    
      if (resultSearch[0].length > 0) {
        resultSearch[0].forEach((obj) => {
          Object.keys(obj).forEach((key) => {
            if (
              key !== "[[Prototype]]" &&
              key !== "codi_07" &&
              key !== "DETA_07"
            ) {
              const existingItemIndex = newArray.findIndex(
                (item) => item.nombre === key
              );
  
              if (existingItemIndex !== -1) {
                // Si el elemento ya existe, sumar la cantidad
                newArray[existingItemIndex].cantidad += obj[key];
              } else {
                // Si el elemento no existe, agregarlo al array
                newArray.push({ nombre: key, cantidad: obj[key] });
              }
            }
          });
        });
        console.log(newArray);
        
        setArrayFiltrado(newArray.filter(tipo => !tipo.nombre.includes("_") && !tipo.nombre.includes("MUJERES") && !tipo.nombre.includes("VARONES")));
      }
    }, [resultSearch]);
  console.log(arrayFiltrado);
  
    const data = {
      labels: Object.keys(resultSearch[0][0]).filter(
        (rs) => !rs.includes("codi") && !rs.includes("DETA") && !rs.includes("_") && !rs.includes("MUJERES") && !rs.includes("VARONES")
      ),
      datasets: [
        {
          label: "",
          data: arrayFiltrado.map((rs) => rs.cantidad),
          backgroundColor: ["rgba(255, 182, 193, 0.6)", " rgba(0, 72, 255, 0.8)", "rgba(75, 192, 192, 0.6)"],
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
            <div className="d-flex-col w-100 d-sm-none mt-4">
              <div className=" d-flex justify-content-center">
                {/* <p className="me-2">
                  Mujeres:
                  <b className="ms-1">
                    {arrayFiltrado?.length > 0 &&
                    arrayFiltrado[0]?.cantidad == null
                      ? 0
                      : arrayFiltrado[0]?.cantidad}
                  </b>
                </p>
  
                <p className="ms-2">
                  Varones:
                  <b className="ms-2">
                    {arrayFiltrado?.length > 0 &&
                    arrayFiltrado[1]?.cantidad == null
                      ? 0
                      : arrayFiltrado[1]?.cantidad}
                  </b>
                </p> */}
                <p className="me-2">
                  Planta:
                  <b className="ms-1">
                    {arrayFiltrado?.length > 0 &&
                      arrayFiltrado[0]?.cantidad == null
                      ? 0
                      : arrayFiltrado[0]?.cantidad}
                  </b>
                </p>
  
                <p className="ms-2">
                  Contratos:
                  <b className="ms-2">
                    {arrayFiltrado?.length > 0 &&
                      arrayFiltrado[1]?.cantidad == null
                      ? 0
                      : arrayFiltrado[1]?.cantidad}
                  </b>
                </p>
  
                <p className="ms-2">
                  Funcionarios:
                  <b className="ms-2">
                    {arrayFiltrado?.length > 0 &&
                      arrayFiltrado[2]?.cantidad == null
                      ? 0
                      : arrayFiltrado[2]?.cantidad}
                  </b>
                </p>
              </div>
              <div className="d-flex justify-content-center">
              <p>
                  Total:
                  <b className="ms-2">
                    {arrayFiltrado?.length > 0 &&
                    arrayFiltrado[1]?.cantidad == 0
                      ? 0
                      : arrayFiltrado[2]?.cantidad + arrayFiltrado[1]?.cantidad + arrayFiltrado[0]?.cantidad}
                  </b>
                </p>
              </div>
              <Pie data={data} options={options} />
            </div>
            {/* se repite el div por el tema del width */}
            <div className="container d-flex-col w-50 d-none d-sm-block">
             
            <div className=" d-flex justify-content-center">
                {/* <p className="me-2">
                  Mujeres:
                  <b className="ms-1">
                    {arrayFiltrado?.length > 0 &&
                    arrayFiltrado[0]?.cantidad == null
                      ? 0
                      : arrayFiltrado[0]?.cantidad}
                  </b>
                </p>
  
                <p className="ms-2">
                  Varones:
                  <b className="ms-2">
                    {arrayFiltrado?.length > 0 &&
                    arrayFiltrado[1]?.cantidad == null
                      ? 0
                      : arrayFiltrado[1]?.cantidad}
                  </b>
                </p> */}
                <p className="me-2">
                  Planta:
                  <b className="ms-1">
                    {arrayFiltrado?.length > 0 &&
                      arrayFiltrado[0]?.cantidad == null
                      ? 0
                      : arrayFiltrado[0]?.cantidad}
                  </b>
                </p>
  
                <p className="ms-2">
                  Contratos:
                  <b className="ms-2">
                    {arrayFiltrado?.length > 0 &&
                      arrayFiltrado[1]?.cantidad == null
                      ? 0
                      : arrayFiltrado[1]?.cantidad}
                  </b>
                </p>
  
                <p className="ms-2">
                  Funcionarios:
                  <b className="ms-2">
                    {arrayFiltrado?.length > 0 &&
                      arrayFiltrado[2]?.cantidad == null
                      ? 0
                      : arrayFiltrado[2]?.cantidad}
                  </b>
                </p>
              </div>
              <div className="d-flex justify-content-center">
              <p>
                  Total:
                  <b className="ms-2">
                    {arrayFiltrado?.length > 0 &&
                    arrayFiltrado[1]?.cantidad == 0
                      ? 0
                      : arrayFiltrado[2]?.cantidad + arrayFiltrado[1]?.cantidad + arrayFiltrado[0]?.cantidad}
                  </b>
                </p>
              </div>
             <div className="container">
  
              <Pie data={data} options={options} />
             </div>
            </div>
          </>
        ) : (
          <GraficoPieEsqueleto />
        )}
      </>
    );
  };
  
  export default GraficosCapHumanoPlantaPorSecretaria;
  