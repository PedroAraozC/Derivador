/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
import { Bar, Pie } from "react-chartjs-2";
import { formatearFecha } from "../../../helpers/convertirFecha";
import { coloresEstadosReclamos } from "../../../helpers/constantes";
import GraficoBarraEsqueleto from "../../Esqueletos/GraficoBarraEsqueleto";
import GraficoPieEsqueleto from "../../Esqueletos/GraficoPieEsqueleto";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const GraficoReclamoCategoriaYEstado = ({ data }) => {
  const [categorias, setCategorias] = useState([]);

  const [categoriaSelected, setCategoriaSelected] = useState(null);
  const [copiaResultSearch] = useState(data.resultSearch[0])


  // INICIO trabajar array
  function tieneEstadoFinalizado(categoria, array) {
    return array.some(objeto => objeto.id_categoria === categoria.id_categoria && objeto.estado === 4);
}

// Obtenemos todas las categorías únicas
const categoriasUnicas = [...new Set(data.resultSearch[0].map(objeto => objeto.id_categoria))];

// Creamos un nuevo array con las categorías y sus estados actualizados
const arrayActualizado = categoriasUnicas.flatMap(id_categoria => {
    const categoria = data.resultSearch[0].find(objeto => objeto.id_categoria === id_categoria);
    if (!tieneEstadoFinalizado(categoria, data.resultSearch[0])) {
        return [
            ...data.resultSearch[0].filter(objeto => objeto.id_categoria === id_categoria),
            {
                id_categoria: categoria.id_categoria,
                nombre_categoria: categoria.nombre_categoria,
                estado: 4,
                descripcion: 'FINALIZADO',
                cantidad: 0
            }
        ];
    }
    return data.resultSearch[0].filter(objeto => objeto.id_categoria === id_categoria);
});
// FIN trabajar array

  useEffect(() => {
    const categoriasSP = copiaResultSearch.map(
      (cat) => cat.nombre_categoria
    );
    const categoriasSinRepetidos = [...new Set(categoriasSP)];
    setCategorias(categoriasSinRepetidos);

  }, []);  

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: `${formatearFecha(data.values.desde)} - ${formatearFecha(
          data.values.hasta
        )}`,
      },
    },
  };

  const dataPorCategoriasYestados = {
    labels: copiaResultSearch
      .filter((elemento) => elemento.nombre_categoria === categoriaSelected)
      .map((elemento) => elemento.descripcion),
    datasets: [
      {
        label: "Cantidad de Reclamos por Categoria",
        data: copiaResultSearch
          ?.filter((cat) => cat.nombre_categoria == categoriaSelected)
          .map((elemento) => elemento.cantidad),
        backgroundColor: data.resultSearch[0]?.map((elemento)=>coloresEstadosReclamos[elemento.descripcion]),
      },
    ],
  };

  const datasets = [
    {
      label: "INICIADO",
      data: arrayActualizado
        ?.filter((e) => e.descripcion == "INICIADO")
        .map((cat) => cat.cantidad),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
    {
      label: "FINALIZADO",
      data: arrayActualizado
        ?.filter((e) => e.descripcion == "FINALIZADO")
        .map((cat) => cat.cantidad),
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
    // Puedes añadir más datasets según los estados que quieras mostrar
  ];

  const chartData = { labels: categorias, datasets };

  useEffect(() => {
  if(data.resultSearch[0].length > 5){
    setCategoriaSelected(null)
  }else{

    setCategoriaSelected(data.resultSearch[0][0].nombre_categoria)
  }
  }, [data.resultSearch])
  
  return (
    <div className="d-flex  flex-column container">

      {categoriaSelected != null ? (
        <>
          {categoriaSelected != null ? (
            <div className="LayoutHeight2 d-flex justify-content-center w-100 ">
              <Pie data={dataPorCategoriasYestados} options={options} />
            </div>
          ) : (
            <GraficoPieEsqueleto />
          )}
        </>
      ) : (
        <>
          {categorias.length !== 0 ? (
            <div className="LayoutHeight2 w-100 ">
              <Bar data={chartData} options={options} />
            </div>
          ) : (
            <GraficoBarraEsqueleto />
          )}
        </>
      )}
    </div>
  );
};

export default GraficoReclamoCategoriaYEstado;