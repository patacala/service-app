import React, { useState, useEffect, useRef } from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { BottomModal } from '@/design-system/components/forms/BottomModal/BottomModal';
import { Box, Theme, Typography } from '@/design-system';
import { useTheme } from '@shopify/restyle';

interface StepConfig {
  title: string;
  topText: string;
  height: string;
  component: React.ReactNode;
  validation?: () => boolean;
}

interface ConfirmationConfig {
  image?: ImageSourcePropType;
  title: string;
  description: string;
  height?: string;
}

interface ProviderFormProps {
  visible: boolean;
  onClose: () => void;
  steps: StepConfig[];
  confirmationStep?: ConfirmationConfig;
  onSubmit?: (data: any) => boolean | Promise<boolean>;
  onStepChange?: (step: number, data: any) => void;
  draggable?: boolean;
  enableScroll?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  formData?: any;
  setFormData?: (data: any) => void;
}

export const ProviderForm: React.FC<ProviderFormProps> = ({
  visible,
  onClose,
  steps,
  confirmationStep,
  onSubmit,
  onStepChange,
  draggable = true,
  enableScroll = true,
  primaryButtonText = "Continue",
  secondaryButtonText = "Go back",
  formData = {},
  setFormData
}) => {
  const theme = useTheme<Theme>();
  const styles = createStyles(theme);
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const wasVisible = useRef(false);
  const totalSteps = steps.length;
  const hasConfirmation = !!confirmationStep;

  // Estado interno si no se proporciona desde afuera
  const [internalFormData, setInternalFormData] = useState<any>({});
  
  // Usar formData externo o interno
  const currentFormData = formData || internalFormData;
  const updateFormData = setFormData || setInternalFormData;

  // Resetear al abrir el modal
  useEffect(() => {
    if (visible && !wasVisible.current) {
      setCurrentStep(1);
      if (!setFormData) {
        setInternalFormData({});
      }
    }
    
    wasVisible.current = visible;
  }, [visible]);

  // Notificar cambios de paso
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep, currentFormData);
    }
  }, [currentStep, currentFormData]);

  // Validación para habilitar/deshabilitar el botón de continuar
  const canContinue = () => {
    if (currentStep <= totalSteps) {
      const currentStepConfig = steps[currentStep - 1];
      if (currentStepConfig.validation) {
        return currentStepConfig.validation();
      }
      return true;
    }
    return true;
  };

  // Función para avanzar al siguiente paso
  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      if (onSubmit) {
        const result = onSubmit(currentFormData);

        if (result instanceof Promise) {
          result.then((success) => {
            if (success) {
              if (hasConfirmation) {
                setCurrentStep(totalSteps + 1);
              } else {
                onClose();
              }
            }
          });
        } else {
          if (result) {
            if (hasConfirmation) {
              setCurrentStep(totalSteps + 1);
            } else {
              onClose();
            }
          }
        }
      } else {
        if (hasConfirmation) {
          setCurrentStep(totalSteps + 1);
        } else {
          onClose();
        }
      }
    } else if (hasConfirmation && currentStep === totalSteps + 1) {
      onClose();
    }
  };

  // Función para volver al paso anterior
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  // Obtener configuración del paso actual
  const getCurrentStepConfig = () => {
    if (currentStep <= totalSteps) {
      return steps[currentStep - 1];
    }
    return null;
  };

  // Renderizar paso de confirmación
  const renderConfirmationStep = () => {
    if (!confirmationStep) return null;

    return (
      <Box alignItems="center" marginTop="xs">
        {confirmationStep.image && (
          <Image
            source={confirmationStep.image}
            resizeMode="contain"
          />
        )}
        <Box justifyContent="center" alignItems="center" marginVertical="xl" maxWidth={291}>
          <Typography variant="headingPrimary" color="white" style={styles.centerText}>
            {confirmationStep.title}
          </Typography>
          <Typography variant="bodyMedium" color="white" style={styles.centerText}>
            {confirmationStep.description}
          </Typography>
        </Box>
      </Box>
    );
  };

  // Obtener título del paso actual
  const getCurrentTitle = () => {
    const stepConfig = getCurrentStepConfig();
    return stepConfig ? stepConfig.title : (confirmationStep?.title || '');
  };

  // Obtener texto superior del paso actual
  const getCurrentTopText = () => {
    const stepConfig = getCurrentStepConfig();
    return stepConfig ? stepConfig.topText : '';
  };

  // Obtener altura del modal
  const getCurrentHeight = () => {
    const stepConfig = getCurrentStepConfig();
    if (stepConfig) {
      return stepConfig.height;
    }
    return confirmationStep?.height || '55%';
  };

  // Determinar si mostrar pasos
  const shouldShowSteps = () => {
    return currentStep <= totalSteps;
  };

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      title={getCurrentTitle()}
      topText={getCurrentTopText()} 
      draggable={draggable}
      activateSteps={shouldShowSteps()}
      stepPosition={"belowTitle"}
      currentStep={currentStep}
      totalSteps={totalSteps}
      showPrimaryButton={true}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      primaryButtonVariant="secondary"
      onPrimaryButtonPress={handleContinue}
      primaryButtonDisabled={!canContinue() && currentStep <= totalSteps}
      showSecondaryButton={currentStep <= totalSteps}
      secondaryButtonIcon="left-arrow"
      secondaryButtonVariant="outlined"
      onSecondaryButtonPress={handleBack}
      height={getCurrentHeight()}
      enableScroll={enableScroll}
    >
      {currentStep <= totalSteps && (
        getCurrentStepConfig()?.component
      )}

      {hasConfirmation && currentStep === totalSteps + 1 && (
        renderConfirmationStep()
      )}
    </BottomModal>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  prefix: {
    backgroundColor: theme.colors.colorGrey600,
    width: 100,
    height: 60,
    borderRadius: theme.border.radius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerText: {
    textAlign: "center"
  }
});