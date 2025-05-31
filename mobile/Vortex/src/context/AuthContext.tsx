// ../context/auth/authProvider.tsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SecureStore from "expo-secure-store";

// axios.interceptors.request.use(req => {
//   console.log('[axios req]', req.method?.toUpperCase(), req.url, req.data);
//   return req;
// });

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  authenticated: boolean | null;
}

// const [authState, setAuthState] = useState<AuthState>({ 
//   token: null, 
//   refreshToken: null, 
//   authenticated: null 
// });

interface AuthProps{
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (first_name: string, last_name: string, phone_number: string, email: string, password: string, ) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onGoogleLogin: () => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "jwt";
const REFRESH_TOKEN = "refresh";
//export const API_URL = "https://gregarious-happiness-production.up.railway.app";
export const API_URL = "http://10.0.2.2:8000";
//export const ALT_API_URL = "https://eager-dingos-behave.loca.lt"

const AuthContext = createContext<AuthProps>({} as AuthProps);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{ token: string | null; refreshToken: string | null ; authenticated: boolean | null;
    }>({ token: null, refreshToken: null, authenticated: null, })

      axios.interceptors.request.use(req => {
    // console.log("[axios req]", req.method?.toUpperCase(), req.url, req.data);
    return req;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      const isRefreshEndpoint =
        originalRequest.url?.endsWith("/api/token/refresh/") ?? false;

      if (status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
        originalRequest._retry = true;

        const storedRefresh = await SecureStore.getItemAsync(REFRESH_TOKEN);
        if (!storedRefresh) {
          setAuthState({ token: null, refreshToken: null, authenticated: false });
          return Promise.reject(error);
        }

        try {
          const refreshResponse = await axios.post(
            `${API_URL}/api/token/refresh/`,
            { refresh: storedRefresh }
          );

          const newAccess = refreshResponse.data.access;
          await SecureStore.setItemAsync(TOKEN_KEY, newAccess);
          axios.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

          setAuthState((prev) => ({
            ...prev,
            token: newAccess,
          }));
          return axios(originalRequest);
        } catch {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(REFRESH_TOKEN);
          setAuthState({ token: null, refreshToken: null, authenticated: false });
        }
      }

      return Promise.reject(error);
    }
  );

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const refteshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);
            console.log("stored:", token)
            if(token && refteshToken){
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                setAuthState({ token: token, refreshToken: refteshToken, authenticated: true });
            }
        }
        loadToken();
    }, [])
    
    const register = async (first_name: string, last_name: string, phone_number: string, email: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/api/user/register/`, {
                first_name, last_name, phone_number, email, password
            });
        } catch (e) {
            //return {error: true, message: (e as any).response.data.message}; nemec
            const error = e as AxiosError;
            return { error: true, message: (error.response?.data as any)?.message || error.message
            }
        }
    }

    const login = async (email: string, password: string) => {
        try{
            const result = await axios.post(`${API_URL}/api/token/`,{ email, password });
            if (!result.data?.access) {
                throw new Error("No access token in response");
            }

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.access); // result.data.token or access?
            await SecureStore.setItemAsync(REFRESH_TOKEN, result.data.refresh);

            //console.log("roketa ~ file: AuthContext.tsx:40 ~ login ~ result:", result)

            setAuthState({ token: result.data.access, refreshToken: result.data.refresh, authenticated: true });

            axios.defaults.headers.common["Authorization"] = `Bearer ${result.data.access}`;


            return result;
        }
        catch (e) {
            return {error: true, message: (e as any).response.data.message};
        }
    };

      const googleLogin = async () => {
        try {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
          await GoogleSignin.signIn();
          const { idToken } = await GoogleSignin.getTokens();
          // console.log('idToken: ' + idToken)
          const { data } = await axios.post(`${API_URL}/api/auth/google/`, { idToken });
          if (!data.access) throw new Error('No access token');
          await SecureStore.setItemAsync(TOKEN_KEY, data.access);
          await SecureStore.setItemAsync(REFRESH_TOKEN, data.refresh);
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
          setAuthState({ token: data.access, refreshToken: data.refresh, authenticated: true });
          return data;
        } catch (e) {
          const error = e as AxiosError;
          return { error: true, message: (error.response?.data as any)?.detail || error.message };
        }
      };

    const logout = async () => {
      try{
        await GoogleSignin.signOut();
      } catch (e) {
        console.warn('Google signOut error: ', e)
      }
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN);
        axios.defaults.headers.common["Authorization"] = '';

        setAuthState({ token: null, refreshToken: null, authenticated: false })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onGoogleLogin: googleLogin,
        authState
    };

    return <AuthContext.Provider value = {value}>{children}</AuthContext.Provider>
}