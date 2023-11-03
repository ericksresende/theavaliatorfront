import axios from "axios";

const api = axios.create({
    baseURL:"https://bancotheavaliator-316d4dc95349.herokuapp.com/api"
})

export default api;