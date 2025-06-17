import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TemporaryData {
  [key: string]: any;
}

interface DataManagerContextType {
  getData: (key: string) => Promise<any>;
  setData: (key: string, value: any) => Promise<void>;
  removeData: (key: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const DataManagerContext = createContext<DataManagerContextType | undefined>(undefined);

// Proveedor del contexto
export const DataManagerProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [data, setData] = useState<TemporaryData>({});

  // Cargar datos al iniciar
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        
        const loadedData: TemporaryData = {};
        result.forEach(([key, value]) => {
          if (key && value) {
            try {
              loadedData[key] = JSON.parse(value);
            } catch (parseError) {
              console.error(`Error parsing data for key ${key}:`, parseError);
            }
          }
        });

        setData(loadedData);
      } catch (error) {
        console.error('Error loading persisted data:', error);
      }
    };

    loadPersistedData();
  }, []);

  const getData = async (key: string) => {
    // Primero intenta obtener de la memoria local
    if (data[key]) return data[key];

    // Si no está en memoria, intenta obtener de AsyncStorage
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        const parsedValue = JSON.parse(value);
        // Actualiza la memoria local
        setData(prevData => ({
          ...prevData,
          [key]: parsedValue
        }));
        return parsedValue;
      }
      return null;
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  };

  // Establecer datos para una clave
  const setDataValue = async (key: string, value: any) => {
    try {
      // Guardar en AsyncStorage
      await AsyncStorage.setItem(key, JSON.stringify(value));

      // Actualizar estado en memoria
      setData(prevData => ({
        ...prevData,
        [key]: value
      }));
    } catch (error) {
      console.error(`Error setting data for key ${key}:`, error);
    }
  };

  // Eliminar datos de una clave
  const removeData = async (key: string) => {
    try {
      // Eliminar de AsyncStorage
      await AsyncStorage.removeItem(key);

      // Eliminar de memoria local
      setData(prevData => {
        const newData = { ...prevData };
        delete newData[key];
        return newData;
      });
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
    }
  };

  // Limpiar todos los datos
  const clearAll = async () => {
    try {
      // Limpiar AsyncStorage
      await AsyncStorage.clear();

      // Limpiar memoria local
      setData({});
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  };

  return (
    <DataManagerContext.Provider value={{ 
      getData, 
      setData: setDataValue, 
      removeData, 
      clearAll 
    }}>
      {children}
    </DataManagerContext.Provider>
  );
};

export const useDataManager = () => {
  const context = useContext(DataManagerContext);
  if (context === undefined) {
    throw new Error('useDataManager debe usarse dentro de un DataManagerProvider');
  }
  return context;
};