import React, { useState, useEffect, useRef } from 'react';
import { BottomModal } from '@/design-system/components/forms/BottomModal/BottomModal';
import { FormService } from './FormService';
import { FormResponsible } from './FormResponsible';
import { ContactProvider } from './ContactProvider';
import { CardPost } from '@/features/wall/slices/wall.slice';

interface BookServiceFormProps {
  visible: boolean;
  onClose: () => void;
  service: CardPost; 
  onSubmit?: (data: {
    serviceId: string;
    serviceName: string;
    dateTime: Date | null;
    address: string;
    comments: string;
    responsibleName: string;
    phoneNumber: string;
  }) => void;
}

export const BookServiceForm: React.FC<BookServiceFormProps> = ({
  visible,
  onClose,
  service,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [contactProviderVisible, setContactProviderVisible] = useState<boolean>(false);
  const wasVisible = useRef(false);

  const [serviceData, setServiceData] = useState({
    serviceId: service.id,
    serviceName: service.title,
    dateTime: null as Date | null,
    address: '',
    comments: '',
    responsibleName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (visible && !wasVisible.current) {
      setCurrentStep(1);
      setServiceData({
        serviceId: service.id,
        serviceName: service.title,
        dateTime: null,
        address: '',
        comments: '',
        responsibleName: '',
        phoneNumber: ''
      });
    }
    wasVisible.current = visible;
  }, [visible, service]);

  const handleDateTimeChange = (date: Date) => {
    setServiceData(prev => ({ ...prev, dateTime: date }));
  };

  const handleTextChange = (text: string) => {
    setServiceData(prev => ({ ...prev, comments: text }));
  };

  const handleAddressChange = (address: string) => {
    setServiceData(prev => ({ ...prev, address }));
  };

  const handleResponsibleNameChange = (name: string) => {
    setServiceData(prev => ({ ...prev, responsibleName: name }));
  };

  const handlePhoneNumberChange = (phone: string) => {
    setServiceData(prev => ({ ...prev, phoneNumber: phone }));
  };

  const canContinue = () => {
    if (currentStep === 1) {
      return !!(serviceData.dateTime && serviceData.address);
    } else if (currentStep === 2) {
      return !!(serviceData.responsibleName && serviceData.phoneNumber);
    }
    return false;
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (onSubmit) {
        onSubmit(serviceData);
      }
      setContactProviderVisible(true);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      onClose();
    }
  };

  const handleContactProvider = () => {
    setContactProviderVisible(false);
    onClose();
  };

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      title={!contactProviderVisible ? "Book Service":""}
      subtitle={!contactProviderVisible ?"Complete your painter request":""}
      draggable={true}
      activateSteps={!contactProviderVisible}
      currentStep={currentStep}
      totalSteps={2}
      showPrimaryButton={!contactProviderVisible}
      primaryButtonText={currentStep === 2 ? (!contactProviderVisible ? "Complete Request" : "Contact Provider") : "Continue"}
      secondaryButtonText={currentStep === 2 ? "Go back" : "Cancel"}
      primaryButtonVariant="secondary"
      onPrimaryButtonPress={handleContinue}
      primaryButtonDisabled={!contactProviderVisible ? !canContinue() : false}
      showSecondaryButton={!contactProviderVisible}
      secondaryButtonIcon="left-arrow"
      secondaryButtonVariant="outlined"
      onSecondaryButtonPress={handleBack}
      height={currentStep === 1 ? '88%': !contactProviderVisible ? '70%':'64%'}
      enableScroll={true}
    >
      {currentStep === 1 ? (
        <FormService
          serviceName={service.title}
          onDateTimeChange={handleDateTimeChange}
          onAddressChange={handleAddressChange}
          onCommentChange={handleTextChange}
          initialValues={{
            dateTime: serviceData.dateTime,
            address: serviceData.address,
            comments: serviceData.comments
          }}
        />
      ) : (
        !contactProviderVisible ? (
          <FormResponsible
            onNameChange={handleResponsibleNameChange}
            onPhoneChange={handlePhoneNumberChange}
            initialValues={{
              name: serviceData.responsibleName,
              phone: serviceData.phoneNumber
            }}
          />
        ) : (
          <ContactProvider onButtonPress={handleContactProvider} initialValues={{}} />
        )
      )}
    </BottomModal>
  );
};
