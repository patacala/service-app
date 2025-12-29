import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Image, ImageSourcePropType, Alert, ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, ChipOption, GroupChipSelector, Input, Theme, Typography, Button } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import { Icon } from '@/design-system/components/layout/Icon';
import images from "@/assets/images/images";
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';

const detailInfoSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
});

type DetailInfoFormData = z.infer<typeof detailInfoSchema>;

interface InitialValues {
  selectedServices?: string[];
  selectedServiceOptions?: ChipOption[];
  description?: string;
  media?: string[];
}

interface MediaAsset {
  uri: string;
  displayUri: string;
  type: 'image' | 'video';
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

  const [media, setMedia] = useState<MediaAsset[]>(() => {
    const initialMedia = initialValues.media || [];
    return initialMedia.map(uri => ({
      uri,
      displayUri: uri,
      type: uri.endsWith('.mp4') || uri.endsWith('.mov') ? 'video' : 'image',
    }));
  });

  const selectedServices = initialValues.selectedServices || [];
  const selectedServiceOptions = initialValues.selectedServiceOptions || [];

  const watchedValues = watch();

  useEffect(() => {
    const generateInitialThumbnails = async () => {
      const updatedMedia = await Promise.all(
        media.map(async (asset) => {
          if (asset.type === 'video' && asset.uri === asset.displayUri) {
            const thumb = await getVideoThumbnail(asset.uri);
            if (thumb) {
              return { ...asset, displayUri: thumb };
            }
          }
          return asset;
        })
      );
      setMedia(updatedMedia);
    };

    if (initialValues.media && initialValues.media.length > 0) {
        generateInitialThumbnails();
    }
  }, [initialValues.media]);

  useEffect(() => {
    const validMedia = media.filter(m => m.uri.trim() !== '');
    const hasEnoughMedia = validMedia.length >= 3;
    const formIsValid = isValid;
    const overallValid = formIsValid && hasEnoughMedia;

    if (onValidationChange) {
      onValidationChange(overallValid);
    }
  }, [isValid, media, onValidationChange]);

  useEffect(() => {
    if (onDescriptionChange && watchedValues.description !== initialValues.description) {
      onDescriptionChange(watchedValues.description);
    }
  }, [watchedValues.description, onDescriptionChange, initialValues.description]);

  const notifyMediaChange = (newMedia: MediaAsset[]) => {
    const validMediaUris = newMedia.map(asset => asset.uri).filter(uri => uri.trim() !== '');
    if (onMediaChange) {
      onMediaChange(validMediaUris);
    }
  };

  const selectImageFromLibrary = async (): Promise<MediaAsset | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        if (asset.type === 'video') {
          const thumbUri = await getVideoThumbnail(asset.uri);
          return {
            uri: asset.uri,
            displayUri: thumbUri || asset.uri,
            type: 'video',
          };
        } else {
          return {
            uri: asset.uri,
            displayUri: asset.uri,
            type: 'image',
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error selecting media:', error);
      Alert.alert('Error', 'Could not select media');
      return null;
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleMediaelect = async (index: number) => {
    try {
      const mediaAsset = await selectImageFromLibrary();
      
      if (mediaAsset) {
        const newMedia = [...media];
        
        if (index >= newMedia.length) {
          newMedia.push(mediaAsset);
        } else {
          newMedia[index] = mediaAsset;
        }
        
        setMedia(newMedia);
        notifyMediaChange(newMedia);
        
        scrollToEnd();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el medio');
      console.error('Error selecting media:', error);
    }
  };

  const handlePhotoRemove = (index: number) => {
    Alert.alert(
      'Delete Media',
      'Are you sure you want to delete this media?',
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

  const renderAllPhotoBoxes = () => {
    const boxes = [];
    const validMediaCount = media.filter(m => m.uri.trim() !== '').length;
    
    if (media.length === 0) {
      for (let i = 0; i < 3; i++) {
        boxes.push(renderPhotoBox(null, i, false));
      }
      return boxes;
    }
    
    const totalBoxesToShow = Math.max(3, media.length);
    
    for (let i = 0; i < totalBoxesToShow; i++) {
      const asset = i < media.length ? media[i] : null;
      boxes.push(renderPhotoBox(asset, i, false));
    }
    
    const allBoxesFilled = media.length >= 3 && media.every(m => m.uri.trim() !== '');
    
    if (allBoxesFilled && validMediaCount < maxMedia) {
      boxes.push(renderPhotoBox(null, media.length, true));
    }
 
    return boxes;
  };
  
  const renderPhotoBox = (asset: MediaAsset | null, index: number, isAddButton: boolean = false) => {
    const hasMedia = asset && asset.uri.trim() !== '';

    return (
      <TouchableOpacity
        key={isAddButton ? `add-${index}` : index}
        onPress={() => hasMedia ? handlePhotoRemove(index) : handleMediaelect(index)}
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
          {hasMedia ? (
            <>
              <Image
                source={{ uri: asset.displayUri }}
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

  const getVideoThumbnail = async (uri: string): Promise<string | null> => {
    try {
      const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1500,
      });
      return thumbnailUri;
    } catch (e) {
      console.warn('Error generating thumbnail:', e);
      return null;
    }
  };

  const validMediaCount = media.filter(m => m.uri.trim() !== '').length;
  const hasEnoughMedia = validMediaCount >= 3;

  return (
      <>
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

        <Box marginBottom="lg">
            <Row marginBottom="sm" gap="sm" justifyContent="space-between" alignItems="center">
                <Box gap="sm">
                    <Typography variant="bodyLarge" color="white">Evidences</Typography>
                </Box>
            </Row>

            <ScrollView 
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {renderAllPhotoBoxes()}
            </ScrollView>

            <Box marginTop="sm">
                <Typography variant="bodySmall" color={theme.colors.colorGrey300}>
                    {validMediaCount} of {maxMedia} Photos/Videos
                </Typography>
                
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