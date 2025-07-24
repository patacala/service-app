// Importamos React y los hooks necesarios
import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
// Importamos funciones y tipos de Firebase Auth
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
// Importamos la configuración de Firebase previamente inicializada
import { auth } from '@/infrastructure/config/firebase';

// Definimos el tipo del contexto, describiendo qué valores y funciones estarán disponibles
type AuthContextType = {
  user: User | null;           // Usuario autenticado o null si no hay sesión
  loading: boolean;            // Indica si la app sigue verificando el estado de autenticación
  token: string | null;        // Token JWT del usuario, útil para llamadas a backend
  logout: () => Promise<void>; // Función que permite cerrar sesión
};

// Creamos el contexto con valores iniciales
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  logout: async () => {}, // Función vacía por defecto para evitar errores
});

// Componente proveedor que envolverá la aplicación y compartirá el contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);      // Estado del usuario
  const [loading, setLoading] = useState(true);             // Estado para indicar carga inicial
  const [token, setToken] = useState<string | null>(null);  // Estado para almacenar el token

  // Al montar el componente, nos suscribimos a los cambios de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);     // Actualizamos el usuario actual
      setLoading(false);         // Dejamos de mostrar estado de carga

      if (firebaseUser) {
        // Si hay un usuario, obtenemos su token de acceso
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
      } else {
        // Si no hay usuario, limpiamos el token
        setToken(null);
      }
    });

    // Devuelve la función para desuscribirse al desmontar el componente
    return unsubscribe;
  }, []);

  // Función para cerrar sesión del usuario
  const logout = async () => {
    try {
      await signOut(auth);  // Llamamos a Firebase para cerrar la sesión
      setUser(null);        // Limpiamos el estado del usuario
      setToken(null);       // Limpiamos el token
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  // Retornamos el proveedor con los valores del contexto
  return (
    <AuthContext.Provider value={{ user, loading, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir fácilmente el contexto en otros componentes
export const useAuth = () => useContext(AuthContext);
