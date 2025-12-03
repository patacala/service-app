import { useState, useEffect } from 'react';
import { GoogleAuthService } from '../services/GoogleAuthService';

interface UseGoogleAuthReturn {
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
 * Single Responsibility: Manage Google Sign-In state
 * Reads web client ID from GoogleService-Info.plist automatically
 */
export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const service = new GoogleAuthService();

  useEffect(() => {
    // Web client ID configurado vía env para no acoplarlo al código
    const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENTID;

    if (!WEB_CLIENT_ID) {
      console.error(
        '[GoogleAuth] Missing EXPO_PUBLIC_WEB_CLIENTID. ' +
        'Define it en tu .env con el Web client ID de Google (OAuth 2.0).'
      );
      setError('Google Sign-In is not configured correctly (missing client ID).');
      return;
    }

    GoogleAuthService.configure(WEB_CLIENT_ID);
  }, []);

  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const credential = await service.signIn();
      const token = await service.getIdToken(credential.user);

      // Debug: log successful Google + Firebase auth payload
      console.log('[GoogleAuth] Firebase user:', {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName,
      });

      return {
        token,
        email: credential.user.email,
        name: credential.user.displayName,
      };
    } catch (err: any) {
      // User cancelled
      if (err?.code === '-5') {
        console.log('[GoogleAuth] Sign-in cancelled by user');
        setError('Sign-in cancelled');
        return null;
      }

      console.error('[GoogleAuth] Sign-in error:', {
        code: err?.code,
        message: err?.message,
      });

      const message = err?.message || 'Failed to sign in with Google';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, signIn, clearError };
};

