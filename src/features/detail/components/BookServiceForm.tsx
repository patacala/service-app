import React, { useState, useEffect, useRef } from 'react';
import { BottomModal } from '@/design-system/components/forms/BottomModal/BottomModal';
import { FormService } from './FormService';
import { FormResponsible } from './FormResponsible';
import { ContactProvider } from './ContactProvider';
import { useRouter } from 'expo-router';
import { Service } from '@/features/services/store';
import { useTranslation } from 'react-i18next';

interface BookServiceFormProps {
  visible: boolean;
  disabled?: boolean;
  onClose: () => void;
  service: Service; 
  onSubmit?: (data: {
    serviceId: string;
    serviceName: string;
    dateTime: Date | null;
    address: string;
    comments: string;
    responsibleName: string;
    phoneNumber: string;
  }) => Promise<boolean> | boolean;
}

export const BookServiceForm: React.FC<BookServiceFormProps> = ({
  visible,
  disabled,
  onClose,
  service,
  onSubmit
}) => {
  const { t } = useTranslation('auth');
  const router = useRouter();
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
    phoneNumber: '',
    useSavedAddress: false,
    useSavedNamePhone: false
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
        phoneNumber: '',
        useSavedAddress: false,
        useSavedNamePhone: false
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

  const handleUseSavedAddressChange = (value: boolean) => {
    setServiceData(prev => ({ ...prev, useSavedAddress: value }));
  };

  const handleResponsibleNameChange = (name: string) => {
    setServiceData(prev => ({ ...prev, responsibleName: name }));
  };

  const handlePhoneNumberChange = (phone: string) => {
    setServiceData(prev => ({ ...prev, phoneNumber: phone }));
  };

  const handleUseSavedNamePhoneChange = (value: boolean) => {
    setServiceData(prev => ({ ...prev, useSavedNamePhone: value }));
  };

  const canContinue = () => {
    if (currentStep === 1) {
      return !!(serviceData.dateTime && serviceData.address);
    } else if (currentStep === 2) {
      return !!(serviceData.responsibleName && serviceData.phoneNumber);
    }
    return false;
  };

  const handleContinue = async () => {
    if (disabled) return;

    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (onSubmit) {
        const success = await onSubmit(serviceData);
        if (success) {
          setContactProviderVisible(true);
        }
      }
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
    router.replace('/services');
    setContactProviderVisible(false);
    onClose();
  };

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      title={!contactProviderVisible ? t("details.bookservicesmall"):""}
      subtitle={!contactProviderVisible ? t("details.subtitlecomplete"):""}
      draggable={true}
      activateSteps={!contactProviderVisible}
      currentStep={currentStep}
      totalSteps={2}
      showPrimaryButton={!contactProviderVisible}
      primaryButtonText={currentStep === 2 ? (!contactProviderVisible ? t("details.completerequest"): t("details.contactprovider")) : t("details.btncontinue")}
      secondaryButtonText={currentStep === 2 ? t("details.btngoback") : t("details.btncancel")}
      primaryButtonVariant="secondary"
      onPrimaryButtonPress={handleContinue}
      primaryButtonDisabled={disabled || (!contactProviderVisible ? !canContinue() : false)}
      showSecondaryButton={!contactProviderVisible}
      secondaryButtonIcon="left-arrow"
      secondaryButtonVariant="outlined"
      onSecondaryButtonPress={handleBack}
      height={currentStep === 1 ? '89%': !contactProviderVisible ? '58%':'64%'}
      enableScroll={false}
    >
      {currentStep === 1 ? (
        <FormService
          serviceName={service.title}
          onDateTimeChange={handleDateTimeChange}
          onAddressChange={handleAddressChange}
          onCommentChange={handleTextChange}
          onUseSavedAddressChange={handleUseSavedAddressChange}
          initialValues={{
            dateTime: serviceData.dateTime,
            address: serviceData.address,
            comments: serviceData.comments,
            useSavedAddress: serviceData.useSavedAddress
          }}
        />
      ) : (
        !contactProviderVisible ? (
          <FormResponsible
            onNameChange={handleResponsibleNameChange}
            onPhoneChange={handlePhoneNumberChange}
            onUseSavedNamePhoneChange={handleUseSavedNamePhoneChange}
            initialValues={{
              name: serviceData.responsibleName,
              phone: serviceData.phoneNumber,
              useSavedNamePhone: serviceData.useSavedNamePhone
            }}
          />
        ) : (
          <ContactProvider onButtonPress={handleContactProvider} />
        )
      )}
    </BottomModal>
  );
};
