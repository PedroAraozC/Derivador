import axios from "../../config/axios";
import { useEffect, useState } from "react";
import { FormSelect, Form, Alert, Button } from "react-bootstrap";
import useStore from "../../Zustand/Zustand";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Typography } from "@mui/material";

// eslint-disable-next-line react/prop-types
const FormReclamos = ({ funcionCerrar }) => {
  const { setResultSearch, setValuesGraficos } = useStore();

  const [error, setError] = useState("");
  const [storeProcedures, setStoreProcedures] = useState([]);
  const [values, setValues] = useState({
    procedimiento: "",
    desde: "",
    hasta: "",
  });

  const [flagButton, setFlagButton] = useState(false);

  const getData = async (e) => {
    e.preventDefault();
    try {
      setFlagButton(true);
      const resultado = await axios.post("/reclamos/listar", values);
      setResultSearch(resultado.data.resultado[0]);
      setValuesGraficos(values);
      console.log(resultado);
      setFlagButton(false);
      funcionCerrar();
    } catch (error) {
      console.log("mal");
    }
  };

  const handleInputChange = (e) => {
    // setFlagShowGraphic(false);
    const { name, value } = e.target;
    if (name != "procedimiento") {
      // Validación para asegurarse de que 'desde' no sea mayor que 'hasta'
      if (name === "desde" && values.hasta !== "" && value > values.hasta) {
        setError("'Desde' no puede ser mayor que 'Hasta'");
        return;
      }

      // Validación para asegurarse de que 'hasta' no sea menor que 'desde'
      if (name === "hasta" && values.desde !== "" && value < values.desde) {
        setError("'Hasta' no puede ser menor que 'Desde'");
        return;
      }

      // Validación para asegurarse de que 'desde' y 'hasta' no sean mayores a hoy
      const today = new Date().toISOString().split("T")[0];
      if (value > today) {
        setError(
          `'${
            name === "desde" ? "Desde" : "Hasta"
          }' no puede ser mayor que la fecha actual`
        );
        return;
      }
      setError("");

      setValues({
        ...values,
        [name]: value,
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  const obtenerProcedimientosAlmacenados = async () => {
    try {
      const resultado = await axios.get("/reclamos/listarProcedimientos");
      setStoreProcedures(resultado.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerProcedimientosAlmacenados();
  }, []);

  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  function formatProcedimientoName(procedimiento) {
    const palabras = procedimiento.substring(2).split("_");
    let nombreFormateado = palabras
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");

    nombreFormateado = nombreFormateado.replace("Reclamos", "");

    return nombreFormateado.trim();
  }

  return (
    <>
      {storeProcedures.length == 0 ? (
        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="d-flex flex-column w-50 justify-content-center align-items-center">
            <Typography variant="h3" width={"100%"}>
              {" "}
              <Skeleton  />
            </Typography>

            <Typography variant="h3"  width={"100%"}>
              {" "}
              <Skeleton />
            </Typography>

            <Typography variant="h3"  width={"100%"}>
              {" "}
              <Skeleton/>
            </Typography>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center px-3 mt-5">
          <Form className="d-flex flex-column gap-3" onSubmit={getData}>
            <FormSelect
              value={values.procedimiento}
              onChange={handleInputChange}
              name="procedimiento"
              required
            >
              <option value="">Elija un tipo de Reclamo</option>
              {storeProcedures.length !== 0 &&
                storeProcedures
                  .filter(
                    (sp) =>
                      !sp.routine_name.includes("insert") &&
                      !sp.routine_name.includes("detalle") &&
                      !sp.routine_name.includes("tipo") &&
                      // !sp.routine_name.includes("estados") &&
                      !sp.routine_name.includes("mapa") &&
                      !sp.routine_name.includes("area") &&
                      !sp.routine_name.includes("usuario")
                  )
                  .map((st, index) => {
                    if (
                      formatProcedimientoName(st.routine_name) !=
                      "Por Estado Sec Repar Oficina"
                    ) {
                      return (
                        <option value={st.routine_name} key={index}>
                          {formatProcedimientoName(st.routine_name)}
                        </option>
                      );
                    }
                  })}
            </FormSelect>
            <div className="d-flex">
              <Form.Control
                type="date"
                name="desde"
                value={values.desde}
                onChange={handleInputChange}
                required
              />
              <Form.Control
                type="date"
                name="hasta"
                value={values.hasta}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button disabled={flagButton ? true : false} type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
            <div className="container">
              {error != "" && <Alert variant="danger">{error}</Alert>}
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default FormReclamos;
