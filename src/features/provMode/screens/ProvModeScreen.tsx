import { useState } from "react";
import { Image, ImageSourcePropType } from "react-native";
import { Box, Button, PremiumCard, Typography, theme, ChipOption } from "@/design-system";
import { getProvModeStyles } from './provMode/provmode.styles';
import images from "@/assets/images/images";
import { Row } from "@/design-system/components/layout/Row/Row";
import { LocationPanel } from "@/features/wall/components/LocationPanel";
import { ProviderAccount } from "../components/ProviderAccount";
import { ProviderForm } from "../components/ProviderForm";
import { InfoMain } from "../components/InfoMain";
import { DetailInfo } from "../components/DetailInfo";
import { DetailService } from "../components/DetailService";
import { ProviderFormData } from "../slices/provmod.slice";

interface Location {
  id: string;
  name: string;
}

export const ProvModeScreen = () => {
  const [locationPanelVisible, setLocationPanelVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>({ id: '1', name: 'Miami, FL' });
  const [provAccountVisible, setProvAccountVisible] = useState(false);
  const [providerFormVisible, setProviderFormVisible] = useState(false);

  // Estados de validación para cada paso
  const [step1Valid, setStep1Valid] = useState(false);
  const [step2Valid, setStep2Valid] = useState(false);
  const [step3Valid, setStep3Valid] = useState(false);

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState<ProviderFormData>({
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

  const handleSelectLocation = (location: Location) => {
    setCurrentLocation(location);
  };

  const handleProAccount = () => {
    setProvAccountVisible(true);
  };

  const handleProForm = () => {
    setProviderFormVisible(true);
  };

  const handleProviderSubmit = (data: ProviderFormData) => {
    console.log('Datos del formulario completo:', data);

    setFormData({
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
  };

  // Handlers para cada paso
  const handlePhoneChange = (phone: string) => {
    setFormData(prev => ({ ...prev, phone }));
  };

  const handleCityChange = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
  };

  const handleAddressChange = (address: string) => {
    setFormData(prev => ({ ...prev, address }));
  };

  const handleSelectedServicesChange = (services: string[], serviceOptions: ChipOption[]) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedServices: services,
      selectedServiceOptions: serviceOptions
    }));
  };

  const handleDescriptionChange = (description: string) => {
    setFormData(prev => ({ ...prev, description }));
  };

  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({ ...prev, photos }));
  };

  const handleAddressServiceChange = (addressService: string) => {
    setFormData(prev => ({ ...prev, addressService }));
  };

  const handlePricePerHourChange = (pricePerHour: number) => {
    setFormData(prev => ({ ...prev, pricePerHour }));
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
      height: "100%",
      component: (
        <InfoMain 
          onPhoneChange={handlePhoneChange}
          onCityChange={handleCityChange}
          onAddressChange={handleAddressChange}
          onSelectedServicesChange={handleSelectedServicesChange}
          onValidationChange={handleStep1Validation}
          initialValues={{
            phone: formData.phone,
            city: formData.city,
            address: formData.address,
            selectedServices: formData.selectedServices,
            selectedServiceOptions: formData.selectedServiceOptions
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
          onPhotosChange={handlePhotosChange}
          onValidationChange={handleStep2Validation}
          initialValues={{
            selectedServices: formData.selectedServices,
            selectedServiceOptions: formData.selectedServiceOptions,
            description: formData.description,
            photos: formData.photos
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
            selectedServices: formData.selectedServices,
            selectedServiceOptions: formData.selectedServiceOptions,
            addressService: formData.addressService,
            pricePerHour: formData.pricePerHour
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
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};