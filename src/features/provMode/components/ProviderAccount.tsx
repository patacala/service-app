import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { BottomModal, Box, Input, Theme, Typography } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import { useTranslation } from 'react-i18next';
import images from '@/assets/images/images';

interface InitialValues {
  name?: string;
  phone?: string;
}

interface FormResponsibleProps {
  onPhoneChange?: (phone: string) => void;
  initialValues?: InitialValues;
  onClose: () => void;
  visible: boolean;
}

export const ProviderAccount: React.FC<FormResponsibleProps> = ({
  onPhoneChange,
  initialValues = {},
  onClose,
  visible
}) => {
  const theme = useTheme<Theme>();
  const styles = createStyles(theme);
  const { t } = useTranslation('auth');

  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [phone, setPhone] = useState<string>(initialValues.phone || '');
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);

  // Resetear estado cuando el modal se haga visible
  useEffect(() => {
    if (visible) {
      setStep('form');
      // Limpiar campos al abrir el modal
      setPhone('');
      setIsPhoneValid(false);
    }
  }, [visible]);

  useEffect(() => {
    if (initialValues.phone !== undefined) {
      setPhone(initialValues.phone);
      validatePhoneNumber(initialValues.phone);
    }
  }, [initialValues]);

  const validatePhoneNumber = (phoneNumber: string) => {
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    const isValid = cleanedNumber.length >= 10;
    setIsPhoneValid(isValid);
    return isValid;
  };

  const handlePhoneChange = (value: string) => {
    const formattedValue = value.replace(/[^\d\s-]/g, '');
    setPhone(formattedValue);
    validatePhoneNumber(formattedValue);
    if (onPhoneChange) {
      onPhoneChange(formattedValue);
    }
  };

  const handlePrimaryPress = () => {
    if (step === 'form' && isPhoneValid) {
      setStep('confirmed');
    } else if (step === 'confirmed') {
      onClose();
    }
  };

  const handleSecondaryPress = () => {
    if (step === 'confirmed') {
      setStep('form');
    } else {
      setPhone('');
      setIsPhoneValid(false);
      onClose();
    }
  };

  const renderFormStep = () => (
    <Box gap='md' marginTop="lg" marginBottom="xl">
      <Row spacing="none" gap="sm" justifyContent="space-between">
        <Box style={styles.prefix} padding="md">
          <Typography variant="bodyRegular" colorVariant="secondary">+1</Typography>
        </Box>
        <Input
          label={t('signupCompletion.number')}
          placeholder={t('signupCompletion.text-input-number')}
          variant='numeric'
          value={phone}
          onChangeValue={handlePhoneChange}
          style={{ width: 265 }}
          autoFocus={false}
          keyboardType="phone-pad"
          maxLength={14}
        />
      </Row>

      {phone.length > 0 && !isPhoneValid && (
        <Box paddingTop="xs">
          <Typography 
            variant="bodySmall" 
            color={theme.colors.colorFeedbackError}
          >
            Please enter a valid phone number (10 digits minimum)
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderConfirmedStep = () => (
    <Box alignItems="center" marginTop="xs">
      <Image
        source={images.withoutResult as ImageSourcePropType}
        resizeMode="contain"
      />
      <Box justifyContent="center" alignItems="center" gap="xl" marginVertical="xl" maxWidth={291}>
        <Typography variant="headingPrimary" color="white">Account Confirmed</Typography>
        <Typography variant="bodyMedium" color="white" style={styles.centerText}>
          From now on you can use all the services as a provider
        </Typography>
      </Box>
    </Box>
  );

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      title={step === 'form' ? 'Provider Account' : undefined}
      topText={step === 'form' ? 'Linked to your previous account' : undefined}
      enableScroll={false}
      height={step === 'form' ? '44%' : '57%'}
      showPrimaryButton={true}
      showSecondaryButton={step === 'form'}
      primaryButtonText={"Continue"}
      secondaryButtonText={step === 'form' ? 'Go back' : undefined}
      secondaryButtonIcon={step === 'form' ? 'left-arrow' : undefined}
      primaryButtonVariant="secondary"
      secondaryButtonVariant="outlined"
      primaryButtonDisabled={step === 'form' && !isPhoneValid}
      onPrimaryButtonPress={handlePrimaryPress}
      onSecondaryButtonPress={handleSecondaryPress}
    >
      {step === 'form' ? renderFormStep() : renderConfirmedStep()}
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