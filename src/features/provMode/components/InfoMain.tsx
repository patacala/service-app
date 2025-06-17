import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

type InfoMainFormData = any;

// Interfaz para los valores iniciales
interface InitialValues {
  phone?: string;
  city?: string;
  address?: string;
  selectedServices?: string[];
  selectedServiceOptions?: ChipOption[];
}

interface InfoMainProps {
  onPhoneChange?: (phone: string) => void;
  onCityChange?: (city: string) => void;
  onAddressChange?: (address: string) => void;
  onSelectedServicesChange?: (services: string[], serviceOptions: ChipOption[]) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValues?: InitialValues;
}

export const InfoMain: React.FC<InfoMainProps> = ({
  onPhoneChange,
  onCityChange,
  onAddressChange,
  onSelectedServicesChange,
  onValidationChange,
  initialValues = {},
}) => {
  const theme = useTheme<Theme>();
  const styles = createStyles(theme);
  const { t } = useTranslation('auth');

  const dynamicSchema = useMemo(() => createDynamicSchema(initialValues), [
    initialValues.phone !== undefined,
    initialValues.city !== undefined,
    initialValues.address !== undefined
  ]);

  const {
    control,
    watch,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: 'onChange',
    defaultValues: {
      phone: initialValues.phone || '',
      city: initialValues.city || '',
      address: initialValues.address || '',
    }
  });

  // Estados para los GroupChipSelector
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [firstGroupSelected, setFirstGroupSelected] = useState<string[]>([]);
  const [secondGroupSelected, setSecondGroupSelected] = useState<string[]>([]);
  const [firstGroupOptions, setFirstGroupOptions] = useState<ChipOption[]>([
    { id: 'construction', label: 'Construction', icon: 'palauster' },
    { id: 'coaching', label: 'Coaching', icon: 'smile' },
    { id: 'painter', label: 'Painter', icon: 'painter' },
    { id: 'tutor', label: 'Tutor', icon: 'tutor' },
    { id: 'gardening', label: 'Gardening', icon: 'gardening' },
  ]);
  const [firstGroupTotal, setFirstGroupTotal] = useState<number>(firstGroupOptions.length);
  const [secondGroupOptions, setSecondGroupOptions] = useState<ChipOption[]>([]);

  // Watch form values
  const watchedValues = watch();

  // Filtrar opciones del primer grupo basado en el término de búsqueda
  const filteredFirstGroupOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return firstGroupOptions;
    }
    
    return firstGroupOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [firstGroupOptions, searchTerm]);

  // Función para notificar cambios de servicios seleccionados - OPTIMIZADA CON useCallback
  const notifySelectedServicesChange = useCallback((newSecondGroupOptions: ChipOption[]) => {
    const selectedServices = newSecondGroupOptions.map(option => option.id);

    if (onSelectedServicesChange) {
      onSelectedServicesChange(selectedServices, newSecondGroupOptions);
    }
  }, [onSelectedServicesChange]);

  // Efecto para validación general (form + servicios)
  useEffect(() => {
    const hasServices = initialValues.selectedServices !== undefined ? secondGroupOptions.length > 0 : true;
    const formIsValid = isValid;
    const overallValid = formIsValid && hasServices;

    if (onValidationChange) {
      onValidationChange(overallValid);
    }
  }, [isValid, secondGroupOptions.length]);

  // Efecto para notificar cambios de campos individuales
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

  // Efecto para manejar servicios seleccionados iniciales - OPTIMIZADO
  useEffect(() => {
    if (initialValues.selectedServices && 
        initialValues.selectedServices.length > 0 && 
        secondGroupOptions.length === 0) {

      // Encontrar las opciones que corresponden a los servicios seleccionados iniciales
      const allOptions: ChipOption[] = [
        { id: 'construction', label: 'Construction', icon: 'palauster' },
        { id: 'coaching', label: 'Coaching', icon: 'smile' },
        { id: 'painter', label: 'Painter', icon: 'painter' },
        { id: 'tutor', label: 'Tutor', icon: 'tutor' },
        { id: 'gardening', label: 'Gardening', icon: 'gardening' },
      ];
      
      const initialSelectedOptions: ChipOption[] = allOptions.filter(option => 
        initialValues.selectedServices!.includes(option.id)
      );
      
      const remainingOptions: ChipOption[] = allOptions.filter(option => 
        !initialValues.selectedServices!.includes(option.id)
      );
    
      // Configurar los estados
      setSecondGroupOptions(initialSelectedOptions);
      setSecondGroupSelected(initialValues.selectedServices);
      setFirstGroupOptions(remainingOptions);
      notifySelectedServicesChange(initialSelectedOptions);
    }
  }, [initialValues.selectedServices?.join(',')]);

  // Manejar cambio en el buscador
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Manejar selección en el primer grupo
  const handleFirstGroupChange = (selectedIds: string[]) => {
    // Encontrar qué opciones fueron seleccionadas
    const selectedOptions: ChipOption[] = firstGroupOptions.filter(option => 
      selectedIds.includes(option.id)
    );
    
    // Agregar las opciones seleccionadas al segundo grupo
    const newSecondGroupOptions = [...secondGroupOptions, ...selectedOptions];
    setSecondGroupOptions(newSecondGroupOptions);

    // Marcar automáticamente como seleccionados en el segundo grupo
    const newSecondGroupSelected = [...secondGroupSelected, ...selectedIds];
    setSecondGroupSelected(newSecondGroupSelected);

    // Remover las opciones seleccionadas del primer grupo
    setFirstGroupOptions(prevOptions => 
      prevOptions.filter(option => !selectedIds.includes(option.id))
    );

    // Actualizar selección del primer grupo (limpiar después de transferir)
    setFirstGroupSelected([]);
    
    // Notificar cambio de servicios seleccionados
    notifySelectedServicesChange(newSecondGroupOptions);
  };

  // Manejar selección en el segundo grupo (para deseleccionar y regresar al primero)
  const handleSecondGroupChange = (selectedIds: string[]) => {
    // Encontrar qué elementos fueron deseleccionados
    const deselectedIds = secondGroupSelected.filter(id => !selectedIds.includes(id));
    
    if (deselectedIds.length > 0) {
      // Encontrar las opciones deseleccionadas
      const deselectedOptions: ChipOption[] = secondGroupOptions.filter(option => 
        deselectedIds.includes(option.id)
      );
      
      // Regresar las opciones deseleccionadas al primer grupo
      setFirstGroupOptions(prevOptions => [...prevOptions, ...deselectedOptions]);
      
      // Remover las opciones deseleccionadas del segundo grupo
      const newSecondGroupOptions = secondGroupOptions.filter(option => !deselectedIds.includes(option.id));
      setSecondGroupOptions(newSecondGroupOptions);
      
      // Notificar cambio de servicios seleccionados
      notifySelectedServicesChange(newSecondGroupOptions);
    }
    
    // Actualizar la selección del segundo grupo
    setSecondGroupSelected(selectedIds);
  };

  return (
    <>
        {initialValues.phone !== undefined && (
          <Box gap='md' marginBottom="md">
              <Row spacing="none" gap="sm" justify='space-between'>
                  <Box style={styles.prefix} padding="md">
                      <Typography variant="bodyRegular" colorVariant="secondary">+1</Typography>
                  </Box>
                      
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Box flex={1} marginLeft="sm">
                        <Input
                          label={t('signupCompletion.number')}
                          variant='numeric'
                          value={value}
                          onChangeValue={onChange}
                          onBlur={onBlur}
                          keyboardType="phone-pad"
                          style={{ width: 265 }}
                        />
                        {errors.phone && (
                          <Box marginTop="xs">
                            <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
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
                        <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
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
                        <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
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
                <Icon name="tag" color="colorBaseWhite"/>
                <Typography variant="bodyLarge" color="white">Service to offer</Typography>
            </Row>

            <Box>
                <Input
                    variant="search"
                    placeholder="Search service"
                    value={searchTerm}
                    onChangeValue={handleSearchChange}
                />

                {/* Primer GroupChipSelector - Opciones disponibles */}
                <Box marginBottom="md">
                    <GroupChipSelector
                        options={filteredFirstGroupOptions}
                        selectedIds={firstGroupSelected}
                        onChange={handleFirstGroupChange}
                        multiSelect={true}
                        variant="vertical"
                    />
                </Box>
            </Box>

            {/* Segundo GroupChipSelector - Servicios seleccionados */}
            <Box width="100%" marginBottom="lg">
                <Row justifyContent="space-between">
                    <Typography variant="bodySmall" color={theme.colors.colorGrey200}>Selected Services</Typography>
                    <Typography variant="bodySmall" color={theme.colors.colorGrey200}>{secondGroupOptions.length}/{firstGroupTotal}</Typography>
                </Row>
                
                <GroupChipSelector
                    options={secondGroupOptions}
                    selectedIds={secondGroupSelected}
                    onChange={handleSecondGroupChange}
                    multiSelect={true}
                    variant="vertical"
                />
                
                {/* Error message para servicios */}
                {secondGroupOptions.length === 0 && (
                  <Box marginTop="xs">
                    <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                      Please select at least one service
                    </Typography>
                  </Box>
                )}
            </Box>
          </>
        )}
    </>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  prefix: {
    backgroundColor: theme.colors.colorGrey600, 
    width: 100, 
    height: 60,
    borderRadius: theme.border.radius.md,
    alignItems: 'center'
  }
});