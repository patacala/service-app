import React, { useState, useEffect } from 'react';
import { Box, Input, theme, Typography } from '@/design-system';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import { RegisterPayload } from '@/infrastructure/services/api/types/auth.types';
import { Row } from '@/design-system/components/layout/Row/Row';
import { getLoginStyles } from './login/login.style';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RegisterScreenParams } from '@/types/navigation';

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
  const router = useRouter();
  const params = useLocalSearchParams<Partial<RegisterScreenParams>>();
  const { name, email, phonenumber } = params;

  const registeredWithEmail = !!email && email.trim() !== '';
  const registeredWithPhone = !!phonenumber && phonenumber.trim() !== '';

  const { t } = useTranslation('auth');
  const { getData, setData, removeData } = useDataManager();
  const styles = getLoginStyles(theme);

  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    name: name || '',
    city: '',
    email: email || '',
    phone: phonenumber || '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    city: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormIncomplete =
    !registerFormData.name.trim() ||
    !registerFormData.city.trim() ||
    (!registerFormData.email.trim() && !registerFormData.phone.trim());

  useEffect(() => {
    setErrors({ name: '', city: '', email: '', phone: '' });
  }, []);

  useEffect(() => {
    const loadSavedData = async () => {
      const savedFormData = await getData('registerForm');
      if (savedFormData) {
        setRegisterFormData((prev) => ({
          ...prev,
          name: savedFormData.name || prev.name,
          city: savedFormData.city || prev.city,
          email: savedFormData.email || prev.email,
          phone: savedFormData.phone || prev.phone,
        }));
      }
    };
    loadSavedData();
  }, [getData]);

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = { name: '', city: '', email: '', phone: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!registerFormData.name.trim()) {
      newErrors.name = t('signup.name-required');
      isValid = false;
    }

    if (!registerFormData.city.trim()) {
      newErrors.city = t('signupCompletion.text-input-city');
      isValid = false;
    }

    // ✅ Si el campo viene bloqueado por params no valida ni pone error
    if (registeredWithEmail || registeredWithPhone) {
      // campos bloqueados y llenos — no valida nada
    } else if (registerFormData.email.trim()) {
      if (!emailRegex.test(registerFormData.email)) {
        newErrors.email = t('signup.email-invalid');
        isValid = false;
      }
    } else if (registerFormData.phone.trim()) {
      if (registerFormData.phone.length !== 10) {
        newErrors.phone = t('login.phone-invalid');
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    const updatedFormData = { ...registerFormData, [field]: value };
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
        name: registerFormData.name,
        city: registerFormData.city,
        email: registerFormData.email,
        phone: registerFormData.phone,
      };

      await setData('registerForm', payload);
      router.push('/register-completion');
    } catch {
      Toast.show({
        type: 'error',
        text1: t('messages.msg19'),
        text2: t('messages.msg18'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    removeData('registerForm');
    router.back();
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
      primaryButtonDisabled={isSubmitting || isFormIncomplete}
    >
      <Input
        label={t('signup.name')}
        placeholder={t('signup.text-input-name')}
        autoCapitalize="words"
        value={registerFormData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        error={errors.name}
      />
      <Input
        label={t('signupCompletion.city')}
        placeholder={t('signupCompletion.text-input-city')}
        autoCapitalize="words"
        value={registerFormData.city}
        onChangeText={(value) => handleInputChange('city', value)}
        error={errors.city}
      />

      {registeredWithEmail ? (
        <>
          <Input
            label={t('signup.email')}
            placeholder={t('signup.text-input-email')}
            autoCapitalize="none"
            keyboardType="email-address"
            value={registerFormData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            error={errors.email}
            editable={false}
          />
          <Row justify="space-between">
            <Box style={styles.prefix} padding="md">
              <Typography variant="bodyRegular" colorVariant="secondary">+1</Typography>
            </Box>
            <Input
              label={t('signupCompletion.number')}
              placeholder={t('signupCompletion.text-input-number')}
              keyboardType="numeric"
              value={registerFormData.phone}
              onChangeText={(value) =>
                handleInputChange('phone', value.replace(/[^0-9]/g, '').slice(0, 10))
              }
              error={errors.phone}
              style={{ width: 250 }}
            />
          </Row>
        </>
      ) : (
        <Row justify="space-between">
          <Box style={styles.prefix} padding="md">
            <Typography variant="bodyRegular" colorVariant="secondary">+1</Typography>
          </Box>
          <Input
            label={t('signupCompletion.number')}
            placeholder={t('signupCompletion.text-input-number')}
            keyboardType="numeric"
            value={registerFormData.phone}
            onChangeText={(value) =>
              handleInputChange('phone', value.replace(/[^0-9]/g, '').slice(0, 10))
            }
            error={errors.phone}
            style={{ width: 250 }}
            editable={!registeredWithPhone}
          />
        </Row>
      )}
    </AuthenticationCard>
  );
};