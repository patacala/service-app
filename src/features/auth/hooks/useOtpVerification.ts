import { useState } from 'react';
import { PhoneAuthService } from '../services/PhoneAuthService';
import { FirebaseAuthTypes } from '@/infrastructure/config/firebase';

interface UseOtpVerificationReturn {
  loading: boolean;
  error: string | null;
  verifyOtp: (
    confirmation: FirebaseAuthTypes.ConfirmationResult,
    code: string
  ) => Promise<string | null>;
  clearError: () => void;
}

/**
 * Single Responsibility: Handle OTP verification
 * Dependency Inversion: Depends on abstractions (PhoneAuthService)
 */
export const useOtpVerification = (): UseOtpVerificationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const service = new PhoneAuthService();

  const verifyOtp = async (
    confirmation: FirebaseAuthTypes.ConfirmationResult,
    code: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const credential = await service.verifyCode(confirmation, code);
      return await service.getIdToken(credential.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid verification code';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, verifyOtp, clearError };
};

