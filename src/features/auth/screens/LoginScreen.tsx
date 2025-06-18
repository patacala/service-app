import React, { useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Box, Button, Input, theme, Typography } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { login } from '@/infrastructure/services/api/endpoints/auth.api';
import { SessionManager } from '@/infrastructure/session/session';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { Row } from '@/design-system/components/layout/Row/Row';
import { getLoginStyles } from './login/login.style';
import Toast from 'react-native-toast-message';

import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth } from '@/infrastructure/auth/firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';

WebBrowser.maybeCompleteAuthSession();

interface LoginFormData {
  phoneNumber: string;
  password: string;
}

interface FormErrors {
  phoneNumber: string;
  password: string;
}

export const LoginScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { t } = useTranslation('auth');
  const session = SessionManager.getInstance();
  const styles = getLoginStyles(theme);

  const [inputValues, setInputValues] = useState<LoginFormData>({
    phoneNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    phoneNumber: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = { phoneNumber: '', password: '' };

    if (!inputValues.phoneNumber.trim()) {
      newErrors.phoneNumber = t('login.phone-required');
      isValid = false;
    } else if (inputValues.phoneNumber.length !== 10) {
      newErrors.phoneNumber = t('login.phone-invalid');
      isValid = false;
    }

    if (!inputValues.password) {
      newErrors.password = t('login.password-required');
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please correct the highlighted fields.',
      });
    }

    return isValid;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const rawPhone = inputValues.phoneNumber.trim();
      const email = `${rawPhone}@auth.com`;
      const password = inputValues.password;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await login({ firebaseToken: idToken });
      const { token } = response.data;

      await session.setSession(token);

      Toast.show({
        type: 'success',
        text1: 'Login successful',
      });

      navigation.navigate('Main');
    } catch (err: any) {
      const isFirebaseError =
        err?.code?.startsWith('auth/') ||
        err?.response?.status === 401;

      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: isFirebaseError
          ? 'Invalid phone number or password.'
          : 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();

      if (result.type !== 'success') return;

      const credential = GoogleAuthProvider.credential(result.authentication?.idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const idToken = await userCredential.user.getIdToken();

      const response = await login({ firebaseToken: idToken });
      const { token } = response.data;

      await session.setSession(token);
      Toast.show({ type: 'success', text1: 'Login successful' });
      navigation.navigate('Main');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Google login could not complete.',
      });
    }
  };

  const handleAppleLogin = async () => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleCredential.identityToken!,
      });

      const userCredential = await signInWithCredential(auth, credential);
      const idToken = await userCredential.user.getIdToken();

      const response = await login({ firebaseToken: idToken });
      const { token } = response.data;

      await session.setSession(token);
      Toast.show({ type: 'success', text1: 'Login successful' });
      navigation.navigate('Main');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Apple login could not complete.',
      });
    }
  };

  const handleForgotPassword = () => {
    let errorMessage = '';

    if (!inputValues.phoneNumber.trim()) {
      errorMessage = t('signupCompletion.number-required');
    } else if (inputValues.phoneNumber.length !== 10) {
      errorMessage = t('signupCompletion.number-invalid');
    }

    if (errorMessage) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: errorMessage,
      }));

      Toast.show({
        type: 'error',
        text1: 'Phone required',
        text2: errorMessage,
      });
      return;
    }

    navigation.navigate('ForgotPassword', {
      phonenumber: `+57${inputValues.phoneNumber}`,
    });
  };

  const handleGoBack = () => navigation.goBack();

  return (
    <AuthenticationCard
      mainTitle={t('login.title')}
      title={t('login.title')}
      subtitle={t('login.sub-title')}
      onPrimaryButtonPress={handleLogin}
      onSecondaryButtonPress={handleGoBack}
      primaryButtonDisabled={loading}
    >
      <Row justify="space-between">
        <Box style={styles.prefix} padding="md">
          <Typography variant="bodyRegular" colorVariant="secondary">
            +57
          </Typography>
        </Box>
        <Input
          label={t('signupCompletion.number')}
          placeholder={t('signupCompletion.text-input-number')}
          keyboardType="numeric"
          value={inputValues.phoneNumber}
          onChangeText={(value) =>
            handleInputChange(
              'phoneNumber',
              value.replace(/[^0-9]/g, '').slice(0, 10)
            )
          }
          error={errors.phoneNumber}
          style={{ width: 250 }}
        />
      </Row>
      <Input
        label={t('login.password-input')}
        placeholder={t('login.text-input-password')}
        variant="password"
        value={inputValues.password}
        onChangeText={(value) => handleInputChange('password', value)}
        error={errors.password}
      />

      <Box alignItems="center">
        <Button
          variant="ghost"
          label={t('login.forgot-password')}
          onPress={handleForgotPassword}
          style={{ width: '100%', maxWidth: 195 }}
        />
      </Box>

      <Box marginTop="lg">
        <Button
          label="Continue with Google"
          onPress={handleGoogleLogin}
          style={{ marginBottom: 10 }}
        />
        {Platform.OS === 'ios' && (
          <Button
            label="Continue with Apple"
            onPress={handleAppleLogin}
          />
        )}
      </Box>
    </AuthenticationCard>
  );
};
