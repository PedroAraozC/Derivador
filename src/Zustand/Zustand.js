import { create } from 'zustand';
import axios from '../config/axios';

const useStore = create((set) => ({
  errors: "",

  authenticated: false,
  user: null,
  loading: true,
  botonState: false,
  login: async (values) => {
    set({ botonState: true });
    try {
      set({errors : ""})
      const { data } = await axios.post("/usuarios/login", values);
      set({
        authenticated: !!data.user
      });
      set({user:data.user});
      axios.defaults.headers.common["Authorization"] = data.token;
      localStorage.setItem("token", data.token);
    } catch (error) {
      // toast.error(error.response?.data.message || error.message);
        set({errors : error.response?.data.message || error.message });
    }
    set({ botonState: false });
  },
  logout:() => {
    set({authenticated: false });
      localStorage.removeItem("token");
    
  },

  getAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ loading: false, authenticated: false });
        return;
      }
      axios.defaults.headers.common["Authorization"] = token;
      const { data } = await axios.get("/usuarios/authStatus");
      set({
        authenticated: true
      });
      set({user:data.usuarioSinContraseña});
    } catch (error) {
      set({ authenticated: false});
      localStorage.removeItem("token");
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
  setValuesCapHumano: (newValues) => set((state) => ({ valuesCapHumano: newValues }))
}))


export default useStore;

// flagShowGraphic: false,
// setFlagShowGraphic: () => set((state) => ({ ...state, flagShowGraphic: !state.flagShowGraphic })),