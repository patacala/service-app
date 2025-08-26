import React, { createContext, useContext } from 'react';
import { useCategories } from './hooks/useCategory';

const CategoryContext = createContext<any>(null);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { categories, isLoading, error } = useCategories('en');

  return (
    <CategoryContext.Provider value={{ categories, isLoading, error }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => useContext(CategoryContext);
