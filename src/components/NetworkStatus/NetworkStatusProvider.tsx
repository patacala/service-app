import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { theme } from '@/design-system';

interface NetworkContextType {
  isConnected: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({ isConnected: true });

export const useNetworkStatus = () => useContext(NetworkContext);

const OfflineBanner = () => (
  <View style={styles.offlineBanner}>
    <Text style={styles.offlineText}>
      No hay conexión a Internet. Algunas funciones pueden no estar disponibles.
    </Text>
  </View>
);

export const NetworkStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
      {isConnected === false && <OfflineBanner />}
    </NetworkContext.Provider>
  );
};

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: theme.colors.colorFeedbackError,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  offlineText: {
    color: theme.colors.colorBaseWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
