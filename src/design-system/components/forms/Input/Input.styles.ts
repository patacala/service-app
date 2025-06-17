import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme';

const variantDefaultStyle = (theme?: Theme) => ({
  backgroundColor: theme?.colors.colorGrey600,
  borderRadius: theme?.border?.radius.md,
});

export const getInputStyles = (theme?: Theme) =>
  StyleSheet.create({
    varianDefault: {
      ...variantDefaultStyle(theme)
    },
    variantSearch: {
      ...variantDefaultStyle(theme),
      padding: theme?.spacing?.xxs,
    },
    variantPassword: {
      ...variantDefaultStyle(theme)
    },
    variantNumeric: {
      ...variantDefaultStyle(theme)
    },
    varianOtp: {
      ...variantDefaultStyle(theme),
      maxWidth: 80,
    },
    // Variante date
    variantDate: {
      ...variantDefaultStyle(theme)
    },
    // Nueva variante textarea
    variantTextarea: {
      ...variantDefaultStyle(theme),
      minHeight: 100,
      position: 'relative',
      paddingBottom: 24 // Espacio para el contador
    },
    // Nueva variante disabled
    variantDisabled: {
      ...variantDefaultStyle(theme),
      backgroundColor: theme?.colors.colorGrey600,
      opacity: 0.7,
      borderColor: theme?.colors.colorGrey500,
    },
    labelInput: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      padding: 18,
    },
    labelText: {
      fontSize: 18,
      color: theme?.colors?.colorGrey200,
    },
    labelFocused: {
      top: -15,
    },
    labelTextFocused: {
      fontSize: 12,
    },
    input: {
      flex: 1,
      fontSize: 18,
      color: theme?.colors?.colorTextSecondary,
      height: 60,
      padding: theme?.spacing?.md,
      borderWidth: 0,
    },
    inputCenterText: {
      textAlign: 'center'
    },
    
    // Estilos para el contador de caracteres
    charCountContainer: {
      position: 'absolute',
      bottom: 5,
      right: 12,
      zIndex: 2,
    },
    
    // Estilos para el DatePicker modal
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme?.colors?.colorGrey600 || '#1E1E1E',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme?.colors?.colorGrey600 || '#333',
    },
    modalCloseButton: {
      alignSelf: 'flex-end',
    },
    datePickerContainer: {
      backgroundColor: theme?.colors?.colorGrey600,
    },
    // Estilos para las pestañas en el modo datetime
    modalTabContainer: {
      flexDirection: 'row',
      marginRight: 'auto',
    },
    modalTab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    modalTabActive: {
      backgroundColor: theme?.colors?.colorGrey600,
    }
});