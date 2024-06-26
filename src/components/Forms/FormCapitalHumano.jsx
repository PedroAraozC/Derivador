import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "../../config/axios";
import useStore from "../../Zustand/Zustand";
import { Alert, Skeleton, Snackbar, Typography } from "@mui/material";

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
      const resultado = await axios.get("/listar/listarProcedimientos");
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
      const resultado = await axios.post("/listar/ejecutarProcedimiento", obj);
      setResultSearch(resultado.data);
    } catch (error) {
      console.log(error);
      setError(error.response.data?.message || error.message)
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

  return (
    <>
    {procedimientos.length !== 0 ? (
      <div className="mb-3">
      <FormControl sx={{ m: 1, minWidth: 180 }}>
        <InputLabel id="">Informes</InputLabel>
        <Select onChange={handleChange} autoWidth label="Informes">
          {procedimientos?.length > 0 ? (
            procedimientos
            ?.filter(
              (sp) =>
              sp.ROUTINE_NAME.includes("sp_plantaporreparticion") ||
              sp.ROUTINE_NAME.includes("sp_plantamunicipal") ||
              sp.ROUTINE_NAME.includes("sp_plantaporcatego")
              )
              .map((st, index) => (
                <MenuItem value={st.ROUTINE_NAME} key={index}>
                  {formatProcedimientoName(st.ROUTINE_NAME).includes("Plantaporreparticion")? "Planta por Repartición":formatProcedimientoName(st.ROUTINE_NAME).includes("Plantamunicipal")? "Planta Municipal":"Planta por Categoría"}
                </MenuItem>
              ))
              ) : (
                <p></p>
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
