import { Box, SendCode, Otp} from '@/design-system';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import { useEffect, useRef, useState } from 'react';
import { SessionManager } from '@/infrastructure/session';
import { OtpRef } from '@/design-system/components/forms/Otp/types';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';

// Tipo para los parámetros de la ruta
interface OtpScreenRouteParams {
  confirmation: any; // FirebaseAuthTypes.ConfirmationResult
  phoneNumber: string;
}

export const OtpScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const route = useRoute();
  const { confirmation, phoneNumber } = route.params as OtpScreenRouteParams;
  const { t } = useTranslation('auth');
  const { getData, removeData } = useDataManager();

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otpRef = useRef<OtpRef>(null);

  useEffect(() => {
    // Enfocar el primer campo del OTP al montar el componente
    otpRef.current?.clear();
    otpRef.current?.focusFirst();
  }, []);

  const handleResendCode = async () => {
    try {
      // Reenviar código usando Firebase
      await auth().signInWithPhoneNumber(phoneNumber);
      otpRef.current?.clear();
      otpRef.current?.focusFirst();

      Toast.show({ 
        type: 'success', 
        text1: 'Code sent', 
        text2: `We sent a new code to ${phoneNumber}` 
      });
    } catch (err: any) {
      console.error('Resend code error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error re-sending code',
        text2: err.message || 'There was an unexpected error.'
      });
    }
  };

  const handleOtp = async () => {
    if (!code || code.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid code',
        text2: 'Please enter the complete verification code.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Verificar el código con Firebase
      const credential = await confirmation.confirm(code);
      
      console.log('User signed in successfully:', credential.user);

      // Obtener el token de Firebase
      const token = await credential.user.getIdToken();
      
      // Guardar la sesión
      const session = SessionManager.getInstance();
      await session.setSession(token);

      // Obtener datos adicionales si es necesario para el registro
      const step1 = await getData('registerForm');
      const step2 = await getData('registerCompletionForm');

      // Si tienes datos de registro pendientes, podrías enviarlos a tu backend aquí
      if (step1 && step2) {
        // Opcional: Enviar datos adicionales a tu backend
        // await completUserRegistration({
        //   firebaseUid: credential.user.uid,
        //   city: step2.city,
        //   servicetagids: step2.selectedServices,
        //   // otros datos...
        // });
        
        // Limpiar la data de registro
        await removeData('registerForm');
        await removeData('registerCompletionForm');
      }

      Toast.show({
        type: 'success',
        text1: 'Verification successful',
        text2: 'Welcome!'
      });

      // Redirigir a la pantalla principal
      navigation.navigate('Main');
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'There was an unexpected error.';
      
      // Manejar diferentes tipos de errores de Firebase
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'The verification code is incorrect.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'The verification code has expired. Please request a new one.';
      } else if (error.code === 'auth/session-expired') {
        errorMessage = 'The session has expired. Please try again.';
      }

      Toast.show({
        type: 'error',
        text1: 'Error verifying code',
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
      <Box marginTop="xl">
        <Otp qtyDigits={6} ref={otpRef} onChangeValue={(otp) => setCode(otp.toString())} />
      </Box>
      <SendCode delaySeconds={60} onSend={handleResendCode} />
    </AuthenticationCard>
  );
};