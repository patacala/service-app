import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, GroupChipSelector, theme } from '@/design-system';
import { useTranslation } from 'react-i18next';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { useDataManager } from '@/infrastructure/dataManager/DataManager';
import Toast from 'react-native-toast-message';
import { useGetCategoriesQuery } from '@/infrastructure/services/api/endpoints/category/store';
import { useRegisterMutation } from '../store';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { ActivityIndicator } from 'react-native';
import { getWallStyles } from '@/features/wall/screens/wall/wall.style';
import { useRouter } from 'expo-router';
import { getDeviceLanguage } from '@/assembler/config/i18n';

interface CompletionFormData {
  city: string;
  email: string;
  phone: string;
  selectedCategories: string[];
}

export const RegisterCompletionScreen = () => {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { getData, setData, removeData } = useDataManager();
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetCategoriesQuery({ language: getDeviceLanguage() });
  const { user: userData, userUpdate } = useAuth();

  const [completionFormData, setCompletionFormData] = useState<CompletionFormData>({
    city: '',
    email: '',
    phone: '',
    selectedCategories: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerProfile] = useRegisterMutation();

  const tagOptions = useMemo(() => {
    return (
      categoriesData?.categories?.map((category) => ({
        id: category.id,
        label: category.name,
      })) || []
    );
  }, [categoriesData]);

  useEffect(() => {
    const loadAndMergeData = async () => {
      try {
        const savedFormData = await getData('registerCompletionForm');
        const basicRegisterData = await getData('registerForm');

        if (savedFormData || basicRegisterData) {
          setCompletionFormData({
            ...basicRegisterData,
            ...savedFormData,
            selectedCategories: Array.isArray(savedFormData?.selectedCategories)
              ? savedFormData.selectedCategories
              : [],
          });
        }
      } catch (error) {
        return false;
      }
    };

    loadAndMergeData();
  }, []);

  useEffect(() => {
    if (categoriesError) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg20"),
        text2: t("messages.msg21"),
      });
    }
  }, [categoriesError]);

  // Función para guardar automáticamente los datos
  const saveFormData = useCallback(async (updatedFormData: CompletionFormData) => {
    try {
      await setData('registerCompletionForm', updatedFormData);
    } catch (error) {
      return false;
    }
  }, [setData]);

  const handleInputChange = useCallback((field: keyof CompletionFormData, value: string | string[]) => {
    const updatedFormData = {
      ...completionFormData,
      [field]: field === 'selectedCategories' ? (value as string[]) : value,
    };
    
    setCompletionFormData(updatedFormData);
    
    // Guardar automáticamente cuando cambian las categorías
    saveFormData(updatedFormData);
  }, [completionFormData, saveFormData]);

  // Función específica para manejar cambios en las categorías
  const handleCategoryChange = useCallback((selectedIds: string[] | null) => {
    const selectedCategories = selectedIds || [];
    handleInputChange('selectedCategories', selectedCategories);
  }, [handleInputChange]);

  const handleRegisterCompletion = async () => {
    setIsSubmitting(true);
    try {
      await saveFormData(completionFormData);

      const savedFormData = await getData('registerCompletionForm');
      const registerRequest = {
        ...savedFormData,
        userId: userData?.id,
      };

      const { user } = await registerProfile(registerRequest).unwrap();
      await userUpdate(user);

      Toast.show({
        type: 'success',
        text1: t("messages.msg22"),
        text2: t("messages.msg23"),
      });

      await removeData('registerCompletionForm');
      await removeData('registerForm');

      router.replace('/home');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg24"),
        text2: t("messages.msg18"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
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
        <Box marginBottom='sm'>
          <Typography variant="bodyRegular" colorVariant="secondary">
            {t("messages.msg32")}
          </Typography>
        </Box>
        

        {isCategoriesLoading ? (
          <Box style={getWallStyles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.colorBrandPrimary} />
          </Box>
        ) : (
          <GroupChipSelector
            multiSelect
            onChange={handleCategoryChange}
            options={tagOptions}
            selectedIds={completionFormData.selectedCategories || []}
          />
        )}
      </Box>
    </AuthenticationCard>
  );
};