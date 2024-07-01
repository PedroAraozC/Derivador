import axiosOriginal from 'axios'

const axiosLici = axiosOriginal.create({
    baseURL: import.meta.env.VITE_APP_RUTA_BACK_LICITACIONES
})

export default axiosLici;