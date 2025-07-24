import React, { useState, useEffect, useRef } from 'react';
import { Image, ImageSourcePropType, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

import { GoogleAuthProvider, signInWithCredential, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/infrastructure/config/firebase';

import { Box, Input, theme, Typography } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { Row } from '@/design-system/components/layout/Row/Row';
import { getLoginStyles } from './login/login.style';
import images from '@/assets/images/images';
import { SessionManager } from '@/infrastructure/session';
import { setOtpConfirmationResult } from '@/infrastructure/auth/otpResultManager';

WebBrowser.maybeCompleteAuthSession();

interface LoginFormData {
  phoneNumber: string;
}

interface FormErrors {
  phoneNumber: string;
}

export const LoginScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { t } = useTranslation('auth');
  const styles = getLoginStyles(theme);
  const recaptchaVerifier = useRef(null);

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
        const googleCredential = GoogleAuthProvider.credential(id_token);

        try {
          const userCredential = await signInWithCredential(auth, googleCredential);

          const sessionManager = SessionManager.getInstance();
          await sessionManager.initialize();
          const firebaseIdToken = await userCredential.user.getIdToken();
          await sessionManager.setSession(firebaseIdToken);

          navigation.navigate('Register', {
            name: userCredential.user.displayName,
            email: userCredential.user.email,
          });

        } catch (error: any) {
          Toast.show({ type: 'error', text1: 'Error de Firebase', text2: error.message });
        } finally {
          setLoading(false);
        }
      } else if (response?.type === 'error') {
        Toast.show({ type: 'error', text1: 'Inicio de sesión cancelado' });
      }
    };
    handleGoogleResponse();
  }, [response, navigation]);

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

  // CAMBIO: Función de Login con Teléfono actualizada para el SDK Web
  const handleLoginWithPhone = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const rawPhone = inputValues.phoneNumber.trim();
    const fullPhoneNumber = `+1${rawPhone}`;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier.current!);
      setOtpConfirmationResult(confirmationResult);
      
      navigation.navigate('Otp', {
        phoneNumber: fullPhoneNumber,
      });

      Toast.show({ type: 'info', text1: 'Código enviado', text2: `Enviamos un código a ${fullPhoneNumber}` });

    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Fallo en el envío', text2: err.message });
      console.error('Phone login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigation.goBack();

  return (
    <AuthenticationCard
      mainTitle={t('login.title')}
      title={t('login.title')}
      subtitle={t('login.sub-title')}
      onPrimaryButtonPress={handleLoginWithPhone}
      onSecondaryButtonPress={handleGoBack}
      primaryButtonDisabled={loading || !request}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={Constants.expoConfig?.extra?.firebase}
        attemptInvisibleVerification={true}
        title="Verifica que no eres un robot"
        cancelLabel="Cancelar"
      />
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