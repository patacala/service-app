import { getAuthToken, removeAuthToken, setAuthToken, getUserData, removeUserData, setUserData, getUserProfile, setUserProfile, removeUserProfile } from './storage';

interface BackendUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  isNewUser: boolean;
}

interface Profile {
  name: string;
  email: string;
  phone: string;
  location_city: string;
  address: string;
}

export class SessionManager {
  private static instance: SessionManager;
  private _token: string | null = null;
  private _user: BackendUser | null = null;
  private _profile: Profile | null = null;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  get token(): string | null {
    return this._token;
  }

  get user(): BackendUser | null {
    return this._user;
  }

  get profile(): Profile | null { 
    return this._profile;
  }

  async initialize(): Promise<void> {
    this._token = await getAuthToken();
    const userData = await getUserData();
    this._user = userData;
    const userProfile = await getUserProfile();
    this._profile = userProfile;
  }

  async setSession(token: string, user: BackendUser | null): Promise<void> {
    this._token = token;
    this._user = user;
    await setAuthToken(token);
    if (user) {
      await setUserData(user); // Guardar los datos del usuario
    } else {
      await removeUserData(); // Si el usuario es null, eliminar datos antiguos
    }
  }

  async clearSession(): Promise<void> {
    this._token = null;
    this._user = null;
    await removeAuthToken();
    await removeUserData(); 
  }

  isAuthenticated(): boolean {
    return !!this._token;
  }

  async updateUser(user: BackendUser | null): Promise<void> {
    this._user = user;
    if (user) {
      await setUserData(user);
    } else {
      await removeUserData(); 
    }
  }

  async updateUserProfile(profile: Profile | null): Promise<void> {
    this._profile = profile;
    if (profile) {
      await setUserProfile(profile);
    } else {
      await removeUserProfile(); 
    }
  }
}
