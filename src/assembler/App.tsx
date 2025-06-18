// App.tsx
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/design-system/theme/ThemeProvider';
import { store } from '@/store';
import { AppNavigator } from './navigation/AppNavigator';
import { SessionManager } from '@/infrastructure/session';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { DataManagerProvider } from '@/infrastructure/dataManager/DataManager';
import { toastConfig } from '@/design-system/components/customToast/CustomToast';

const App = () => {
  const [fontsLoaded] = useFonts({
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
    enableScreens();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <DataManagerProvider>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
            >
              <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.container}>
                  <AppNavigator />
                  <Toast config={toastConfig} /> 
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </DataManagerProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
