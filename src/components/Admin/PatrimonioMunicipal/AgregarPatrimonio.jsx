/* eslint-disable react-hooks/exhaustive-deps */
import { Button, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react";
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from "../../../config/axios";
import { EducaContext } from "../../../context/EducaContext";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const AgregarPatrimonio = () => {
  const [archivo, setArchivo] = useState(null);
  const fileInputRef = useRef(null);
  const [buttonDis, setButtonDis] = useState(false);
  const [errores, setErrores] = useState({});
  const { obtenerCategoria, categoria, obtenerAutor, autor, obtenerEstado, estado, obtenerMaterial, material, obtenerTipologia, tipologia, obtenerUbicacion, ubicacion } = useContext(EducaContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensaje, setSnackbarMensaje] = useState('');
  const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  const [formularioValues, setFormularioValues] = useState({
      nombre_patrimonio: "",
      anio_emplazamiento: "",
      descripcion: "",
      origen: "",
      id_categoria: "",
      id_tipologia: "",
      id_material: "",
      id_estado: "",
      id_autor: "",
      id_ubicacion: "",
      latylon: "",
      habilita: 0, 
  });

    // Función para validar el formulario antes de enviarlo
    const validarFormulario = () => {
      const nuevosErrores = {};
      const regex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d(\.\d+)?|180(\.0+)?|\d{1,2}(\.\d+)?))$/;
      
      if (!formularioValues.nombre_patrimonio || formularioValues.nombre_patrimonio.length > 40) {
        nuevosErrores.nombre_patrimonio = "Ingrese un nombre de máximo 40 caracteres";
        setSnackbarMensaje("Ingrese un nombre del autor/a de máximo 40 caracteres");
      }
      if (!formularioValues.anio_emplazamiento || formularioValues.anio_emplazamiento.length > 4) {
        nuevosErrores.anio_emplazamiento = "Ingrese un año de máximo 4 caracteres";
        setSnackbarMensaje("Ingrese un año de máximo 4 caracteres");
      }
      if (!formularioValues.origen || formularioValues.origen.length > 80) {
        nuevosErrores.origen = "Ingrese un origen de máximo 80 caracteres";
        setSnackbarMensaje("Describa el origen en un máximo de 80 caracteres");
      }
      if (!formularioValues.latylon || !regex.test(formularioValues.latylon)) {
        nuevosErrores.latylon = "Ingrese coordenadas válidas en formato Latitud, Longitud";
        setSnackbarMensaje("Ingrese coordenadas válidas en formato Latitud, Longitud");
    }
  
      setErrores(nuevosErrores);
  
      // Si hay errores, muestra el Snackbar
      if (Object.keys(nuevosErrores).length > 0) {
        setSnackbarOpen(true);
      }
  
      return Object.keys(nuevosErrores).length === 0; // Retorna true si no hay errores
    };


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

    const handleAgregar = async (event, patri) => {
      event.preventDefault();
      const formularioValido = validarFormulario();
      setButtonDis(true)
      if (formularioValido) {
        try {
          patri.archivo = archivo;
          // Realiza la solicitud con formData
          const response = await axios.post("/admin/agregarPatrimonio", patri, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
          setSnackbarMensaje("Patrimonio creado.");
          setSnackbarOpen(true);
          return response.data;
        } catch (error) {
          console.error("Error al agregar el patrimonio:", error);
          setSnackbarMensaje("Error al agregar el patrimonio.");
          setSnackbarOpen(true);
          throw new Error("Error al agregar el patrimonio");
        }
      } else {
        console.log('Algo salió mal :(');
        setSnackbarOpen(true);
        setButtonDis(false)
      }
    };

    const handleFileInputChange = () => {
      const file = fileInputRef.current.files[0];
      setArchivo(file); // Asignar el archivo al estado
    };

    useEffect(() => {
      obtenerCategoria();
      obtenerTipologia();
      obtenerMaterial();
      obtenerEstado();
      obtenerAutor();
      obtenerUbicacion();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const conseguirLatyLon = () =>{
      window.open("https://support.google.com/maps/answer/18539?hl=es&co=GENIE.Platform%3DDesktop", "_blank")
    }

  return (
    <>
        <div className="container mt-3">
            <h3>Agregar Patrimonio</h3>
        </div>
        <div className="container mt-3 mb-3">
            <form className="d-flex gap-5 justify-content-center align-items-center formAgregarcausal" onSubmit={(event) => handleAgregar(event, formularioValues)}>
                <div>
                    <InputLabel sx={{ marginTop: 2}}>NOMBRE PATRIMONIO</InputLabel>
                    <TextField
                        placeholder="Ingrese el nombre del patrimonio..."
                        onChange={handleInputChange}
                        name="nombre_patrimonio"
                        value={formularioValues.nombre_patrimonio}
                        sx={{width: 400,  minHeight: '56px'}}
                        required={true}
                    />
                    <InputLabel sx={{ marginTop: 2}}>AÑO EMPLAZAMIENTO</InputLabel>
                    <TextField
                      placeholder="Ingrese el año de emplazamiento"
                      onChange={handleInputChange}
                      name="anio_emplazamiento"
                      value={formularioValues.anio_emplazamiento}
                      sx={{ width: 400,  minHeight: '56px' }}
                      required={true}
                    />
                    <InputLabel sx={{ marginTop: 2}}>DESCRIPCIÓN</InputLabel>
                    <TextField
                      placeholder="Ingrese una descripción para el patrimonio"
                      onChange={handleInputChange}
                      name="descripcion"
                      value={formularioValues.descripcion}
                      sx={{ width: 400,  minHeight: '56px' }}
                      required={true}
                    />
                    <InputLabel sx={{ marginTop: 2}}>ORIGEN</InputLabel>
                    <TextField
                      placeholder="Ingrese el origen del patrimonio"
                      onChange={handleInputChange}
                      name="origen"
                      value={formularioValues.origen}
                      sx={{ width: 400,  minHeight: '56px' }}
                      required={true}
                    />
                    <div className="d-flex algin-items-center gap-2 mt-3 mb-2">
                      <InputLabel>LATITUD y LONGITUD</InputLabel>
                      <HelpOutlineOutlinedIcon sx={{cursor: 'pointer'}} onClick={conseguirLatyLon}/>
                    </div>
                    <TextField
                      placeholder="Ingrese el valor de las coordenadas"
                      onChange={handleInputChange}
                      name="latylon"
                      value={formularioValues.latylon}
                      sx={{ width: 400,  minHeight: '56px' }}
                      required={true}
                    />
                    <div className="d-flex flex-column">
                    <InputLabel sx={{ marginTop: 2}}>HABILITA</InputLabel>
                    <Switch
                      checked={formularioValues.habilita === 1}
                      onChange={handleHabilitarChange}
                      name="habilita"
                    />
                </div>
                    
                </div>
                <div>
                    <InputLabel sx={{ marginTop: 0}}>TIPO DE CATEGORÍA</InputLabel>
                    <Select
                      value={formularioValues.id_categoria}
                      onChange={handleInputChange}
                      name="id_categoria"
                      sx={{ width: 400}}
                      required={true}
                    >
                      {Array.isArray(categoria) &&
                        categoria.map((e) => (
                          <MenuItem
                            key={e.id_categoria}
                            value={e.id_categoria}
                          >
                            {e.nombre_categoria}
                          </MenuItem>
                        ))}
                    </Select>
                    <InputLabel sx={{ marginTop: 2}}>TIPOLOGÍA</InputLabel>
                    <Select
                      value={formularioValues.id_tipologia}
                      onChange={handleInputChange}
                      name="id_tipologia"
                      sx={{ width: 400}}
                      required={true}
                    >
                      {Array.isArray(tipologia) &&
                        tipologia.map((e) => (
                          <MenuItem
                            key={e.id_tipologia}
                            value={e.id_tipologia}
                          >
                            {e.nombre_tipologia}
                          </MenuItem>
                        ))}
                    </Select>
                    <InputLabel sx={{ marginTop: 2}}>MATERIAL</InputLabel>
                    <Select
                      value={formularioValues.id_material}
                      onChange={handleInputChange}
                      name="id_material"
                      sx={{ width: 400}}
                      required={true}
                    >
                      {Array.isArray(material) &&
                        material.map((e) => (
                          <MenuItem
                            key={e.id_material}
                            value={e.id_material}
                          >
                            {e.nombre_material}
                          </MenuItem>
                        ))}
                    </Select>
                    <InputLabel sx={{ marginTop: 2}}>ESTADO</InputLabel>
                    <Select
                      value={formularioValues.id_estado}
                      onChange={handleInputChange}
                      name="id_estado"
                      sx={{ width: 400}}
                      required={true}
                    >
                      {Array.isArray(estado) &&
                        estado.map((e) => (
                          <MenuItem
                            key={e.id_estado}
                            value={e.id_estado}
                          >
                            {e.nombre_estado}
                          </MenuItem>
                        ))}
                    </Select>
                    <InputLabel sx={{ marginTop: 2}}>AUTOR</InputLabel>
                    <Select
                      value={formularioValues.id_autor}
                      onChange={handleInputChange}
                      name="id_autor"
                      sx={{ width: 400}}
                      required={true}
                    >
                      {Array.isArray(autor) &&
                        autor.map((e) => (
                          <MenuItem
                            key={e.id_autor}
                            value={e.id_autor}
                          >
                            {e.nombre_autor}
                          </MenuItem>
                        ))}
                    </Select>
                    <InputLabel sx={{ marginTop: 2}}>UBICACIÓN</InputLabel>
                    <Select
                      value={formularioValues.id_ubicacion}
                      onChange={handleInputChange}
                      name="id_ubicacion"
                      sx={{ width: 400}}
                      required={true}
                    >
                      {Array.isArray(ubicacion) &&
                        ubicacion.map((e) => (
                          <MenuItem
                            key={e.id_ubicacion}
                            value={e.id_ubicacion}
                          >
                            {e.nombre_ubicacion}
                          </MenuItem>
                        ))}
                    </Select>
                </div>
                <div className="d-flex flex-column">
                <InputLabel sx={{ marginBottom: 4, textAlign: 'center' }}>INGRESE UNA IMAGEN PARA LA CARD (900x600 px)</InputLabel>
                <input
                  type="file"
                  accept=".png, .webp, .jpg"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  required={false}
                  style={{ width: 400, paddingTop: 5, paddingBottom: 30, border: '4px dotted #ccc', padding: '20px' }}
                />
                <TextField
                      placeholder="Ingrese la URL de la imagen para el carrousel #1"
                      onChange={handleInputChange}
                      name="imagen_carrousel_1"
                      value={formularioValues.imagen_carrousel_1}
                      sx={{ width: 400,  minHeight: '56px' }}
                      required={true}
                      className="mt-5"
                    />
                <TextField
                      placeholder="Ingrese la URL de la imagen para el carrousel #2"
                      onChange={handleInputChange}
                      name="imagen_carrousel_2"
                      value={formularioValues.imagen_carrousel_2}
                      sx={{ width: 400,  minHeight: '56px' }}
                      required={true}
                      className="mt-5"
                    />
                <TextField
                      placeholder="Ingrese la URL de la imagen para el carrousel #3"
                      onChange={handleInputChange}
                      name="imagen_carrousel_3"
                      value={formularioValues.imagen_carrousel_3}
                      sx={{ width: 400,  minHeight: '56px' }}
                      required={true}
                      className="mt-5"
                    />
                <Button variant="contained" color="success" type="submit" disabled={buttonDis} className="mt-5">AGREGAR</Button>

              </div>
            </form>
            {errores? (
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                    {snackbarMensaje}
                </Alert>
            </Snackbar>
            ):<></>}
        </div>
    </>
  )
}

export default AgregarPatrimonio