// // // ../context/auth/authProvider.tsx
// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { AxiosError } from "axios";

// // сразу после import axios
// axios.interceptors.request.use(req => {
//   console.log('[axios req]', req.method?.toUpperCase(), req.url, req.data);
//   return req;
// });



// import * as SecureStore from "expo-secure-store";

// interface AuthProps{
//     authState?: { token: string | null; authenticated: boolean | null };
//     onRegister?: (first_name: string, last_name: string, phone_number: string, email: string, password: string, ) => Promise<any>;
//     onLogin?: (email: string, password: string) => Promise<any>;
//     onLogout?: () => Promise<any>;
// }

// const TOKEN_KEY = "jwt";
// export const API_URL = "http://10.0.2.2:8000";
// const AuthContext = createContext<AuthProps>({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }: any) => {
//     const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null;
//     }>({ token: null, authenticated: null, })

//       axios.interceptors.request.use(req => {
//     console.log("[axios req]", req.method?.toUpperCase(), req.url, req.data);
//     return req;
//   });

//   // Интерсептор ответов: при 401 — логаут
//   axios.interceptors.response.use(
//     res => res,
//     async err => {
//       if (err.response?.status === 401) {
//         // Если токен просрочен/невалидный
//         await SecureStore.deleteItemAsync(TOKEN_KEY);
//         delete axios.defaults.headers.common["Authorization"];
//         setAuthState({ token: null, authenticated: false });
//       }
//       return Promise.reject(err);
//     }
//   );

//     useEffect(() => {
//         const loadToken = async () => {
//             const token = await SecureStore.getItemAsync(TOKEN_KEY);
//             console.log("stored:", token)
//             if(token){
//                 axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//                 setAuthState({ token: token, authenticated: true });
//             }
//         }
//         loadToken();
//     }, [])
    
//     const register = async (first_name: string, last_name: string, phone_number: string, email: string, password: string) => {
//         try {
//             return await axios.post(`http://10.0.2.2:8000/api/user/register/`, {
//                 first_name, last_name, phone_number, email, password
//             });
            
//         } catch (e) {
//             //return {error: true, message: (e as any).response.data.message}; nemec
//             const error = e as AxiosError;
//             return { error: true, message: (error.response?.data as any)?.message || error.message
//             }
//         }
//     }

//     const login = async (email: string, password: string) => {
//         try{
//             const result = await axios.post(`http://10.0.2.2:8000/api/token/`,{ email, password });
//             if (!result.data?.access) {
//                 throw new Error("No access token in response");
//             }
//             console.log("roketa ~ file: AuthContext.tsx:40 ~ login ~ result:", result)

//             setAuthState({ token: result.data.access, authenticated: true });

//             axios.defaults.headers.common["Authorization"] = `Bearer ${result.data.access}`;

//             await SecureStore.setItemAsync(TOKEN_KEY, result.data.access); // result.data.token or access?
//             return result;
//         }
//         catch (e) {
//             return {error: true, message: (e as any).response.data.message};
//         }
//     };

//     const logout = async () => {
//         await SecureStore.deleteItemAsync(TOKEN_KEY);
//         axios.defaults.headers.common["Authorization"] = '';

//         setAuthState({ token: null, authenticated: false })
//     }

//     const value = {
//         onRegister: register,
//         onLogin: login,
//         onLogout: logout,
//         authState
//     };

//     return <AuthContext.Provider value = {value}>{children}</AuthContext.Provider>
// }

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
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "jwt";
const REFRESH_TOKEN = "refresh";
export const API_URL = "http://10.0.2.2:8000";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{ token: string | null; refreshToken: string | null ; authenticated: boolean | null;
    }>({ token: null, refreshToken: null, authenticated: null, })

      axios.interceptors.request.use(req => {
    console.log("[axios req]", req.method?.toUpperCase(), req.url, req.data);
    return req;
  });

  // Интерсептор ответов: при 401 — логаут
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Получаем refresh token
        const refreshToken = await SecureStore.getItemAsync('REFRESH_TOKEN');
        
        // Запрашиваем новый access token
        const refreshResponse = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: refreshToken
        });

        // Сохраняем новые токены
        await SecureStore.setItemAsync(TOKEN_KEY, refreshResponse.data.access);
        axios.defaults.headers.common["Authorization"] = `Bearer ${refreshResponse.data.access}`;
        originalRequest.headers["Authorization"] = `Bearer ${refreshResponse.data.access}`;

        // Обновляем состояние
        setAuthState(prev => ({
          ...prev,
          token: refreshResponse.data.access
        }));

        // Повторяем оригинальный запрос
        return axios(originalRequest);

      } catch (refreshError) {
        // Если refresh token невалиден - логаут
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync('REFRESH_TOKEN');
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

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        axios.defaults.headers.common["Authorization"] = '';

        setAuthState({ token: null, refreshToken: null, authenticated: false })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value = {value}>{children}</AuthContext.Provider>
}