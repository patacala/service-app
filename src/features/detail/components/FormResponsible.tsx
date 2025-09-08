import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Box, Input, Theme, Typography } from '@/design-system';
import { IconName } from '@/design-system/components/layout/Icon';
import { Row } from '@/design-system/components/layout/Row/Row';
import { useTranslation } from 'react-i18next';

// Interfaz para los valores iniciales
interface InitialValues {
  name?: string;
  phone?: string;
}

interface FormResponsibleProps {
  onNameChange?: (name: string) => void;
  onPhoneChange?: (phone: string) => void;
  initialValues?: InitialValues;
}

export const FormResponsible: React.FC<FormResponsibleProps> = ({
  onNameChange,
  onPhoneChange,
  initialValues = {},
}) => {
  const theme = useTheme<Theme>();
  const styles = createStyles(theme);
  const { t } = useTranslation('auth');

  // Inicializar estados con valores iniciales si existen
  const [name, setName] = useState<string>(initialValues.name || '');
  const [phone, setPhone] = useState<string>(initialValues.phone || '');

  // Efecto para actualizar estados si cambian los valores iniciales
  useEffect(() => {
    if (initialValues.name !== undefined) {
      setName(initialValues.name);
    }
    if (initialValues.phone !== undefined) {
      setPhone(initialValues.phone);
    }
  }, [initialValues]);

  // Manejar cambio de nombre
  const handleNameChange = (value: string) => {
    setName(value);
    if (onNameChange) {
      onNameChange(value);
    }
  };

  // Manejar cambio de teléfono
  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (onPhoneChange) {
      onPhoneChange(value);
    }
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
        />
      </Box>
      <Box gap='md' marginBottom="xl">
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
            style={{
              width: 265
            }}
          />
        </Row>
      </Box>
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