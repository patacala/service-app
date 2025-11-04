import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '@/infrastructure/config/firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { setLoading, setError, setFirebaseToken } from '@/features/auth/store/auth.slice';

export const usePhoneAuth = () => {
  const dispatch = useDispatch();
  const [confirmationState, setConfirmationState] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const sendOTP = async (phoneNumber: string) => {
    setLocalLoading(true);
    dispatch(setLoading(true));
    dispatch(setError(null));
    setLocalError(null);
    
    try {
      // No necesita recaptcha en la implementación nativa
      const confirmation = await auth.signInWithPhoneNumber(phoneNumber);
      setConfirmationState(confirmation);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error sending OTP';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      return false;
    } finally {
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  const confirmOTP = async (code: string) => {
    if (!confirmationState) {
      const errorMessage = 'No confirmation pending';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      return false;
    }

    setLocalLoading(true);
    dispatch(setLoading(true));
    dispatch(setError(null));
    setLocalError(null);
    
    try {
      const result = await confirmationState.confirm(code);
      if (result && result.user) {
        const firebaseToken = await result.user.getIdToken();
        dispatch(setFirebaseToken(firebaseToken));
        return { user: result.user, token: firebaseToken };
      }
      return false;
    } catch (err: any) {
      const errorMessage = err.message || 'Invalid code';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      return false;
    } finally {
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  return {
    sendOTP,
    confirmOTP,
    loading: localLoading,
    error: localError,
    hasConfirmation: !!confirmationState
  };
};
