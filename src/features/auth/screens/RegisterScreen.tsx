import React, { useState, useEffect } from 'react';
import { Box, Input, theme, Typography } from '@/design-system';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackNavigationProp, AuthStackParamList } from '@/assembler/navigation/types';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import { RegisterPayload } from '@/infrastructure/services/api/types/auth.types';
import { Row } from '@/design-system/components/layout/Row/Row';
import { getLoginStyles } from './login/login.style';
import Toast from 'react-native-toast-message';

interface RegisterFormData extends RegisterPayload {
  name: string;
  city: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name: string;
  city: string;
  email: string;
  phone: string;
}

export const RegisterScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { t } = useTranslation('auth');
  const { getData, setData, removeData } = useDataManager();
  const route = useRoute<RouteProp<AuthStackParamList, 'Register'>>();
  const { name, email, phonenumber } = route.params || {};
  const styles = getLoginStyles(theme);

  const [RegisterFormData, setRegisterFormData] = useState<RegisterFormData>({
    name: name || '',
    city: '',
    email: email || '',
    phone: phonenumber || ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    city: '',
    email: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSavedData = async () => {
      const savedFormData = await getData('registerForm');
      if (savedFormData) {
        setRegisterFormData((prev) => ({
          ...prev,
          name: savedFormData.name || '',
          city: savedFormData.city || '',
          email: savedFormData.email || ''
        }));
      }
    };
    loadSavedData();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = { ...errors };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!RegisterFormData.name.trim()) {
      newErrors.name = t('signup.name-required');
      isValid = false;
    } else {
      newErrors.name = '';
    }

    if (!RegisterFormData.city.trim()) {
      newErrors.city = t('signupCompletion.text-input-city');
      isValid = false;
    } else {
      newErrors.city = '';
    }

    if (RegisterFormData.phone) {
      if (!RegisterFormData.email.trim()) {
        newErrors.email = t('signup.email-required');
        isValid = false;
      } else if (!emailRegex.test(RegisterFormData.email)) {
        newErrors.email = t('signup.email-invalid');
        isValid = false;
      } else {
        newErrors.email = '';
      }

      newErrors.phone = '';
    } else {
      if (!RegisterFormData.phone.trim() || RegisterFormData.phone.length !== 10) {
        newErrors.phone = t('login.phone-invalid');
        isValid = false;
      } else {
        newErrors.phone = '';
      }

      newErrors.email = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    const updatedFormData = { ...RegisterFormData, [field]: value };
    setRegisterFormData(updatedFormData);

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload: RegisterPayload = {
        name: RegisterFormData.name,
        city: RegisterFormData.city,
        email: RegisterFormData.email,
        phone: RegisterFormData.phone
      };

      await setData('registerForm', payload);

      navigation.navigate('RegisterCompletion');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: 'There was an unexpected error.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    removeData('registerForm');
    navigation.goBack();
  };

  return (
    <AuthenticationCard
      mainTitle={t('signup.title')}
      activeStepIndicator
      currentStep={1}
      totalSteps={2}
      subtitle={t('signup.sub-title')}
      onPrimaryButtonPress={handleRegister}
      onSecondaryButtonPress={handleGoBack}
      primaryButtonDisabled={isSubmitting}
    >
      <Input
        label={t('signup.name')}
        placeholder={t('signup.text-input-name')}
        autoCapitalize="words"
        value={RegisterFormData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        error={errors.name}
      />
      <Input
        label={t('signupCompletion.city')}
        placeholder={t('signupCompletion.text-input-city')}
        autoCapitalize="words"
        value={RegisterFormData.city}
        onChangeText={(value) => handleInputChange('city', value)}
        error={errors.city}
      />
      {RegisterFormData.phone ? (
        // Mostrar campo EMAIL si ya hay phone
        <Input
          label={t('signup.email')}
          placeholder={t('signup.text-input-email')}
          autoCapitalize="none"
          keyboardType="email-address"
          value={RegisterFormData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          error={errors.email}
        />
      ) : (
        // Mostrar campo PHONE si no hay phone
        <Row justify="space-between">
          <Box style={styles.prefix} padding="md">
            <Typography variant="bodyRegular" colorVariant="secondary">+1</Typography>
          </Box>
          <Input
            label={t('signupCompletion.number')}
            placeholder={t('signupCompletion.text-input-number')}
            keyboardType="numeric"
            value={RegisterFormData.phone}
            onChangeText={value => handleInputChange('phone', value.replace(/[^0-9]/g, '').slice(0, 10))}
            error={errors.phone}
            style={{ width: 250 }}
          />
        </Row>
      )}

    </AuthenticationCard>
  );
};
