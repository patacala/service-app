import { getAuthToken, removeAuthToken, setAuthToken, getUserData, removeUserData, setUserData } from './storage';

interface BackendUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  isNewUser: boolean;
}

export class SessionManager {
  private static instance: SessionManager;
  private _token: string | null = null;
  private _user: BackendUser | null = null;

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

  async initialize(): Promise<void> {
    this._token = await getAuthToken();
    const userData = await getUserData();
    this._user = userData;
  }

  async setSession(token: string, user: BackendUser | null): Promise<void> {
    this._token = token;
    this._user = user;
    await setAuthToken(token);
    if (user) {
      await setUserData(user);
    } else {
      await removeUserData();
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
}

