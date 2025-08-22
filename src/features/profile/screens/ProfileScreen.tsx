import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Keyboard,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@shopify/restyle';
import * as ImagePicker from 'expo-image-picker';

// Design System
import { Box, Button, Input, Typography, Theme, GroupChipSelector, PremiumCard, SubscriptionPlans, SubscriptionPlan, ChipOption } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';

// Assets & Styles
import images from '@/assets/images/images';
import { getProfileStyles } from './profile/profile.styles';

// Redux
import { RootState } from '../../../store';
import {
  Profile,
  fetchProfileStart,
  updateProfileStart,
} from '../slices/profile.slice';
import { Icon } from '@/design-system/components/layout/Icon';
import { RatingReview } from '@/features/detail/components/RatingReview';
import { InfoMain } from '@/features/provMode/components/InfoMain';
import { DetailInfo } from '@/features/provMode/components/DetailInfo';
import { DetailService } from '@/features/provMode/components/DetailService';
import { ProviderForm } from '@/features/provMode/components/ProviderForm';
import { SessionManager } from '@/infrastructure/session';
/* import { GoogleSignin } from '@react-native-google-signin/google-signin'; */
import { useAuth } from '@/infrastructure/auth/AuthContext';

// Interfaces
interface ServiceData {
  id: string;
  phone: string;
  city: string;
  address: string;
  serviceOptions: ChipOption[];
  selectedServices: string[];
  pricePerHour: number;
  addressService: string;
  description: string;
  photos: string[];
}

interface ServiceFormData {
  phone: string;
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
  const dispatch = useDispatch();
  const { t } = useTranslation('auth');
  const theme = useTheme<Theme>();
  const { profile: userProfile } = useAuth();

  const { data: profile, isLoading } = useSelector(
    (state: RootState) => state.profile
  );

  // Estado para la imagen de perfil
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Estados para el formulario de servicios
  const [serviceFormVisible, setServiceFormVisible] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Estados de validación para cada paso del formulario de servicios
  const [step1Valid, setStep1Valid] = useState(false);
  const [step2Valid, setStep2Valid] = useState(false);
  const [step3Valid, setStep3Valid] = useState(false);

  // Estado para servicios guardados
  const [services, setServices] = useState<ServiceData[]>([
    {
      id: '1',
      phone: '305-555-0123',
      city: 'Miami',
      address: '1234 S Miami Ave, Miami, FL 33129',
      serviceOptions: [{ id: 'painter', label: 'Painter', icon: 'painter' }],
      selectedServices: ['painter'],
      pricePerHour: 62,
      addressService: 'S Miami Ave Miami, FL 33129',
      description: 'Residential Painting, Commercial Painting, Furniture Painting, Decorative Painting, Paint Restoration, Drywall Repair and Painting, Paint Consultation.',
      photos: []
    }
  ]);

  // Estado para los datos del formulario de servicios
  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
    phone: '',
    city: '',
    address: '',
    selectedServices: [],
    selectedServiceOptions: [],
    description: '',
    photos: [],
    addressService: '',
    pricePerHour: 62
  });

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
    formState: { errors, isValid, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: userProfile?.name,
      email: userProfile?.email,
      phone: getPhoneDetail(userProfile?.phone ?? '')?.number,
      city: userProfile?.location_city,
      address: userProfile?.address,
    }
  });

  /* useEffect(() => {
    dispatch(fetchProfileStart());
  }, [dispatch]); */

  /* useEffect(() => {
    if (userProfile) {
      reset({
        name: userProfile?.name,
        email: userProfile?.email,
        phone: userProfile?.phone,
        city: userProfile?.location_city,
        address: userProfile?.address,
      });
      setProfileImage(profile.avatar || null);
    }
  }, [profile, reset]); */

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

  const onSubmit = (data: ProfileFormData) => {
    if (!profile) return;

    const updatedProfile: Profile = {
      ...profile,
      name: data.name,
      city: data.city,
      address: data.address,
      avatar: profileImage,
      contactInfo: {
        email: data.email,
        phone: data.phone,
      },
    };
    
    dispatch(updateProfileStart(updatedProfile));
    
    Alert.alert(
      'Success',
      'Profile updated successfully!',
      [{ text: 'OK' }]
    );
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
      phone: profile?.contactInfo?.phone || '',
      city: profile?.city || '',
      address: profile?.address || '',
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
    const service = services.find(s => s.id === serviceId);

    if (service) {
      setEditingServiceId(serviceId);
      setServiceFormData({
        phone: service?.phone,
        city: service?.city,
        address: service?.address,
        selectedServices: service.selectedServices,
        selectedServiceOptions: service.serviceOptions,
        description: service.description,
        photos: service.photos,
        addressService: service.addressService,
        pricePerHour: service.pricePerHour
      });
      setServiceFormVisible(true);
    }
  };

  const handleServiceSubmit = (data: ServiceFormData) => {
    if (editingServiceId) {
      // Editar servicio existente
      setServices(prev => prev.map(service => 
        service.id === editingServiceId 
          ? {
              ...service,
              phone: data.phone,
              city: data.city,
              address: data.address,
              serviceOptions: data.selectedServiceOptions,
              selectedServices: data.selectedServices,
              pricePerHour: data.pricePerHour,
              addressService: data.addressService,
              description: data.description,
              photos: data.photos
            }
          : service
      ));
    } else {
      // Agregar nuevo servicio
      const newService: ServiceData = {
        id: Date.now().toString(),
        phone: data.phone,
        city: data.city,
        address: data.address,
        serviceOptions: data.selectedServiceOptions,
        selectedServices: data.selectedServices,
        pricePerHour: data.pricePerHour,
        addressService: data.addressService,
        description: data.description,
        photos: data.photos
      };
      setServices(prev => [...prev, newService]);
    }

    // Resetear formulario y cerrar modal
    setServiceFormData({
      phone: '',
      city: '',
      address: '',
      selectedServices: [],
      selectedServiceOptions: [],
      description: '',
      photos: [],
      addressService: '',
      pricePerHour: 62
    });
    setServiceFormVisible(false);
    setEditingServiceId(null);
  };

  // Handlers para el formulario de servicios
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
              disabled={!isValid || !isDirty}
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
  );

  // Contenido de Portfolio
  const renderPortfolioContent = () => (
    <>
      <Box>
        <Row marginTop="md" gap="sm">
          <Icon name="tag" color="colorBaseWhite"/>
          <Typography variant="bodyLarge" color="white">Services to offer</Typography>
        </Row>

        {/* Renderizar servicios existentes */}
        {services.map((service) => (
          <Box 
            key={service.id}
            marginTop="lg" 
            paddingHorizontal="md"
            paddingTop="sm"
            paddingBottom="md" 
            backgroundColor="colorGrey600"
            borderRadius={16}
            gap="sm"
          >
            <Row justifyContent="space-between">
              <Row spacing='none' gap="lg">
                <Box maxWidth={180}>
                  <GroupChipSelector
                    onChange={() => {}}
                    options={service.serviceOptions}
                    selectedIds={service.selectedServices}
                    variant="horizontal"
                    multiSelect={false}
                    textVariant="bodyMedium"
                  />
                </Box>
                <Typography variant="bodyMedium" color={theme.colors.colorBaseWhite}>
                  ${service.pricePerHour}/Hr
                </Typography>
              </Row>
              <Box>
                <Button 
                  variant="transparent" 
                  label="Edit" 
                  iconWidth={20} 
                  iconHeight={20} 
                  leftIcon={images.iconEdit as ImageSourcePropType} 
                  onPress={() => handleEditService(service.id)} 
                />
              </Box>
            </Row>

            <Box gap="sm">
              <Row spacing="sm">
                <Icon name="location" color="colorBaseWhite" />
                <Typography variant="bodySmall" color={theme.colors.colorBaseWhite}>
                  {service.addressService}
                </Typography>
              </Row>
              <Typography variant="bodyRegular" color={theme.colors.colorBaseWhite}>
                {service.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box marginTop="xl">
        <Button 
          variant="secondary" 
          label="Add New Service"
          onPress={handleAddNewService} 
        />
      </Box>
    </>
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

  const renderReviews = () => {
      return reviews.map((review, index) => (
        <Box key={review.username + '-' + index} marginBottom={index < reviews.length - 1 ? "md" : "none"}>
          <RatingReview 
            rating={review.rating}
            reviewDate={review.reviewDate}
            username={review.username}
            reviewText={review.reviewText}
            reviewImages={review.reviewImages}
            reviewTitle={review.reviewTitle}
          />
        </Box>
      ));
  };

  const renderUserReviewsContent = () => (
    <Box marginTop="lg" paddingHorizontal="md" paddingBottom="xl">
      {renderReviews()}
    </Box>
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
    <>
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
    </>
  );

  // Configuración de pasos del formulario de servicios
  const serviceSteps = [
    {
      title: editingServiceId ? "Edit Service" : "New Services",
      topText: "Build your portfolio",
      height: "77%",
      component: (
        <InfoMain 
          onPhoneChange={handlePhoneChange}
          onCityChange={handleCityChange}
          onAddressChange={handleAddressChange}
          onSelectedServicesChange={handleSelectedServicesChange}
          onValidationChange={handleStep1Validation}
          initialValues={{
            selectedServices: serviceFormData.selectedServices,
            selectedServiceOptions: serviceFormData.selectedServiceOptions
          }}
        />
      ),
      validation: () => step1Valid
    },
    {
      title: "Detail Information", 
      topText: "Build your portfolio",
      height: "94%",
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
      height: "76%",
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
    title: editingServiceId ? "Service Updated!" : "Services Successfully Created",
    description: "",
    height: "62%"
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
    <Box flex={1}>
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

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: 70 
        }}
        keyboardShouldPersistTaps="handled"
      >
        {renderContent()}
      </ScrollView>

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
      />
    </Box>
  );
};