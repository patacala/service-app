import React, { useState, useEffect } from 'react';
import { Box, Typography, GroupChipSelector } from '@/design-system';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import Toast from 'react-native-toast-message';
import { useGetCategoriesQuery } from '@/infrastructure/services/api/endpoints/category/store';
import { useRegisterMutation } from '../store';
import { useAuth } from '@/infrastructure/auth/AuthContext';

interface CompletionFormData {
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
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetCategoriesQuery({language: 'en'});
  const { user: userData, userUpdate } = useAuth();

  const [completionFormData, setCompletionFormData] = useState<CompletionFormData>({
    city: '',
    email: '',
    phone: '',
    selectedCategories: []
  });

  const [tagOptions, setTagOptions] = useState<CategoryTagOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerProfile] = useRegisterMutation();

  useEffect(() => {
    const loadAndMergeData = async () => {
      try {
        const savedFormData = await getData('registerCompletionForm');
        const basicRegisterData = await getData('registerForm');

        let mergedData = { ...savedFormData, ...basicRegisterData };

        if (mergedData) {
          setCompletionFormData({
            ...mergedData,
            selectedCategories: Array.isArray(mergedData.selectedCategories)
              ? mergedData.selectedCategories
              : [],
          });
        }
      } catch (error) {
        console.error('Error cargando y combinando datos del formulario:', error);
      }
    };

    loadAndMergeData();
  }, []);

  // Procesar categorías cuando lleguen del API
  useEffect(() => {
    if (categoriesData?.categories && Array.isArray(categoriesData.categories)) {
      setTagOptions(categoriesData.categories.map((category) => ({
        id: category.id,
        name: category.name
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
      ...completionFormData,
      [field]: field === 'selectedCategories' && Array.isArray(value) ? value : value
    };
    setCompletionFormData(updatedFormData);
    setData('registerCompletionForm', updatedFormData);
  };

  const handleRegisterCompletion = async () => {
    setIsSubmitting(true);

    try {
      await setData('registerCompletionForm', {
        ...completionFormData,
      });

      const savedFormData = await getData('registerCompletionForm');
      const registerRequest = {
        ...savedFormData,
        userId: userData?.id
      };

      const {message, user} = await registerProfile(registerRequest).unwrap();
      await userUpdate(user);
      
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: message ?? 'You have successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error saving data.',
        text2: error?.data?.error || 'Unexpected error occurred.',
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
      onSecondaryButtonPress={handleGoBack}
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
            onChange={(selectedIds) => handleInputChange('selectedCategories', selectedIds || [])}
            options={tagOptions.map(tag => ({
              id: tag.id,
              label: tag.name
            }))}
            selectedIds={completionFormData.selectedCategories || []}
          />
        )}
      </Box>
      
    </AuthenticationCard>
  );
};