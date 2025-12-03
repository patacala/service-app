import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

import { Box, Input, theme, Typography } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { Row } from '@/design-system/components/layout/Row/Row';
import { getLoginStyles } from './login/login.style';
import { setOtpConfirmationResult } from '@/infrastructure/auth/otpResultManager';
import { usePhoneAuth } from '../hooks/usePhoneAuth';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { PhoneValidator } from '../utils/phoneValidator';
import { useLoginWithFirebaseMutation } from '../store/auth.api';
import { useDispatch } from 'react-redux';
import { setAuthData, setFirebaseToken } from '../store/auth.slice';
import images from '@/assets/images/images';

export const LoginScreen = () => {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const styles = getLoginStyles(theme);
  const dispatch = useDispatch();
  
  const { loading: phoneLoading, sendCode, error: phoneError } = usePhoneAuth();
  const { loading: googleLoading, signIn: googleSignIn, error: googleError } = useGoogleAuth();
  const [loginWithFirebase, { isLoading: backendLoading }] = useLoginWithFirebaseMutation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState('');

  const loading = phoneLoading || googleLoading || backendLoading;

  const handlePhoneChange = (value: string) => {
    const sanitized = PhoneValidator.sanitize(value);
    setPhoneNumber(sanitized);
    setValidationError('');
  };

  const handleLoginWithPhone = async () => {
    const validation = PhoneValidator.validateUSPhone(phoneNumber);
    
    if (!validation.isValid) {
      setValidationError(validation.error || '');
      return;
    }

    const formattedPhone = PhoneValidator.formatWithCountryCode(phoneNumber);
    const confirmation = await sendCode(formattedPhone);

    if (!confirmation) {
      Toast.show({
        type: 'error',
        text1: t('messages.msg5'),
        text2: phoneError || t('messages.msg18')
      });
      return;
    }

    setOtpConfirmationResult(confirmation);
    
    router.push({
      pathname: '/otp',
      params: { phoneNumber: formattedPhone },
    });

    Toast.show({
      type: 'info',
      text1: t('messages.msg3'),
      text2: `${t('messages.msg4')} ${formattedPhone}`
    });
  };

  const handleGoogleSignIn = async () => {
    console.log('before sign')
    const result = await googleSignIn();
    console.log('results11111111111', result);
    if (!result) {
      if (googleError && !googleError.includes('cancelled')) {
        Toast.show({
          type: 'error',
          text1: 'Google Sign-In Failed',
          text2: googleError
        });
      }
      return;
    }

    console.log('result+++++++++++', result);
    dispatch(setFirebaseToken(result.token));

    try {
      // Authenticate with backend
      const authResponse = await loginWithFirebase(result.token).unwrap();
      dispatch(setAuthData(authResponse));

      if (authResponse.user.isNewUser) {
        router.replace({
          pathname: '/register',
          params: {
            email: result.email || '',
            name: result.name || '',
          },
        });

        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: 'Complete your profile',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Welcome back!',
          text2: `Hi ${result.name || 'there'}`,
        });
        router.replace('/home');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Failed',
        text2: error?.message || 'Could not authenticate with server',
      });
    }
  };

  return (
    <AuthenticationCard
      mainTitle={t('login.title')}
      title={t('login.title')}
      subtitle={t('login.sub-title')}
      onPrimaryButtonPress={handleLoginWithPhone}
      onSecondaryButtonPress={() => router.back()}
      primaryButtonDisabled={loading}
    >
      <Row justify="space-between">
        <Box style={styles.prefix} padding="md">
          <Typography variant="bodyRegular" colorVariant="secondary">
            +1
          </Typography>
        </Box>
        <Input
          label={t('signupCompletion.number')}
          placeholder={t('signupCompletion.text-input-number')}
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          error={validationError}
          style={{ width: 250 }}
        />
      </Row>
      
      <Box marginTop="lg" />
      <Row justifyContent="center">
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Image
            source={images.gmailLogo as ImageSourcePropType}
            resizeMode="contain"
            style={styles.logos}
          />
        </TouchableOpacity>
      </Row>
    </AuthenticationCard>
  );
};