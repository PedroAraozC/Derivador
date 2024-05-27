/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import {
  Modal,
  Box,
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { formatearFechaHora } from "../../../../helpers/convertirFecha";
import "../../Educacion/Convocatorias/Convocatorias.css";
import { EducaContext } from "../../../../context/EducaContext";
import axios from "../../../../config/axios";

const ModalTipologia = ({
  tipologia,
  modalAbierto,
  handleClose,
  modoEdicion,
}) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const fileInputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);
  const [formularioValues, setFormularioValues] = useState({
    id: "",
    nombre: "",
    habilita: 0,
  });
  const [datosOld, setDatosOld] = useState("");
  console.log(datosOld);
  const {
    obtenerCategoria,
  } = useContext(EducaContext);
  useEffect(() => {
    const fetchData = async () => {
      try {

        await obtenerTipologia();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modoEdicion]);

  useEffect(() => {
    if (tipologia) {
      // Si hay una convocatoria y el modal está abierto, establece los valores del formulario
      setFormularioValues({
        id: tipologia.id_tipologia,
        nombre: tipologia.nombre_tipologia,
        habilita: tipologia.habilita,
        });
    }
  }, [tipologia]);

  useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const isMobile = deviceWidth <= 600;
  if (!tipologia) {
    return null;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    setFormularioValues({
      ...formularioValues,
      [name]: newValue,
    });
    console.log(formularioValues);
  };

  const handleHabilitarChange = (event) => {
    setFormularioValues({
      ...formularioValues,
      habilita: event.target.checked ? 1 : 0,
    });
  };
  const editarTipologia = async (tipologia) => {
    try {
      tipologia.oldName = datosOld;
      console.log(tipologia);
      const response = await axios.put(
        "/educacion/editarConvocatoria",
        tipologia,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      obtenerTipologia();
      handleClose();
      return response.data;
    } catch (error) {
      console.error("Error al editar la convocatoria:", error);
      throw new Error("Error al editar la convocatoria");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : "1200px", // Ajusta el ancho según el dispositivo
    height: "95%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal open={modalAbierto} onClose={handleClose}>
      <Box sx={style}>
        <div className="d-flex justify-content-around align-items-center mb-3">
          <p style={{ fontSize: "1rem", margin: 0 }}>
            Detalle de la Tipologia: {tipologia.id_tipologia}
          </p>
        </div>
        <Divider />
        <div className="d-flex flex-column justify-content-center">
          {!modoEdicion ? (
            <>
              <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>
                <b>Tipologia:</b> {tipologia.nombre_tipologia}
              </p>
             
              <Button onClick={handleClose} className="mt-3" variant="outlined">
                Cerrar
              </Button>
            </>
          ) : (
            <>
              <form className="d-flex justify-content-around">
                <div className="w-50 d-flex flex-column gap-3 p-2">
                
                  <InputLabel>TIPOLOGIA</InputLabel>
                  <TextField
                    placeholder={`${tipologia.nombre_tipologia}`}
                    onChange={handleInputChange}
                    name="nombre"
                    value={formularioValues.nombre}
                  />
                  <div className="d-flex align-items-center">
                    <p className="m-0">Habilita:</p>
                    <Switch
                      checked={formularioValues.habilita === 1}
                      onChange={handleHabilitarChange}
                      name="habilita"
                    />
                  </div>
                </div>
              </form>

              <Button
                onClick={() => editarTipologia(formularioValues)}
                className="mt-3"
                variant="outlined"
              >
                Guardar cambios
              </Button>
            </>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ModalTipologia;
