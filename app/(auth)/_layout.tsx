import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user && !user.isNewUser) {
        router.replace('/home');
      } else if (!user) {
        router.replace('/intro');
      }
    }
  }, [user, loading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="login" />
    </Stack>
  );
}