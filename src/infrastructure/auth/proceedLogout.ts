import { SessionManager } from '@/infrastructure/session';
import { router } from 'expo-router';

export const proceedLogout = async () => {
  const sessionManager = SessionManager.getInstance();
  await sessionManager.clearSession();
  router.replace('/intro');
};
