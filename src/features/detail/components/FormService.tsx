import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@shopify/restyle';
import { Box, GroupChipSelector, Input, Theme, Typography } from '@/design-system';
import { IconName } from '@/design-system/components/layout/Icon';

// Interfaz para los valores iniciales
interface InitialValues {
  selectedServiceId?: string;
  dateTime?: Date | null;
  address?: string;
  comments?: string;
}

interface FormServiceProps {
  chipOptions: Array<{
    id: string;
    label: string;
    icon: IconName
  }>;
  onDateTimeChange?: (date: Date) => void;
  onAddressChange?: (address: string) => void;
  onCommentChange?: (comment: string) => void;
  onServiceSelect?: (serviceId: string) => void;
  initialValues?: InitialValues;
}

export const FormService: React.FC<FormServiceProps> = ({
  chipOptions = [],
  onDateTimeChange,
  onAddressChange,
  onCommentChange,
  onServiceSelect,
  initialValues = {},
}) => {
  const theme = useTheme<Theme>();
  
  // Referencia para controlar si ya hemos notificado la selección inicial
  const hasNotifiedInitialSelection = useRef(false);
  
  // Estados para almacenar los datos del formulario
  const [address, setAddress] = useState<string>(initialValues.address || '');
  const [comment, setComment] = useState<string>(initialValues.comments || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialValues.dateTime || null);
  
  // Referencia para saber si es la primera vez que montamos el componente
  const isFirstMount = useRef(true);

  // Notificar al padre del servicio seleccionado (solo una vez)
  useEffect(() => {
    if (chipOptions.length > 0 && onServiceSelect && !hasNotifiedInitialSelection.current) {
      onServiceSelect(chipOptions[0].id);
      hasNotifiedInitialSelection.current = true;
    }
    
    // Marcar que ya no es el primer montaje
    isFirstMount.current = false;
  }, [chipOptions, onServiceSelect]);

  // Efecto para actualizar estados si cambian los valores iniciales
  // Este efecto debe ejecutarse solo cuando initialValues cambia, no en el primer montaje
  useEffect(() => {
    // Evitar actualizar en el primer montaje ya que useState ya ha inicializado con initialValues
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
  }, [initialValues]);

  // Manejar cambio de fecha y hora
  const handleDateTimeChange = (date: Date) => {
    console.log('Fecha seleccionada en el componente:', date);
    setSelectedDate(date); // Actualizar el estado local con la fecha seleccionada
    
    if (onDateTimeChange) {
      onDateTimeChange(date);
    }
  };

  // Manejar cambio de texto en textarea
  const handleTextChange = (value: string) => {
    setComment(value);
    if (onCommentChange) {
      onCommentChange(value);
    }
  };

  // Manejar cambio de dirección
  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (onAddressChange) {
      onAddressChange(value);
    }
  };

  // Manejar selección manual de servicio
  const handleServiceChange = (selectedIds: string[]) => {
    if (onServiceSelect && selectedIds.length > 0) {
      onServiceSelect(selectedIds[0]);
    }
  };

  // Formatear la fecha para mostrarla en el input
  const formattedDate = selectedDate ? formatDateTime(selectedDate) : '';
  
  // Log para debugging
  console.log('FormService render - selectedDate:', selectedDate);

  return (
    <>
      <Box marginTop="sm">
        <Typography variant="bodyMedium" color="white">Service Selected</Typography>

        {chipOptions.length > 0 ? (
          <GroupChipSelector
            onChange={handleServiceChange}
            options={chipOptions}
            selectedIds={[]}
            multiSelect={false}
          />
        ) : (
          <Typography variant="bodySmall" color={theme.colors.colorGrey200}>No services selected</Typography>
        )}
      </Box>

      <Box>
        <Typography variant="bodyMedium" color="white">Schedule Service</Typography>
      </Box>
      <Box gap="md" marginVertical="md">
        <Input
          label="Date & Time"
          variant="date"
          dateMode="datetime"
          onDateChange={handleDateTimeChange}
          value={formattedDate} // Usar el estado local formateado
        />
        <Input
          label="Address"
          placeholder="Input your address"
          icon="transfer"
          value={address}
          onChangeValue={handleAddressChange}
        />
      </Box>

      <Box>
        <Typography variant="bodyMedium" color="white">Commend or Petitions</Typography>
      </Box>
      <Box marginVertical="md">  
        <Input
          label="Write here"
          placeholder="Escribe aquí"
          variant="textarea"
          numberOfLines={6}
          maxLength={500}
          value={comment}
          onChangeValue={(value) => handleTextChange(value)}
        />
      </Box>
    </>
  );
};

// Función para formatear la fecha
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