import React, { useState, useEffect } from 'react';
import { Box, Typography, Input, GroupChipSelector, theme } from '@/design-system';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { Row } from '@/design-system/components/layout/Row/Row';
import { getRegisterCompletionStyles } from './registerCompetion/registerCompletion.style';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import { getAllServiceTags } from '@/infrastructure/services/api/endpoints/servicetags.api';
import Toast from 'react-native-toast-message';

interface CompletionFormData {
  phoneNumber: string;
  city: string;
  selectedServices: string[];
}

interface FormErrors {
  phoneNumber: string;
  city: string;
}

interface ServicetagOption {
  id: number;
  name: string;
}

export const RegisterCompletionScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const styles = getRegisterCompletionStyles(theme);
  const { t } = useTranslation('auth');
  const { getData, setData, removeData } = useDataManager();

  const [formData, setFormData] = useState<CompletionFormData>({
    phoneNumber: '',
    city: '',
    selectedServices: []
  });

  const [errors, setErrors] = useState<FormErrors>({
    phoneNumber: '',
    city: ''
  });

  const [tagOptions, setTagOptions] = useState<ServicetagOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowGoBack, setAllowGoBack] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedFormData = await getData('registerCompletionForm');
        const basicRegisterData = await getData('registerForm');

        if (savedFormData) setFormData(savedFormData);
        if (!basicRegisterData) setAllowGoBack(true);

        const data = await getAllServiceTags();
        setTagOptions(data.map((tag: any) => ({
          id: tag.id,
          name: tag.name
        })));
      } catch (error) {
        console.error('Error cargando datos del formulario o servicetags:', error);
      }
    };

    loadData();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = { ...errors };

    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('signupCompletion.number-required');
      isValid = false;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t('signupCompletion.number-invalid');
      isValid = false;
    } else {
      newErrors.phoneNumber = '';
    }

    if (!formData.city.trim()) {
      newErrors.city = t('signupCompletion.city-required');
      isValid = false;
    } else {
      newErrors.city = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof CompletionFormData, value: string | string[]) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedFormData);
    setData('registerCompletionForm', updatedFormData);

    if (errors[field as keyof FormErrors]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: ''
      }));
    }
  };

  const handleRegisterCompletion = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const fullPhoneNumber = `+57${formData.phoneNumber}`;
      await setData('registerCompletionForm', {
        ...formData,
        phoneNumber: fullPhoneNumber
      });
      navigation.navigate('Otp');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error saving data.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    removeData('registerCompletionForm');
    navigation.goBack();
  };

  return (
    <AuthenticationCard
      mainTitle={t('signup.title')}
      activeStepIndicator
      currentStep={2}
      subtitle={t('signupCompletion.sub-title')}
      onPrimaryButtonPress={handleRegisterCompletion}
      onSecondaryButtonPress={allowGoBack ? handleGoBack : undefined}
      primaryButtonDisabled={isSubmitting}
    >
      <Box gap='md' marginBottom='sm'>
        <Row justify='space-between'>
          <Box style={styles.prefix} padding="md">
            <Typography variant="bodyRegular" colorVariant="secondary">+57</Typography>
          </Box>
          <Input
            label={t('signupCompletion.number')}
            placeholder={t('signupCompletion.text-input-number')}
            keyboardType="numeric"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value.replace(/[^0-9]/g, '').slice(0, 10))}
            error={errors.phoneNumber}
            style={{ width: 250 }}
          />
        </Row>
        <Input
          label={t('signupCompletion.city')}
          placeholder={t('signupCompletion.text-input-city')}
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
          error={errors.city}
        />
      </Box>

      <GroupChipSelector
        multiSelect
        onChange={(selectedIds) => handleInputChange('selectedServices', selectedIds)}
        options={tagOptions.map(tag => ({
          id: tag.id.toString(),
          label: tag.name
        }))}
        selectedIds={formData.selectedServices}
      />
    </AuthenticationCard>
  );
};
