import { initializeApp, getApp, getApps } from 'firebase/app';

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const firebaseConfig = Constants.expoConfig?.extra?.firebase;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CAMBIO: Inicializamos auth con la persistencia de AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});