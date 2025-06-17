import React, { useState, useRef } from 'react';
import { Box, SendCode, Otp, Input, SendCodeRef } from '@/design-system';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackNavigationProp, AuthStackParamList } from '@/assembler/navigation/types';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { requestOtpRecovery, verifyOtpSimple, changePasswordWithToken } from '@/infrastructure/services/api/endpoints/auth.api';
import Toast from 'react-native-toast-message';
import { OtpRef } from '@/design-system/components/forms/Otp/types';

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ForgotPassword'>>();
  const { phonenumber = '' } = route.params || {};

  const { t } = useTranslation('auth');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');

  const otpRef = useRef<OtpRef>(null);
  const sendCodeRef = useRef<SendCodeRef>(null);

  const handleSendCode = async () => {
    if (!phonenumber) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Phone number not provided.' });
      throw new Error('Phone number not provided');
    }

    try {
      await requestOtpRecovery({ phonenumber });

      otpRef.current?.clear();
      otpRef.current?.focusFirst();

      Toast.show({ type: 'success', text1: 'Code sent', text2: 'Check your SMS.' });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error?.response?.data?.message });
      // Stop countdown if it started (extra safety)
      sendCodeRef.current?.stop();
      throw error; // Make sure SendCode knows it failed
    }
  };

  const handleOtpSubmit = async () => {
    if (!code || code.length !== 4) {
      Toast.show({ type: 'error', text1: 'Invalid code', text2: 'OTP must have 4 digits.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await verifyOtpSimple({
        phonenumber,
        code,
      });

      const { recoveryToken } = response.data;
      setRecoveryToken(recoveryToken);
      setIsOtpValid(true);

      Toast.show({
        type: 'success',
        text1: 'Valid code',
        text2: 'Now enter your new password.',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: error?.response?.data?.message || 'Error validating OTP.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || !repeatPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Complete both fields.' });
      return;
    }

    if (newPassword !== repeatPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await changePasswordWithToken({
        token: recoveryToken,
        newPassword,
        repeatPassword,
      });

      Toast.show({
        type: 'success',
        text1: 'Password updated',
        text2: 'You can now log in.',
      });

      navigation.navigate('Login');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error updating password',
        text2: error?.response?.data?.message || 'An error occurred while updating the password.',
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
      mainTitle={t('forgotPassword.title')}
      title={t('forgotPassword.title')}
      subtitle={t('forgotPassword.sub-title')}
      onPrimaryButtonPress={isOtpValid ? handlePasswordReset : handleOtpSubmit}
      onSecondaryButtonPress={handleGoBack}
      primaryButtonDisabled={isSubmitting}
    >
      {!isOtpValid ? (
        <>
          <Box marginTop="xl">
            <Otp ref={otpRef} onChangeValue={(otp) => setCode(otp.toString())} />
          </Box>
          <SendCode
            ref={sendCodeRef}
            initialLabel={`Send code to ${phonenumber}`}
            delaySeconds={10}
            onSend={handleSendCode}
          />
        </>
      ) : (
        <Box gap="md" marginTop="md">
          <Input
            label={"New Password"}
            placeholder={"New Password"}
            variant="password"
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Input
            label={"Repeat Password"}
            placeholder={"Repeat Password"}
            variant="password"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
          />
        </Box>
      )}
    </AuthenticationCard>
  );
};
