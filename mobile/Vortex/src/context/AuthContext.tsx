// // ../context/auth/authProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
// сразу после import axios
axios.interceptors.request.use(req => {
  //console.log('[axios req]', req.method?.toUpperCase(), req.url, req.data);
  return req;
});



//import * as SecureStore from "expo-secure-store";

interface AuthProps{
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (first_name: string, last_name: string, phone_number: string, email: string, password: string, ) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "jwt";
const REFRESH_KEY = "refresh";

export const API_URL = "http://10.0.2.2:8000";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);


axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry // prevent infinite loop
    ) {
      originalRequest._retry = true;

      const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });

          await SecureStore.setItemAsync(TOKEN_KEY, data.access);
          axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
          originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

          return axios(originalRequest);
        } catch (err) {
          // refresh failed, logout
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(REFRESH_KEY);
        }
      }
    }

    return Promise.reject(error);
  }
);



export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null,
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
            //console.log("stored:", token)
            if(token && refresh){
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        }
        loadToken();
    }, [])
    
    const register = async (first_name: string, last_name: string, phone_number: string, email: string, password: string) => {
        try {
            return await axios.post(`http://10.0.2.2:8000/api/user/register/`, {
                first_name, last_name, phone_number, email, password
            });
            
        } catch (e) {
            //return {error: true, message: (e as any).response.data.message}; nemec
            const error = e as AxiosError;
            return {
                error: true,
                message: (error.response?.data as any)?.message || error.message
            }
        }
    }

    const login = async (email: string, password: string) => {
        try{
            const result = await axios.post(`http://10.0.2.2:8000/api/token/`,{ email, password });
            if (!result.data?.access) {
                throw new Error("No access token in response");
            }

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.access); // result.data.token or access?
            await SecureStore.setItemAsync(REFRESH_KEY, result.data.refresh);
           // console.log("roketa ~ file: AuthContext.tsx:40 ~ login ~ result:", result)

            axios.defaults.headers.common["Authorization"] = `Bearer ${result.data.access}`;
        
            setAuthState({
                token: result.data.access,
                authenticated: true
            });
            return result;
        }
        catch (e) {
            return {error: true, message: (e as any).response.data.message};
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        //axios.defaults.headers.common["Authorization"] = '';
        delete axios.defaults.headers.common["Authorization"];

        setAuthState({
            token: null,
            authenticated: false
        })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value = {value}>{children}</AuthContext.Provider>
}