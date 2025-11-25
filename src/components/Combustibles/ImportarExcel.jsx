import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  Stack,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import logo2 from "../../assets/Logo_SMT_neg_4.png"; // ajustá según tu ruta
import axios from "../../config/axios";

const CargarExcel = () => {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!archivo) {
      setError("Debe seleccionar un archivo .xlsx");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const res = await axios.post("/combustibles/importarExcel", formData);
      setMensaje(res.data.message);
      setArchivo(null);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al subir el archivo");
    }
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.endsWith(".xlsx")) {
      setError("El archivo debe tener extensión .xlsx");
      setArchivo(null);
    } else {
      setArchivo(file);
      setError("");
    }
  };

  return (
    <>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }} elevation={3}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Typography variant="subtitle1">Seleccioná un archivo Excel (.xlsx):</Typography>

              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
              >
                Elegir archivo
                <input type="file" hidden accept=".xlsx" onChange={handleArchivoChange} />
              </Button>

              {archivo && (
                <Typography variant="body2" color="text.secondary">
                  Archivo seleccionado: {archivo.name}
                </Typography>
              )}

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Cargar archivo Excel
              </Button>

              {mensaje && <Alert severity="success">{mensaje}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default CargarExcel;
