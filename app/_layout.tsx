import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (loading) return;

    if (pathname === '/') {
      if ((!user || needsOnboarding)) {
        router.replace('/login');
      } 
      else if (user && !needsOnboarding) {
        router.replace('/home');
      }
    }

    SplashScreen.hideAsync();
  }, [user, loading, needsOnboarding, pathname]);

  if (loading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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