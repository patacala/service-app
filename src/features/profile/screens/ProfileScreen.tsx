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
import { SessionManager } from '@/infrastructure/session';

/* import { GoogleSignin } from '@react-native-google-signin/google-signin'; */
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { ProfilePartial, useGetCurrentUserQuery, useUpdateProfileMutation } from '@/features/auth/store';
import { useGetCategoriesQuery } from '@/infrastructure/services/api';
import { useCreateServiceMutation, useUpdateServiceMutation, useGetMyServicesQuery } from '@/features/services/store';
import { getWallStyles } from '@/features/wall/screens/wall/wall.style';
import { ServiceOffer } from '@/features/services/components/ServiceOffer';

interface ServiceFormData {
  id: string;
  title: string;
  city: string;
  address: string;
  selectedServices: string[];
  selectedServiceOptions: ChipOption[];
  description: string;
  photos: string[];
  addressService: string;
  pricePerHour: number;
}

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
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetCategoriesQuery({ language: 'en' }); 
  const { data: profile, error: profileError } = useGetCurrentUserQuery();

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [createService, { isLoading: isLoadingCreateService, isError: isErrorCreateService, error: errorCreateService }] = useCreateServiceMutation();
  const [updateService, { isLoading: isLoadingUpdateService, isError: isErrorUpdateService, error: errorUpdateService }] = useUpdateServiceMutation();
  const { data: services, isLoading: isLoadingServices } = useGetMyServicesQuery();

  // Estado para la imagen de perfil
  const [profileImage, setProfileImage] = useState<string>('');

  // Estados para el formulario de servicios
  const [serviceFormVisible, setServiceFormVisible] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Estados de validación para cada paso del formulario de servicios
  const [step1Valid, setStep1Valid] = useState(false);
  const [step2Valid, setStep2Valid] = useState(false);
  const [step3Valid, setStep3Valid] = useState(false);

  // Estado para los datos del formulario de servicios
  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
    id: '',
    title: '',
    city: '',
    address: '',
    selectedServices: [],
    selectedServiceOptions: [],
    description: '',
    photos: [],
    addressService: '',
    pricePerHour: 62
  });

  const categories: ChipOption[] =
  categoriesData?.categories?.map((c: any) => ({
    id: c.id,
    label: c.name,
  })) ?? [];

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

  // Función para obtener el nombre de una categoría por su ID
  const getCategoryName = useMemo(() => {
  return (id: string): string => {
    if (!categories || categories.length === 0) {
      return id;
    }
    
    const category = categories.find((cat: ChipOption) => cat.id === id);
    return category?.label || id;
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
        text1: 'Error al cargar categorías',
        text2: (categoriesError as any)?.message ?? 'No se pudieron cargar las categorías.',
      });
    }
  }, [categoriesError]);

  useEffect(() => {
    if (profileError) {
      Toast.show({
        type: 'error',
        text1: 'Error al cargar perfil',
        text2: (profileError as any)?.message ?? 'No se pudo cargar el perfil.',
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

  // Función para seleccionar imagen directamente de la galería
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Could not select image');
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!profile) return;

      const updatedProfileData: ProfilePartial = {
        name: data.name,
        city: data.city,
        address: data.address,
        avatar: profileImage,
      };

      const response = await updateProfile(updatedProfileData).unwrap();
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
      });

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: response?.message ?? 'Profile successfully updated.',
      });
    } catch (error: any) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Error saving data.',
        text2: error?.data?.error || 'Unexpected error occurred.',
      });
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
      photos: [],
      addressService: '',
      pricePerHour: 62
    });
    setServiceFormVisible(true);
  };

  const handleEditService = (serviceId: string) => {
    const service = services?.find(s => s.id === serviceId);

    if (service) {
      setEditingServiceId(serviceId);
      
      // Convertir los IDs de categorías a ChipOptions
      const serviceOptions = getCategoryOptions(service.categories || []);
      
      setServiceFormData({
        id: service.id,
        title: service.title,
        city: service.city || '',
        address: service.city || '',
        selectedServices: service.categories || [],
        selectedServiceOptions: serviceOptions,
        description: service.description,
        photos: service.images || [],
        addressService: service.city || '',
        pricePerHour: service.price || 0
      });
      setServiceFormVisible(true);
    }
  };

  const handleServiceSubmit = async (data: ServiceFormData) => {
    try {
      if (editingServiceId) {
        console.log('Editing service:', editingServiceId);
        await updateService({
          id: data.id,
          data: {
            title: data.title,
            description: data.description,
            price: data.pricePerHour,
            categoryIds: data.selectedServices,
            images: data.photos,
            currency: 'USD',
            city: profile?.city ?? '',
            lat: undefined,
            lon: undefined,
            coverMediaId: undefined,
          },
      }).unwrap();
      } else {
        // Crear servicio en backend
        await createService({
          title: data.title,
          description: data.description,
          price: data.pricePerHour,   
          categoryIds: data.selectedServices,
          images: data.photos,
          currency: 'USD',
          city: profile?.city ?? '',
          lat: undefined,
          lon: undefined,
          coverMediaId: undefined
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
        photos: [],
        addressService: '',
        pricePerHour: 62,
      });
      return true;
    } catch (error: any) {
      console.error(error);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.data?.message || 'Failed to create service',
      });

      return false;
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

  const handlePhotosChange = (photos: string[]) => {
    setServiceFormData(prev => ({ ...prev, photos }));
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

  const itemsDetail = [
    { id: 'myprofile', label: 'My Profile' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'userreviews', label: 'User Reviews' },
    { id: 'subscriptions', label: 'Subscriptions' },
  ];

  const [selectedItemDetail, setSelectedItemDetail] = useState(['myprofile']);

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
                  source={
                    profileImage 
                      ? { uri: profileImage } 
                      : images.profileLarge1 as ImageSourcePropType
                  }
                  resizeMode="contain"
                  style={getProfileStyles.image}
                />
                <Box 
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  backgroundColor="colorBaseBlack"
                >
                  <Icon name="picture" color="colorBaseWhite" size={16} />
                </Box>
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
                    label="Name"
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your full name"
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
                    label="Email"
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your email"
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
                    label="City"
                    icon="transfer"
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your city"
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
                    label="Address"
                    icon="transfer"
                    value={value}
                    onChangeValue={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your full address"
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
                label="Save"
                onPress={handleSubmit(onSubmit, onError)}
                disabled={!isValid || !isDirty || isLoading}
              />
            </Box>
            
            <TouchableOpacity onPress={handleHelpPress} activeOpacity={0.7}>
              <Row spacing="sm" alignItems="center">
                <Icon name="sound" color="colorBaseWhite" />
                <Typography variant="bodyMedium" color={theme.colors.colorBaseWhite}>
                  Help
                </Typography>
              </Row>
            </TouchableOpacity>

            <Box marginTop="lg" marginBottom="xl">
              <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
                <Row spacing="sm" alignItems="center">
                  <Icon name="left-arrow" color="colorFeedbackError" />
                  <Typography variant="bodyMedium" color={theme.colors.colorFeedbackError}>
                    Logout
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
  const renderPortfolioContent = () => (
    <Box flex={1}>
      <FlatList
        data={services ?? []}
        keyExtractor={(item: any) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 70 }}
        ListHeaderComponent={
          <Box>
            <Row marginTop="md" gap="sm">
              <Icon name="tag" color="colorBaseWhite" />
              <Typography variant="bodyLarge" color="white">Services to offer</Typography>
            </Row>

            {/* Loading de categorías */}
            {isCategoriesLoading && (
              <Typography variant="bodyMedium" color={theme.colors.colorBaseWhite}>
                Loading categories...
              </Typography>
            )}

            {/* Loading de servicios */}
            {isLoadingServices && (
              <Box style={getWallStyles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.colorBrandPrimary} />
                <Typography variant="bodyMedium" color="white" style={getWallStyles.loadingText}>
                  Loading services...
                </Typography>
              </Box>
            )}
          </Box>
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
              label="Add New Service"
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

  // Contenido de User Reviews
  const reviews = [
    {
      rating: 4.2,
      reviewDate: '21 Apr',
      username: 'Username_010',
      reviewText: 'I hired them a month ago for a complete interior painting of my home, and the results are absolutely stunning.',
      reviewImages: [
        images.reviewImage1 as ImageSourcePropType,
        images.reviewImage2 as ImageSourcePropType,
        images.reviewImage3 as ImageSourcePropType
      ],
      reviewTitle: 'Awesome Work!',
    },
    {
      rating: 4.2,
      reviewDate: '15 Apr',
      username: 'Customer_456',
      reviewText: 'Professional service with attention to detail. They completed the job ahead of schedule and the quality exceeded my expectations.',
      reviewImages: [
        images.reviewImage2 as ImageSourcePropType,
        images.reviewImage3 as ImageSourcePropType
      ],
      reviewTitle: 'Great Experience',
    },
    {
      rating: 4.2,
      reviewDate: '02 Apr',
      username: 'HomeOwner_22',
      reviewText: 'The team was courteous and skilled. They transformed my living space with beautiful paint work and clean edges.',
      reviewImages: [
        images.reviewImage1 as ImageSourcePropType,
      ],
      reviewTitle: 'Highly Recommended',
    },
  ];

  const renderUserReviewsContent = () => (
    <FlatList
      data={reviews}
      keyExtractor={(review, index) => review.username + '-' + index}
      renderItem={({ item: review, index }) => (
        <TouchableWithoutFeedback onPress={() => {}}>
          <Box
            key={review.username + '-' + index}
            marginBottom={index < reviews.length - 1 ? 'md' : 'none'}
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
          onPhotosChange={handlePhotosChange}
          onValidationChange={handleStep2Validation}
          initialValues={{
            selectedServices: serviceFormData.selectedServices,
            selectedServiceOptions: serviceFormData.selectedServiceOptions,
            description: serviceFormData.description,
            photos: serviceFormData.photos
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

  const { logout } = useAuth();
  const proceedLogout = async () => {
    try {
      /* await GoogleSignin.signOut(); */
      await logout();

      const sessionManager = SessionManager.getInstance();
      await sessionManager.clearSession();

      console.log('Session successfully closed.');
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
        primaryButtonDisabled={isLoadingCreateService || isLoadingUpdateService}
        secondaryButtonDisabled={isLoadingCreateService || isLoadingUpdateService}
      />
    </View>
  );
};