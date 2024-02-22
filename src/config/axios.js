import axiosOriginal from 'axios'

const axios = axiosOriginal.create({
    baseURL: import.meta.env.VITE_APP_RUTA_BACK
    // baseURL: "http://172.16.9.97:4000"
})

export default axios;