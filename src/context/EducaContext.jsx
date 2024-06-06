import { createContext, useState } from "react";
import axios from "../config/axios";

export const EducaContext = createContext();

// eslint-disable-next-line react/prop-types
const ProviderEducacion = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(null);
  const [selected, setSelected] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoriasTabla, setConvocatoriasTabla] = useState([]);
  const [arrayFiltrado, setArrayFiltrado] = useState([]);
  const [arrayNiveles, setArrayNiveles] = useState([]);
  const [arrayEstablecimientos, setArrayEstablecimientos] = useState([]);
  const [arrayCausal, setArrayCausal] = useState([]);
  const [arrayCausalTabla, setArrayCausalTabla] = useState([]);
  const [arrayCaracterTabla, setArrayCaracterTabla] = useState([]);
  const [arrayEstablecimientoTabla, setArrayEstablecimientoTabla] = useState(
    []
  );
  const [arrayCaracter, setArrayCaracter] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [tipologia, setTipologia] = useState([]);
  const [material, setMaterial] = useState([]);
  const [estado, setEstado] = useState([]);
  const [autor, setAutor] = useState([]);
  const [ubicacion, setUbicacion] = useState([]);
  const [patrimonios, setPatrimonios] = useState([]);
  //Funcion para listar las convocatorias

  const obtenerConvocatorias = async (idNivel) => {
    try {
      const resultado = await axios.get("/educacion/listarConvocatorias");
      const convocatoriasFiltradas = resultado.data.convocatorias.filter(
        (convocatoria) => convocatoria.id_nivel === idNivel
      );

      // Ordena las convocatorias por id de forma descendente
      const arrayFiltradoOrdenado = convocatoriasFiltradas.sort(
        (a, b) => b.id - a.id
      );

      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setConvocatorias(resultado.data);
      setArrayFiltrado(arrayFiltradoOrdenado.reverse());
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerConvocatoriasTabla = async () => {
    try {
      const resultado = await axios.get("/educacion/listarConvocatoriasTabla");
      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setConvocatoriasTabla(resultado.data);
    } catch (error) {
      console.log(error);
    }
  };

  //Funciona para obtener niveles
  const obtenerNiveles = async () => {
    try {
      const resultado = await axios.get("/educacion/listarNiveles");
      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setArrayNiveles(resultado.data.niveles);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerEstablecimientos = async () => {
    try {
      const resultado = await axios.get("/educacion/listarEstablecimientos");
      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setArrayEstablecimientos(resultado.data.establecimientos);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerCausal = async () => {
    try {
      const resultado = await axios.get("/educacion/listarCausal");
      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setArrayCausal(resultado.data.causal);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerCausalTabla = async () => {
    try {
      const resultado = await axios.get("/educacion/listarCausalTabla");
      console.log(resultado.data);
      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setArrayCausalTabla(resultado.data.causal);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerCaracter = async () => {
    try {
      const resultado = await axios.get("/educacion/listarCaracter");
      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setArrayCaracter(resultado.data.caracter);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerCaracterTabla = async () => {
    try {
      const resultado = await axios.get("/educacion/listarCaracterTabla");
      console.log(resultado.data);
      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setArrayCaracterTabla(resultado.data.caracter);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerEstablecimientoTabla = async () => {
    try {
      const resultado = await axios.get(
        "/educacion/listarEstablecimientosTabla"
      );
      console.log(resultado.data);
      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setArrayEstablecimientoTabla(resultado.data.establecimientos);
    } catch (error) {
      console.log(error);
    }
  };

  const getAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return setAuthenticated(false);
      }
      axios.defaults.headers.common["Authorization"] = token;
      const { data } = await axios.get("/usuarios/authStatus");
      setUser(data.usuarioSinContraseña);
      setAuthenticated(true);
    } catch (error) {
      setAuthenticated(false);
      // toast.error("Error de autenticación. Ingrese nuevamente");
    }
    setLoading(false);
  };

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenSet");
    const url = new URL(`http://localhost:5174/`);
    url.searchParams.append("logout", true);
    window.open(url.toString(), "_self");
  };

  const actualizador = () => {
    setRefresh(!refresh);
  };

  const obtenerCategoria = async () => {
    try {
      const resultado = await axios.get("/admin/listarCategorias");
      // Actualiza los estados con las convocatorias filtradas y ordenadas
      setCategoria(resultado.data.categorias);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerTipologia = async () => {
    try {
      const resultado = await axios.get("/admin/listarTipologias");
      // console.log(resultado.data.tipologias)
      setTipologia(resultado.data.tipologias);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerMaterial = async () => {
    try {
      const resultado = await axios.get("/admin/listarMateriales");
      // console.log(resultado.data.materiales);
      setMaterial(resultado.data.materiales);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerEstado = async () => {
    try {
      const resultado = await axios.get("/admin/listarEstados");
      // console.log(resultado.data.materiales);
      setEstado(resultado.data.estados);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerAutor = async () => {
    try {
      const resultado = await axios.get("/admin/listarAutores");
      // console.log(resultado.data.materiales);
      setAutor(resultado.data.autores);
    } catch (error) {
      console.log(error);
    }
  }  
  const obtenerUbicacion = async () => {
    try {
      const resultado = await axios.get("/admin/listarUbicaciones");
      // console.log(resultado.data.materiales);
      setUbicacion(resultado.data.ubicaciones);
    } catch (error) {
      console.log(error);
    }
  }
  const obtenerPatrimonios = async () => {
    try {
      const resultado = await axios.get("/admin/listarPatrimonio");
      // console.log(resultado.data.materiales);
      setPatrimonios(resultado.data.patrimonios);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <EducaContext.Provider
      value={{
        user,
        authenticated,
        setAuthenticated,
        loading,
        getAuth,
        setLoading,
        logout,
        selected,
        setSelected,
        convocatorias,
        setConvocatorias,
        arrayFiltrado,
        obtenerConvocatorias,
        obtenerConvocatoriasTabla,
        convocatoriasTabla,
        obtenerNiveles,
        arrayNiveles,
        obtenerEstablecimientos,
        arrayEstablecimientos,
        obtenerEstablecimientoTabla,
        arrayEstablecimientoTabla,
        obtenerCausal,
        obtenerCaracter,
        arrayCaracter,
        arrayCausal,
        arrayCausalTabla,
        obtenerCausalTabla,
        arrayCaracterTabla,
        obtenerCaracterTabla,
        actualizador,
        refresh,
        obtenerCategoria,
        categoria,
        obtenerTipologia,
        tipologia,
        obtenerMaterial,
        material,
        obtenerEstado,
        estado,
        obtenerAutor,
        autor,
        obtenerUbicacion,
        ubicacion,
        obtenerPatrimonios,
        patrimonios
      }}
    >
      {children}
    </EducaContext.Provider>
  );
};

export default ProviderEducacion;
