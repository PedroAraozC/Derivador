import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";

// Registro de Chart.js (idempotente; necesario si se entra directo a esta ruta)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import axios from "../../config/axios";
import GeneroChart from "./components/GeneroChart";
import RankingChart from "./components/RankingChart";
import "./DashboardSistemas.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BASE = "/estadisticas-externos";

const EstadisticasPersonales = () => {
  const navigate = useNavigate();

  const [genero, setGenero] = useState(null);
  const [localidades, setLocalidades] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [resGenero, resLocalidades] = await Promise.all([
        axios.get(`${BASE}/genero`),
        axios.get(`${BASE}/localidades`, { params: { limit: 10 } }),
      ]);

      setGenero(resGenero.data);
      setLocalidades(
        resLocalidades.data.map((l) => ({
          label: l.nombre_localidad,
          accesos: l.cantidad,
        }))
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "No se pudieron obtener las estadísticas personales."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="dashboard-sistemas">
      {/* ---- Encabezado + acciones (no se imprime) ---- */}
      <Box
        className="no-print"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard-sistemas")}
        >
          Volver al dashboard
        </Button>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handleImprimir}
          disabled={loading || !genero}
        >
          Imprimir
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="no-print" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box
          className="no-print"
          sx={{ display: "flex", justifyContent: "center", py: 8 }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && genero && (
        <div id="dashboard-print">
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              Estadísticas personales del padrón
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de personas registradas: {genero.total?.toLocaleString("es-AR")}
            </Typography>
          </Box>

          <div className="dashboard-grid-charts iguales">
            <Card elevation={3} className="evitar-corte">
              <CardHeader title="Distribución por género" />
              <Divider />
              <CardContent>
                <GeneroChart genero={genero} />
              </CardContent>
            </Card>

            <Card elevation={3} className="evitar-corte">
              <CardHeader title="Localidades con más personas" subheader="Top 10" />
              <Divider />
              <CardContent>
                <RankingChart
                  items={localidades}
                  color="#00897b"
                  etiquetaColumna="Localidad"
                  etiquetaValor="Personas"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstadisticasPersonales;
