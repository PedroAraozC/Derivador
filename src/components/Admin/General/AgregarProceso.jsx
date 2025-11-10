/* eslint-disable react/prop-types */
import { useState } from "react";
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

const AgregarProceso = ({ option, isModalOpen, setIsModalOpen }) => {
    const [nombreProceso, setNombreProceso] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [habilita, setHabilita] = useState(false);

    const limpiarCampos = () => {
        setNombreProceso("");
        setDescripcion("");
        setHabilita(false);
    };

    const handleClose = () => {
        limpiarCampos();
        setIsModalOpen(false);
    };

    const handleAgregar = async () => {
        const datos = {
            id_opcion: option?.subItems?.[0]?.id_opcion,
            nombre_proceso: nombreProceso.trim(),
            descripcion: descripcion.trim(),
            habilita: habilita ? "1" : "0",
        };

        if (!datos.nombre_proceso || !datos.descripcion) {
            Swal.fire({
                title: "Formulario incompleto",
                text: "Por favor completa todos los campos.",
                icon: "warning",
                confirmButtonText: "Entendido",
            });
            return;
        }

        try {
            const response = await axios.post("/admin/altaProceso", datos);
            console.log(response)
            Swal.fire({
                title: "¡Agregado!",
                text: "El proceso fue agregado correctamente.",
                icon: "success",
                timer: 1500,
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al agregar el proceso:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo agregar el proceso.",
                icon: "error",
            });
        }
    };

    return (
        <>
            <Dialog
                open={isModalOpen}
                onClose={(_, reason) => {
                    // Evita que se cierre al hacer clic fuera o presionar Escape
                    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                        handleClose();
                    }
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Agregar proceso para {option?.nombre_opcion}</DialogTitle>
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
                        onClick={handleAgregar}
                        variant="contained"
                        color="success"
                        sx={{ width: 120 }}
                    >
                        Aceptar
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
        </>
    );
};

export default AgregarProceso;
