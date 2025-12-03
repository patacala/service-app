import auth, { FirebaseAuthTypes } from '@/infrastructure/config/firebase';

/**
 * Single Responsibility: Handle ONLY Firebase email/password authentication
 */
export class EmailAuthService {
  async signInWithEmail(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    return auth().signInWithEmailAndPassword(email, password);
  }

  async createAccount(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    return auth().createUserWithEmailAndPassword(email, password);
  }

  async sendPasswordReset(email: string): Promise<void> {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    return auth().sendPasswordResetEmail(email);
  }

  async getIdToken(user: FirebaseAuthTypes.User): Promise<string> {
    return user.getIdToken(true);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

