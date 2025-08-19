import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { SessionManager } from '@/infrastructure/session';

// 1. Definimos el tipo del usuario que esperamos de tu backend
interface BackendUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  isNewUser: boolean;
}

// 2. Definimos el tipo del contexto, describiendo qué valores y funciones estarán disponibles
type AuthContextType = {
  user: BackendUser | null;           // Usuario autenticado (datos de tu backend)
  loading: boolean;                   // Indica si el contexto está cargando/inicializando la sesión
  token: string | null;               // Token JWT del usuario (obtenido de tu backend)
  login: (backendToken: string, userData: BackendUser | null) => Promise<void>;
  logout: () => Promise<void>;        // Función que permite cerrar sesión
};

// 3. Creamos el contexto con valores iniciales
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true, // Inicialmente en true mientras SessionManager se inicializa
  token: null,
  login: async () => {}, // Función vacía por defecto
  logout: async () => {}, // Función vacía por defecto
});

// 4. Componente proveedor que envolverá la aplicación y compartirá el contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Ahora, el estado de AuthContext refleja el estado de SessionManager
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<BackendUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Instancia del SessionManager
  const sessionManager = SessionManager.getInstance();

  // Función para iniciar sesión (llama al SessionManager)
  const login = async (backendToken: string, userData: BackendUser | null) => {
    await sessionManager.setSession(backendToken, userData);
    setSessionToken(sessionManager.token);
    setSessionUser(sessionManager.user);
  };

  // Función para cerrar sesión (llama al SessionManager)
  const logout = async () => {
    await sessionManager.clearSession();
    setSessionToken(null);
    setSessionUser(null);
  };

  // Efecto para inicializar el SessionManager al montar el componente
  useEffect(() => {
    const initializeSession = async () => {
      setLoading(true); // Indica que estamos cargando la sesión

      try {
        await sessionManager.initialize(); // Inicializa SessionManager desde SecureStore
        // Actualiza el estado del contexto con los valores del SessionManager
        setSessionToken(sessionManager.token);
        setSessionUser(sessionManager.user);
      } catch (error) {
        console.error('Error al inicializar SessionManager:', error);
        await logout(); // Si hay un error, limpiar la sesión
      } finally {
        setLoading(false); // La inicialización ha terminado
      }
    };

    initializeSession();
  }, []); // Se ejecuta solo una vez al montar

  // Retornamos el proveedor con los valores del contexto
  return (
    <AuthContext.Provider value={{
      user: sessionUser, // Se usa el estado local que refleja SessionManager
      loading,
      token: sessionToken, // Se usa el estado local que refleja SessionManager
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir fácilmente el contexto en cualquier componente
export const useAuth = () => useContext(AuthContext);
