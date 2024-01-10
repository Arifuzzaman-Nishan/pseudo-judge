import axios from "axios";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://pseudojudge.codes/api/v1"
    : "http://localhost:5000/api/v1";

const baseApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default baseApi;
