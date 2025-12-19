import { useState, useEffect } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import auth from '@react-native-firebase/auth';

interface UseAppleAuthReturn {
  loading: boolean;
  error: string | null;
  signIn: () => Promise<{
    token: string;
    email: string | null;
    name: string | null;
  } | null>;
  clearError: () => void;
}

/**
 * Single Responsibility: Manage Apple Sign-In state
 * Uses Firebase for authentication
 */
export const useAppleAuth = (): UseAppleAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        setError('Apple Sign-In is not available on this device');
      }
    };
    checkAvailability();
  }, []);

  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      const { identityToken } = credential;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken
      );

      const userCredential = await auth().signInWithCredential(appleCredential);
      const token = await userCredential.user.getIdToken();

      return {
        token,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
      };
    } catch (err: any) {
      // User cancelled
      if (err.code === 'ERR_CANCELED') {
        console.log('[AppleAuth] Sign-in cancelled by user');
        setError('Sign-in cancelled');
        return null;
      }

      console.error('[AppleAuth] Sign-in error:', {
        code: err?.code,
        message: err?.message,
      });

      const message = err?.message || 'Failed to sign in with Apple';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, signIn, clearError };
};