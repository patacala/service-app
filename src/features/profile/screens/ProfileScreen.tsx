import React, { useEffect, useState, useMemo } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Keyboard,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@shopify/restyle';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

// Design System
import { Box, Button, Input, Typography, Theme, GroupChipSelector, PremiumCard, SubscriptionPlans, SubscriptionPlan, ChipOption } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';

// Assets & Styles
import images from '@/assets/images/images';
import { getProfileStyles } from './profile/profile.styles';
import { Icon } from '@/design-system/components/layout/Icon';
import { RatingReview } from '@/features/detail/components/RatingReview';
import { InfoMain } from '@/features/provMode/components/InfoMain';
import { DetailInfo } from '@/features/provMode/components/DetailInfo';
import { DetailService } from '@/features/provMode/components/DetailService';
import { ProviderForm } from '@/features/provMode/components/ProviderForm';

/* import { GoogleSignin } from '@react-native-google-signin/google-signin'; */
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { ProfilePartial, useGetCurrentUserQuery, useUpdateProfileMutation } from '@/features/auth/store';
import { useGetCategoriesQuery } from '@/infrastructure/services/api';
import { useCreateServiceMutation, useUpdateServiceMutation, useGetMyServicesQuery } from '@/features/services/store';
import { useCreateVideoDirectUploadUrlMutation, useDeleteImageMutation, useUploadImageMutation, useUploadVideoToDirectUrlMutation } from '@/features/media/store/media.api';
import { getWallStyles } from '@/features/wall/screens/wall/wall.style';
import { ServiceOffer } from '@/features/services/components/ServiceOffer';
import { getDeviceLanguage } from '@/assembler/config/i18n';
import { ServiceFormData } from '../slices/profile.slice';
import { useLocalSearchParams } from 'expo-router';
import { MediaObject, DownloadedMedia, RNFileLike } from '@/features/media/store/media.types';
import { Rating, useGetRatingsByUserQuery } from '@/features/ratings/store';

// Validation Schema
const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City name is too long'),
  
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(100, 'Address is too long'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileScreen = () => {
  const { t } = useTranslation('auth');
  const theme = useTheme<Theme>();
  // Categorias y perfil
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetCategoriesQuery({ language: getDeviceLanguage() }, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  }); 
  const { data: profile, error: profileError } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const [updateProfile] = useUpdateProfileMutation();
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const { data: services, isLoading: isLoadingServices, isFetching: isFetchingServices } = useGetMyServicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });
  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [createVideoDirectUploadUrl] = useCreateVideoDirectUploadUrlMutation();
  const [uploadVideoToDirectUrl] = useUploadVideoToDirectUrlMutation();
  
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para la imagen de perfil
  const [profileImage, setProfileImage] = useState<string>('');

  // Estados para el formulario de servicios
  const [serviceFormVisible, setServiceFormVisible] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Estados de validación para cada paso del formulario de servicios
  const [step1Valid, setStep1Valid] = useState(false);
  const [step2Valid, setStep2Valid] = useState(false);
  const [step3Valid, setStep3Valid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para los datos del formulario de servicios
  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
    id: '',
    title: '',
    city: '',
    address: '',
    selectedServices: [],
    selectedServiceOptions: [],
    description: '',
    media: [],
    addressService: '',
    pricePerHour: 62
  });

  const categories: ChipOption[] =
  categoriesData?.categories?.map((c: any) => ({
    id: c.id,
    label: c.name,
  })) ?? [];

  const { logout, user } = useAuth();

  // Api de rating
  const { data: ratingsData } = useGetRatingsByUserQuery();

  // Función para convertir IDs de categorías a ChipOptions
  const getCategoryOptions = useMemo(() => {
    return (categoryIds: string[]): ChipOption[] => {
      if (!categories || categories.length === 0) {
        return [];
      }
      
      return categoryIds
        .map(id => {
          const category = categories.find((cat: ChipOption) => cat.id === id);
          return category ? { id: category.id, label: category.label } : null;
        })
        .filter(Boolean) as ChipOption[];
    };
  }, [categories]);

  const getPhoneDetail = (phoneNumber: string) => {
      if (typeof phoneNumber !== 'string' || phoneNumber.trim() === '') {
          return null;
      }

      const cleanNumber = phoneNumber.replace(/\s+/g, '');
      const regex = /^\+1(\d{10})$/;
      const match = cleanNumber.match(regex);

      if (match) {
          const number = match[1];
          return { prefix: '+1', number };
      }

      return null;
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      address: '',
    }
  });

  useEffect(() => {
    if (categoriesError) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg20"),
        text2: t("messages.msg21"),
      });
    }
  }, [categoriesError]);

  useEffect(() => {
    if (profileError) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg34"),
        text2: t("messages.msg35")
      });
    }
  }, [profileError]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        email: profile.email ?? '',
        phone: getPhoneDetail(profile.phone ?? '')?.number ?? '',
        city: profile.city ?? '',
        address: profile.address ?? '',
      });
    }
  }, [profile, reset]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        setProfileImage(selectedFile.uri);
        setIsAvatarDirty(true);
      }
    } catch (error) {
      Alert.alert('Error', t("messages.msg36"));
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    let uploadedImageId: string | null = null;

    try {
      if (!profile) return;

      setIsSaving(true);
      let uploadedMedia: MediaObject | undefined;

      if (profileImage && !profileImage.startsWith('http')) {
        const file = {
          uri: profileImage,
          name: `avatar-${Date.now()}.jpg`,
          type: 'image/jpeg',
        };

        const response = await uploadImage({ file }).unwrap();
        uploadedMedia = response;
        uploadedImageId = response.id;
      }
      
      const updatedProfileData: ProfilePartial = {
        name: data.name,
        city: data.city,
        address: data.address,
        media: uploadedMedia,
      };

      await updateProfile(updatedProfileData).unwrap();
      if (profile.media && profile.media.length > 0) {
        const currentMedia = profile.media[0];
        await deleteImage(currentMedia.providerRef).unwrap();
      } 

      reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
      });
      setIsAvatarDirty(false);

      Toast.show({
        type: 'success',
        text1: t('messages.msg22'),
        text2: t('messages.msg37'),
      });
    } catch (error: any) {
      if (uploadedImageId) {
        try {
          await deleteImage(uploadedImageId).unwrap();
        } catch {}
      }

      Toast.show({
        type: 'error',
        text1: t('messages.msg24'),
        text2: t('messages.msg9'),
      });
    } finally {
      setIsSaving(false);

    }
  };

  const onError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Alert.alert('Validation Error', firstError.message);
    }
  };

  const handleHelpPress = () => {
    Alert.alert(
      'Help & Support',
      'How can we help you today?',
      [
        { text: 'Contact Support', onPress: () => console.log('Contact Support') },
        { text: 'FAQ', onPress: () => console.log('Open FAQ') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return value;
  };

  // Funciones para manejar servicios
  const handleAddNewService = () => {
    setEditingServiceId(null);
    setServiceFormData({
      id: '',
      title: '',
      city: '',
      address: '',
      selectedServices: [],
      selectedServiceOptions: [],
      description: '',
      media: [],
      addressService: '',
      pricePerHour: 62
    });
    setServiceFormVisible(true);
  };

  const handleEditService = async (serviceId: string) => {
    const service = services?.find(s => s.id === serviceId);
    if (!service) return;

    const serviceOptions = getCategoryOptions(service.categories || []);
    const photoUrls = await Promise.all(
      service.media?.map(async (m) => {
        if (m.kind === 'video') {
          const videoUrl = m.variants?.public?.url;
          if (videoUrl) {
            try {
              return await getVideoThumbnail(videoUrl);
            } catch (error) {
              return null;
            }
          }

          return null;
        } else {
          return m.variants?.thumbnail?.url;
        }
      }) || []
    ).then(urls => urls.filter(Boolean) as string[]);

    setEditingServiceId(service.id);
    setServiceFormData({
      id: service.id,
      title: service.title,
      city: service.city || '',
      address: service.city || '',
      selectedServices: service.categories || [],
      selectedServiceOptions: serviceOptions,
      description: service.description,
      media: photoUrls || [],
      addressService: service.city || '',
      pricePerHour: service.price || 0,
    });
    setServiceFormVisible(true);
  };

  const getVideoThumbnail = async (uri: string): Promise<string | null> => {
    try {
      // Extraer el video ID de la URL
      const videoIdMatch = uri.match(/\/([a-f0-9]{32})\//);
      
      if (!videoIdMatch) {
        return null;
      }
      
      const videoId = videoIdMatch[1];
      const customerCode = 'kb0znv13nolt7e8g';
      const thumbnailUrl = `https://customer-${customerCode}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
      
      return thumbnailUrl;
    } catch (e) {
      return null;
    }
  };

  const uploadMediaFromFormData = async (
    mediaUris: string[],
    existingMedia: DownloadedMedia[]
  ): Promise<MediaObject[]> => {
    if (mediaUris.length === 0) return [];
    
    const uploadPromises: Promise<MediaObject>[] = [];
    const uploadedMediaForCleanup: MediaObject[] = [];

    try {
      for (const uri of mediaUris) {
        if (uri.startsWith('http')) {
          let idFromUrl: string | undefined;
          const imageMatch = uri.match(/imagedelivery\.net\/[^/]+\/([^/]+)/);
          if (imageMatch) {
            idFromUrl = imageMatch[1];
          }

          const videoMatch = uri.match(/cloudflarestream\.com\/([^/]+)\//);
          if (videoMatch) {
            idFromUrl = videoMatch[1];
          }

          const found = existingMedia.find(m =>
            m.providerRef === idFromUrl || m.id === idFromUrl
          );

          uploadPromises.push(
            Promise.resolve({
              id: found?.providerRef ?? found?.id ?? idFromUrl,
              downloaded: true,
            } as MediaObject)
          );
        } else {
          const isVideo = /\.(mp4|mov|avi|mkv)$/i.test(uri);

          if (isVideo) {
            const uploadPromise = (async (): Promise<MediaObject> => {
              const { uid, uploadURL } = await createVideoDirectUploadUrl({}).unwrap();
              const videoId = uid;
              const name = `video-${videoId}.mp4`;

              const file: RNFileLike = {
                uri: uri,
                name,
                type: 'video/mp4',
              };
              await uploadVideoToDirectUrl({ uploadURL, file });

              const uploadedVideo = { id: videoId, filename: name, downloaded: false, kind: 'video' };
              uploadedMediaForCleanup.push(uploadedVideo);
              return uploadedVideo;
            })();
            uploadPromises.push(uploadPromise);

          } else {
            const file: RNFileLike = {
              uri: uri,
              name: `service-${Date.now()}.jpg`,
              type: 'image/jpeg',
            };

            const uploadPromise = uploadImage({ file })
              .unwrap()
              .then((result: MediaObject) => {
                const uploadedImage = { ...result, downloaded: false, kind: 'image'  };
                uploadedMediaForCleanup.push(uploadedImage);
                return uploadedImage;
              });
            uploadPromises.push(uploadPromise);
          }
        }
      }

      return await Promise.all(uploadPromises);
    } catch (error: any) {
      for (const media of uploadedMediaForCleanup) {
        if (media.id) {
          try {
            await deleteImage(media.id).unwrap();
          } catch {}
        }
      }

      return [];
    }
  };

  const handleServiceSubmit = async (data: ServiceFormData) => {
    let finalUploadedMedia: MediaObject[] = [];
    let mediaDownloaded: DownloadedMedia[] = []; 
    setIsSubmitting(true);

    try {
      mediaDownloaded = services?.find(s => s.id === data.id)?.media ?? [];

      if (data.media && data.media.length > 0) {
        finalUploadedMedia = await uploadMediaFromFormData(data.media, mediaDownloaded);
        if (finalUploadedMedia.length === 0 && data.media.length > 0) {
          return false;
        }
      }

      if (editingServiceId) {
        await updateService({
            id: data.id,
            data: {
              title: data.title,
              description: data.description,
              price: data.pricePerHour,
              categoryIds: data.selectedServices,
              media: finalUploadedMedia,
              currency: 'USD',
              city: profile?.city ?? '',
              lat: undefined,
              lon: undefined
            },
        }).unwrap();
        await deleteRemovedMedia(mediaDownloaded, finalUploadedMedia);
      } else {
        await createService({
          title: data.title,
          description: data.description,
          price: data.pricePerHour,   
          categoryIds: data.selectedServices,
          media: finalUploadedMedia,
          currency: 'USD',
          city: profile?.city ?? '',
          lat: undefined,
          lon: undefined,
        }).unwrap();
      }

      // Resetear formulario
      setServiceFormData({
        id: '',
        title: '',
        city: '',
        address: '',
        selectedServices: [],
        selectedServiceOptions: [],
        description: '',
        media: [],
        addressService: '',
        pricePerHour: 62,
      });

      return true;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.data?.message || 'Failed to create service',
      });

      // En caso de error en la creación del servicio, eliminar las imágenes subidas
      await deleteNewlyUploadedMedia(finalUploadedMedia);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRemovedMedia = async (
    mediaDownloaded: DownloadedMedia[],
    finalUploadedMedia: MediaObject[]
  ) => {
    const finalIds = new Set(finalUploadedMedia.map(m => m.id));
    for (const downloaded of mediaDownloaded) {
      const ref = downloaded.providerRef ?? downloaded.id;
      if (ref && !finalIds.has(ref)) {
        try {
          await deleteImage(ref).unwrap();
        } catch {}
      }
    }
  };

  const deleteNewlyUploadedMedia = async (finalUploadedMedia: MediaObject[]) => {
    for (const uploadedMedia of finalUploadedMedia) {
      try {
        if (!uploadedMedia.downloaded && uploadedMedia.id) {
          await deleteImage(uploadedMedia.id).unwrap();
        }
      } catch {}
    }
  };

  // Handlers para el formulario de servicios
  const handleTitleChange = (title: string) => {
    setServiceFormData(prev => ({ ...prev, title }));
  };

  const handlePhoneChange = (phone: string) => {
    setServiceFormData(prev => ({ ...prev, phone }));
  };

  const handleCityChange = (city: string) => {
    setServiceFormData(prev => ({ ...prev, city }));
  };

  const handleAddressChange = (address: string) => {
    setServiceFormData(prev => ({ ...prev, address }));
  };

  const handleSelectedServicesChange = (services: string[], serviceOptions: ChipOption[]) => {
    setServiceFormData(prev => ({ 
      ...prev, 
      selectedServices: services,
      selectedServiceOptions: serviceOptions
    }));
  };

  const handleDescriptionChange = (description: string) => {
    setServiceFormData(prev => ({ ...prev, description }));
  };

  const handleMediaChange = (media: string[]) => {
    setServiceFormData(prev => ({ ...prev, media }));
  };

  const handleAddressServiceChange = (addressService: string) => {
    setServiceFormData(prev => ({ ...prev, addressService }));
  };

  const handlePricePerHourChange = (pricePerHour: number) => {
    setServiceFormData(prev => ({ ...prev, pricePerHour }));
  };

  // Handlers de validación para cada paso
  const handleStep1Validation = (isValid: boolean) => {
    setStep1Valid(isValid);
  };

  const handleStep2Validation = (isValid: boolean) => {
    setStep2Valid(isValid);
  };

  const handleStep3Validation = (isValid: boolean) => {
    setStep3Valid(isValid);
  };

  const { section } = useLocalSearchParams<{ section?: string }>();
  const [selectedItemDetail, setSelectedItemDetail] = useState(['myprofile']);

  const itemsDetail = user?.role === 'publisher' || user?.role === 'both' ? [
    { id: 'myprofile', label: t("profile.myprofile")},
    { id: 'portfolio', label: t("profile.portfolio")},
    { id: 'userreviews', label: t("profile.userreviews")},
    { id: 'subscriptions', label: t("profile.subscriptions")},
  ]:[
    { id: 'myprofile', label: t("profile.myprofile")},
  ];

  // Función para cambiar la sección seleccionada
  const handleSectionChange = (selectedIds: string[]) => {
    setSelectedItemDetail(selectedIds);
  };

  // Función para renderizar el contenido según la sección seleccionada
  const renderContent = () => {
    const currentSection = selectedItemDetail[0];

    switch (currentSection) {
      case 'myprofile':
        return renderMyProfileContent();
      case 'portfolio':
        return renderPortfolioContent();
      case 'userreviews':
        return renderUserReviewsContent();
      case 'subscriptions':
        return renderSubscriptionsContent();
      default:
        return renderMyProfileContent();
    }
  };

  useEffect(() => {
    if (section && typeof section === 'string') {
      setSelectedItemDetail([section]);
    }
  }, [section]);

  // Contenido de My Profile
  const renderMyProfileContent = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 70,
      }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Box marginTop="lg" paddingHorizontal="md" paddingBottom="xl">
          
          {/* Profile Header */}
          <Box width="100%" justifyContent="center" alignItems="center" marginBottom="lg" gap="sm">
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <Box style={getProfileStyles.profileImage} position="relative">
                <Image
                  source={{
                    uri: profileImage
                      ? profileImage
                      : profile?.media?.[0]?.variants?.profileThumbnail?.url ?? 
                      'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d6201e99-87ce-450d-e6c1-91e3463f3600/profileThumbnail',
                  }}
                  resizeMode="contain"
                  style={getProfileStyles.image}
                />
                {/* <Box 
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  backgroundColor="colorBaseBlack"
                >
                  <Icon name="picture" color="colorBaseWhite" size={16} />
                </Box> */}
              </Box>
            </TouchableOpacity>
            <Typography variant="bodyMedium" color={theme.colors.colorBaseWhite}>
              ID 92347451
            </Typography>
          </Box>

          {/* Form */}
          <Box marginBottom="xl" gap="md">
            {/* Name */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Input
                    label={t("profile.name-label")}
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    placeholder={t("profile.name-placeholder")}
                  />
                  {errors.name && (
                    <Box marginTop="xs">
                      <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                        {errors.name.message}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Input
                    label={t("profile.email-label")}
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    placeholder={t("profile.email-placeholder")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={false}
                  />
                  {errors.email && (
                    <Box marginTop="xs">
                      <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                        {errors.email.message}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            />

            {/* Phone */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Row spacing="none" gap="sm" justify="space-between">
                    <Box style={getProfileStyles.prefix} padding="md">
                      <Typography variant="bodyRegular" colorVariant="secondary">
                        +1
                      </Typography>
                    </Box>
                    <Box flex={1}>
                      <Input
                        label={t('signupCompletion.number')}
                        variant="numeric"
                        value={value}
                        onChangeValue={(text) => {
                          const formatted = formatPhoneNumber(text);
                          onChange(formatted);
                        }}
                        onBlur={onBlur}
                        keyboardType="phone-pad"
                        maxLength={12}
                        style={{ width: '100%' }}
                        editable={false}
                      />
                    </Box>
                  </Row>
                  {errors.phone && (
                    <Box marginTop="xs">
                      <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                        {errors.phone.message}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            />

            {/* City */}
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Input
                    label={t("profile.city-label")}
                    icon="transfer"
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    placeholder={t("profile.email-placeholder")}
                  />
                  {errors.city && (
                    <Box marginTop="xs">
                      <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                        {errors.city.message}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            />

            {/* Address */}
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Input
                    label={t("profile.address-label")}
                    icon="transfer"
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    placeholder={t("profile.address-placeholder")}
                  />
                  {errors.address && (
                    <Box marginTop="xs">
                      <Typography variant="bodySmall" color={theme.colors.colorFeedbackError}>
                        {errors.address.message}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            />
          </Box>

          {/* Actions */}
          <Box width="100%" justifyContent="center" alignItems="center" gap="xl">
            <Box width="100%">
              <Button
                variant="secondary"
                label={t("profile.profilesave")}
                onPress={handleSubmit(onSubmit, onError)}
                disabled={
                  (!isValid && !isAvatarDirty) || 
                  (!isDirty && !isAvatarDirty) || 
                  isSaving 
                }
              />
            </Box>
            
            <TouchableOpacity onPress={handleHelpPress} activeOpacity={0.7}>
              <Row spacing="sm" alignItems="center">
                <Icon name="sound" color="colorBaseWhite" />
                <Typography variant="bodyMedium" color={theme.colors.colorBaseWhite}>
                  {t("profile.help")}
                </Typography>
              </Row>
            </TouchableOpacity>

            <Box marginTop="lg" marginBottom="xl">
              <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
                <Row spacing="sm" alignItems="center">
                  <Icon name="left-arrow" color="colorFeedbackError" />
                  <Typography variant="bodyMedium" color={theme.colors.colorFeedbackError}>
                    {t("profile.logout")}
                  </Typography>
                </Row>
              </TouchableOpacity>
            </Box>

          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </ScrollView>
  );

  // Contenido de Portfolio
  const renderTitlePortfolio = () => {
    return (
      <Row marginTop="md" gap="sm">
        <Icon name="tag" color="colorBaseWhite" />
        <Typography variant="bodyLarge" color="white">
          {t("profile.offerservices")}
        </Typography>
      </Row>
    );
  }
  
  const renderPortfolioContent = () => {
    if (isCategoriesLoading || isLoadingServices || isFetchingServices) {
      return (
        <Box>
          {renderTitlePortfolio()}
          <Box style={getWallStyles.loadingContainer} marginTop='lg'>
            <ActivityIndicator size="large" color={theme.colors.colorBrandPrimary} />
            <Typography variant="bodyMedium" color="white" style={getWallStyles.loadingText}>
              {t("profile.loadportfolio")}
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Box flex={1}>
        <FlatList
          data={services ?? []}
          keyExtractor={(item: any) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 70 }}
          ListHeaderComponent={
            renderTitlePortfolio()
          }
          renderItem={({ item: service, index }) => {
            const serviceOptions = getCategoryOptions(service.categories || []);
            return (
              <TouchableWithoutFeedback onPress={() => {}}>
                <ServiceOffer
                  key={service.id}
                  service={service}
                  serviceOptions={serviceOptions}
                  onEditPress={handleEditService}
                />
              </TouchableWithoutFeedback>
            );
          }}
          ListFooterComponent={
            <Box marginTop="xl">
              <Button
                variant="secondary"
                label={t("profile.addnewservice")}
                onPress={handleAddNewService}
                disabled={isCategoriesLoading}
              />
            </Box>
          }
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        />
      </Box>
    );
  };

  // Contenido de User Reviews
  const ratings: Rating[] = ratingsData?.ratings ?? [];
  const renderUserReviewsContent = () => (
    <FlatList
      data={ratings}
      keyExtractor={(review, index) => review.username + '-' + index}
      renderItem={({ item: review, index }) => (
        <TouchableWithoutFeedback onPress={() => {}}>
          <Box
            key={review.username + '-' + index}
            marginBottom={index < ratings.length - 1 ? 'md' : 'none'}
          >
            <RatingReview
              rating={review.rating}
              reviewDate={review.reviewDate}
              username={review.username}
              reviewText={review.reviewText}
              reviewImages={review.reviewImages}
              reviewTitle={review.reviewTitle}
            />
          </Box>
        </TouchableWithoutFeedback>
      )}
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 70,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );

  // Contenido de Subscriptions
  const premiumFeatures = [
    "Visibility in all the upcoming service",
    "Portfolio with more than 6 services",
    "Badged as a recommended worker",
    "Medical assistance for any occupational accident in the first 3 hours.",
    "Immediate technical assistance"
  ];

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      title: "Annual", 
      description: "First 30 days free - Then $99/Year",
      isBestValue: true, 
    },
    {
      title: "Monthly",
      description: "First 7 days free - Then $15,99/Month", 
      isActive: true
    }
  ];

  const renderSubscriptionsContent = () => (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 20,
          paddingBottom: 70, // ✅ solo paddings
        }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View>
            <PremiumCard 
              title="Get Premium" 
              features={premiumFeatures} 
            />

            <SubscriptionPlans 
              plans={subscriptionPlans}
              onPlanSelect={(index) => console.log(`Selected plan ${index}`)}
            />

            <Box width="100%" marginTop="md" marginBottom="lg" gap="sm">
              <Button
                variant="slide"
                label="Cancel Subscription"
                leftIcon="clear"
                onPress={() => {}}
              />
            </Box>

            <Box maxWidth={400}>
              <Typography variant="bodyRegular" color={theme.colors.colorBaseWhite}>
                By placing this order, you agree to the Terms of Service and Privacy Policy. 
                Subscription automatically renews unless auto-renew is turned off at least 24-hours 
                before the end of the current period.
              </Typography>
            </Box>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );

  // Configuración de pasos del formulario de servicios
  const serviceSteps = [
    { 
      key: editingServiceId ?? 'new',
      topText: "Build your portfolio",
      title: editingServiceId ? "Edit Service" : "New Services",
      height: "78%",
      component: (
        <InfoMain 
          key={editingServiceId ?? 'new-info'}
          onTitleChange={handleTitleChange}
          onPhoneChange={handlePhoneChange}
          onCityChange={handleCityChange}
          onAddressChange={handleAddressChange}
          onSelectedServicesChange={handleSelectedServicesChange}
          onValidationChange={handleStep1Validation}
          categories={categories}
          isCategoriesLoading={isCategoriesLoading}
          initialValues={{
            title: serviceFormData.title,
            selectedServices: serviceFormData.selectedServices,
            selectedServiceOptions: serviceFormData.selectedServiceOptions
          }}
        />
      ),
      validation: () => step1Valid
    },
    {
      topText: "Build your portfolio",
      title: "Detail Information", 
      height: "97%",
      component: (
        <DetailInfo 
          onDescriptionChange={handleDescriptionChange}
          onMediaChange={handleMediaChange}
          onValidationChange={handleStep2Validation}
          initialValues={{
            selectedServices: serviceFormData.selectedServices,
            selectedServiceOptions: serviceFormData.selectedServiceOptions,
            description: serviceFormData.description,
            media: serviceFormData.media
          }}
        />
      ),
      validation: () => step2Valid
    },
    {
      title: "Detail Service",
      topText: "Build your portfolio", 
      height: "81%",
      component: (
        <DetailService 
          onAddressServiceChange={handleAddressServiceChange}
          onPricePerHourChange={handlePricePerHourChange}
          onValidationChange={handleStep3Validation}
          initialValues={{
            selectedServices: serviceFormData.selectedServices,
            selectedServiceOptions: serviceFormData.selectedServiceOptions,
            addressService: serviceFormData.addressService,
            pricePerHour: serviceFormData.pricePerHour
          }}
        />
      ),
      validation: () => step3Valid
    }
  ];

  const serviceConfirmationStep = {
    image: images.withoutResult as ImageSourcePropType,
    title: editingServiceId ? "Service Successfully Updated!" : "Services Successfully Created",
    description: "",
    height: "66%"
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: proceedLogout }
      ]
    );
  };

  const proceedLogout = async () => {
    try {
      /* await GoogleSignin.signOut(); */
      await logout();
    } catch (error) {
      console.error('Error while signing out:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Box marginTop="sm">
        <GroupChipSelector
          onChange={handleSectionChange}
          options={itemsDetail}
          selectedIds={selectedItemDetail}
          variant="horizontal"
          multiSelect={false}
          textVariant="bodyMedium"
        />
      </Box>

      {renderContent()}
    
      {/* Modal del formulario de servicios */}
      <ProviderForm
        visible={serviceFormVisible}
        onClose={() => {
          setServiceFormVisible(false);
          setEditingServiceId(null);
        }}
        steps={serviceSteps}
        confirmationStep={serviceConfirmationStep}
        onSubmit={handleServiceSubmit}
        formData={serviceFormData}
        setFormData={setServiceFormData}
        primaryButtonDisabled={isSubmitting}
        secondaryButtonDisabled={isSubmitting}
      />
    </View>
  );
};