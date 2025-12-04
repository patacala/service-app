import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Pequeño almacén en memoria para compartir el resultado de signInWithPhoneNumber
// entre pantallas (por ejemplo, de Login -> OTP).
let confirmationResult: FirebaseAuthTypes.ConfirmationResult | null = null;

export const setOtpConfirmationResult = (result: FirebaseAuthTypes.ConfirmationResult) => {
  confirmationResult = result;
};

export const getOtpConfirmationResult = (): FirebaseAuthTypes.ConfirmationResult | null => {
  return confirmationResult;
};