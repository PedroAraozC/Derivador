import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import axios from "../../config/axios";
import axiosLici from "../../config/axiosLicitaciones"
import useStore from "../../Zustand/Zustand";
import { Alert, Skeleton, Snackbar, Typography } from "@mui/material";
import axiosMuni from "../../config/axiosMuni";

const FormCapitalHumano = () => {
  const [procedimientos, setProcedimientos] = React.useState([]);

  const { setResultSearch, setValuesCapHumano } = useStore();

  const formatProcedimientoName = (procedimiento) => {
    const palabras = procedimiento.substring(2).split("_");
    let nombreFormateado = palabras
      .map((palabra) => {
        const primeraLetra = palabra.charAt(0).toUpperCase();
        const restoPalabra = palabra.slice(1).toLowerCase();
        return primeraLetra + restoPalabra;
      })
      .join(" ");

    return nombreFormateado;
  };

  const [error, setError] = React.useState("");
  const obtenerProcedimientosAlmacenados = async () => {
    try {
      // const resultado = await axios.get("/listar/listarProcedimientos");
      const resultado = await axiosMuni.get("/listar/listarProcedimientos");
      setProcedimientos(resultado.data);
    } catch (error) {
      console.log(error);
      setError(error.response.data?.message || error.message)
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
  };

  const getData = async (SP) => {
    try {
      const obj = { procedimiento: SP };
      // const resultado = await axios.post("/listar/ejecutarProcedimiento", obj);
      const resultado = await axiosMuni.post("/listar/ejecutarProcedimiento", obj);
      setResultSearch(resultado.data);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || error.message)
    }
  };

  React.useEffect(() => {
    obtenerProcedimientosAlmacenados();
  }, []);

  const handleChange = (e) => {
    setResultSearch([]);
    const { value } = e.target;
    setValuesCapHumano(value);
    getData(value);
  };

const priorityMap = {
  "Planta Municipal": 1,
  "Planta por Secretaría": 2,
  "Planta por Repartición": 3,
  "Planta por Categoría y Secretaría": 4,
  "Planta por Categoría y Repartición": 5
};

const getFormattedName = (name) => {
  if (name.includes("sp_plantamunicipal")) return "Planta Municipal";
  if (name.includes("sp_plantaporsecretaria")) return "Planta por Secretaría";
  if (name.includes("sp_plantaporreparticion")) return "Planta por Repartición";
  if (name.includes("sp_plantaporcategosec")) return "Planta por Categoría y Secretaría";
  if (name.includes("sp_plantaporcatego")) return "Planta por Categoría y Repartición";
  return "";
};

const sortedProcedimientos = procedimientos?.filter(
  (sp) =>
    sp.ROUTINE_NAME.includes("sp_plantaporsecretaria") ||
    sp.ROUTINE_NAME.includes("sp_plantamunicipal") ||
    sp.ROUTINE_NAME.includes("sp_plantaporreparticion") ||
    sp.ROUTINE_NAME.includes("sp_plantaporcategosec") ||
    sp.ROUTINE_NAME.includes("sp_plantaporcatego")
).sort((a, b) => {
  const nameA = getFormattedName(a.ROUTINE_NAME);
  const nameB = getFormattedName(b.ROUTINE_NAME);
  return (priorityMap[nameA] || Infinity) - (priorityMap[nameB] || Infinity);
});

  return (
    <>
      {procedimientos.length !== 0 ? (
        <div className="mb-3">
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="">Informes</InputLabel>
            <Select onChange={handleChange} autoWidth label="Informes">
              {sortedProcedimientos.length > 0 ? (
                sortedProcedimientos.map((st, index) => (
                  <MenuItem value={st.ROUTINE_NAME} key={index}>
                    {getFormattedName(st.ROUTINE_NAME)}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hay informes disponibles</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>
    ):
    <div className="d-flex w-50 justify-content-center align-items-center ">
          <div className="d-flex flex-column w-50 justify-content-center align-items-center">
            <Typography variant="h1"  width={"80%"}>
              {" "}
              <Skeleton/>
            </Typography>
          </div>
        </div>}
        {
          error != "" &&
          <Snackbar
          open={error != "" ? true : false}
          autoHideDuration={5000000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Ajusta la posición del Snackbar
        >
          <Alert severity="warning">{error}</Alert>
        </Snackbar>
        }
    </>
    );
  };

export default FormCapitalHumano;
