import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { z } from 'zod';
import { Box, ChipOption, GroupChipSelector, Input, Theme, Typography } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/design-system/components/layout/Icon';

// Validation Schema dinámico
const createDynamicSchema = (initialValues: InitialValues) => {
  const schemaFields: any = {};

  if (initialValues.phone !== undefined) {
    schemaFields.phone = z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be less than 15 digits')
      .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number');
  }

  if (initialValues.city !== undefined) {
    schemaFields.city = z
      .string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City name is too long');
  }

  if (initialValues.address !== undefined) {
    schemaFields.address = z
      .string()
      .min(5, 'Address must be at least 5 characters')
      .max(100, 'Address is too long');
  }

  return z.object(schemaFields);
};

interface InitialValues {
  title?: string;
  phone?: string;
  city?: string;
  address?: string;
  selectedServices?: string[];
  selectedServiceOptions?: ChipOption[];
}

interface InfoMainProps {
  onTitleChange?: (title: string) => void;
  onPhoneChange?: (phone: string) => void;
  onCityChange?: (city: string) => void;
  onAddressChange?: (address: string) => void;
  onSelectedServicesChange?: (services: string[], serviceOptions: ChipOption[]) => void;
  onValidationChange?: (isValid: boolean) => void;
  categories?: ChipOption[]; 
  isCategoriesLoading?: boolean;
  initialValues?: InitialValues;
}

interface CategoryTagOption {
  id: string;
  name: string;
}

export const InfoMain: React.FC<InfoMainProps> = ({
  onTitleChange,
  onPhoneChange,
  onCityChange,
  onAddressChange,
  onSelectedServicesChange,
  onValidationChange,
  categories = [],
  isCategoriesLoading = false,
  initialValues = {},
}) => {
  const theme = useTheme<Theme>();
  const styles = createStyles(theme);
  const { t } = useTranslation('auth');
  const [tagOptions, setTagOptions] = useState<CategoryTagOption[]>([]);
  const [secondGroupOptions, setSecondGroupOptions] = useState<ChipOption[]>([]);
  const [secondGroupSelected, setSecondGroupSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dynamicSchema = useMemo(() => createDynamicSchema(initialValues), [
    initialValues.title,
    initialValues.phone,
    initialValues.city,
    initialValues.address,
  ]);

  const {
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: 'onChange',
    defaultValues: {
      title: initialValues.title || '',
      phone: initialValues.phone || '',
      city: initialValues.city || '',
      address: initialValues.address || '',
    },
  });

  const watchedValues = watch();

  // 🔹 Filtrado dinámico por búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return tagOptions;
    return tagOptions.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tagOptions, searchTerm]);

  const notifySelectedServicesChange = useCallback(
    (newOptions: ChipOption[]) => {
      const selectedServices = newOptions.map((option) => option.id);
      if (onSelectedServicesChange) {
        onSelectedServicesChange(selectedServices, newOptions);
      }
    },
    [onSelectedServicesChange]
  );

  useEffect(() => {
    if (categories && Array.isArray(categories)) {
      setTagOptions(
        categories.map((category) => ({
          id: category.id,
          name: category.label,
        }))
      );
    }
  }, [categories]);

  useEffect(() => {
    const formIsValid = isValid && secondGroupOptions.length > 0;
    onValidationChange?.(formIsValid);
  }, [isValid, secondGroupOptions.length]);

  useEffect(() => {
    if (onTitleChange && watchedValues.title !== initialValues.title) {
      onTitleChange(watchedValues.title);
    }
  }, [watchedValues.title]);

  useEffect(() => {
    if (onPhoneChange && watchedValues.phone !== initialValues.phone) {
      onPhoneChange(watchedValues.phone);
    }
  }, [watchedValues.phone]);

  useEffect(() => {
    if (onCityChange && watchedValues.city !== initialValues.city) {
      onCityChange(watchedValues.city);
    }
  }, [watchedValues.city]);

  useEffect(() => {
    if (onAddressChange && watchedValues.address !== initialValues.address) {
      onAddressChange(watchedValues.address);
    }
  }, [watchedValues.address]);

  useEffect(() => {
    if (initialValues.selectedServices && 
      initialValues.selectedServices.length > 0 && 
      tagOptions.length > 0
    ) {
      const newSelectedOptions = tagOptions
        .filter((option) => initialValues.selectedServices!.includes(option.id))
        .map((opt) => ({ id: opt.id, label: opt.name }));

      setSecondGroupSelected(initialValues.selectedServices);
      setSecondGroupOptions(newSelectedOptions);
    }
  }, [initialValues.selectedServices, tagOptions, notifySelectedServicesChange]);


  const handleCategoryChange = (selectedIds: string[]) => {
    const newSelectedOptions = tagOptions
      .filter((option) => selectedIds.includes(option.id))
      .map((opt) => ({ id: opt.id, label: opt.name }));

    setSecondGroupOptions(newSelectedOptions);
    setSecondGroupSelected(selectedIds);
    notifySelectedServicesChange(newSelectedOptions);
  };

  return (
    <>
      {initialValues.title !== undefined && (
        <Box marginBottom="sm">
            {initialValues.title !== undefined && (
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Input
                    label="Title"
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                  />
                  {errors.title && (
                    <Box marginTop="xs">
                      <Typography
                        variant="bodySmall"
                        color={theme.colors.colorFeedbackError}
                      >
                        {errors.title?.message as string}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            />
          )}
        </Box>
      )}

      {initialValues.phone !== undefined && (
        <Box gap="md" marginBottom="md">
          <Row spacing="none" gap="sm" justify="space-between">
            <Box style={styles.prefix} padding="md">
              <Typography variant="bodyRegular" colorVariant="secondary">
                +1
              </Typography>
            </Box>

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box flex={1} marginLeft="sm">
                  <Input
                    label={t('signupCompletion.number')}
                    variant="numeric"
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    style={{ width: 265 }}
                  />
                  {errors.phone && (
                    <Box marginTop="xs">
                      <Typography
                        variant="bodySmall"
                        color={theme.colors.colorFeedbackError}
                      >
                        {errors.phone?.message as string}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            />
          </Row>
        </Box>
      )}

      <Box marginBottom="md" gap="md">
        {initialValues.city !== undefined && (
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Input
                  label="City"
                  value={value}
                  onChangeValue={onChange}
                  onBlur={onBlur}
                  icon="transfer"
                />
                {errors.city && (
                  <Box marginTop="xs">
                    <Typography
                      variant="bodySmall"
                      color={theme.colors.colorFeedbackError}
                    >
                      {errors.city?.message as string}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          />
        )}

        {initialValues.address !== undefined && (
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Input
                  label="Address"
                  value={value}
                  onChangeValue={onChange}
                  onBlur={onBlur}
                  icon="transfer"
                />
                {errors.address && (
                  <Box marginTop="xs">
                    <Typography
                      variant="bodySmall"
                      color={theme.colors.colorFeedbackError}
                    >
                      {errors.address?.message as string}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          />
        )}
      </Box>

      {initialValues.selectedServices !== undefined && (
        <>
          <Row marginTop="sm" marginBottom="md" gap="sm">
            <Icon name="tag" color="colorBaseWhite" />
            <Typography variant="bodyLarge" color="white">
              Service to offer
            </Typography>
          </Row>

          <Box>
            <Input
              variant="search"
              placeholder="Search category"
              value={searchTerm}
              onChangeValue={setSearchTerm}
            />

            <Box marginBottom="md">
              {isCategoriesLoading ? (
                <Typography variant="bodyRegular" colorVariant="secondary">
                  {t('common.loading', 'Cargando...')}
                </Typography>
              ) : (
                <GroupChipSelector
                  options={filteredOptions.map((tag) => ({
                    id: tag.id,
                    label: tag.name,
                  }))}
                  selectedIds={secondGroupSelected}
                  onChange={handleCategoryChange}
                  multiSelect={true}
                  variant="vertical"
                />
              )}
            </Box>
          </Box>

          {secondGroupOptions.length === 0 && (
            <Box marginTop="xs">
              <Typography
                variant="bodySmall"
                color={theme.colors.colorFeedbackError}
              >
                Please select at least one service
              </Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    prefix: {
      backgroundColor: theme.colors.colorGrey600,
      width: 100,
      height: 60,
      borderRadius: theme.border.radius.md,
      alignItems: 'center',
    },
  });
