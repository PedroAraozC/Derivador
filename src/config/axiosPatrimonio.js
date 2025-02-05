import axiosOriginal from 'axios'

const axiosPatri = axiosOriginal.create({
    baseURL: import.meta.env.VITE_APP_RUTA_BACK_PATRIMONIO
})

export default axiosPatri;