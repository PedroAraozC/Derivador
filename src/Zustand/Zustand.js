import { create } from 'zustand';
import axios from '../config/axios';

const useStore = create((set) => ({
  errors: "",
  setErrors: (newValues) => set(() => ({ errors: newValues })),

  authenticated: false,

  user: null,

  permisos: [],
  
  opciones: [],

  loading: true,
  
  botonState: false,

  login: async (values) => {
    set({ botonState: true });
    try {
      set({errors : ""})
      const { data } = await axios.post("/usuarios/login", values);
    
      set({
        authenticated: !!data.user.usuarioSinContraseña
      });
      set({user:data.user.usuarioSinContraseña});
      axios.defaults.headers.common["Authorization"] = data.token;
      localStorage.setItem("token", data.token);
    } catch (error) {
        set({errors : error.response.data?.errors?.length > 0 ?  error.response.data.errors[0].msg : error.response?.data?.message? error.response?.data.message: error.message});
    }
    set({ botonState: false });
  },

  obtenerPermisos: async (idUsuario) => {
    try {
      set({ errors: "" });
      const response = await axios.get(`/usuarios/permisos/${idUsuario}`);
      const data = response.data.usuario;
      set({ permisos: data });
    } catch (error) {
      let errorMessage = "Algo salió mal :(";
      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      set({ errors: errorMessage });
    }
  }
  ,
  obtenerOpciones: async () => {
    try {
      set({ errors: "" });
      const response = await axios.get("/usuarios/opciones");
      const data = response.data;
      console.log(response.data)
      set({ opciones: data });
    } catch (error) {
      let errorMessage = "Algo salió mal :(";
      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      set({ errors: errorMessage });
    }
  }
  ,

  logout:() => {
    set({authenticated: false });
    localStorage.removeItem("token");
    localStorage.removeItem("saveChanges");
  },

  getAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ loading: false});
        return set({authenticated:false})
      }
      axios.defaults.headers.common["Authorization"] = token;
      const { data } = await axios.get("/usuarios/authStatus");
      set({user:data.usuarioSinContraseña});
      set({
        authenticated: true
      });
    } catch (error) {
      set({ authenticated: false});
      // localStorage.removeItem("token");
      console.log("error de auth");
      console.log(error)
    }
    set({ loading: false});
  },

  resultSearch: [],
  setResultSearch: (item) => set(() => ({ resultSearch: [item] })),

  valuesGraficos: {
    procedimiento: "",
    desde: "",
    hasta: "",
  },
  setValuesGraficos: (newValues) => set((state) => ({ ...state, valuesGraficos: { ...state.valuesGraficos, ...newValues } })),


  valuesCapHumano: "",
  // eslint-disable-next-line no-unused-vars
  setValuesCapHumano: (newValues) => set((state) => ({ valuesCapHumano: newValues })),

  formFlagReclamos: true,
  setFormFlagReclamos: () => set((state) => ({ ...state, formFlagReclamos: !state.formFlagReclamos })),

  flagCategoriasFuncionarios: false,
  setFlagCategoriasFuncionarios: () => set((state) => ({ ...state, flagCategoriasFuncionarios: !state.flagCategoriasFuncionarios })),

  updateUser: (newUserData) => {
    set({ user: newUserData });
  },
}))

export default useStore;