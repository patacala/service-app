import React, {useState, useRef, useEffect, forwardRef} from 'react';
import {
  TextInput, 
  TouchableOpacity, 
  Animated, 
  TouchableWithoutFeedback, 
  Platform,
  Modal,
  View
} from 'react-native';
import {Box} from '../../layout/Box';
import {Typography} from '../../foundation/Typography';
import {InputProps} from './types';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../../theme';
import {Icon} from '../../layout/Icon';
import {getInputStyles} from './Input.styles';
import DateTimePicker from '@react-native-community/datetimepicker';

// Definir nueva propiedad para el input expandible
interface ExpandableInputProps extends InputProps {
  expandable?: boolean;
  maxHeight?: number;
}

export const Input = forwardRef<TextInput, ExpandableInputProps>(({
  label,
  error,
  placeholder,
  icon: initialRightIcon,
  secureTextEntry: initialSecureTextEntry,
  style,
  variant = 'default',
  value,
  onChangeValue,
  onDateChange,
  onIconPress,
  dateMode = 'date',
  format = 'MMM dd, yyyy',
  numberOfLines = 4,
  maxLength = 500,
  editable = true,
  expandable = false,
  maxHeight = 120,
  ...props
}, ref) => {
  const theme = useTheme<Theme>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasText, setHasText] = useState(Boolean(value || props.defaultValue));
  const [inputValue, setInputValue] = useState(value || props.defaultValue || '');
  const styles = getInputStyles(theme);
  const internalRef = useRef<TextInput>(null);
  
  // Estados para contar caracteres en textarea
  const [charCount, setCharCount] = useState(inputValue.length);
  
  // Estados para DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>(dateMode === 'datetime' ? 'date' : dateMode as 'date' | 'time');
  
  // Estados para propiedades que pueden cambiar según la variante
  const [icon, setIcon] = useState(initialRightIcon);
  const [secureTextEntry, setSecureTextEntry] = useState(initialSecureTextEntry);
  const [keyboardType, setKeyboardType] = useState(props.keyboardType);

  // Nueva ref para controlar si el componente se monta por primera vez
  const isFirstMount = useRef(true);

  // Manejar estado disabled
  const isDisabled = variant === 'disabled' || !editable;

  // Nuevos estados para manejar el input expandible
  const [inputHeight, setInputHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isMultiline, setIsMultiline] = useState(variant === 'textarea' || (expandable && (props.multiline || false)));
  const [hasNewlines, setHasNewlines] = useState(value ? value.includes('\n') : false);

  // Función para formatear la fecha y/o hora
  const formatDateTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    };
    
    if (dateMode === 'time') {
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (dateMode === 'datetime') {
      return `${date.toLocaleDateString(undefined, options)} ${date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else {
      return date.toLocaleDateString(undefined, options);
    }
  };

  // Exponer el método focus a través de la ref
  useEffect(() => {
    if (!ref) return;
    
    if (typeof ref === 'function') {
      ref(internalRef.current);
    }
  }, [ref]);

  // Este efecto se ejecuta solo una vez al montar el componente
  useEffect(() => {
    // Marcar que ya no es el primer montaje para el próximo render
    isFirstMount.current = false;
  }, []);

  // Actualizar estado interno cuando cambia value prop
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
      // Importante: actualizar hasText aquí para mantener el label elevado
      setHasText(Boolean(value));
      setCharCount(value.length);
      
      // Actualizamos estado de saltos de línea
      if (expandable) {
        setHasNewlines(value.includes('\n'));
      }
      
      // Si tenemos una fecha en formato string y estamos en variant date,
      // intentamos convertirla a objeto Date
      if (variant === 'date' && typeof value === 'string' && value) {
        try {
          const dateFromString = new Date(value);
          if (!isNaN(dateFromString.getTime())) {
            setSelectedDate(dateFromString);
          }
        } catch (error) {
          console.warn('Error parsing date string:', error);
        }
      }
      
      // Asegurarnos que la animación del label se ejecute correctamente
      // cuando se cambia el valor programáticamente (volviendo del paso 2 al paso 1)
      if (!isFirstMount.current && !isFocused) {
        // Actualizar animaciones inmediatamente
        animateLabel(Boolean(value));
      }
    }
  }, [value, variant]);
  
  // Nueva función para animar el label basado en un estado específico
  const animateLabel = (shouldElevate: boolean) => {
    const normalTopPosition = styles.labelInput?.top as number;
    const focusedTopPosition = styles.labelFocused?.top as number;
    const normalFontSize = styles.labelText?.fontSize as number;
    const focusedFontSize = styles.labelTextFocused?.fontSize as number;
    
    if (shouldElevate) {
      Animated.parallel([
        Animated.timing(labelPositionY, {
          toValue: focusedTopPosition,
          duration: 0, // Hacer inmediato
          useNativeDriver: false,
        }),
        Animated.timing(labelFontSize, {
          toValue: focusedFontSize,
          duration: 0, // Hacer inmediato
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(labelPositionY, {
          toValue: normalTopPosition,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(labelFontSize, {
          toValue: normalFontSize,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };
  
  // Configurar propiedades específicas según la variante
  useEffect(() => {
    // Resetear a valores iniciales
    setIcon(initialRightIcon);
    setSecureTextEntry(initialSecureTextEntry);
    setKeyboardType(props.keyboardType);
    
    // Aplicar configuraciones según variante
    switch (variant) {
      case 'search':
        if (!initialRightIcon) {
          setIcon(hasText ? 'clear' : 'search');
        }
        break;
      case 'password':
        if (initialSecureTextEntry === undefined) {
          setSecureTextEntry(true);
        }
        break;
      case 'numeric':
        setKeyboardType('numeric');
        break;
      case 'otp':
        setKeyboardType('numeric');
        break;
      case 'date':
        setIcon(initialRightIcon || (dateMode === 'time' ? 'clock' : 'date'));
        break;
      case 'textarea':
        // Configuraciones específicas para textarea
        if (initialRightIcon === undefined) {
          setIcon(undefined);
        }
        break;
      case 'disabled':
        break;
      
    }
  }, [variant, initialRightIcon, initialSecureTextEntry, props.keyboardType, hasText, selectedDate, dateMode]);

  // Extraer valores de estilos
  const normalTopPosition = styles.labelInput?.top as number;
  const focusedTopPosition = styles.labelFocused?.top as number;
  const normalFontSize = styles.labelText?.fontSize as number;
  const focusedFontSize = styles.labelTextFocused?.fontSize as number;

  // Animación para la posición Y del label
  const labelPositionY = useRef(new Animated.Value(hasText ? focusedTopPosition : normalTopPosition)).current;
  // Animación para el tamaño de fuente
  const labelFontSize = useRef(new Animated.Value(hasText ? focusedFontSize : normalFontSize)).current;

  useEffect(() => {
    // Cuando el input tiene foco o texto, animamos el label hacia arriba
    if (isFocused || hasText) {
      Animated.parallel([
        Animated.timing(labelPositionY, {
          toValue: focusedTopPosition,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(labelFontSize, {
          toValue: focusedFontSize,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Si no tiene foco ni texto, regresamos el label a su posición original
      Animated.parallel([
        Animated.timing(labelPositionY, {
          toValue: normalTopPosition,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(labelFontSize, {
          toValue: normalFontSize,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isFocused, hasText, labelPositionY, labelFontSize, normalTopPosition, focusedTopPosition, normalFontSize, focusedFontSize]);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Función para limpiar el input (para la variante search)
  const handleClearInput = () => {
    setInputValue('');
    setHasText(false);
    setCharCount(0);
    
    // Llamar callbacks
    if (props.onChangeText) {
      props.onChangeText('');
    }
    if (onChangeValue) {
      onChangeValue('');
    }
    
    // Volver a enfocar el input
    if (internalRef.current) {
      internalRef.current.focus();
    }
  };

  // Función centralizada para mostrar el DatePicker
  const showDatePickerModal = () => {
    if (variant === 'date' && !isDisabled) {
      // Resetear al modo inicial para datetime
      if (dateMode === 'datetime') {
        setPickerMode('date');
      } else {
        setPickerMode(dateMode as 'date' | 'time');
      }
      setShowDatePicker(true);
    }
  };

  const handleFocus = (e: any) => {
    if (isDisabled) return;
    setIsFocused(true);
    props.onFocus?.(e);

    if (variant === 'date') {
      showDatePickerModal();
    }
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  // Nueva función para manejar el cambio de contenido en el input expandible
  const handleContentSizeChange = (event: any) => {
    if (expandable) {
      const { height } = event.nativeEvent.contentSize;
      setContentHeight(height);
      
      // Si el contenido tiene más de una línea, activamos multilinea
      if (height > 30 && !isMultiline) {
        setIsMultiline(true);
      } else if (height <= 30 && isMultiline && inputValue.indexOf('\n') === -1) {
        // Si el contenido es de una sola línea y no hay saltos de línea, desactivamos multilinea
        setIsMultiline(false);
      }
      
      // Ajustar la altura del input, pero no más allá de maxHeight
      const newHeight = Math.min(Math.max(30, height), maxHeight);
      setInputHeight(newHeight);
    }
  };

  const handleChangeText = (text: string) => {
    if (isDisabled) return;
    
    // Para textarea con maxLength, verificamos que no exceda el límite
    if (variant === 'textarea' && maxLength && text.length > maxLength) {
      return;
    }
    
    setInputValue(text);
    setHasText(text.length > 0);
    setCharCount(text.length);
    
    // Si expandable, verificamos si el texto tiene saltos de línea
    if (expandable) {
      const hasLines = text.includes('\n');
      setHasNewlines(hasLines);
      
      if (hasLines && !isMultiline) {
        setIsMultiline(true);
      } else if (!hasLines && isMultiline && contentHeight <= 30) {
        setIsMultiline(false);
      }
    }
    
    // Llamar callbacks
    if (props.onChangeText) {
      props.onChangeText(text);
    }
    if (onChangeValue) {
      onChangeValue(text);
    }
  };

  // Función para manejar el cambio de fecha
  const handleDateChange = (event: any, date?: Date) => {
    if (isDisabled) return;
    
    // En Android, el picker se cierra automáticamente al seleccionar
    const isAndroid = Platform.OS === 'android';
    
    if (isAndroid && event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    
    if (!date) {
      // Si no hay fecha (por ejemplo, si el usuario canceló en Android)
      if (isAndroid) {
        setShowDatePicker(false);
      }
      return;
    }
    
    // Crear una copia de la fecha actual seleccionada
    const updatedDate = new Date(selectedDate.getTime());
    
    if (pickerMode === 'date') {
      // Si estamos en modo fecha, actualizamos año, mes y día
      updatedDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      
      // Si es datetime y estamos en Android, necesitamos mostrar el picker de tiempo después
      if (dateMode === 'datetime' && isAndroid) {
        setPickerMode('time');
        setTimeout(() => {
          setShowDatePicker(true);
        }, 100);
      } else if (dateMode === 'datetime' && !isAndroid) {
        // En iOS, simplemente cambiamos al picker de tiempo
        setPickerMode('time');
      } else if (isAndroid) {
        // Si no es datetime, cerramos el picker en Android
        setShowDatePicker(false);
      }
    } else if (pickerMode === 'time') {
      // Si estamos en modo tiempo, actualizamos hora y minutos
      updatedDate.setHours(date.getHours(), date.getMinutes());
      
      // Siempre cerramos el picker después de seleccionar la hora
      if (isAndroid) {
        setShowDatePicker(false);
      } else {
        // En iOS no cerramos automáticamente para permitir ajustes adicionales
        // El usuario debe presionar "Listo"
      }
    }
    
    setSelectedDate(updatedDate);
    const formattedDate = formatDateTime(updatedDate);
    setInputValue(formattedDate);
    setHasText(true);
    
    // Llamar callbacks solo cuando se completa la selección
    if ((dateMode !== 'datetime') || (dateMode === 'datetime' && pickerMode === 'time')) {
      if (props.onChangeText) {
        props.onChangeText(formattedDate);
      }
      if (onChangeValue) {
        onChangeValue(formattedDate);
      }
      if (onDateChange) {
        onDateChange(updatedDate);
      }
    }
  };

  // Función para manejar el foco - ahora delegando a showDatePickerModal
  const focusInput = () => {
    if (isDisabled) return;
    
    if (variant === 'date') {
      // Para variante date, mostramos el DatePicker directamente
      showDatePickerModal();
    } else {
      // Para otras variantes, enfocamos el input como siempre
      if (internalRef.current) {
        internalRef.current.focus();
      }
    }
  };

  const renderRightIcon = () => {
    if (variant === 'search') {
      // Si hay texto, siempre mostrar el icono de limpiar
      if (hasText) {
        return (
          <TouchableOpacity onPress={handleClearInput} disabled={isDisabled}>
            <Icon 
              name="clear" 
              color={isDisabled ? "colorGrey400" : "colorBaseWhite"} 
            />
          </TouchableOpacity>
        );
      }
      
      // Si no hay texto, mostrar el icono personalizado o el icono de búsqueda por defecto
      if (icon && typeof icon !== 'string') {
        return icon;
      }
      
      const iconName = icon || 'search';
      
      return (
        <Icon 
          name={iconName as any} 
          color={isDisabled ? "colorGrey400" : "colorBaseWhite"} 
        />
      );
    }
    
    if (secureTextEntry && variant === 'password') {
      return (
        <TouchableOpacity onPress={handleTogglePasswordVisibility} disabled={isDisabled}>
          <Icon 
            name={isPasswordVisible ? 'eye-off' : 'eye'} 
            color={isDisabled ? "colorGrey400" : "colorBaseWhite"} 
          />
        </TouchableOpacity>
      );
    }
    
    if (variant === 'date') {
      return (
        <TouchableOpacity onPress={showDatePickerModal} disabled={isDisabled}>
          <Icon 
            name={(icon as any) || (dateMode === 'time' ? 'clock' : 'date')} 
            color={isDisabled ? "colorGrey400" : "colorBaseWhite"} 
            size={20}
          />
        </TouchableOpacity>
      );
    }

    if (variant === 'chat') {
      return (
        <TouchableOpacity 
          onPress={isDisabled ? undefined : onIconPress} 
          disabled={isDisabled}
        >
          <Icon 
            name="send" 
            color={isDisabled ? "colorGrey400" : "colorBaseWhite"}
          />
        </TouchableOpacity>
      );
    }
    
    // Cambiar el icono dependiendo si está en modo multilinea o no
    if (expandable && icon === 'send') {
      return (
        <TouchableOpacity 
          onPress={isDisabled ? undefined : onIconPress} 
          disabled={isDisabled}
        >
          <Icon 
            name={isMultiline ? "clear" : "send"} 
            color={isDisabled ? "colorGrey400" : "colorBaseWhite"}
          />
        </TouchableOpacity>
      );
    }
    
    if (icon) {
      if (onIconPress) {
        return (
          <TouchableOpacity 
            onPress={isDisabled ? undefined : onIconPress} 
            disabled={isDisabled}
          >
            {typeof icon === 'string' ? (
              <Icon 
                name={icon as any} 
                color={isDisabled ? "colorGrey400" : "colorBaseWhite"}
              />
            ) : (
              icon
            )}
          </TouchableOpacity>
        );
      }
      
      // Si no hay onIconPress, mostrar el icono normalmente
      return typeof icon === 'string' ? (
        <Icon 
          name={icon as any} 
          color={isDisabled ? "colorGrey400" : "colorBaseWhite"}
        />
      ) : (
        icon
      );
    }

    return null;
  };
  
  // Obtener estilos específicos según la variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'search':
        return styles.variantSearch;
      case 'password':
        return styles.variantPassword;
      case 'numeric':
        return styles.variantNumeric;
      case 'otp':
        return styles.varianOtp;
      case 'date':
        return styles.variantDate || styles.varianDefault;
      case 'textarea':
        return styles.variantTextarea || styles.varianDefault;
      case 'chat':
        return styles.varianDefault;
      case 'disabled':
        return styles.variantDisabled || styles.varianDefault;
      case 'default':
        return styles.varianDefault;
      default:
        return {};
    }
  };
  
  // También aplicamos estilo deshabilitado si editable es false
  let variantStyles = getVariantStyles();
  if (isDisabled && variant !== 'disabled') {
    variantStyles = {...variantStyles, ...styles.variantDisabled};
  }
  
  const rightIconElement = renderRightIcon();

  // Componente de label animado con toque habilitado
  const AnimatedLabel = () => {
    const labelVariant = (isFocused || hasText) ? "bodySmall" : "bodyLarge";

    return (
      <TouchableWithoutFeedback onPress={focusInput}>
        <Animated.View
          style={[
            styles.labelInput,
            
            {
              top: labelPositionY,
            },
          ]}
        >
          <Typography  
            variant={labelVariant} 
            color={isDisabled ? theme?.colors?.colorGrey400 : theme?.colors?.colorGrey200}
          >
            {label}
          </Typography>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  // Renderizado del DatePicker, diferente según plataforma
  const renderDatePicker = () => {
    if (!showDatePicker || isDisabled) return null;
    
    if (Platform.OS === 'ios') {
      return (
        <Modal
          transparent={true}
          visible={showDatePicker}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowDatePicker(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                {dateMode === 'datetime' && (
                  <View style={styles.modalTabContainer}>
                    <TouchableOpacity 
                      onPress={() => setPickerMode('date')}
                      style={[
                        styles.modalTab,
                        pickerMode === 'date' && styles.modalTabActive
                      ]}
                    >
                      <Typography 
                        variant="bodyMedium" 
                        color={pickerMode === 'date' ? 
                          theme?.colors?.colorBaseWhite : 
                          theme?.colors?.colorGrey300}
                      >
                        Fecha
                      </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setPickerMode('time')}
                      style={[
                        styles.modalTab,
                        pickerMode === 'time' && styles.modalTabActive
                      ]}
                    >
                      <Typography 
                        variant="bodyMedium" 
                        color={pickerMode === 'time' ? 
                          theme?.colors?.colorBaseWhite : 
                          theme?.colors?.colorGrey300}
                      >
                        Hora
                      </Typography>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(false)}
                  style={styles.modalCloseButton}
                >
                  <Typography variant="bodyLarge" color={theme?.colors?.colorBaseWhite}>
                    Listo
                  </Typography>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={selectedDate}
                  mode={pickerMode}
                  display="spinner"
                  onChange={handleDateChange}
                  style={{ backgroundColor: theme?.colors?.colorGrey600 }}
                  textColor={theme?.colors?.colorBaseWhite}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      );
    } else {
      return (
        <DateTimePicker
          value={selectedDate}
          mode={pickerMode}
          display="default"
          onChange={handleDateChange}
        />
      );
    }
  };

  // Renderizar contador de caracteres para textarea
  const renderCharCounter = () => {
    if (variant !== 'textarea' || maxLength === undefined) return null;
    
    return (
      <Box style={styles.charCountContainer}>
        <Typography 
          variant="bodySmall" 
          color={isDisabled 
            ? theme?.colors?.colorGrey400 
            : (charCount > maxLength * 0.8 ? theme?.colors?.colorFeedbackError : theme?.colors?.colorGrey300)}
        >
          {charCount}/{maxLength}
        </Typography>
      </Box>
    );
  };
  
  // Calcular la altura para el textarea o input expandible
  const calculatedHeight = 
    variant === 'textarea' 
      ? (numberOfLines * 24)
      : (expandable && inputHeight > 0 
          ? inputHeight 
          : undefined);

  return (
    <Box style={{position: 'relative'}}>
      {label && variant !== 'otp' && variant !== 'search' && <AnimatedLabel />}
      
      <TouchableWithoutFeedback onPress={isDisabled ? undefined : focusInput}>
        <Box
          flexDirection="row"
          alignItems={(isMultiline || variant === 'textarea') ? "flex-start" : "center"}
          borderWidth={1}
          borderColor={error ? 'colorFeedbackError' : (isDisabled ? 'colorGrey500' : (isFocused ? 'colorGrey200' : 'colorGrey600'))}
          style={[
            variantStyles ?? {},
            variant === 'textarea' && { 
              height: calculatedHeight, 
              paddingTop: 20
            },
            expandable && {
              minHeight: 60,
            },
            style ?? {},
          ]}>
          <TextInput
            ref={internalRef}
            value={inputValue}
            placeholder={
              variant === 'otp' 
                ? (placeholder || '-')
                : (variant === 'search' ? placeholder : (isFocused ? placeholder : ''))
            }
            style={[
              styles.input,
              variant === 'otp' && styles.inputCenterText,
              variant === 'date' && { color: theme?.colors?.colorBaseWhite },
              isDisabled && { color: theme?.colors?.colorGrey400 },
              variant === 'textarea' && {
                height: calculatedHeight ? calculatedHeight - 20 : undefined,
                textAlignVertical: 'top',
                paddingTop: 0,
                paddingBottom: 20
              },
              expandable && {
                maxHeight: maxHeight,
                textAlignVertical: isMultiline ? 'top' : 'center',
                minHeight: 40,
                height: 'auto',
              }
            ]}
            placeholderTextColor={
              isDisabled
                ? theme.colors.colorGrey400
                : (variant === 'search'
                  ? theme.colors.colorGrey200
                  : (variant === 'otp' ? theme.colors.colorGrey200 : theme.colors.colorTextSecondary))
            }
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            keyboardType={keyboardType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            editable={!isDisabled && (variant !== 'date')}
            pointerEvents={variant === 'date' ? 'none' : 'auto'}
            multiline={isMultiline || variant === 'textarea' || expandable}
            numberOfLines={variant === 'textarea' ? numberOfLines : undefined}
            maxLength={variant === 'textarea' ? maxLength : undefined}
            onContentSizeChange={expandable ? handleContentSizeChange : undefined}
            returnKeyType={hasNewlines ? "default" : (props.returnKeyType || "default")}
            {...props}
          />
          
          {rightIconElement && (
            <Box 
              marginRight="sm" 
              marginTop={(isMultiline || variant === 'textarea') ? "md" : undefined}
              style={expandable && isMultiline ? { alignSelf: 'flex-end', marginBottom: 10 } : undefined}
            >
              {rightIconElement}
            </Box>
          )}
          
          {/* Contador de caracteres para textarea */}
          {variant === 'textarea' && renderCharCounter()}
        </Box>
      </TouchableWithoutFeedback>
      
      {error && (
        <Typography variant="bodySmall" color={theme?.colors?.colorFeedbackError}>
          {error}
        </Typography>
      )}
      
      {variant === 'date' && renderDatePicker()}
    </Box>
  );
});