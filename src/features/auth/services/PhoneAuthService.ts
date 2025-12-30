import firebaseAuth, { FirebaseAuthTypes } from '@/infrastructure/config/firebase';

/**
 * Single Responsibility: Handle ONLY Firebase phone authentication
 */
export class PhoneAuthService {
  async sendVerificationCode(phoneNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
    if (!phoneNumber.startsWith('+')) {
      throw new Error('Phone number must include country code');
    }
    
    return await firebaseAuth().signInWithPhoneNumber(phoneNumber);
  }

  async verifyCode(
    confirmation: FirebaseAuthTypes.ConfirmationResult,
    code: string
  ): Promise<FirebaseAuthTypes.UserCredential | null> {
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      throw new Error('Invalid OTP code format');
    }

    return await confirmation.confirm(code);
  }

  async getIdToken(user: FirebaseAuthTypes.User): Promise<string> {
    return user.getIdToken(true);
  }
}

