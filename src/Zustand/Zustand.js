import {create} from 'zustand';

const useStore = create((set) => ({
    authenticated: true,
    //cambiar despues a false
    login: () => set({ authenticated: true }),
    logout: () => set({ authenticated: false }),
    
    resultSearch: [],
    setResultSearch: (item) => set(() => ({ resultSearch: [item] })),

    valuesGraficos: {
        procedimiento: "",
        desde: "",
        hasta: "",
    },
    setValuesGraficos: (newValues) => set((state) => ({ ...state, valuesGraficos: { ...state.valuesGraficos, ...newValues } })),


    valuesCapHumano: "", 
    setValuesCapHumano: (newValues) => set((state) => ({valuesCapHumano: newValues}))
}))


export default useStore;

// flagShowGraphic: false,
// setFlagShowGraphic: () => set((state) => ({ ...state, flagShowGraphic: !state.flagShowGraphic })),