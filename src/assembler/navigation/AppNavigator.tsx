import {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {RootStackParamList} from './types';
import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';
import {SessionManager} from '../../infrastructure/session';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const sessionManager = SessionManager.getInstance();

  useEffect(() => {
    if (token) {
      sessionManager.setSession(token);
    } else {
      sessionManager.clearSession();
    }
  }, [token]);

  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!token ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </>
  );
};
