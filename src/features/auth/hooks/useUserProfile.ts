// hooks/useUserProfile.ts
import { useEffect } from 'react';
import { useGetCurrentUserQuery } from '@/features/auth/store';
import { useAuth } from '@/infrastructure/auth/AuthContext';

export const useUserProfile = () => {
  const { data: profile, error, isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const { profileUpdate } = useAuth();

  useEffect(() => {
    if (profile) {
      profileUpdate(profile);
    }
  }, [profile, profileUpdate]);

  return { profile, error, isLoading, isFetching };
};