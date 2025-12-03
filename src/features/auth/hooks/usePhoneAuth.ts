import { useState } from 'react';
import { PhoneAuthService } from '../services/PhoneAuthService';
import { FirebaseAuthTypes } from '@/infrastructure/config/firebase';

interface UsePhoneAuthReturn {
  loading: boolean;
  error: string | null;
  sendCode: (phoneNumber: string) => Promise<FirebaseAuthTypes.ConfirmationResult | null>;
  clearError: () => void;
}

/**
 * Single Responsibility: Manage phone auth state
 * Open/Closed: Extensible without modification
 */
export const usePhoneAuth = (): UsePhoneAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const service = new PhoneAuthService();

  const sendCode = async (phoneNumber: string) => {
    setLoading(true);
    setError(null);

    try {
      return await service.sendVerificationCode(phoneNumber);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send verification code';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, sendCode, clearError };
};

