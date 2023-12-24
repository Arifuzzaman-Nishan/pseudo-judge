import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

console.log("apiUrl is ", apiUrl);

const baseApi = axios.create({
  baseURL: apiUrl,
});

export default baseApi;
