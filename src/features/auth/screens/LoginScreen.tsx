import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Box, Button, Input, theme, Typography } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { login } from '@/infrastructure/services/api/endpoints/auth.api';
import { SessionManager } from '@/infrastructure/session/session';
import { LoginPayload } from '@/infrastructure/services/api/types/auth.types';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { Row } from '@/design-system/components/layout/Row/Row';
import { getLoginStyles } from './login/login.style';
import Toast from 'react-native-toast-message';

interface LoginFormData {
  phoneNumber: string;
  password: string;
}

interface FormErrors {
  phoneNumber: string;
  password: string;
}

export const LoginScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { t } = useTranslation('auth');
  const session = SessionManager.getInstance();
  const styles = getLoginStyles(theme);

  const [inputValues, setInputValues] = useState<LoginFormData>({
    phoneNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    phoneNumber: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = { phoneNumber: '', password: '' };

    if (!inputValues.phoneNumber.trim()) {
      newErrors.phoneNumber = t('login.phone-required');
      isValid = false;
    } else if (inputValues.phoneNumber.length !== 10) {
      newErrors.phoneNumber = t('login.phone-invalid');
      isValid = false;
    }

    if (!inputValues.password) {
      newErrors.password = t('login.password-required');
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please correct the highlighted fields.',
      });
    }

    return isValid;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const payload: LoginPayload = {
        phonenumber: `+57${inputValues.phoneNumber}`,
        password: inputValues.password,
      };

      const response = await login(payload);
      const { token } = response.data;

      await session.setSession(token);
      Toast.show({
        type: 'success',
        text1: 'Login successful',
      });
      navigation.navigate('Main');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Please check your credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    let errorMessage = '';

    if (!inputValues.phoneNumber.trim()) {
      errorMessage = t('signupCompletion.number-required');
    } else if (inputValues.phoneNumber.length !== 10) {
      errorMessage = t('signupCompletion.number-invalid');
    }

    if (errorMessage) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: errorMessage,
      }));

      Toast.show({
        type: 'error',
        text1: 'Phone required',
        text2: errorMessage,
      });
      return;
    }

    navigation.navigate('ForgotPassword', {
      phonenumber: `+57${inputValues.phoneNumber}`,
    });
  };

  const handleGoBack = () => navigation.goBack();

  return (
    <AuthenticationCard
      mainTitle={t('login.title')}
      title={t('login.title')}
      subtitle={t('login.sub-title')}
      onPrimaryButtonPress={handleLogin}
      onSecondaryButtonPress={handleGoBack}
      primaryButtonDisabled={loading}
    >
      <Row justify="space-between">
        <Box style={styles.prefix} padding="md">
          <Typography variant="bodyRegular" colorVariant="secondary">
            +57
          </Typography>
        </Box>
        <Input
          label={t('signupCompletion.number')}
          placeholder={t('signupCompletion.text-input-number')}
          keyboardType="numeric"
          value={inputValues.phoneNumber}
          onChangeText={(value) =>
            handleInputChange(
              'phoneNumber',
              value.replace(/[^0-9]/g, '').slice(0, 10)
            )
          }
          error={errors.phoneNumber}
          style={{ width: 250 }}
        />
      </Row>
      <Input
        label={t('login.password-input')}
        placeholder={t('login.text-input-password')}
        variant="password"
        value={inputValues.password}
        onChangeText={(value) => handleInputChange('password', value)}
        error={errors.password}
      />

      <Box alignItems="center">
        <Button
          variant="ghost"
          label={t('login.forgot-password')}
          onPress={handleForgotPassword}
          style={{ width: '100%', maxWidth: 195 }}
        />
      </Box>
    </AuthenticationCard>
  );
};
