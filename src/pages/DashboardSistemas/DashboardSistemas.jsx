import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useNavigate } from "react-router-dom";

// Registro de Chart.js (una sola vez para toda la página)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import axios from "../../config/axios";
import KpiCards from "./components/KpiCards";
import EvolucionChart from "./components/EvolucionChart";
import DistribucionChart from "./components/DistribucionChart";
import RankingChart from "./components/RankingChart";
import "./DashboardSistemas.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BASE = "/estadisticas-externos";

// Devuelve YYYY-MM-DD respetando la fecha local (sin desfase de zona horaria).
const toInputDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Rango por defecto: mes en curso.
const hoy = new Date();
const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

const DashboardSistemas = () => {
  const navigate = useNavigate();
  const [fechaDesde, setFechaDesde] = useState(toInputDate(inicioMes));
  const [fechaHasta, setFechaHasta] = useState(toInputDate(hoy));

  const [resumen, setResumen] = useState(null);
  const [evolucion, setEvolucion] = useState(null);
  const [procesos, setProcesos] = useState([]);
  const [opciones, setOpciones] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { fechaDesde, fechaHasta };

      const [resResumen, resEvolucion, resProcesos, resOpciones] = await Promise.all([
        axios.get(`${BASE}/resumen`, { params }),
        axios.get(`${BASE}/evolucion`, { params: { ...params, agrupacion: "auto" } }),
        axios.get(`${BASE}/procesos`, { params: { ...params, limit: 10 } }),
        axios.get(`${BASE}/opciones`, { params: { ...params, limit: 10 } }),
      ]);

      setResumen(resResumen.data);
      setEvolucion(resEvolucion.data);
      setProcesos(
        resProcesos.data.map((p) => ({ label: p.descripcion, accesos: p.accesos }))
      );
      setOpciones(
        resOpciones.data.map((o) => ({ label: o.nombre_opcion, accesos: o.accesos }))
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "No se pudieron obtener las estadísticas."
      );
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta]);

  // Carga inicial con el rango por defecto.
  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarDatos();
  };

  const handleImprimir = () => {
    window.print();
  };

  const rangoTexto =
    resumen?.rango
      ? `${resumen.rango.fechaDesde} al ${resumen.rango.fechaHasta}`
      : `${fechaDesde} al ${fechaHasta}`;

  return (
    <div className="dashboard-sistemas">
      {/* ---- Encabezado + filtros (no se imprime) ---- */}
      <Box
        className="no-print"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          component="form"
          onSubmit={handleBuscar}
          sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}
        >
          <TextField
            label="Desde"
            type="date"
            size="small"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Hasta"
            type="date"
            size="small"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            disabled={loading}
          >
            Consultar
          </Button>
          <Button
            type="button"
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handleImprimir}
            disabled={loading || !resumen}
          >
            Imprimir
          </Button>
        </Box>

        <Button
          type="button"
          variant="contained"
          color="secondary"
          startIcon={<PeopleAltIcon />}
          onClick={() => navigate("/estadisticas-personales")}
          sx={{ ml: "auto" }}
        >
          Estadísticas Personales
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

      {/* ---- Contenido imprimible ---- */}
      {!loading && resumen && (
        <div id="dashboard-print">
          {/* Encabezado visible solo en impresión */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              Interacción de ciudadanos con la plataforma
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Período: {rangoTexto}
            </Typography>
          </Box>

          <Box className="evitar-corte" sx={{ mb: 3 }}>
            <KpiCards resumen={resumen} />
          </Box>

          {/* Evolución + Distribución */}
          <div className="dashboard-grid-charts dos-columnas">
            <Card elevation={3} className="evitar-corte">
              <CardHeader
                title="Evolución de accesos"
                subheader={`Agrupación: ${evolucion?.agrupacion === "mes" ? "mensual" : "diaria"}`}
              />
              <Divider />
              <CardContent>
                <EvolucionChart evolucion={evolucion} />
              </CardContent>
            </Card>

            <Card elevation={3} className="evitar-corte">
              <CardHeader title="Empleados vs. No empleados" />
              <Divider />
              <CardContent>
                <DistribucionChart resumen={resumen} />
              </CardContent>
            </Card>
          </div>

          {/* Procesos + Opciones */}
          <div className="dashboard-grid-charts iguales" style={{ marginTop: 16 }}>
            <Card elevation={3} className="evitar-corte">
              <CardHeader title="Procesos / sistemas más utilizados" subheader="Top 10" />
              <Divider />
              <CardContent>
                <RankingChart items={procesos} color="#1976d2" etiquetaColumna="Proceso" />
              </CardContent>
            </Card>

            <Card elevation={3} className="evitar-corte">
              <CardHeader title="Opciones de menú más utilizadas" subheader="Top 10" />
              <Divider />
              <CardContent>
                <RankingChart items={opciones} color="#6a1b9a" etiquetaColumna="Opción" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSistemas;
