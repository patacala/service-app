import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Image, ImageSourcePropType, Alert, ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, ChipOption, GroupChipSelector, Input, Theme, Typography, Button } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/design-system/components/layout/Icon';
import images from "@/assets/images/images";
import * as ImagePicker from 'expo-image-picker';

// Validation Schema
const detailInfoSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
});

type DetailInfoFormData = z.infer<typeof detailInfoSchema>;

// Interfaz para los valores iniciales
interface InitialValues {
  selectedServices?: string[];
  selectedServiceOptions?: ChipOption[];
  description?: string;
  media?: string[];
}

interface DetailInfoProps {
  onDescriptionChange?: (description: string) => void;
  onMediaChange?: (media: string[]) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValues?: InitialValues;
  maxMedia?: number;
}

export const DetailInfo: React.FC<DetailInfoProps> = ({
  onDescriptionChange,
  onMediaChange,
  onValidationChange,
  initialValues = {},
  maxMedia = 10,
}) => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation('auth');
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    control,
    watch,
    formState: { errors, isValid }
  } = useForm<DetailInfoFormData>({
    resolver: zodResolver(detailInfoSchema),
    mode: 'onChange',
    defaultValues: {
      description: initialValues.description || '',
    }
  });

  // Estados para fotos
  const [media, setMedia] = useState<string[]>(() => {
    const initialMedia = initialValues.media || [];
    return initialMedia;
  });
  
  // Obtener servicios seleccionados desde initialValues únicamente
  const selectedServices = initialValues.selectedServices || [];
  const selectedServiceOptions = initialValues.selectedServiceOptions || [];

  // Watch form values
  const watchedValues = watch();

  // Efecto para validación general (form + fotos)
  useEffect(() => {
    const validMedia = media.filter(media => media.trim() !== '');
    const hasEnoughMedia = validMedia.length >= 3;
    const formIsValid = isValid;
    const overallValid = formIsValid && hasEnoughMedia;

    if (onValidationChange) {
      onValidationChange(overallValid);
    }
  }, [isValid, media, onValidationChange]);

  // Efecto para notificar cambio de descripción
  useEffect(() => {
    if (onDescriptionChange && watchedValues.description !== initialValues.description) {
      onDescriptionChange(watchedValues.description);
    }
  }, [watchedValues.description, onDescriptionChange, initialValues.description]);

  // Efecto para actualizar estados si cambian los valores iniciales
  useEffect(() => {
    if (initialValues.media !== undefined && initialValues.media !== media) {
      setMedia(initialValues.media);
    }
  }, [initialValues.media]);

  // Notificar cambios de fotos al componente padre
  const notifyMediaChange = (newMedia: string[]) => {
    const validMedia = newMedia.filter(media => media.trim() !== '');
    if (onMediaChange) {
      onMediaChange(validMedia);
    }
  };

  // Función para seleccionar imagen de la galería con Expo
  const selectImageFromLibrary = async (): Promise<string | null> => {
    try {
      // Abrir selector de imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Could not select image');
      return null;
    }
  };

  // Función para hacer scroll al final
  const scrollToEnd = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Manejar selección de foto - CON SCROLL AL FINAL
  const handleMediaelect = async (index: number) => {
    try {
      const imageUri = await selectImageFromLibrary();
      
      if (imageUri) {
        const newMedia = [...media];
        
        if (index >= newMedia.length) {
          // Agregar nueva foto al final
          newMedia.push(imageUri);
        } else {
          // Reemplazar foto existente o slot vacío
          newMedia[index] = imageUri;
        }
        
        setMedia(newMedia);
        notifyMediaChange(newMedia);
        
        // Auto-scroll al final cuando se agrega una nueva foto
        scrollToEnd();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      console.error('Error selecting image:', error);
    }
  };

  // Manejar eliminación de foto - SIMPLIFICADA
  const handlePhotoRemove = (index: number) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newMedia = [...media];
            newMedia.splice(index, 1);
            setMedia(newMedia);
            notifyMediaChange(newMedia);
          },
        },
      ]
    );
  };

  // Función para renderizar todas las cajas
  const renderAllPhotoBoxes = () => {
    const boxes = [];
    const validMediaCount = media.filter(media => media.trim() !== '').length;
    
    // Si no hay fotos, mostrar solo 3 cajas vacías
    if (media.length === 0) {
      for (let i = 0; i < 3; i++) {
        boxes.push(renderPhotoBox('', i, false));
      }
      return boxes;
    }
    
    // Renderizar todas las fotos existentes (mínimo 3 cajas)
    const totalBoxesToShow = Math.max(3, media.length);
    
    for (let i = 0; i < totalBoxesToShow; i++) {
      const photo = i < media.length ? media[i] : '';
      boxes.push(renderPhotoBox(photo, i, false));
    }
    
    // Solo agregar caja adicional si TODAS las cajas actuales tienen foto Y no hemos alcanzado el máximo
    const allBoxesFilled = media.length >= 3 && media.every(media => media.trim() !== '');
    
    if (allBoxesFilled && validMediaCount < maxMedia) {
      boxes.push(renderPhotoBox('', media.length, true));
    }
    
    return boxes;
  };

  // Renderizar cada caja de foto - ANCHO FIJO PARA SCROLL HORIZONTAL
  const renderPhotoBox = (photo: string, index: number, isAddButton: boolean = false) => {
    const hasPhoto = photo.trim() !== '';
    
    return (
      <TouchableOpacity
        key={isAddButton ? `add-${index}` : index}
        onPress={() => hasPhoto ? handlePhotoRemove(index) : handleMediaelect(index)}
      >
        <Box 
          justifyContent="center" 
          alignItems="center" 
          width={60} 
          height={60} 
          backgroundColor="colorGrey600"
          borderRadius={6}
          gap="xs"
          position="relative"
          marginLeft="md"
        >
          {hasPhoto ? (
            <>
              <Image
                source={{ uri: photo }}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
              <Box
                style={{
                  position: 'absolute',
                  top: 1,
                  right: 1,
                  backgroundColor: theme.colors.colorFeedbackError,
                  borderRadius: 10,
                  width: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1
                }}
              >
                <Icon name="clear" size={12} color="colorBaseWhite" />
              </Box>
            </>
          ) : (
            // Caja vacía - mostrar icono de agregar
            <>
              <Image
                source={images.addPhoto as ImageSourcePropType}
                resizeMode="cover"
              />
              <Typography variant="bodyMedium" color={theme.colors.colorGrey100}>
                Add
              </Typography>
            </>
          )}
        </Box>
      </TouchableOpacity>
    );
  };

  // Verificar si hay suficientes fotos
  const validMediaCount = media.filter(media => media.trim() !== '').length;
  const hasEnoughMedia = validMediaCount >= 3;

  return (
    <>
        {/* Servicios seleccionados (solo lectura) */}
        <Box marginBottom="lg">
            <Row marginBottom="sm" gap="sm">
                <Icon name="tag" color="colorBaseWhite"/>
                <Typography variant="bodyLarge" color="white">Categories</Typography>
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
        </Box>

        {/* Descripción del servicio */}
        <Box marginBottom="lg">
            <Box marginBottom="sm" gap="sm">
                <Typography variant="bodyLarge" color="white">Description</Typography>
            </Box>
            
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Input
                    label="Write here"
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    multiline={true}
                    numberOfLines={7}
                    variant="textarea"
                  />
                  {errors.description && (
                    <Box marginTop="xs">
                      <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                        {errors.description.message}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            />
        </Box>

        {/* Evidencias fotográficas - CON SCROLL HORIZONTAL */}
        <Box marginBottom="lg">
            <Row marginBottom="sm" gap="sm" justifyContent="space-between" alignItems="center">
                <Box gap="sm">
                    <Typography variant="bodyLarge" color="white">Evidences</Typography>
                </Box>
            </Row>

            {/* ScrollView horizontal con las cajas */}
            <ScrollView 
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {renderAllPhotoBoxes()}
            </ScrollView>

            {/* Info del estado actual y error de validación */}
            <Box marginTop="sm">
                <Typography variant="bodySmall" color={theme.colors.colorGrey300}>
                    {validMediaCount} of {maxMedia} Photos/Videos
                </Typography>
                
                {/* Error message para fotos */}
                {!hasEnoughMedia && (
                  <Box marginTop="xs">
                    <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                      Please add at least 3 Photos/Videos
                    </Typography>
                  </Box>
                )}
            </Box>
        </Box>
    </>
  );
};