import axiosOriginal from 'axios'

const axiosMuni = axiosOriginal.create({
    baseURL: import.meta.env.VITE_APP_RUTA_BACK_MUNI
})

export default axiosMuni;