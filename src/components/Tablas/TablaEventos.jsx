import { React, useContext } from "react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { Button, Modal, Table } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaEye} from "react-icons/fa";
import "./TablaEventos.css";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { COMContext } from "../../context/COMContext";

const TablaEventos = ({ headings, items,  setSelected, selected,getReportes,user}) => {
  const navigate = useNavigate();
  // const [paginacion, setPaginacion] = useState(1);
  const {paginacion,setPaginacion} = useContext(COMContext);
  const itemPag = 10;
  const indexUltimoItem = paginacion * itemPag;
  const indexPrimerItem = indexUltimoItem - itemPag;
  const currentItems = items.slice(indexPrimerItem, indexUltimoItem);
  const totalPages = Math.ceil(items.length / itemPag);

  const [modalDelete, setModalDelete] = useState(false);

  const setReportDelete = (id)=>{
    setModalDelete(true);
    setSelected(id);
  }

  // const despacharReporte = (reporte)=>{
  //   const props = { reporte: reporte };
  //   navigate("/despachar", { state: props });
  // }

  // const verEditarDespacho = (despacho)=>{
  //   const props = { despacho: despacho };
  //   navigate("/editarDespacho", { state: props });
  // }

  const handleNextPage = () => {
    setPaginacion((prevPag) => prevPag + 1);
  };

  const handlePreviousPage = () => {
    setPaginacion((prevPag) => prevPag - 1);
  };

  const handleRemove = async () => {
    try {
      await axios.delete("/reportes/", { data: { id: selected } });
      toast.info("Reporte borrado con éxito");
      getReportes();
      setModalDelete(false);
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
    }
  };

  const verDetalle = (reporte) => {
    const props = { reporte: reporte };
    navigate("/detalleEvento", { state: props });
  };

  function convertirFechaConHora(fecha) {
    const diasSemana = {
      Domingo: "Sun",
      Lunes: "Mon",
      Martes: "Tue",
      Miércoles: "Wed",
      Jueves: "Thu",
      Viernes: "Fri",
      Sábado: "Sat",
    };
  
    const meses = {
      Ene: "01",
      Feb: "02",
      Mar: "03",
      Abr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Ago: "08",
      Sept: "09",
      Oct: "10",
      Nov: "11",
      Dic: "12",
    };
  
    const [, diaSemana, dia, mes, anio, hora, minutos, segundos] = fecha.match(/(\w+) (\d+) De (\w+) De (\d+), (\d+):(\d+):(\d+)/);
    
    // const diaSemanaAbreviado = diasSemana[diaSemana];
    const mesNumerico = meses[mes];
    const diaConCeros = String(dia).padStart(2, '0');
    const horaConCeros = String(hora).padStart(2, '0');
    const minutosConCeros = String(minutos).padStart(2, '0');
    const segundosConCeros = String(segundos).padStart(2, '0');

    if (user.tipoDeUsuario == "estadística") {
      return `${diaConCeros}-${mesNumerico}-${anio} ${horaConCeros}:${minutosConCeros}:${segundosConCeros}`;

    } else return `${diaConCeros}/${mesNumerico}/${anio}`;

    }

  return (
    <>
      {/* <Modal
            className="modal-borrarUsuario"
            show={modalDelete}
            onHide={() => setModalDelete(false)}
            backdrop="static"
            centered
          >
            <div className="fondoModal">
              <Modal.Header closeButton>
                <h4>Borrar Reporte</h4>
              </Modal.Header>
              <div className="mensajeConfirmacion">
                Seguro que quieres borrar este Reporte?
              </div>
              <Button
                className="btn-BorrarUsuario"
                variant="danger"
                onClick={handleRemove}
              >
                Confirmar
              </Button>
            </div>
          </Modal> */}
      <MDBTable responsive>
        <MDBTableHead className="colorTabla">
          <tr>
            {headings.map((heading) => (
              <th key={nanoid()}>{heading}</th>
            ))}
          </tr>
        </MDBTableHead>
        <MDBTableBody className="colorTabla">
          {currentItems.length !== 0 &&
            currentItems.map((item) => (
              <tr key={item._id} >
                <td>
                  {/* {item.numero} */}
                  </td>
                <td>
                  {/* {convertirFechaConHora(item.fecha)} */}
                  </td>
                <td>
                  {/* {item.detalle.length < 60? item.detalle :  item.detalle.slice(0, 60) + "..."} */}
                  </td>
                <td>
                  {/* {item.usuario.nombreUsuario} */}
                  </td>
                <td>
                  {/* {item.dispositivo.nombre.toUpperCase()} */}
                  </td>
                <td>
                  {/* {item.categoria.nombre} */}
                  </td>
                {/* <td>{item.subcategoria?.nombre}</td> */}
                <td>
                  {/* {item.despacho == null && (user.tipoDeUsuario=="admin" || user.tipoDeUsuario=="supervisor")? 
                
                <FontAwesomeIcon onClick={()=>despacharReporte(item)} className="botonDespacho" icon={faXmark} />
             
                : item.despacho !== null && (user.tipoDeUsuario=="admin" || user.tipoDeUsuario=="supervisor")?
                <FontAwesomeIcon onClick={()=>verEditarDespacho(item.despacho)} className="botonDespacho" icon={faCheck} />
                : item.despacho == null ?
                <FontAwesomeIcon className="botonDespachoDisable" icon={faXmark} />
                :
                <FontAwesomeIcon onClick={()=>verEditarDespacho(item.despacho)} className="botonDespacho" icon={faCheck} />
                  }  */}
                  
                  <FaEye
                    onClick={() => verDetalle(item)}
                    className="botonVer"
                  />
                  {/* {user.tipoDeUsuario=="admin" || user.tipoDeUsuario=="supervisor" ?
                  <FaTrashAlt
                    onClick={() => setReportDelete(item._id)}
                    className="botonEliminar"
                  />
                  :<></>
                  } */}
                </td>
              </tr>
            ))}
        </MDBTableBody>
      </MDBTable>

      <div className="paginacionCont">
        <Button
          className="paginacionBtnPrev"
          disabled={paginacion === 1}
          onClick={handlePreviousPage}
        >
          Anterior
        </Button>
        <div className="paginacionText">
          Página {paginacion} de {totalPages}
        </div>
        <Button
          className="paginacionBtnNext"
          disabled={paginacion === totalPages}
          onClick={handleNextPage}
        >
          Siguiente
        </Button>
      </div>
    </>
  );
};

export default TablaEventos;
