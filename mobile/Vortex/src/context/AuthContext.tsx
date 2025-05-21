// // ../context/auth/authProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";

// сразу после import axios
axios.interceptors.request.use(req => {
  console.log('[axios req]', req.method?.toUpperCase(), req.url, req.data);
  return req;
});



import * as SecureStore from "expo-secure-store";

interface AuthProps{
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (first_name: string, last_name: string, phone_number: string, email: string, password: string, ) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "jwt";
export const API_URL = "http://10.0.2.2:8000";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

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
            console.log("stored:", token)
            if(token){
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
            console.log("roketa ~ file: AuthContext.tsx:40 ~ login ~ result:", result)

            setAuthState({
                token: result.data.access,
                authenticated: true
            });

            axios.defaults.headers.common["Authorization"] = `Bearer ${result.data.access}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.access); // result.data.token or access?
            return result;
        }
        catch (e) {
            return {error: true, message: (e as any).response.data.message};
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        axios.defaults.headers.common["Authorization"] = '';

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