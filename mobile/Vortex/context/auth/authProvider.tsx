// // ../context/auth/authProvider.tsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import * as SecureStore from 'expo-secure-store';

// interface AuthContextType {
//   token: string | null;
//   signIn: (email: string, password: string) => Promise<boolean>;
//   signUp: (data: { first_name: string; last_name: string; phone_number: string; email: string; password: string }) => Promise<boolean>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({} as any);

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(null);

//   // при старте пытаемся загрузить токен
//   useEffect(() => {
//     (async () => {
//       const saved = await SecureStore.getItemAsync('jwt');
//       if (saved) {
//         setToken(saved);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
//       }
//     })();
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     try {
//       const { data } = await axios.post('http://10.0.2.2:8000/api/token/', { email, password });
//       await SecureStore.setItemAsync('jwt', data.access);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
//       setToken(data.access);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const signUp = async (body: any) => {
//     try {
//       await axios.post('http://10.0.2.2:8000/api/user/register/', body);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const signOut = async () => {
//     await SecureStore.deleteItemAsync('jwt');
//     delete axios.defaults.headers.common['Authorization'];
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, signIn, signUp, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
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
            return await axios.post(`${API_URL}/api/user/register/`, {
                first_name, last_name, phone_number, email, password
            });
        } catch (e) {
            return {error: true, message: (e as any).response.data.message};
        }
    }

    const login = async (email: string, password: string) => {
        try{
            const result = await axios.post(`${API_URL}/api/token/`, { email, password });

            console.log("roketa ~ file: AuthContext.tsx:40 ~ login ~ result:", result)

            setAuthState({
                token: result.data.access,
                authenticated: true
            });

            axios.defaults.headers.common["Authorization"] = `Bearer ${result.data.access}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
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