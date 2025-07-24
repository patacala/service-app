import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Post } from '../../features/wall/slices/wall.slice';
import { CardPost } from '../../features/wall/slices/wall.slice';
import { ServiceData } from '@/features/services/slices/services.slice';

// Tabs principales
export type MainTabParamList = {
  ProviderMode: undefined;
  Wall: undefined;
  Services: undefined;
  Profile: undefined;
};

// Stack principal (incluye Tabs y pantallas adicionales como Register)
export type MainStackParamList = {
  Tabs: NavigatorScreenParams<MainTabParamList>;
  ServiceDetail: { post: CardPost };
  Chat: { service: ServiceData };
};

// Stack de autenticación
export type AuthStackParamList = {
  Intro: undefined;
  Login: undefined;
  ForgotPassword: { phonenumber: string; userId: number };
  Register: { name: string; email: string; phonenumber: string };
  RegisterCompletion: undefined;
  Otp: undefined;
};

// Root Stack que controla si mostramos Auth o Main
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
  App: undefined;
  PostDetails: { postId: string };
  CreatePost: undefined;
  EditPost: { post: Post };
};

// Tipos auxiliares
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

declare module '@react-navigation/native' {
  export interface RootParamList extends RootStackParamList {}
}

export type IconName = 'search' | 'star' | 'user-circle' | 'plus-circle';
export type UserRole = 'admin' | 'user' | 'guest';

export type AuthStackNavigationProp = {
  navigate: (screen: keyof AuthStackParamList | keyof MainStackParamList, params?: unknown) => void;
  goBack: () => void;
};
