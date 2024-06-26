import axiosOriginal from 'axios'

const axios = axiosOriginal.create({
<<<<<<< HEAD
    // baseURL: import.meta.env.VITE_APP_RUTA_BACK
//    baseURL: "http://172.16.9.97:4000"
    baseURL: "http://localhost:3000"
=======
     baseURL: import.meta.env.VITE_APP_RUTA_BACK
    //baseURL: "http://localhost:3000"
>>>>>>> 18433f4c409f1777c854e1d5208227dbede1e517

})

export default axios;