import { useState } from 'react';
import { EmailAuthService } from '../services/EmailAuthService';

interface UseEmailAuthReturn {
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  clearError: () => void;
}

/**
 * Single Responsibility: Manage email auth state
 * Open/Closed: Extensible without modification
 */
export const useEmailAuth = (): UseEmailAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const service = new EmailAuthService();

  const signIn = async (email: string, password: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const credential = await service.signInWithEmail(email, password);
      return await service.getIdToken(credential.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const credential = await service.createAccount(email, password);
      return await service.getIdToken(credential.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, signIn, signUp, clearError };
};

