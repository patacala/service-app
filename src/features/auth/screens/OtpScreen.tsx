import { Box, SendCode, Otp} from '@/design-system';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import { useEffect, useRef, useState } from 'react';
import { requestOtp, verifyOtpInitial } from '@/infrastructure/services/api/endpoints/auth.api';
import { SessionManager } from '@/infrastructure/session';
import { OtpRef } from '@/design-system/components/forms/Otp/types';
import Toast from 'react-native-toast-message';

export const OtpScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { t } = useTranslation('auth');
  const { getData, removeData } = useDataManager();

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otpRef = useRef<OtpRef>(null);

  const sendCodeOnMount = async () => {
    try {
      const step1 = await getData('registerForm');
      const step2 = await getData('registerCompletionForm');

      if (!step1?.userId || !step2?.phoneNumber) return;
      await requestOtp({ userId: step1.userId, phonenumber: step2.phoneNumber});
      Toast.show({ type: 'success', text1: 'Code sent', text2: 'Check your SMS.' });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error sending OTP automatically',
        text2: error?.response?.data?.message || 'There was an unexpected error.',
      });
    }
  };

  useEffect(() => {
    sendCodeOnMount().then(() => {
      otpRef.current?.clear();
      otpRef.current?.focusFirst();
    });
  }, []);

  const handleResendCode = async () => {
    try {
      const step1 = await getData('registerForm');
      const step2 = await getData('registerCompletionForm');
      if (!step1?.userId || !step2?.phoneNumber) throw new Error('Datos incompletos');

      await requestOtp({ userId: step1.userId, phonenumber: step2.phoneNumber });

      // Reiniciar campos OTP
      otpRef.current?.clear();
      otpRef.current?.focusFirst();

      Toast.show({ type: 'success', text1: 'Code sent', text2: 'Check your SMS.' });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error re-sending OTP'
      });
    }
  };

  const handleOtp = async () => {
    if (!code || code.length !== 4) return;

    setIsSubmitting(true);

    try {
      const step1 = await getData('registerForm');
      const step2 = await getData('registerCompletionForm');

      if (!step1?.userId || !step2) throw new Error('Faltan datos');

      // Verificar OTP
      const response = await verifyOtpInitial({
        userId: step1.userId,
        code,
        city: step2.city,
        servicetagids: step2.selectedServices,
      });

      const { token, user } = response.data;

      const session = SessionManager.getInstance();
      await session.setSession(token);

      // Limpiar la data
      await removeData('registerForm');
      await removeData('registerCompletionForm');

      // Redirigir a Home o Dashboard
      navigation.navigate('Main');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error verifying OTP',
        text2: error?.response?.data?.message || 'There was an unexpected error.',
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
      primaryButtonDisabled={isSubmitting}
    >
      <Box marginTop="xl">
        <Otp ref={otpRef} onChangeValue={(otp) => setCode(otp.toString())} />
      </Box>
      <SendCode delaySeconds={10} onSend={handleResendCode} />
    </AuthenticationCard>
  );
};
