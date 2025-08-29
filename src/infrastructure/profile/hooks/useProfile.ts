import { useGetCurrentUserQuery } from '@/features/auth/store';

export const useProfile = () => {
const { data: profile, isLoading, error } = useGetCurrentUserQuery();
  return { profile, isLoading, error };
};
