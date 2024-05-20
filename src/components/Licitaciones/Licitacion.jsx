import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../config/axios";
import { Button } from "@mui/material";

const Licitacion = () => {
  const { id } = useParams();
  const [contratacion, setContratacion] = useState(null);
  const navigate = useNavigate()

  const traerContratacion = async (id) => {
    try {
      const response = await axios.get(`/admin/listarContratacionPorId/${id}`);
      setContratacion(response.data.contratacion[0]);
    } catch (error) {
      console.error("No se encontró la contratación", error);
      throw new Error("No se encontró la contratación");
    }
  };

    const urlPliego = `https://atencionciudadana.smt.gob.ar/PDF-Convocatorias/${contratacion?.nombre_archivo}`;
    const urlAnexo = `https://atencionciudadana.smt.gob.ar/PDF-Convocatorias/${contratacion?.nombre_anexo}`;
  
  const handleVolver = () =>{
    navigate(-1)
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

  let precio
  if(contratacion?.valor_pliego == '0.00'){
    precio = 'SIN COSTO'
  }else {
    precio = `$ ${contratacion?.valor_pliego} (PESOS)`;
  }

  return (
    <div className="container d-flex mt-5 mb-5 flex-column gap-2">
      <div className="mb-3">
        <Button variant="contained" onClick={handleVolver}>VOLVER</Button>
      </div>
      {contratacion && (
        <>
          <h2 className="mb-5">{contratacion.nombre_contratacion}</h2>
          <p className="mt-5">{contratacion.detalle}</p>
          <p><b>Expendiente N°: </b>{contratacion.expte}</p>
          <p><b>Resolución N°: </b>{contratacion.num_instrumento}</p>
          <p><b>Valor del Pliego de Bases y Condiciones: </b> {precio}</p>
          <p><b>Lugar de Apertura: </b>{contratacion.lugar_apertura}</p>
          <p><b>Plazo de Presentación de las Ofertas: </b>{fechaFormateada} - HORAS {contratacion.hora_presentacion}</p>
          <p><b>Fecha de Apertura y Hora: </b>{fechaFormateada2} - HORAS {contratacion.hora_apertura}</p>
          {/* <Button className="mt-5" variant="outlined" onClick={()=>abrirArchivo(contratacion.nombre_archivo)}>DESCARGAR PLIEGO</Button> */}
          <a href={urlPliego} target="_blank" rel="noreferrer" className="btn">DESCARGAR PLIEGO</a>
          {contratacion.nombre_anexo == '' &&
          // <Button className="mt-5" variant="outlined" onClick={()=>abrirArchivo(contratacion.nombre_anexo)}>DESCARGAR ANEXO</Button>
          <a href={urlAnexo} target="_blank" rel="noreferrer">DESCARGAR ANEXO</a>
          }
        </>
      )}
      </div>
  );
};

export default Licitacion;
