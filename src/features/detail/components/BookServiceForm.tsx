import React, { useState, useEffect, useRef } from 'react';
import { BottomModal } from '@/design-system/components/forms/BottomModal/BottomModal';
import { IconName } from '@/design-system/components/layout/Icon';
import { FormService } from './FormService';
import { FormResponsible } from './FormResponsible';
import { ContactProvider } from './ContactProvider';

interface ChipOption {
  id: string;
  label: string;
  icon: IconName
}

interface BookServiceFormProps {
  visible: boolean;
  onClose: () => void;
  chipOptions?: ChipOption[];
  onSubmit?: (data: {
    serviceId: string;
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
  chipOptions = [],
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [contactProviderVisible, setContactProviderVisible] = useState<boolean>(false);
  const hasSetInitialService = useRef(false);
  const wasVisible = useRef(false);

  const [serviceData, setServiceData] = useState({
    serviceId: '',
    dateTime: null as Date | null,
    address: '',
    comments: '',
    responsibleName: '',
    phoneNumber: ''
  });
  
  // Estado para controlar la altura del modal según el paso
  const modalHeight = currentStep === 2 ? !contactProviderVisible ? 500:600 : undefined;

  useEffect(() => {
    if (visible && !wasVisible.current) {
      setCurrentStep(1);
      hasSetInitialService.current = false;
    }
    
    wasVisible.current = visible;
  
    if (visible && chipOptions.length > 0 && !hasSetInitialService.current) {
      setServiceData(prev => ({
        ...prev,
        serviceId: chipOptions[0].id
      }));
      hasSetInitialService.current = true;
      console.log('Servicio seleccionado inicialmente:', chipOptions[0].id);
    }
  }, [visible, chipOptions]);

  const handleDateTimeChange = (date: Date) => {
    console.log('Fecha seleccionada:', date);
    
    setServiceData(prev => ({ ...prev, dateTime: date }));
  };

  const handleTextChange = (text: string) => {
    setServiceData(prev => ({ ...prev, comments: text }));
  };
  
  const handleAddressChange = (address: string) => {
    setServiceData(prev => ({ ...prev, address }));
  };
  
  const handleServiceSelect = (serviceId: string) => {
    if (serviceId !== serviceData.serviceId) {
      setServiceData(prev => ({ ...prev, serviceId }));
      console.log('Servicio seleccionado manualmente:', serviceId);
    }
  };

  // Handlers para FormResponsible
  const handleResponsibleNameChange = (name: string) => {
    setServiceData(prev => ({ ...prev, responsibleName: name }));
  };

  const handlePhoneNumberChange = (phone: string) => {
    setServiceData(prev => ({ ...prev, phoneNumber: phone }));
  };

  // Validación para habilitar/deshabilitar el botón de continuar
  const canContinue = () => {
    if (currentStep === 1) {
      const canProceed = !!(serviceData.serviceId && serviceData.dateTime && serviceData.address);
      return canProceed;
    } else if (currentStep === 2) {
      return !!(serviceData.responsibleName && serviceData.phoneNumber);
    }
    return false;
  };

  // Función para avanzar al siguiente paso
  const handleContinue = () => {
    if (currentStep === 1) {
      console.log('Avanzando al paso 2 con datos:', serviceData);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      console.log('Enviando formulario completo:', serviceData);
      
      if (onSubmit) {
        onSubmit(serviceData);
      }
      
      setServiceData({
        serviceId: '',
        dateTime: null,
        address: '',
        comments: '',
        responsibleName: '',
        phoneNumber: ''
      });
      
      // Resetear el flag de servicio inicial
      hasSetInitialService.current = false;

      setContactProviderVisible(true);
      
      // Cerrar el modal
      //onClose();
    }
  };

  // Función para volver al paso anterior
  const handleBack = () => {
    if (currentStep === 2) {
      console.log('Volviendo al paso 1 con datos:', serviceData);
      setCurrentStep(1);
    } else {
      onClose();
    }
  };

  const handleContactProvider = () => {
    setContactProviderVisible(false);
    onClose();
  }

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      title={!contactProviderVisible ? "Book Service":""} 
      subtitle={!contactProviderVisible ? "Complete your painter request":""} 
      draggable={true}
      activateSteps={!contactProviderVisible}
      currentStep={currentStep}
      totalSteps={2}
      showPrimaryButton={contactProviderVisible ? false:true}
      primaryButtonText={currentStep === 2 ? !contactProviderVisible ? "Complete Request":"Contact Provider" : "Continue"}
      secondaryButtonText={currentStep === 2 ? "Go back" : "Cancel"}
      primaryButtonVariant="secondary"
      onPrimaryButtonPress={handleContinue}
      primaryButtonDisabled={!contactProviderVisible ? !canContinue():false}
      showSecondaryButton={contactProviderVisible ? false:true}
      secondaryButtonIcon="left-arrow"
      secondaryButtonVariant="outlined"
      onSecondaryButtonPress={handleBack}
      height={modalHeight}
      enableScroll={false}
    >
      {currentStep === 1 ? (
        <FormService 
          chipOptions={chipOptions}
          onDateTimeChange={handleDateTimeChange}
          onAddressChange={handleAddressChange}
          onCommentChange={handleTextChange}
          onServiceSelect={handleServiceSelect}
          initialValues={{
            dateTime: serviceData.dateTime,
            address: serviceData.address,
            comments: serviceData.comments
          }}
        />
      ) : (
        !contactProviderVisible ? 
          <FormResponsible 
            onNameChange={handleResponsibleNameChange}
            onPhoneChange={handlePhoneNumberChange}
            initialValues={{
              name: serviceData.responsibleName,
              phone: serviceData.phoneNumber
            }}
          /> 
        : <ContactProvider onButtonPress={handleContactProvider} initialValues={{}} />
      )}
    </BottomModal>
  );
};