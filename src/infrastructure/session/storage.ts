import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  AUTH_TOKEN: '@app:auth_token',
} as const;

export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(StorageKeys.AUTH_TOKEN, token);
};

export const getAuthToken = async (): Promise<string | null> =>
  AsyncStorage.getItem(StorageKeys.AUTH_TOKEN);

export const removeAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(StorageKeys.AUTH_TOKEN);
};
