import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../config/axios";
import { Button } from "@mui/material";

const Licitacion = () => {
  const { id } = useParams();
  const [contratacion, setContratacion] = useState(null);

  const traerContratacion = async (id) => {
    try {
      const response = await axios.get(`/admin/listarContratacionPorId/${id}`);
      setContratacion(response.data.contratacion[0]);
    } catch (error) {
      console.error("No se encontró la contratación", error);
      throw new Error("No se encontró la contratación");
    }
  };

  const abrirArchivo = () => {
    //CAMBIAR LA RUTA
    window.location.href = '../../../public/CONTRATACION_1367-SSP-2024_EXPTE_125046-40086-2024.pdf';
  }
  

//--------FORMATEO LAS FECHAS ----------------------
  const fechaTexto = contratacion?.fecha_presentacion;
  const fechaTexto2 = contratacion?.fecha_apertura;
  const fecha = new Date(fechaTexto);
  const fecha2 = new Date(fechaTexto2);
  const año = fecha.getFullYear();
  const mes = ('0' + (fecha.getMonth() + 1)).slice(-2); 
  const día = ('0' + fecha.getDate()).slice(-2); 
  const año2 = fecha2.getFullYear();
  const mes2 = ('0' + (fecha2.getMonth() + 1)).slice(-2); 
  const día2 = ('0' + fecha2.getDate()).slice(-2); 
  const fechaFormateada = `${día}-${mes}-${año}`;
  const fechaFormateada2 = `${día2}-${mes2}-${año2}`;
//--------FORMATEO LAS FECHAS ----------------------
  
  useEffect(() => {
    traerContratacion(id);
  }, [id]);

  return (
    <div className="container d-flex mt-5 mb-5 flex-column gap-2">
      {contratacion && (
        <>
          <h2 className="mb-5">{contratacion.nombre_contratacion}</h2>
          <p className="mt-5">{contratacion.detalle}</p>
          <p><b>Expendiente N°: </b>{contratacion.expte}</p>
          <p><b>Resolución N°: </b>{contratacion.num_instrumento}</p>
          <p><b>Valor del Pliego de Bases y Condiciones: </b>$ {contratacion.valor_pliego} (PESOS)</p>
          <p><b>Lugar de Apertura: </b>{contratacion.lugar_apertura}</p>
          <p><b>Plazo de Presentación de las Ofertas: </b>{fechaFormateada} - HORAS {contratacion.hora_presentacion}</p>
          <p><b>Fecha de Apertura y Hora: </b>{fechaFormateada2} - HORAS {contratacion.hora_apertura}</p>
          <Button className="mt-5" variant="outlined" onClick={abrirArchivo}>DESCARGAR PLIEGO</Button>
        </>
      )}
      </div>
  );
};

export default Licitacion;
