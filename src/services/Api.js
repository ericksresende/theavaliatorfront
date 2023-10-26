import axios from "axios";

const api = axios.create({
    baseURL:"https://backavaliadora.guugascode.site/api"
})

export default api;