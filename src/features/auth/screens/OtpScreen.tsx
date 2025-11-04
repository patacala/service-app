import React, { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { Box, SendCode, Otp } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { OtpRef } from '@/design-system/components/forms/Otp/types';
import { usePhoneAuth } from '@/infrastructure/auth/hooks/usePhoneAuth';
import { useLoginWithFirebaseMutation } from '../store/auth.api';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../store/auth.slice';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RegisterScreenParams } from '@/types/navigation';

export const OtpScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber: string }>();
  const { phoneNumber } = params;
  const { t } = useTranslation('auth');
  const { clearAll } = useDataManager();
  const dispatch = useDispatch();

  const [code, setCode] = useState('');
  const otpRef = useRef<OtpRef>(null);
  
  // Hooks para autenticación
  const { confirmOTP, loading: otpLoading, error: otpError } = usePhoneAuth();
  const [loginWithFirebase, { isLoading: loginLoading, error: loginError }] = useLoginWithFirebaseMutation();
  
  // Estado de carga combinado
  const loading = otpLoading || loginLoading;
  
  useEffect(() => {
    otpRef.current?.clear();
    otpRef.current?.focusFirst();
    clearAll();
  }, []);

  useEffect(() => {
    if (otpError) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg17"),
        text2: otpError
      });
    }
  }, [otpError]);
  
  useEffect(() => {
    if (loginError) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg17"),
        text2: 'Error al autenticar con el servidor'
      });
    }
  }, [loginError]);

  const handleResendCode = async () => {
    try {
      // La lógica de reenvío se implementaría aquí usando usePhoneAuth
      // Por ahora, mostramos un mensaje informativo
      Toast.show({
        type: 'info',
        text1: t("messages.msg6"),
        text2: `${t("messages.msg7")} ${phoneNumber}`
      });
      
      otpRef.current?.clear();
      otpRef.current?.focusFirst();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg8"),
        text2: t("messages.msg9")
      });
    }
  };

  const handleOtp = async () => {
    if (!code || code.length !== 6) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg12"),
        text2: t("messages.msg13"),
      });
      return;
    }

    try {
      // Confirmar el código OTP con Firebase
      const result = await confirmOTP(code);
      
      
      if (result && 'token' in result) {
        // Autenticar con el backend usando el token de Firebase
        const authResponse = await loginWithFirebase(result.token).unwrap();
        
        // Guardar los datos de autenticación en el store de Redux
        dispatch(setAuthData(authResponse));
        
        if (authResponse.user.isNewUser) {
          const registerParams: Partial<RegisterScreenParams> = {
            phonenumber: phoneNumber,
            name: "",
            email: "",
          };

          router.replace({
            pathname: '/register',
            params: registerParams,
          });

          Toast.show({
            type: 'success',
            text1: t("messages.msg14"),
            text2: t("messages.msg15"),
          });
        } else {
          Toast.show({
            type: 'success',
            text1: t("messages.msg14"),
            text2: t("messages.msg16")
          });

          router.replace('/home');
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg17"),
        text2: t("messages.msg18"),
      });
    }
  };

  const handleGoBack = () => {
    router.back();
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
      primaryButtonDisabled={loading || !code || code.length !== 6}
    >
      <Box marginTop="xl">
        <Otp qtyDigits={6} ref={otpRef} onChangeValue={(otp) => setCode(otp.toString())} />
      </Box>
      <SendCode delaySeconds={60} onSend={handleResendCode} />
    </AuthenticationCard>
  );
};