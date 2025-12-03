import React, { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Box, SendCode, Otp } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { OtpRef } from '@/design-system/components/forms/Otp/types';
import { useLoginWithFirebaseMutation } from '../store/auth.api';
import { setAuthData, setFirebaseToken } from '../store/auth.slice';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import { RegisterScreenParams } from '@/types/navigation';
import { getOtpConfirmationResult } from '@/infrastructure/auth/otpResultManager';
import { useOtpVerification } from '../hooks/useOtpVerification';

export const OtpScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber: string }>();
  const { phoneNumber } = params;
  const { t } = useTranslation('auth');
  const { clearAll } = useDataManager();
  const dispatch = useDispatch();

  const [code, setCode] = useState('');
  const otpRef = useRef<OtpRef>(null);
  
  const { loading: otpLoading, verifyOtp, error: otpError } = useOtpVerification();
  const [loginWithFirebase, { isLoading: loginLoading, error: loginError }] = useLoginWithFirebaseMutation();
  
  const loading = otpLoading || loginLoading;
  
  useEffect(() => {
    otpRef.current?.clear();
    otpRef.current?.focusFirst();
    clearAll();
  }, []);

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

    const confirmation = getOtpConfirmationResult();
    if (!confirmation) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg17"),
        text2: t("messages.msg18"),
      });
      return;
    }

    // Verify OTP with Firebase
    const firebaseToken = await verifyOtp(confirmation, code);
    
    if (!firebaseToken) {
      Toast.show({
        type: 'error',
        text1: t('messages.msg17'),
        text2: otpError || t('messages.msg18'),
      });
      return;
    }

    dispatch(setFirebaseToken(firebaseToken));

    try {
      // Authenticate with backend
      const authResponse = await loginWithFirebase(firebaseToken).unwrap();
      dispatch(setAuthData(authResponse));

      if (authResponse.user.isNewUser) {
        router.replace({
          pathname: '/register',
          params: {
            phonenumber: phoneNumber,
            name: '',
            email: '',
          } as Partial<RegisterScreenParams>,
        });

        Toast.show({
          type: 'success',
          text1: t('messages.msg14'),
          text2: t('messages.msg15'),
        });
      } else {
        Toast.show({
          type: 'success',
          text1: t('messages.msg14'),
          text2: t('messages.msg16'),
        });
        router.replace('/home');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('messages.msg17'),
        text2: error?.message || t('messages.msg18'),
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