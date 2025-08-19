import * as SecureStore from 'expo-secure-store';

export const StorageKeys = {
  AUTH_TOKEN: 'appauthtoken', 
  USER_DATA: 'appuserdata',
} as const;

export const setAuthToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(StorageKeys.AUTH_TOKEN, token);
};

export const getAuthToken = async (): Promise<string | null> =>
  SecureStore.getItemAsync(StorageKeys.AUTH_TOKEN);

export const removeAuthToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(StorageKeys.AUTH_TOKEN);
};

export const setUserData = async (userData: any): Promise<void> => {
  await SecureStore.setItemAsync(StorageKeys.USER_DATA, JSON.stringify(userData));
};

export const getUserData = async (): Promise<any | null> => {
  const data = await SecureStore.getItemAsync(StorageKeys.USER_DATA);
  return data ? JSON.parse(data) : null;
};

export const removeUserData = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(StorageKeys.USER_DATA);
};
