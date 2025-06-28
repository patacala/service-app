import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Post } from '../../features/wall/slices/wall.slice';
import { CardPost } from '../../features/wall/slices/wall.slice';
import { ServiceData } from '@/features/services/slices/services.slice';

export type MainTabParamList = {
  ProviderMode: undefined;
  Wall: undefined;
  Services: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<MainTabParamList>;
  ServiceDetail: { post: CardPost };
  Chat: undefined;
};

export type AuthStackParamList = {
  Intro: undefined;
  Login: undefined;
  ForgotPassword: { phonenumber: string; userId: number };
  Register: { name: string; email: string; phonenumber: string };
  RegisterCompletion: undefined;
  Otp: undefined;
  Main: NavigatorScreenParams<MainStackParamList>;
  Chat: { service: ServiceData };
  ProvMode: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  PostDetails: { postId: string };
  CreatePost: undefined;
  EditPost: { post: Post };
};

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
