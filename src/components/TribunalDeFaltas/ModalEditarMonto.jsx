/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Modal, Box, Button, Divider, InputLabel, Switch, TextField, Snackbar, Alert, Select, MenuItem } from "@mui/material";
import useStore from "../../Zustand/Zustand";
import axios from "../../config/axios";

const ModalEditarCalle = ({ modalEditarAbierto, handleClose,calleSeleccionada, setCalles,setCalleSeleccionada, callesTipo, getCalles }) => {

    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const [errores, setErrores] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    // const [instituciones, setInstituciones] = useState(false);
    // const [reparticiones, setReparticiones] = useState(false);
    const [snackbarMensaje, setSnackbarMensaje] = useState('');
    const { user } = useStore();
    const [formularioValues, setFormularioValues] = useState({
      calle:"",idcalletipo:"", estado:"",idcalle:""
    });

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (calleSeleccionada) {
            setFormularioValues({
              idcalletipo: calleSeleccionada.idTipoMonto,
              estado: calleSeleccionada.estado,
              calle: Number(calleSeleccionada.precio),
            });
        }

    }, [calleSeleccionada]);


    // Función para validar el formulario antes de enviarlo
    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formularioValues.calle || formularioValues.calle.length > 60 || formularioValues.calle == "") {
            nuevosErrores.calle = "Ingrese un nombre de máximo 30 caracteres";
            setSnackbarMensaje("Ingrese un nombre de máximo 30 caracteres");
        }
        if (!formularioValues.idcalletipo) {
            nuevosErrores.idcalletipo = "No seleccionaste un tipo de Calle";
            setSnackbarMensaje("No seleccionaste un tipo de Calle");
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
  
    };

    const handleHabilitarChange = (event) => {
        setFormularioValues({
            ...formularioValues,
            estado: event.target.checked ? 1 : 0,
        });
    };

    const [botonState, setBotonState] = useState(false)
    const editarCalle = async (formularioValues) => {
        setBotonState(true)
        const formularioValido = validarFormulario();
        let datos = {
            ...formularioValues,
            usrmod: user?.id_persona,
            idcalle:calleSeleccionada.idcalle
        }
        let obj= {
            precio:formularioValues.calle, idTipoMonto:formularioValues.idcalletipo, idMonto:calleSeleccionada.idMonto, estado:formularioValues.estado
        }
        if (formularioValido) {
            try {
                const response = await axios.patch("/usuarios/editarMonto", obj);
                setSnackbarMensaje('Editado exitoso')
                setSnackbarOpen(true)
                getCalles()
                setTimeout(()=>{
                    cerrarModal();
                },3000)
                
            } catch (error) {
                console.error("Error al editar la Calle:", error);
                throw new Error("Error al editar la Calle");
            }
        } else {
            setBotonState(false)
            console.log('Algo salio mal :(')
            setSnackbarOpen(true);
        }
        
    };

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
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90%" : "900px",
        bgcolor: "background.paper",
        border: "none",
        borderRadius: "8px",
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const cerrarModal =()=>{
        handleClose();
        setCalleSeleccionada(false)
        handleSnackbarClose()
        setBotonState(false)
    }

    return (
        <Modal open={modalEditarAbierto} onClose={cerrarModal}>
            <Box sx={style}>
                <div className="d-flex justify-content-around align-items-center mb-3">
                    <p style={{ fontSize: "1rem", margin: 0 }}>
                        Editar Monto {calleSeleccionada?.Oficina}
                    </p>
                </div>
                <Divider />
                <div className="d-flex flex-column justify-content-center">
                    <form className="d-flex justify-content-around flex-column">
                        <div className="w-50 d-flex flex-column gap-3 p-2">
                            <InputLabel>Precio</InputLabel>
                            <TextField
                                placeholder='Ej: 5500'
                                onChange={(e) => {
                                    // Filtra solo los caracteres numéricos
                                    const numericValue = e.target.value.replace(/\D/g, "");
                    
                                    // Actualiza el estado solo si la entrada es numérica
                                    handleInputChange({
                                      target: {
                                        name: "calle",
                                        value: numericValue,
                                      },
                                    });
                                  }}
                                name="calle"
                                sx={{ width: 400 }}
                                value={formularioValues.calle}
                            />
                        </div>
                        <div className="w-50 d-flex flex-column gap-3 p-2">
                            <InputLabel>Concepto</InputLabel>
                            <Select
                                value={formularioValues.idcalletipo}
                                onChange={handleInputChange}
                                name="idcalletipo"
                                sx={{ width: 400 }}
                                required={true}
                            >
                                {Array.isArray(callesTipo) &&
                                    callesTipo.map((e) => (
                                        <MenuItem
                                            key={e.idTipoMonto}
                                            value={e.idTipoMonto}
                                        >
                                            {e.monto_det}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </div>
           
                        <div className="d-flex flex-column gap-3 w-50 p-2">
                            <div className="d-flex align-items-center">
                                <p className="m-0">Habilitar:</p>
                                <Switch
                                    checked={formularioValues.estado === 1}
                                    onChange={handleHabilitarChange}
                                    name="estado"
                                />
                            </div>
                        </div>
                    </form>
                    <div>
                        <Button
                            onClick={() => editarCalle(formularioValues)}
                            className="mt-3"
                            variant="outlined"
                            disabled={botonState}
                        >
                            Editar
                        </Button>
                    </div>
                </div>
                {errores ? (
                    <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                        <Alert onClose={handleSnackbarClose} severity="info" elevation={6} variant="filled">
                            {snackbarMensaje}
                        </Alert>
                    </Snackbar>
                ) : <></>}
            </Box>
        </Modal>
    )
}

export default ModalEditarCalle;