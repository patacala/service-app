import {getAuthToken, removeAuthToken, setAuthToken} from './storage';

export class SessionManager {
  private static instance: SessionManager;
  private _token: string | null = null;

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

  async initialize(): Promise<void> {
    this._token = await getAuthToken();
  }

  async setSession(token: string): Promise<void> {
    this._token = token;
    await setAuthToken(token);
  }

  async clearSession(): Promise<void> {
    this._token = null;
    await removeAuthToken();
  }

  isAuthenticated(): boolean {
    return !!this._token;
  }
}
