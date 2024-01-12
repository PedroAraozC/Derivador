import create from 'zustand';

const useStore = create((set) => ({
    resultSearch: [],
    // setResultSearch: (item) => set((state) => ({ resultSearch: [...state.resultSearch, item] })),
    setResultSearch: (item) => set(() => ({ resultSearch: [item] })),

    // valuesGraficos: {
    //     procedimiento: "",
    //     desde: "",
    //     hasta: "",
    // },
    // setValuesGraficos: (newValues) => set((state) => ({ ...state, valuesGraficos: { ...state.valuesGraficos, ...newValues } })),

    // flagShowGraphic: false,
    // setFlagShowGraphic: () => set((state) => ({ ...state, flagShowGraphic: !state.flagShowGraphic })),
        authenticated: false,
        login: () => set({ authenticated: true }),
        logout: () => set({ authenticated: false }),
}))


export default useStore;