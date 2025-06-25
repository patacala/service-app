import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { SessionManager } from '../../infrastructure/session';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const sessionManager = SessionManager.getInstance();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      await sessionManager.initialize();
      setToken(sessionManager.token);
    };

    initializeSession();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};
