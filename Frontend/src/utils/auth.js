import { useAuthStore } from "../store/auth";                            // Authentication store to set or get authentication-related state
import axios from "./axios";                           
import jwt_decode from "jwt-decode";                                     // Used to decode JWTs                              
import Cookie from "js-cookie";                                          // Used to manage cookies, which store the access and refresh tokens
import Swal from "sweetalert2";                                          // For creating customizable user-friendly alert

export const login = async (email, password) => {                        // Attempts to log in with the provided email and password
  try {
    const { data, status } = await axios.post(`user/token/`, {           // Sends a POST request to the endpoint user/token/  
      password,                                                          // Arguments are email and password in the request body using axios
      email,                                                             // If the login is successful, the server responds with an access token and a refresh token 
    });                                                                  // Return type is a data object and a status code of 200 if successful

    if (status === 200) {
      setAuthUser(data.access, data.refresh);
    }

    return { data, error: null };
    } 
    catch (error) {
    return {
      data: null,
      error: error.response.data?.detail || "Something went wrong",
    };
  }
};

export const register = async (first_name, last_name, email, password, password2) => {
  try {
    const { data } = await axios.post(`user/register/`, {
      first_name,
      last_name,
      email,
      password,
      password2,
    });

    await login(email, password);
    return { data, error: null };
    } 
    catch (error) {
    return {
      data: null,
      error:
        `${error.response.data.first_name} - ${error.response.data.email}` ||
        "Something went wrong",
    };
  }
};

export const logout = () => {
  Cookie.remove("access_token");
  Cookie.remove("refresh_token");
  useAuthStore.getState().setUser(null);
};

export const setUser = async () => {
  const access_token = Cookie.get("access_token");
  const refresh_token = Cookie.get("refresh_token");

  if (!access_token || !refresh_token) {
    // alert("Tokens does not exists");
    return;
  }

  if (isAccessTokenExpired(access_token)) {
    const response = getRefreshedToken(refresh_token);
    setAuthUser(response.access, response.refresh);
  } 
  else {
    setAuthUser(access_token, refresh_token);
  }
};

export const setAuthUser = (access_token, refresh_token) => {            // Used to store access and refresh tokens in cookies 
  Cookie.set("access_token", access_token, {                             
    expires: 1,                                                          // Sets the access_token with a 1-day expiration
    secure: true,
  });

  Cookie.set("refresh_token", refresh_token, {
    expires: 7,                                                          // Sets the access_token with a 7-day expiration               
    secure: true,
  });

  const user = jwt_decode(access_token) ?? null;                         // Decodes access_token using jwt_decode to extract user information from the token

  if (user) {                                                            // If decoding is successful, the user information is stored in the app state
    useAuthStore.getState().setUser(user);
  }
  useAuthStore.getState().setLoading(false);                             // After setting the user state, function is called to indicate the loading state has completed
};

export const getRefreshedToken = async () => {
  const refresh_token = Cookie.get("refresh_token");
  const response = await axios.post(`user/token/refresh/`, {
    refresh: refresh_token,
  });
  return response.data;
};

export const isAccessTokenExpired = (access_token) => {
  try {
    const decodedToken = jwt_decode(access_token);
    return decodedToken.exp < Date.now() / 1000;
  } 
  catch (error) {
    console.log(error);
    return true;
  }
};
