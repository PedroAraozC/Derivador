import axios from "../../config/axiosAC";

export const traerReclamoPorID = async (datos) => {
  try {
    const res = await axios.post("/reclamos/traerReclamoPorID", datos);
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
export const traerReclamosPorSolicitante = async (datos) => {
  try {
    const res = await axios.post("/reclamos/traerReclamoPorSolicitante", datos);
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
export const traerReclamosPorPersona = async (datos) => {
  try {
    const res = await axios.post("/reclamos/traerReclamosPorPersona", datos);
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
export const traerReclamoPorAsunto = async (datos) => {
  try {
    const res = await axios.post("/reclamos/traerReclamoPorAsunto", datos);
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
export const traerReclamoPorDireccion = async (datos) => {
  try {
    const res = await axios.post("/reclamos/traerReclamoPorDireccion", datos);
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const ListarCategorias = async () => {
  try {
    const { data } = await axios.get("/atencionCiudadana/listarCategorias");
    return data.categorias;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const ListarEstados = async () => {
  try {
    const res = await axios.get("/atencionCiudadana/listarEstados");
    return res.data.estados;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const ListarColoresEstados = async () => {
  try {
    const response = await axios.get("/atencionCiudadana/listarColores");
    return response.data.colores;
  } catch (error) {
    console.error("Error al listar colores de estados:", error);
    return [];
  }
};

export const notasAclaratorias = async (id_reclamo) => {
    let datos = {
        id_reclamo: id_reclamo
    };
  try {
    const res = await axios.post("/reclamos/notasAclaratorias", datos);
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const reiteracionesReclamo = async (id_reclamo) => {
    let datos = {
        id_reclamo: id_reclamo
    };
  try {
    const res = await axios.post("/reclamos/reiteracionesReclamo", datos);
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const derivacionInicial = async (id_reclamo) => {
    let datos = {
        id_reclamo: id_reclamo
    };
  try {
    const res = await axios.post("/reclamos/derivacionInicial", datos);
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const movimientosReclamo = async (id_reclamo) => {
    let datos = {
        id_reclamo: id_reclamo
    };
  try {
    const res = await axios.post("/reclamos/movimientosReclamo", datos);
    return res.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};