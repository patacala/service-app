import React, { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/infrastructure/config/firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { Box, SendCode, Otp } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { OtpRef } from '@/design-system/components/forms/Otp/types';
import { getOtpConfirmationResult } from '@/infrastructure/auth/otpResultManager';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { useLoginMutation } from '../store';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RegisterScreenParams } from '@/types/navigation';

export const OtpScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber: string }>();
  const { phoneNumber } = params;
  const { t } = useTranslation('auth');
  const { clearAll } = useDataManager();

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(() => getOtpConfirmationResult());

  const otpRef = useRef<OtpRef>(null);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const { login } = useAuth();
  const [loginWithFirebase, { isLoading: isLoadingAuthF}] = useLoginMutation();
  
  useEffect(() => {
    otpRef.current?.clear();
    otpRef.current?.focusFirst();
    clearAll();
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
          text1: t("messages.msg6"),
          text2: `${t("messages.msg7")} ${phoneNumber}`
        });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg8"),
        text2: t("messages.msg9")
      });
    }
  };

  const handleOtp = async () => {
    if (!confirmation) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg10"),
        text2: t("messages.msg11"),
      });
      return;
    }

    if (!code || code.length !== 6) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg12"),
        text2: t("messages.msg13"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const credential = await confirmation.confirm(code);
      const firebaseToken = await credential.user.getIdToken();

      // Colocamos el token de firebase
      await login(firebaseToken, null);

      const { user, token } = await loginWithFirebase().unwrap();

      if (!isLoadingAuthF && user && token) {
        // Colocamos el token del backend
        await login(token, user);

        if (user.isNewUser) {
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
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg17"),
        text2: t("messages.msg18"),
      });
    } finally {
      setIsSubmitting(false);
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