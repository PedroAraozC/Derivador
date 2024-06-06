import axiosOriginal from 'axios'

const axios = axiosOriginal.create({
    baseURL: import.meta.env.VITE_APP_RUTA_BACK
    // baseURL: "http://localhost:3000"

})

export default axios;