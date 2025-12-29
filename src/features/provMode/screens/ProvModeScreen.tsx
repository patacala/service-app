import { useEffect, useState } from "react";
import { ImageSourcePropType } from "react-native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

import { Box, Button, PremiumCard, ChipOption } from "@/design-system";
import images from "@/assets/images/images";
import { LocationPanel } from "@/features/wall/components/LocationPanel";
import { ProviderAccount } from "../components/ProviderAccount";
import { ProviderForm } from "../components/ProviderForm";
import { InfoMain } from "../components/InfoMain";
import { DetailInfo } from "../components/DetailInfo";
import { DetailService } from "../components/DetailService";
import { ProviderFormData } from "../slices/provmod.slice";
import { getDeviceLanguage } from "@/assembler/config/i18n";
import { useGetCategoriesQuery } from "@/infrastructure/services/api";
import { useGetCurrentUserQuery } from "@/features/auth/store";
import { useCreateAccountProvServiceMutation } from '@/features/services/store';
import { useCreateVideoDirectUploadUrlMutation, useDeleteImageMutation, useUploadImageMutation, useUploadVideoToDirectUrlMutation } from '@/features/media/store/media.api';
import { useAuth } from "@/infrastructure/auth/AuthContext";
import { router } from "expo-router";
import { MediaObject, RNFileLike } from "@/features/media/store/media.types";

interface Location {
  id: string;
  name: string;
}

export const ProvModeScreen = () => {
  const { t } = useTranslation('auth');
  const { login } = useAuth();
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } =
  useGetCategoriesQuery({ language: getDeviceLanguage() }, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });
  const { data: profile, error: profileError } = useGetCurrentUserQuery(undefined, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true
  });
  const [createAccountProvService] = useCreateAccountProvServiceMutation();
  
  // Mutations para manejo de imágenes y videos
  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [createVideoDirectUploadUrl] = useCreateVideoDirectUploadUrlMutation();
  const [uploadVideoToDirectUrl] = useUploadVideoToDirectUrlMutation();

  const [locationPanelVisible, setLocationPanelVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>({ id: '1', name: 'Miami, FL' });
  const [provAccountVisible, setProvAccountVisible] = useState(false);
  const [providerFormVisible, setProviderFormVisible] = useState(false);

  // Estados de validación para cada paso
  const [step1Valid, setStep1Valid] = useState(false);
  const [step2Valid, setStep2Valid] = useState(false);
  const [step3Valid, setStep3Valid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: ChipOption[] =
  categoriesData?.categories?.map((c: any) => ({
    id: c.id,
    label: c.name,
  })) ?? [];

  // Estado para manejar los datos del formulario
  const [providerFormData, setProviderFormData] = useState<ProviderFormData>({
    title: '',
    phone: '',
    city: '',
    address: '',
    selectedServices: [],
    selectedServiceOptions: [],
    description: '',
    media: [],
    addressService: '',
    pricePerHour: 62
  });

  useEffect(() => {
    if (categoriesError) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg20"),
        text2: t("messages.msg21"),
      });
    }
  }, [categoriesError, t]);
  
  useEffect(() => {
    if (profileError) {
      Toast.show({
        type: 'error',
        text1: t("messages.msg34"),
        text2: t("messages.msg35")
      });
    }
  }, [profileError, t]);

  const uploadMediaFromFormData = async (
    mediaUris: string[]
  ): Promise<MediaObject[]> => {
    if (mediaUris.length === 0) return [];
    
    const uploadPromises: Promise<MediaObject>[] = [];
    const uploadedMediaForCleanup: MediaObject[] = [];

    try {
      for (const uri of mediaUris) {
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

      return await Promise.all(uploadPromises);
    } catch {
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

  const handleSelectLocation = (location: Location) => {
    setCurrentLocation(location);
  };

  const handleProAccount = () => {
    setProvAccountVisible(true);
  };

  const handleProForm = () => {
    setProviderFormVisible(true);
  };

  const handleProviderSubmit = async (data: ProviderFormData) => {
    let finalUploadedMedia: MediaObject[] = [];
    setIsSubmitting(true);

    try {
      if (data.media && data.media.length > 0) {
        finalUploadedMedia = await uploadMediaFromFormData(data.media);
        if (finalUploadedMedia.length === 0 && data.media.length > 0) {
          return false;
        }
      }

      // Crear el servicio con las imágenes subidas
      const { user, token } = await createAccountProvService({
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

      await login(token, user);

      // Limpiar estados
      setProviderFormData({
        title: '',
        phone: '',
        city: '',
        address: '',
        selectedServices: [],
        selectedServiceOptions: [],
        description: '',
        media: [],
        addressService: '',
        pricePerHour: 62
      });

      router.replace({ pathname: '/profile', params: { section: 'portfolio' } });
      return true;
    } catch (error: any) {
      console.log(error);
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.data?.message || 'Failed to create account',
      });

      // En caso de error en la creación del servicio, eliminar las imágenes subidas
      await deleteNewlyUploadedMedia(finalUploadedMedia);
      return false;
    } finally {
      setIsSubmitting(false);
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

  // Handlers para cada paso
  const handleTitleChange = (title: string) => {
    setProviderFormData(prev => ({ ...prev, title }));
  };

  const handlePhoneChange = (phone: string) => {
    setProviderFormData(prev => ({ ...prev, phone }));
  };

  const handleCityChange = (city: string) => {
    setProviderFormData(prev => ({ ...prev, city }));
  };

  const handleAddressChange = (address: string) => {
    setProviderFormData(prev => ({ ...prev, address }));
  };

  const handleSelectedServicesChange = (services: string[], serviceOptions: ChipOption[]) => {
    setProviderFormData(prev => ({ 
      ...prev, 
      selectedServices: services,
      selectedServiceOptions: serviceOptions
    }));
  };

  const handleDescriptionChange = (description: string) => {
    setProviderFormData(prev => ({ ...prev, description }));
  };

  // Handler para actualizar las fotos desde DetailInfo
  const handleMediaChange = (media: string[]) => {
    setProviderFormData(prev => ({ ...prev, media }));
  };

  const handleAddressServiceChange = (addressService: string) => {
    setProviderFormData(prev => ({ ...prev, addressService }));
  };

  const handlePricePerHourChange = (pricePerHour: number) => {
    setProviderFormData(prev => ({ ...prev, pricePerHour }));
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

  const premiumFeatures = [
    "Flexible Hours",
    "Your price per hour",
    "Low service payment and taxes",
  ];

  const providerSteps = [
    {
      title: "Provider Account",
      topText: "Almost done!",
      height: "99%",
      component: (
        <InfoMain 
          onTitleChange={handleTitleChange}
          onPhoneChange={handlePhoneChange}
          onCityChange={handleCityChange}
          onAddressChange={handleAddressChange}
          onSelectedServicesChange={handleSelectedServicesChange}
          onValidationChange={handleStep1Validation}
          categories={categories} 
          isCategoriesLoading={isCategoriesLoading} 
          initialValues={{
            title: providerFormData.title,
            phone: providerFormData.phone,
            city: providerFormData.city,
            address: providerFormData.address,
            selectedServices: providerFormData.selectedServices,
            selectedServiceOptions: providerFormData.selectedServiceOptions
          }}
        />
      ),
      validation: () => step1Valid
    },
    {
      title: "Detail Information", 
      topText: "Build your portfolio",
      height: "95%",
      component: (
        <DetailInfo 
          onDescriptionChange={handleDescriptionChange}
          onMediaChange={handleMediaChange}
          onValidationChange={handleStep2Validation}
          maxMedia={6}
          initialValues={{
            selectedServices: providerFormData.selectedServices,
            selectedServiceOptions: providerFormData.selectedServiceOptions,
            description: providerFormData.description,
            media: providerFormData.media
          }}
        />
      ),
      validation: () => step2Valid
    },
    {
      title: "Detail Service",
      topText: "Build your portfolio", 
      height: "82%",
      component: (
        <DetailService 
          onAddressServiceChange={handleAddressServiceChange}
          onPricePerHourChange={handlePricePerHourChange}
          onValidationChange={handleStep3Validation}
          initialValues={{
            selectedServices: providerFormData.selectedServices,
            selectedServiceOptions: providerFormData.selectedServiceOptions,
            addressService: providerFormData.addressService,
            pricePerHour: providerFormData.pricePerHour
          }}
        />
      ),
      validation: () => step3Valid
    }
  ];

  const confirmationStep = {
    image: images.withoutResult as ImageSourcePropType,
    title: "Account Confirmed",
    description: "From now on you can use all the services as a provider",
    height: "62%"
  };

  return (
    <>
      <PremiumCard 
        title="Become a provider with us!" 
        features={premiumFeatures} 
      />

      <Box gap="lg" marginTop="md">
          <Button
          variant="outlined"
          label="I already have an account"
          onPress={handleProAccount}
          />
          <Button
          variant="secondary"
          label="Create an account"
          onPress={handleProForm}
          />
      </Box>

      <LocationPanel
        visible={locationPanelVisible}
        onClose={() => setLocationPanelVisible(false)}
        onSelectLocation={handleSelectLocation}
        currentLocation={currentLocation}
      />

      <ProviderAccount
          visible={provAccountVisible}
          onClose={() => setProvAccountVisible(false)}
      />

      <ProviderForm
        visible={providerFormVisible}
        onClose={() => setProviderFormVisible(false)}
        steps={providerSteps}
        confirmationStep={confirmationStep}
        onSubmit={handleProviderSubmit}
        formData={providerFormData}
        setFormData={setProviderFormData}
        primaryButtonDisabled={isSubmitting}
        secondaryButtonDisabled={isSubmitting}
      />
    </>
  );
};