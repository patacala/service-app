import { useGetCategoriesQuery } from '@/infrastructure/services/api';
import { ChipOption } from '@/design-system';

export const useCategories = (language: 'en' | 'es' | undefined = 'en') => {
  const { data, isLoading, error } = useGetCategoriesQuery({ language });

  const categories: ChipOption[] =
    data?.categories?.map((c: any) => ({
      id: c.id,
      label: c.name,
    })) || [];

  return { categories, isLoading, error };
};
