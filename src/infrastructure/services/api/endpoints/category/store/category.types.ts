// Interfaces para Category
export interface Category {
  id: string;
  name_es: string;
  name_en: string;
  slug_es: string;
  slug_en: string;
  parent_id?: string;
  parent?: Category;
  children?: Category[];
  users?: UserCategory[];
}

// Interface para UserCategory
export interface UserCategory {
  userId: string;
  categoryId: string;
  category?: Category;
}

// Response types
export interface CategoriesResponse {
  categories: Category[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CategoryResponse {
  category: Category;
  message?: string;
}

export interface UserCategoriesResponse {
  userCategories: UserCategory[];
  total?: number;
}

// Query parameters para obtener datos
export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  parent_id?: string;
  search?: string;
  language?: 'es' | 'en';
}

export interface GetUserCategoriesParams {
  userId: string;
  page?: number;
  limit?: number;
}