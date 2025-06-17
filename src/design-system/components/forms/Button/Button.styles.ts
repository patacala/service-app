import {StyleSheet} from 'react-native';
import {Theme} from '../../../theme';
import {ButtonStylesProps} from './types';

const BUTTON_VARIANTS = {
  primary: (theme: Theme) => ({
    backgroundColor: theme.colors.colorBackgroundPrimary,
    borderWidth: 0,
  }),
  secondary: (theme: Theme) => ({
    backgroundColor: theme.colors.colorBackgroundSecondary,
    borderWidth: 0,
  }),
  outlined: (theme: Theme) => ({
    backgroundColor: theme.colors.colorBackgroundPrimary,
    borderWidth: theme.border.solid[1],
    borderColor: theme.colors.colorGrey200,
  }),
  ghost: () => ({
    backgroundColor: 'transparent',
    borderWidth: 0,
  }),
  ghostWithout: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderWidth: 0,
  }),
  centerIconOnly: (theme: Theme) => ({
    width: '100%',
    height: '100%',
    backgroundColor: theme?.colors.colorGrey600,
    borderWidth: 0,
    borderRadius: 10,
  }),
  // Variante 'transparent'
  transparent: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: theme.border.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  }),
  // Variante 'slide' (deslizable) con nuevos estilos
  slide: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.colorGrey200,
    borderRadius: 28, // Medio de la altura por defecto (56/2)
    overflow: 'hidden',
    position: 'relative',
  }),
};

// Variantes para botones deshabilitados
const DISABLED_BUTTON_VARIANTS = {
  primary: (theme: Theme) => ({
    backgroundColor: theme.colors.colorGrey600,
    borderWidth: 0,
    opacity: 0.7,
  }),
  secondary: (theme: Theme) => ({
    backgroundColor: theme.colors.colorGrey400,
    borderWidth: 0,
    opacity: 0.7,
  }),
  outlined: (theme: Theme) => ({
    backgroundColor: theme.colors.colorGrey600,
    borderWidth: theme.border.solid[1],
    borderColor: theme.colors.colorGrey400,
    opacity: 0.7,
  }),
  ghost: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderWidth: 0,
    opacity: 0.5,
  }),
  ghostWithout: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderWidth: 0,
    opacity: 0.5,
  }),
  centerIconOnly: (theme: Theme) => ({
    width: '100%',
    height: '100%',
    backgroundColor: theme?.colors.colorGrey500,
    borderWidth: 0,
    borderRadius: 10,
    opacity: 0.7,
  }),
  // Versión deshabilitada de la variante 'transparent'
  transparent: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: theme.border.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    opacity: 0.5,
  }),
  // Versión deshabilitada de la variante 'slide' con nuevos estilos
  slide: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.colorGrey400,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    opacity: 0.7,
  }),
};

const BUTTON_SIZES = {
  small: (theme: Theme) => ({
    padding: theme.spacing.sm,
  }),
  medium: (theme: Theme) => ({
    padding: theme.spacing.md,
  }),
  large: (theme: Theme) => ({
    padding: theme.spacing.lg,
  }),
};

const TEXT_VARIANTS = {
  primary: (theme: Theme) => ({
    color: theme.colors.colorGrey100,
  }),
  secondary: (theme: Theme) => ({
    color: theme.colors.colorTextPrimary,
  }),
  outlined: (theme: Theme) => ({
    color: theme.colors.colorGrey100,
  }),
  ghost: (theme: Theme) => ({
    color: theme.colors.colorTextSecondary,
    textDecorationLine: 'underline' as const,
  }),
  ghostWithout: (theme: Theme) => ({
    color: theme.colors.colorTextSecondary,
  }),
  centerIconOnly: (theme: Theme) => ({
    color: theme?.colors.colorGrey600,
  }),
  // Texto para la variante 'transparent'
  transparent: (theme: Theme) => ({
    color: theme.colors.colorBaseWhite,
    fontWeight: '400' as const, // Usar un valor específico compatible con TextStyle
  }),
  // Texto para la variante 'slide' con nuevo color
  slide: (theme: Theme) => ({
    color: theme.colors.colorGrey100,
    fontSize: 16,
    fontWeight: '500' as const,
  }),
};

// Texto para botones deshabilitados
const DISABLED_TEXT_VARIANTS = {
  primary: (theme: Theme) => ({
    color: theme.colors.colorGrey300,
  }),
  secondary: (theme: Theme) => ({
    color: theme.colors.colorGrey300,
  }),
  outlined: (theme: Theme) => ({
    color: theme.colors.colorGrey300,
  }),
  ghost: (theme: Theme) => ({
    color: theme.colors.colorGrey400,
    textDecorationLine: 'underline' as const,
  }),
  ghostWithout: (theme: Theme) => ({
    color: theme.colors.colorGrey400,
  }),
  centerIconOnly: (theme: Theme) => ({
    color: theme?.colors.colorGrey400,
  }),
  transparent: (theme: Theme) => ({
    color: theme.colors.colorGrey100,
  }),
  // Texto deshabilitado para la variante 'slide'
  slide: (theme: Theme) => ({
    color: theme.colors.colorGrey300,
  }),
};

export const getButtonStyles = (
  theme: Theme,
  {variant = 'primary', size = 'medium', disabled = false}: ButtonStylesProps,
) => {
  const sizeStyles = 
    (variant === 'transparent' || variant === 'slide') 
      ? {} 
      : BUTTON_SIZES[size as keyof typeof BUTTON_SIZES](theme);
  
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
      borderRadius: theme.border.radius.pill,
      ...(disabled 
        ? DISABLED_BUTTON_VARIANTS[variant as keyof typeof DISABLED_BUTTON_VARIANTS](theme)
        : BUTTON_VARIANTS[variant as keyof typeof BUTTON_VARIANTS](theme)),
      ...sizeStyles,
    },
    text: {
      ...(disabled
        ? DISABLED_TEXT_VARIANTS[variant as keyof typeof DISABLED_TEXT_VARIANTS](theme)
        : TEXT_VARIANTS[variant as keyof typeof TEXT_VARIANTS](theme))
    },
    withIcon: {
      position: 'absolute',
      width: 52,
      height: 52,
      borderRadius: 52,
      backgroundColor: disabled ? theme?.colors.colorGrey500 : theme?.colors.colorGrey600,
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.7 : 1,
    },
    leftIcon: {
      left: 3,
    },
    rightIcon: {
      right: 3,
      transform: [{ rotate: '-30deg' }]
    },
    iconOnly: {
      position: 'relative',
      backgroundColor: 'transparent',
      width: 60,
      height: 60,
      borderRadius: 0,
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.7 : 1,
    },
    transparentIcon: {
      position: 'relative',
      marginRight: theme.spacing.sm,
      backgroundColor: 'transparent',
    },
    slideContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    slideProgressBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
    },
    slideThumb: {
      position: 'absolute',
      left: 4,
      top: 4,
      alignItems: 'center',
      justifyContent: 'center',
      // Añadir sombra
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3
    }
  });
};