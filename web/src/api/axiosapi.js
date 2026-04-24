import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true
});

export function extApi(baseURL, headers){
  try{
    const api = axios.create({
      baseURL: baseURL,
      headers: headers,
      withCredentials: true
    })
    return api;
  }catch(error){
    return "NO Api Found"
  }
};
export default api;
