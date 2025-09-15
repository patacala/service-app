import React, { useCallback, useEffect, useState } from 'react';
import { useAuth, AuthProvider } from '@/infrastructure/auth/AuthContext';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/design-system/theme/ThemeProvider';
import { store } from '@/store';
import { SessionManager } from '@/infrastructure/session';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataManagerProvider } from '@/infrastructure/dataManager/DataManager';
import { toastConfig } from '@/design-system/components/customToast/CustomToast';
import '@/assembler/config/i18n';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const needsOnboarding = user?.isNewUser === true;
  const pathname = usePathname();
  const router = useRouter();
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (pathname === '/') {
      if ((!user || needsOnboarding)) {
        router.replace('/intro');
      } else if (user && !needsOnboarding) {
        router.replace('/home');
      }
    }
    
    setNavigationReady(true);
  }, [user, loading, needsOnboarding, pathname]);

  if (loading || !navigationReady) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    'CustomIcons': require('@/design-system/assets/fonts/CustomIcons.ttf'),
    'Lexend Deca': require('@/design-system/assets/fonts/LexendDeca-Regular.ttf'),
    'Lexend Deca Bold': require('@/design-system/assets/fonts/LexendDeca-Bold.ttf'),
    'Lexend Deca Medium': require('@/design-system/assets/fonts/LexendDeca-Medium.ttf'),
    'Lexend Deca Regular': require('@/design-system/assets/fonts/LexendDeca-Regular.ttf'),
    'Lexend Deca SemiBold': require('@/design-system/assets/fonts/LexendDeca-SemiBold.ttf'),
  });

  useEffect(() => {
    SessionManager.getInstance().initialize();
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Esperar a que las fuentes se carguen completamente
        if (fontsLoaded || fontError) {
          // Simular cualquier otra preparación necesaria
          await new Promise(resolve => setTimeout(resolve, 100));
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn('Error during app preparation:', e);
        // Aún así, marcar como listo para evitar que la app se quede colgada
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        // Ocultar la splash screen cuando todo esté listo
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <AuthProvider>
              <DataManagerProvider>
                <RootLayoutNav />
                <Toast config={toastConfig} />
              </DataManagerProvider>
            </AuthProvider>
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}