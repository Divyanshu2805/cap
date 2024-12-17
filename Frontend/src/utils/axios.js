// JavaScript library used for making HTTP requests
import axios from "axios";   
import { API_BASE_URL } from "./constants";

// Creates an instance of Axios with some pre-configured options
const apiInstance = axios.create({
  baseURL: API_BASE_URL,                       // Sets a default base URL so that every request made with apiInstance will automatically start with this URL
  timeout: 10000,                              // Request timeout
  headers: {                                   // Adds custom headers to each request
    "Content-Type": "application/json",        // Sets the content type to JSON
    "Accept": "application/json",              // Informs the server that our app expects JSON data
  },
});   

export default apiInstance;
