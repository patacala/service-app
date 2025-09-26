// Interfaces para Category
export interface Category {
  id: string;
  name: string;
  slug: string;
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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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
  language?: string;
}

export interface GetUserCategoriesParams {
  userId: string;
  page?: number;
  limit?: number;
}