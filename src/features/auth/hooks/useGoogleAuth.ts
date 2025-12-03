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
    // iOS client ID from GoogleService-Info.plist
    const WEB_CLIENT_ID = '1006263162496-h58tvggmg4aomv6q8iggn03d7gqrt7g5.apps.googleusercontent.com';
    GoogleAuthService.configure(WEB_CLIENT_ID);
  }, []);

  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const credential = await service.signIn();
      const token = await service.getIdToken(credential.user);

      return {
        token,
        email: credential.user.email,
        name: credential.user.displayName,
      };
    } catch (err: any) {
      // User cancelled
      if (err.code === '-5') {
        setError('Sign-in cancelled');
        return null;
      }

      const message = err.message || 'Failed to sign in with Google';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, signIn, clearError };
};

