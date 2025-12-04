import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@shopify/restyle';
import { Box, Input, Theme, Typography } from '@/design-system';

// Interfaz para los valores iniciales
interface InitialValues {
  dateTime?: Date | null;
  address?: string;
  comments?: string;
}

interface FormServiceProps {
  serviceName: string;
  onDateTimeChange?: (date: Date) => void;
  onAddressChange?: (address: string) => void;
  onCommentChange?: (comment: string) => void;
  initialValues?: InitialValues;
}

export const FormService: React.FC<FormServiceProps> = ({
  serviceName,
  onDateTimeChange,
  onAddressChange,
  onCommentChange,
  initialValues = {},
}) => {
  const theme = useTheme<Theme>();

  const [address, setAddress] = useState<string>(initialValues.address || '');
  const [comment, setComment] = useState<string>(initialValues.comments || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialValues.dateTime || null);

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
    if (onAddressChange) onAddressChange(value);
  };

  const formattedDate = selectedDate ? formatDateTime(selectedDate) : '';

  return (
    <>
      {/* 🔥 Nombre del servicio en vez de chips */}
      <Box marginTop="sm">
        <Typography variant="bodyMedium" color="white">Service Selected</Typography>
        <Box backgroundColor="colorGrey600" marginTop='md' padding="sm" borderRadius={15}>
          <Typography variant="bodyLarge" color="white">
            {serviceName}
          </Typography>
        </Box>
      </Box>

      {/* Schedule Service */}
      <Box marginTop="md">
        <Typography variant="bodyMedium" color="white">Schedule Service</Typography>
      </Box>
      <Box gap="md" marginVertical="md">
        <Input
          label="Date & Time"
          variant="date"
          dateMode="datetime"
          onDateChange={handleDateTimeChange}
          value={formattedDate}
        />
        <Input
          label="Address"
          placeholder="Input your address"
          icon="transfer"
          value={address}
          onChangeValue={handleAddressChange}
        />
      </Box>

      {/* Comments */}
      <Box>
        <Typography variant="bodyMedium" color="white">Comments or Petitions</Typography>
      </Box>
      <Box marginVertical="md">  
        <Input
          label="Write here"
          placeholder="Escribe aquí"
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
