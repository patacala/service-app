import React, { useState, useEffect } from 'react';
import { Image, ImageSourcePropType, Platform, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import auth from '@/infrastructure/config/firebase';

import { Box, Input, theme, Typography } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { Row } from '@/design-system/components/layout/Row/Row';
import { getLoginStyles } from './login/login.style';
import images from '@/assets/images/images';
import { SessionManager } from '@/infrastructure/session';
import { setOtpConfirmationResult } from '@/infrastructure/auth/otpResultManager';
import { useRouter } from 'expo-router';
import { RegisterScreenParams } from '@/types/navigation';

WebBrowser.maybeCompleteAuthSession();

interface LoginFormData {
  phoneNumber: string;
}

interface FormErrors {
  phoneNumber: string;
}

export const LoginScreen = () => {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const styles = getLoginStyles(theme);

  const [inputValues, setInputValues] = useState<LoginFormData>({ phoneNumber: '' });
  const [errors, setErrors] = useState<FormErrors>({ phoneNumber: '' });
  const [loading, setLoading] = useState(false);
  
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleAuth.webClientId,
    iosClientId: Constants.expoConfig?.extra?.googleAuth.iosClientId,
  });

  // Efecto para manejar la respuesta de Google con el SDK Web
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        setLoading(true);
        const { id_token } = response.params;
        const googleCredential = auth.GoogleAuthProvider.credential(id_token);

        try {
          const userCredential = await auth().signInWithCredential(googleCredential);

          const sessionManager = SessionManager.getInstance();
          await sessionManager.initialize();
          const firebaseIdToken = await userCredential.user.getIdToken();
          await sessionManager.setSession(firebaseIdToken, null);

          const params: Partial<RegisterScreenParams> = {
            name: userCredential.user.displayName || undefined,
            email: userCredential.user.email || undefined,
          };

          router.push({
            pathname: '/register',
            params: params,
          });

        } catch (error: any) {
          Toast.show({ type: 'error', text1: t('messages.msg1'), text2: error.message });
        } finally {
          setLoading(false);
        }
      } else if (response?.type === 'error') {
        Toast.show({ type: 'error', text1: t('messages.msg2')});
      }
    };
    handleGoogleResponse();
  }, [response]);

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = { phoneNumber: '' };
    if (!inputValues.phoneNumber.trim() || inputValues.phoneNumber.length !== 10) {
      newErrors.phoneNumber = t('login.phone-invalid');
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Función de Login con Teléfono usando React Native Firebase (nativo, sin reCAPTCHA web)
  const handleLoginWithPhone = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const rawPhone = inputValues.phoneNumber.trim();
    const fullPhoneNumber = `+1${rawPhone}`;

    try {
      const confirmationResult = await auth().signInWithPhoneNumber(fullPhoneNumber);
      setOtpConfirmationResult(confirmationResult as any);
      
      router.push({
        pathname: '/otp',
        params: { phoneNumber: fullPhoneNumber },
      });

      Toast.show({ type: 'info', text1: t('messages.msg3'), text2: `${t('messages.msg4')} ${fullPhoneNumber}` });

    } catch (err: any) {
      Toast.show({ type: 'error', text1: t('messages.msg5'), text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => router.back();

  return (
    <AuthenticationCard
      mainTitle={t('login.title')}
      title={t('login.title')}
      subtitle={t('login.sub-title')}
      onPrimaryButtonPress={handleLoginWithPhone}
      onSecondaryButtonPress={handleGoBack}
      primaryButtonDisabled={loading}
    >
      <Row justify="space-between">
        <Box style={styles.prefix} padding="md"><Typography variant="bodyRegular" colorVariant="secondary">+1</Typography></Box>
        <Input
          label={t('signupCompletion.number')}
          placeholder={t('signupCompletion.text-input-number')}
          keyboardType="numeric"
          value={inputValues.phoneNumber}
          onChangeText={value => handleInputChange('phoneNumber', value.replace(/[^0-9]/g, '').slice(0, 10))}
          error={errors.phoneNumber}
          style={{ width: 250 }}
        />
      </Row>
      <Box marginTop="lg" />
      <Box marginTop="lg">
        <Row justifyContent="center">
          <TouchableOpacity onPress={() => promptAsync()} disabled={!request || loading} activeOpacity={0.7}>
            <Image source={images.gmailLogo as ImageSourcePropType} resizeMode="contain" style={styles.logos} />
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity onPress={() => { /* Lógica para Apple Sign-In aquí */ }} activeOpacity={0.7} disabled={loading}>
              <Image source={images.appleLogo as ImageSourcePropType} resizeMode="contain" style={styles.logos} />
            </TouchableOpacity>
          )}
        </Row>
      </Box>
    </AuthenticationCard>
  );
};