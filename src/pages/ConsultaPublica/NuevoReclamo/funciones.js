import axios from "../../../config/axiosAC";


export const listarTipoReclamo = async () => {
  try {
    const { data } = await axios.get("/atencionCiudadana/listarTipoReclamo");
    return data.t_reclamos;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const listarOrigenes = async () => {
  try {
    const { data } = await axios.get("/atencionCiudadana/listarOrigenReclamo");
    return data.origenes;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const listarCategorias = async () => {
  try {
    const { data } = await axios.get("/atencionCiudadana/listarCategorias");
    return data.categorias;
  } catch (error) {
    console.error(error);
    return [];
  }
};