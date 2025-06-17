import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dimensions, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, ChipOption, GroupChipSelector, Input, Theme, Typography } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/design-system/components/layout/Icon';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width } = Dimensions.get('window');

// Validation Schema
const detailServiceSchema = z.object({
  addressService: z
    .string()
    .min(5, 'Service address must be at least 5 characters')
    .max(100, 'Service address must be less than 100 characters'),
});

type DetailServiceFormData = z.infer<typeof detailServiceSchema>;

// Interfaz para los valores iniciales
interface InitialValues {
  selectedServices?: string[];
  selectedServiceOptions?: ChipOption[];
  addressService?: string;
  pricePerHour?: number;
}

interface DetailServiceProps {
  onAddressServiceChange?: (addressService: string) => void;
  onPricePerHourChange?: (pricePerHour: number) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValues?: InitialValues;
}

export const DetailService: React.FC<DetailServiceProps> = ({
  onAddressServiceChange,
  onPricePerHourChange,
  onValidationChange,
  initialValues = {},
}) => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation('auth');
  
  const {
    control,
    formState: { errors, isValid }
  } = useForm<DetailServiceFormData>({
    resolver: zodResolver(detailServiceSchema),
    mode: 'onChange',
    defaultValues: {
      addressService: initialValues.addressService || '',
    }
  });

  // Estado interno del slider completamente separado
  const [priceValue, setPriceValue] = useState<number>(() => initialValues.pricePerHour || 62);
  
  // Obtener servicios seleccionados desde initialValues únicamente
  const selectedServices = initialValues.selectedServices || [];
  const selectedServiceOptions = initialValues.selectedServiceOptions || [];

  // Validación general
  useEffect(() => {
    const priceIsValid = priceValue > 0;
    const overallValid = isValid && priceIsValid;

    if (onValidationChange) {
      onValidationChange(overallValid);
    }
  }, [isValid, priceValue, onValidationChange]);

  // Debounce para notificar cambios de precio
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onPricePerHourChange) {
        onPricePerHourChange(priceValue);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [priceValue]); // Solo depende de priceValue, no del callback

  // Manejar cambio del slider - completamente independiente
  const handleSliderChange = useCallback((values: number[]) => {
    setPriceValue(values[0]);
  }, []);

  return (
    <>
        {/* Servicios seleccionados (solo lectura) */}
        <Box marginBottom="lg">
            <Row marginBottom="sm" gap="sm">
                <Icon name="tag" color="colorBaseWhite"/>
                <Typography variant="bodyLarge" color="white">Services</Typography>
            </Row>
            
            {selectedServiceOptions.length > 0 ? (
                <GroupChipSelector
                    options={selectedServiceOptions}
                    selectedIds={selectedServices}
                    onChange={() => {}}
                    multiSelect={true}
                    variant="vertical"
                />
            ) : (
                <Box padding="md" style={{ 
                    borderWidth: 1, 
                    borderColor: theme.colors.colorGrey300,
                    borderRadius: theme.border.radius.md 
                }}>
                    <Typography variant="bodyRegular" color={theme.colors.colorGrey200}>
                        No services selected
                    </Typography>
                </Box>
            )}

            <Box gap="lg" marginTop="sm">
                <Typography variant="bodyLarge" color="white">Where you provide this service?</Typography>
                
                <Controller
                  control={control}
                  name="addressService"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Box>
                      <Input
                        label="Address"
                        value={value}
                        onChangeValue={(newValue) => {
                          onChange(newValue);
                          if (onAddressServiceChange) {
                            onAddressServiceChange(newValue);
                          }
                        }}
                        onBlur={onBlur}
                        icon="transfer"
                      />
                      {errors.addressService && (
                        <Box marginTop="xs">
                          <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                            {errors.addressService.message}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                />
            </Box>

            <Row marginTop="lg" gap="sm">
                <Icon name="dollar" color="colorBaseWhite"/>
                <Typography variant="bodyLarge" color="white">Price per Hour</Typography>
            </Row>

            <Row position="relative" alignItems="center" justifyContent="center" paddingTop="xl">
                {/* Mostrar el valor actual del slider */}
                <Box position="absolute" bottom={35} left={45}>
                    <Typography variant="bodyLarge" color="white">
                        ${priceValue}
                    </Typography>
                </Box>

                <MultiSlider
                    values={[priceValue]}
                    sliderLength={width * 0.8 - 40}
                    min={1}
                    max={100}
                    step={1}
                    allowOverlap={false}
                    snapped
                    onValuesChange={handleSliderChange}
                    selectedStyle={{
                        backgroundColor: theme.colors.colorBaseWhite,
                    }}
                    unselectedStyle={{
                        backgroundColor: theme.colors.colorGrey200,
                    }}
                    containerStyle={{
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    trackStyle={{
                        height: 6,
                        borderRadius: 2,
                    }}
                    markerStyle={{
                        backgroundColor: theme.colors.colorBaseWhite,
                        height: 24,
                        width: 24,
                        borderRadius: 12,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                />
                
                {/* Error message para precio */}
                {priceValue <= 0 && (
                  <Box marginTop="xs">
                    <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                      Price must be greater than $0
                    </Typography>
                  </Box>
                )}
            </Row>
        </Box>
    </>
  );
};