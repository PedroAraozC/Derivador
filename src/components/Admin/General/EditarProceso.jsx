/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Box,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "../../../config/axios";

const EditarProceso = ({ option, isModalOpen, setIsModalOpen }) => {
    const [nombreProceso, setNombreProceso] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [habilita, setHabilita] = useState(false);
    const [sistemaExterno, setSistemaExterno] = useState(""); // Nuevo campo
    
    // ✅ Cargar valores iniciales si llega un proceso seleccionado
    useEffect(() => {
        if (option) {
            setNombreProceso(option.nombre_proceso || "");
            setDescripcion(option.descripcion || "");
            setHabilita(option.habilita === "1" || option.habilita === 1);
            setSistemaExterno(option.sistema_externo || "");
        }
    }, [option]);

    const limpiarCampos = () => {
        setNombreProceso("");
        setDescripcion("");
        setHabilita(false);
        setSistemaExterno("");
    };

    const handleClose = () => {
        limpiarCampos();
        setIsModalOpen(false);
    };

    const handleGuardar = async () => {
        const datos = {
            id_proceso: option?.id_proceso,
            nombre_proceso: nombreProceso.trim(),
            descripcion: descripcion.trim(),
            habilita: habilita ? "1" : "0",
            sistema_externo: sistemaExterno.trim(),
        };

        if (!datos.nombre_proceso || !datos.descripcion) {
            Swal.fire({
                title: "Formulario incompleto",
                text: "Por favor completa todos los campos obligatorios.",
                icon: "warning",
                confirmButtonText: "Entendido",
            });
            return;
        }

        try {
            const response = await axios.post("/admin/editarProceso", datos);
            console.log(response);
            Swal.fire({
                title: "¡Actualizado!",
                text: "El proceso fue editado correctamente.",
                icon: "success",
                timer: 1500,
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al editar el proceso:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar el proceso.",
                icon: "error",
            });
        }
    };

    return (
        <Dialog
            open={isModalOpen}
            onClose={(_, reason) => {
                if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                    handleClose();
                }
            }}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Editar proceso: {option?.nombre_proceso}</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Nombre del proceso"
                        variant="outlined"
                        fullWidth
                        value={nombreProceso}
                        onChange={(e) => setNombreProceso(e.target.value)}
                        required
                    />
                    <TextField
                        label="Descripción"
                        variant="outlined"
                        fullWidth
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                    {/* 🆕 Campo sistema externo */}
                    <TextField
                        label="Sistema externo"
                        placeholder="Tu URL aquí"
                        variant="outlined"
                        fullWidth
                        value={sistemaExterno}
                        onChange={(e) => setSistemaExterno(e.target.value)}
                        inputProps={{ maxLength: 150 }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={habilita}
                                onChange={(e) => setHabilita(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Habilitado"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", p: 2 }}>
                <Button
                    onClick={handleGuardar}
                    variant="contained"
                    color="success"
                    sx={{ width: 120 }}
                >
                    Guardar
                </Button>
                <Button
                    onClick={handleClose}
                    variant="contained"
                    color="error"
                    sx={{ width: 120 }}
                >
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditarProceso;
