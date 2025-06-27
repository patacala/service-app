import React, { useState, useEffect } from 'react';
import { Input } from '@/design-system';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackNavigationProp, AuthStackParamList } from '@/assembler/navigation/types';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import { register } from '@/infrastructure/services/api/endpoints/auth.api';
import { RegisterPayload } from '@/infrastructure/services/api/types/auth.types';
import { SessionManager } from '@/infrastructure/session';
import Toast from 'react-native-toast-message';

interface FormData extends RegisterPayload {
  name: string;
  city: string;
  // confirmPassword: string;
}

interface FormErrors {
  name: string;
  city: string;
  /* email: string;
  password: string;
  confirmPassword: string; */
}

export const RegisterScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { t } = useTranslation('auth');
  const { getData, setData, removeData } = useDataManager();
  const route = useRoute<RouteProp<AuthStackParamList, 'Register'>>();
  const { name, email } = route.params || {};

  const [formData, setFormData] = useState<FormData>({
    name: name || '',
    city: ''
    /* email: email || '',
    password: '',
    confirmPassword: '' */
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    city: ''
    /* email: '',
    password: '',
    confirmPassword: '' */
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSavedData = async () => {
      const savedFormData = await getData('registerForm');
      if (savedFormData) {
        setFormData((prev) => ({
          ...prev,
          name: savedFormData.name || '',
          city: savedFormData.city || '',
        }));
      }
    };
    loadSavedData();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = { ...errors };

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = t('signup.name-required');
      isValid = false;
    } else {
      newErrors.name = '';
    }

    if (!formData.city.trim()) {
      newErrors.city = t('signupCompletion.text-input-city');
      isValid = false;
    } else {
      newErrors.city = '';
    }

    /* if (!formData.email.trim()) {
      newErrors.email = t('signup.email-required');
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('signup.email-invalid');
      isValid = false;
    } else {
      newErrors.email = '';
    }

    if (!formData.password) {
      newErrors.password = t('signup.password-required');
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = t('signup.password-min-length');
      isValid = false;
    } else {
      newErrors.password = '';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('signup.confirm-password-required');
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('signup.passwords-not-match');
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    } */

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload: RegisterPayload = {
        name: formData.name,
        city: formData.city
        /* email: formData.email,
        password: formData.password, */
      };

      /* const response = await register(payload);
      const { user } = response.data;

      await setData('registerForm', {
        name: user.user.name,
        city: user.user.email,
      }); */

      /* const session = SessionManager.getInstance();
      await session.setSession(user.token); */

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
      subtitle={t('signup.sub-title')}
      onPrimaryButtonPress={handleRegister}
      onSecondaryButtonPress={handleGoBack}
      primaryButtonDisabled={isSubmitting}
    >
      <Input
        label={t('signup.name')}
        placeholder={t('signup.text-input-name')}
        autoCapitalize="words"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        error={errors.name}
      />
      <Input
        label={t('signupCompletion.city')}
        placeholder={t('signupCompletion.text-input-city')}
        autoCapitalize="words"
        value={formData.city}
        onChangeText={(value) => handleInputChange('city', value)}
        error={errors.city}
      />
      {/* <Input
        label={t('signup.email')}
        placeholder={t('signup.text-input-email')}
        autoCapitalize="none"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        error={errors.email}
      />
      <Input
        label={t('signup.password')}
        placeholder={t('signup.text-input-password')}
        variant="password"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        error={errors.password}
      />
      <Input
        label={t('signup.conpassword')}
        placeholder={t('signup.text-input-conpassword')}
        variant="password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        error={errors.confirmPassword}
      /> */}
    </AuthenticationCard>
  );
};
