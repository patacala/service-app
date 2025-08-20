import React, { useState, useEffect } from 'react';
import { Box, Typography, GroupChipSelector } from '@/design-system';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import Toast from 'react-native-toast-message';
import { useGetCategoriesQuery } from '@/infrastructure/services/api/endpoints/category/store';

interface CompletionFormData {
  phoneNumber: string;
  city: string;
  email: string;
  phone: string;
  selectedCategories: string[];
}

interface CategoryTagOption {
  id: string;
  name: string;
}

export const RegisterCompletionScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { t } = useTranslation('auth');
  const { getData, setData, removeData } = useDataManager();
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetCategoriesQuery();

  const [formData, setFormData] = useState<CompletionFormData>({
    phoneNumber: '',
    city: '',
    email: '',
    phone: '',
    selectedCategories: []
  });

  const [tagOptions, setTagOptions] = useState<CategoryTagOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowGoBack, setAllowGoBack] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedFormData = await getData('registerCompletionForm');
        const basicRegisterData = await getData('registerForm');

        if (savedFormData) setFormData(savedFormData);
        if (!basicRegisterData) setAllowGoBack(true);
      } catch (error) {
        console.error('Error cargando datos del formulario:', error);
      }
    };

    loadData();
  }, []);

  // Procesar categorías cuando lleguen del API
  useEffect(() => {
    if (categoriesData?.categories) {
      setTagOptions(categoriesData.categories.map((category) => ({
        id: category.id,
        name: category.name_es
      })));
    }
  }, [categoriesData]);

  useEffect(() => {
    if (categoriesError) {
      console.error('Error cargando categorías:', categoriesError);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar las categorías.',
      });
    }
  }, [categoriesError]);

  const handleInputChange = (field: keyof CompletionFormData, value: string | string[]) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedFormData);
    setData('registerCompletionForm', updatedFormData);
  };

  const handleRegisterCompletion = async () => {
    setIsSubmitting(true);

    try {
      await setData('registerCompletionForm', {
        ...formData,
      });

     /*  navigation.navigate('Main'); */
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'You have successfully',
      });
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
      totalSteps={2}
      currentStep={2}
      subtitle={t('signupCompletion.sub-title')}
      onPrimaryButtonPress={handleRegisterCompletion}
      onSecondaryButtonPress={allowGoBack ? handleGoBack : undefined}
      primaryButtonDisabled={isSubmitting}
    >
      <Box>
        <Typography variant="bodyRegular" colorVariant="secondary">
          Services you're interested in:
        </Typography>
        
        {isCategoriesLoading ? (
          <Typography variant="bodyRegular" colorVariant="secondary">
            {t('common.loading', 'Cargando...')}
          </Typography>
        ) : (
          <GroupChipSelector
            multiSelect
            onChange={(selectedIds) => handleInputChange('selectedCategories', selectedIds)}
            options={tagOptions.map(tag => ({
              id: tag.id,
              label: tag.name
            }))}
            selectedIds={formData.selectedCategories}
          />
        )}
      </Box>
      
    </AuthenticationCard>
  );
};