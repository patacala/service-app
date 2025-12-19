import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Box, Input, Theme, Typography } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/infrastructure/auth/AuthContext';

// Interfaz para los valores iniciales
interface InitialValues {
  name?: string;
  phone?: string;
  useSavedNamePhone?: boolean;
}

interface FormResponsibleProps {
  onNameChange?: (name: string) => void;
  onPhoneChange?: (phone: string) => void;
  onUseSavedNamePhoneChange?: (value: boolean) => void;
  initialValues?: InitialValues;
}

export const FormResponsible: React.FC<FormResponsibleProps> = ({
  onNameChange,
  onPhoneChange,
  onUseSavedNamePhoneChange,
  initialValues = {},
}) => {
  const theme = useTheme<Theme>();
  const styles = createStyles(theme);
  const { t } = useTranslation('auth');
  const { profile } = useAuth();

  const [name, setName] = useState<string>(initialValues.name || '');
  const [phone, setPhone] = useState<string>(initialValues.phone || '');
  const [useProfileData, setUseProfileData] = useState<boolean>(initialValues.useSavedNamePhone ?? false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  
  const isFirstMount = useRef(true);

  // Efecto para actualizar estados si cambian los valores iniciales
  useEffect(() => {
    if (!isFirstMount.current) {
      if (initialValues.name !== undefined) {
        setName(initialValues.name);
      }
      if (initialValues.phone !== undefined) {
        setPhone(initialValues.phone);
      }
      if (initialValues.useSavedNamePhone !== undefined) {
        setUseProfileData(initialValues.useSavedNamePhone);
      }
    }
    isFirstMount.current = false;
  }, [initialValues]);

  // Manejar cambio de nombre
  const handleNameChange = (value: string) => {
    setName(value);
    setUseProfileData(false);
    if (onNameChange) {
      onNameChange(value);
    }
  };

  // Manejar cambio de teléfono
  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setUseProfileData(false);
    if (onPhoneChange) {
      onPhoneChange(value);
    }
  };

  const handleToggleUseProfileData = () => {
    if (!useProfileData) {
      setManualName(name);
      setManualPhone(phone);

      const profileName = profile?.name || '';
      let profilePhone = profile?.phone || '';
      
      if (profilePhone.startsWith('+1')) {
        profilePhone = profilePhone.slice(2);
      }
      
      setName(profileName);
      setPhone(profilePhone);
      onNameChange?.(profileName);
      onPhoneChange?.(profilePhone);
    } else {
      setName(manualName);
      setPhone(manualPhone);
      onNameChange?.(manualName);
      onPhoneChange?.(manualPhone);
    }

    const newValue = !useProfileData;
    setUseProfileData(newValue);
    onUseSavedNamePhoneChange?.(newValue);
  };

  return (
    <>
      <Box marginTop="sm" marginBottom="md">
        <Typography variant="bodyMedium" color="white">Responsible for</Typography>
      </Box>

      <Box marginBottom="md">
        <Input
          label="Name"
          placeholder="Input your name"
          value={name}
          onChangeValue={handleNameChange}
          editable={!useProfileData}
        />
      </Box>
      <Box gap='md' marginBottom="md">
        <Row spacing="none" gap="sm" justify='space-between'>
          <Box style={styles.prefix} padding="md">
            <Typography variant="bodyRegular" colorVariant="secondary">+1</Typography>
          </Box>
            
          <Input
            label={t('signupCompletion.number')}
            placeholder={t('signupCompletion.text-input-number')}
            variant='numeric'
            value={phone}
            onChangeValue={handlePhoneChange}
            editable={!useProfileData}
            style={{
              width: 265
            }}
          />
        </Row>
      </Box>

      {/* Checkbox para usar datos del perfil */}
      {profile?.name && profile?.phone && (
        <Box maxWidth={200} marginBottom="xl">
          <Pressable
            onPress={handleToggleUseProfileData}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: useProfileData }}
            hitSlop={10}
          >
            <Row marginLeft="sm">
              <Box
                width={18}
                height={18}
                borderRadius={4}
                borderWidth={1}
                borderColor="colorBaseWhite"
                alignItems="center"
                justifyContent="center"
                backgroundColor={useProfileData ? "colorGrey300" : "colorBaseBlack"}
              >
                {useProfileData && (
                  <Box
                    width={11}
                    height={11}
                    borderRadius={2}
                    backgroundColor="colorBaseWhite"
                  />
                )}
              </Box>
              <Typography variant="bodySmall" color="white">
                Use profile data
              </Typography>
            </Row>
          </Pressable>
        </Box>
      )}
    </>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  prefix: {
    backgroundColor: theme.colors.colorGrey600, 
    width: 100, 
    height: 60,
    borderRadius: theme.border.radius.md,
    alignItems: 'center'
  }
});