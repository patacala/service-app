import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@shopify/restyle';
import { Box, Input, Theme, Typography } from '@/design-system';
import { Pressable } from 'react-native';
import { Row } from '@/design-system/components/layout/Row/Row';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { useTranslation } from 'react-i18next';

// Interfaz para los valores iniciales
interface InitialValues {
  dateTime?: Date | null;
  address?: string;
  comments?: string;
  useSavedAddress?: boolean;
}

interface FormServiceProps {
  serviceName: string;
  onDateTimeChange?: (date: Date) => void;
  onAddressChange?: (address: string) => void;
  onCommentChange?: (comment: string) => void;
  onUseSavedAddressChange?: (value: boolean) => void;
  initialValues?: InitialValues;
}

export const FormService: React.FC<FormServiceProps> = ({
  serviceName,
  onDateTimeChange,
  onAddressChange,
  onCommentChange,
  onUseSavedAddressChange,
  initialValues = {},
}) => {
  const { t } = useTranslation('auth');
  const { profile } = useAuth();
  const [address, setAddress] = useState<string>(initialValues.address || '');
  const [comment, setComment] = useState<string>(initialValues.comments || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialValues.dateTime || null);
  const [useSavedAddress, setUseSavedAddress] = useState(initialValues.useSavedAddress ?? false);
  const [manualAddress, setManualAddress] = useState('');
  
  const isFirstMount = useRef(true);

  // Efecto para actualizar estados si cambian los valores iniciales
  useEffect(() => {
    if (!isFirstMount.current) {
      if (initialValues.address !== undefined) {
        setAddress(initialValues.address);
      }
      if (initialValues.comments !== undefined) {
        setComment(initialValues.comments);
      }
      if (initialValues.dateTime !== undefined) {
        setSelectedDate(initialValues.dateTime);
      }
    }
    isFirstMount.current = false;
  }, [initialValues]);

  const handleDateTimeChange = (date: Date) => {
    setSelectedDate(date);
    if (onDateTimeChange) onDateTimeChange(date);
  };

  const handleTextChange = (value: string) => {
    setComment(value);
    if (onCommentChange) onCommentChange(value);
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setUseSavedAddress(false);
    onAddressChange?.(value);
  };

  const formattedDate = selectedDate ? formatDateTime(selectedDate) : '';

  const handleToggleUseSavedAddress = () => {
    if (!useSavedAddress) {
      setManualAddress(address);

      const profileAddress = profile?.address || '';
      setAddress(profileAddress);
      onAddressChange?.(profileAddress);
    } else {
      setAddress(manualAddress);
      onAddressChange?.(manualAddress);
    }

    setUseSavedAddress(!useSavedAddress);
    onUseSavedAddressChange?.(!useSavedAddress);
  };

  return (
    <>
      <Box marginTop="sm">
        <Typography variant="bodyMedium" color="white">{t("details.serviceselected")}</Typography>
        <Box backgroundColor="colorGrey600" marginTop='md' padding="sm" borderRadius={15}>
          <Typography variant="bodyLarge" color="white">
            {serviceName}
          </Typography>
        </Box>
      </Box>

      {/* Schedule Service */}
      <Box marginTop="md">
        <Typography variant="bodyMedium" color="white">{t("details.scheduleservice")}</Typography>
      </Box>
      <Box gap="md" marginVertical="md">
        <Input
          label={t("details.date&time")}
          variant="date"
          dateMode="datetime"
          onDateChange={handleDateTimeChange}
          value={formattedDate}
        />
        <Input
          label={t("details.address")}
          placeholder={t("details.address")}
          icon="transfer"
          value={address}
          onChangeValue={handleAddressChange}
          editable={!useSavedAddress}
        />

        {profile?.address && (
          <Box maxWidth={190}>
            <Pressable
              onPress={handleToggleUseSavedAddress}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: useSavedAddress }}
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
                  backgroundColor={useSavedAddress ? "colorGrey300" : "colorBaseBlack"}
                >
                  {useSavedAddress && (
                    <Box
                      width={11}
                      height={11}
                      borderRadius={2}
                      backgroundColor="colorBaseWhite"
                    />
                  )}
                </Box>
                <Typography variant="bodySmall" color="white">
                  {t("details.profileaddress")}
                </Typography>
              </Row>
            </Pressable>
          </Box>
        )}
      </Box>

      {/* Comments */}
      <Box>
        <Typography variant="bodyMedium" color="white">{t("details.commentspetitions")}</Typography>
      </Box>
      <Box marginVertical="md">  
        <Input
          label={t("details.writehere")}
          placeholder={t("details.writehere")}
          variant="textarea"
          numberOfLines={6}
          maxLength={500}
          value={comment}
          onChangeValue={handleTextChange}
        />
      </Box>
    </>
  );
};

const formatDateTime = (date: Date): string => {
  if (!date) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString(undefined, options);
};
