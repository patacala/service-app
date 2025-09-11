import { BookService } from '@/features/services/store';
import { CardPost } from '@/features/wall/slices/wall.slice';

export type ServiceDetailScreenParams = { 
  post: CardPost;
};

export type ChatScreenParams = {
  service: BookService;
};

export type RegisterScreenParams = {
  userId: string;
  name: string;
  email: string;
  phonenumber: string;
};

export type MainTabParamList = {
  home: undefined;
  'provider-mode': undefined;
  services: undefined;
  profile: undefined;
};

export type IconName = 'search' | 'star' | 'user-circle' | 'plus-circle';
export type UserRole = 'admin' | 'user' | 'guest';