import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@/infrastructure/config/firebase';

/**
 * Single Responsibility: Handle ONLY Google Sign-In with Firebase
 */
export class GoogleAuthService {
  private static isConfigured = false;

  static configure(webClientId: string): void {
    if (this.isConfigured) return;

    GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
    });

    this.isConfigured = true;
  }

  async signIn(): Promise<FirebaseAuthTypes.UserCredential> {
    // Check if device supports Google Play services
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Get user info from Google
    const { idToken } = await GoogleSignin.signIn();

    if (!idToken) {
      throw new Error('No ID token returned from Google Sign-In');
    }

    // Create Firebase credential
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign in to Firebase with Google credential
    return auth().signInWithCredential(googleCredential);
  }

  async signOut(): Promise<void> {
    await GoogleSignin.signOut();
  }

  async getIdToken(user: FirebaseAuthTypes.User): Promise<string> {
    return user.getIdToken(true);
  }

  async getCurrentUser() {
    return GoogleSignin.getCurrentUser();
  }
}

