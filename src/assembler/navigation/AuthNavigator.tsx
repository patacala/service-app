import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IntroScreen} from '@/features/auth/screens/IntroScreen';
import {LoginScreen} from '@/features/auth/screens/LoginScreen';
import { ForgotPasswordScreen } from '@/features/auth/screens/ForgotPasswordScreen';
import {RegisterScreen} from '@/features/auth/screens/RegisterScreen';
import {RegisterCompletionScreen} from '@/features/auth/screens/RegisterCompletionScreen';
import {OtpScreen} from '@/features/auth/screens/OtpScreen';
import {AuthStackParamList} from './types';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Intro">
    <Stack.Screen name="Intro" component={IntroScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="RegisterCompletion" component={RegisterCompletionScreen} />
    <Stack.Screen name="Otp" component={OtpScreen} />
    <Stack.Screen name="Main" component={MainNavigator} />
  </Stack.Navigator>
);
