import React, { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/infrastructure/config/firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { Box, SendCode, Otp } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { OtpRef } from '@/design-system/components/forms/Otp/types';
import { SessionManager } from '@/infrastructure/session';
import { getOtpConfirmationResult } from '@/infrastructure/auth/otpResultManager';
import { firebaseLogin } from '@/infrastructure/services/api';

interface OtpScreenRouteParams {
  confirmationResult: ConfirmationResult;
  phoneNumber: string;
}

export const OtpScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const route = useRoute();
  const { phoneNumber } = route.params as OtpScreenRouteParams;
  const { t } = useTranslation('auth');

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(() => getOtpConfirmationResult());

  const otpRef = useRef<OtpRef>(null);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  useEffect(() => {
    otpRef.current?.clear();
    otpRef.current?.focusFirst();
  }, []);

  const handleResendCode = async () => {
    try {
      if (recaptchaVerifier.current) {
        const newConfirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
        setConfirmation(newConfirmationResult);
        
        otpRef.current?.clear();
        otpRef.current?.focusFirst();

        Toast.show({
          type: 'success',
          text1: 'Código reenviado',
          text2: `Enviamos un nuevo código a ${phoneNumber}`
        });
      }
    } catch (err: any) {
      console.error('Resend code error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error al reenviar',
        text2: err.message || 'Ocurrió un error inesperado.'
      });
    }
  };

  const handleOtp = async () => {
    if (!confirmation) {
      Toast.show({
        type: 'error',
        text1: 'Error de Sesión',
        text2: 'No se encontró la confirmación. Por favor, vuelve a intentarlo.',
      });
      setIsSubmitting(false);
      return;
    }

    if (!code || code.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Código inválido',
        text2: 'Por favor, ingresa el código completo.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const credential = await confirmation.confirm(code);
      const token = await credential.user.getIdToken();

      const session = SessionManager.getInstance();
      await session.setSession(token, null);

      const response = await firebaseLogin({firebaseToken: token});
      const { token: tk, user } = response.data;
      
      if (user) {
        await session.setSession(tk, user);

        if (user.isNewUser) {
          navigation.navigate('Register', {
            name: "",
            email: "",
            phonenumber: phoneNumber
          });
        } else {
          Toast.show({
            type: 'success',
            text1: 'Verificación exitosa',
            text2: '¡Bienvenido de nuevo!'
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error de autenticación',
          text2: 'No se pudo obtener la información del usuario.'
        });
        await session.clearSession();
      }     
    } catch (error: any) {
      console.error('OTP verification error:', error);
      let errorMessage = 'Ocurrió un error inesperado.';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'El código de verificación es incorrecto.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'El código ha expirado. Por favor, solicita uno nuevo.';
      } else if (error.code === 'auth/session-expired') {
        errorMessage = 'La sesión ha expirado. Por favor, inténtalo de nuevo.';
      }

      Toast.show({
        type: 'error',
        text1: 'Error al verificar',
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <AuthenticationCard
      mainTitle={t('signup.title')}
      activeStepIndicator
      currentStep={3}
      subtitle={t('verification.title')}
      message={t('verification.message')}
      onPrimaryButtonPress={handleOtp}
      onSecondaryButtonPress={handleGoBack}
      primaryButtonDisabled={isSubmitting || !code || code.length !== 6}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={Constants.expoConfig?.extra?.firebase}
        attemptInvisibleVerification={true}
      />
      <Box marginTop="xl">
        <Otp qtyDigits={6} ref={otpRef} onChangeValue={(otp) => setCode(otp.toString())} />
      </Box>
      <SendCode delaySeconds={60} onSend={handleResendCode} />
    </AuthenticationCard>
  );
};