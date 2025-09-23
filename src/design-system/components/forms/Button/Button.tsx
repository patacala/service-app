import React, { useRef, useState, useEffect } from 'react';
import {
  TouchableOpacity, 
  Image, 
  Animated, 
  PanResponder,
  Dimensions
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import { Typography } from '../../foundation/Typography';
import { Box } from '../../layout/Box';
import { Icon } from '../../layout/Icon';
import { ButtonProps } from './types';
import { getButtonStyles } from './Button.styles';

type IconColorType = 
  | "colorBaseBlack" | "colorBaseWhite" 
  | "colorGrey100" | "colorGrey200" | "colorGrey300" | "colorGrey400" | "colorGrey500" | "colorGrey600"
  | "colorBrandPrimary" | "colorBrandSecondary"
  | "colorTextPrimary" | "colorTextSecondary"
  | "colorBackgroundPrimary" | "colorBackgroundSecondary"
  | "colorFeedbackError" | "colorFeedbackSuccess" | "colorFeedbackWarning" | "colorFeedbackInfo"
  | undefined;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  label,
  centerIcon,
  leftIcon,
  rightIcon,
  onPress,
  children,
  iconSize,
  iconWidth = 20,
  iconHeight = 12,
  disabled = false,
  slideBackgroundColor,
  slideThumbColor,
  width,
  height = 56,
  textColor,
  ...props
}) => {
  const theme = useTheme<Theme>();
  const buttonStyles = getButtonStyles(theme, {variant, size, disabled});
  
  const containerStyle = buttonStyles.container;

  // Función para renderizar diferentes tipos de iconos
  const renderIconContent = (
    iconProp: any, 
    defaultColor: IconColorType, 
    defaultSizeIcon: number, 
    defaultWSize: number, 
    defaultHSize: number
  ) => {
    // Ajustar el color del icono si está deshabilitado
    const iconColor = disabled ? "colorGrey300" : defaultColor;
    
    if (typeof iconProp === 'string') {
      return <Icon name={iconProp as any} color={iconColor} size={iconSize || defaultSizeIcon} />;
    } else if (iconProp && (iconProp.uri || typeof iconProp === 'number')) {
      return (
        <Image 
          source={iconProp}
          style={{
            width: iconWidth || defaultWSize,
            height: iconHeight || defaultHSize,
            resizeMode: 'contain',
            opacity: disabled ? 0.7 : 1
          }}
        />
      );
    } else {
      return iconProp;
    }
  };

  // Determinar color del icono según la variante
  const getIconColor = (): IconColorType => {
    if (textColor) {
      return textColor;
    }

    switch (variant) {
      case 'secondary':
        return "colorBaseBlack";
      case 'transparent':
        return "colorBaseWhite";
      case 'slide':
        return "colorBaseWhite";
      default:
        return "colorBaseWhite";
    }
  };

  // Renderizar el icono central
  const renderCenterIcon = () => {
    if (!centerIcon) return null;
    
    return (
      <Box 
        alignItems='center'
        justifyContent='center'
        style={buttonStyles.iconOnly}
      >
        {renderIconContent(centerIcon, getIconColor(), 28, iconWidth || 20, iconHeight || 12)}
      </Box>
    );
  };

  // Renderizar el icono izquierdo
  const renderLeftIcon = () => {
    if (!leftIcon) return null;
    
    // Si la variante es transparent, usamos el estilo específico para ella
    if (variant === 'transparent') {
      return (
        <Box style={buttonStyles.transparentIcon} paddingRight="sm">
          {renderIconContent(leftIcon, getIconColor(), 20, iconWidth || 20, iconHeight || 12)}
        </Box>
      );
    }
    
    // Estilo normal para leftIcon
    return (
      <Box style={[buttonStyles.withIcon, buttonStyles.leftIcon]}>
        {renderIconContent(leftIcon, getIconColor(), 20, iconWidth || 20, iconHeight || 12)}
      </Box>
    );
  };

  // Renderizar el icono derecho
  const renderRightIcon = () => {
    if (!rightIcon) return null;
    
    // Si la variante es transparent, usamos el estilo específico para ella
    if (variant === 'transparent') {
      return (
        <Box style={buttonStyles.transparentIcon} paddingLeft="md">
          {renderIconContent(rightIcon, getIconColor(), 20, iconWidth || 20, iconHeight || 12)}
        </Box>
      );
    }
    
    // Estilo normal para rightIcon
    return (
      <Box style={[buttonStyles.withIcon, buttonStyles.rightIcon]}>
        {renderIconContent(rightIcon, getIconColor(), 20, iconWidth || 20, iconHeight || 12)}
      </Box>
    );
  };

  // Para la variante slide (botón deslizable)
  if (variant === 'slide') {
    // Estado y refs para la animación del slide
    const [sliding, setSliding] = useState(false);
    const dragX = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(1)).current;
    const backgroundOpacity = useRef(new Animated.Value(0)).current;
    
    // Configurar dimensiones
    const buttonWidth = width || Dimensions.get('window').width - 40;
    const thumbSize = height - 8; // 4px de margen en cada lado
    const maxSlide = buttonWidth - thumbSize - 8;
    
    // Color de fondo del botón slide (transparente por defecto)
    const bgColor = slideBackgroundColor || 'transparent';
    
    // Color del círculo deslizable (mezcla de 3D3D3D y 7F7F7F por defecto)
    const thumbColor = slideThumbColor || '#3D3D3D';
    
    // Reiniciar el botón si cambia disabled
    useEffect(() => {
      if (disabled && sliding) {
        Animated.spring(dragX, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: false
        }).start(() => {
          setSliding(false);
          backgroundOpacity.setValue(0);
        });
      }
    }, [disabled]);
    
    // Crear el pan responder para manejar el gesto de arrastre
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        
        onPanResponderGrant: () => {
          setSliding(true);
        },
        
        onPanResponderMove: (_, gestureState) => {
          const newX = Math.max(0, Math.min(gestureState.dx, maxSlide));
          dragX.setValue(newX);
          
          // Animar la opacidad del fondo basado en el progreso del deslizamiento
          const progress = newX / maxSlide;
          backgroundOpacity.setValue(progress);
        },
        
        onPanResponderRelease: (_, gestureState) => {
          // Si llegó al 90% del camino, considerar como completado
          if (gestureState.dx > maxSlide * 0.9) {
            Animated.timing(dragX, {
              toValue: maxSlide,
              duration: 100,
              useNativeDriver: false
            }).start(() => {
              if (onPress) onPress();
            });
          } else {
            // Si no llegó lo suficientemente lejos, volver al inicio
            Animated.spring(dragX, {
              toValue: 0,
              friction: 5,
              tension: 40,
              useNativeDriver: false
            }).start(() => {
              setSliding(false);
              backgroundOpacity.setValue(0);
            });
          }
        }
      })
    ).current;
    
    // Estilo interpolado para el fondo de progreso
    const progressStyle = {
      width: dragX.interpolate({
        inputRange: [0, maxSlide],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp'
      })
    };
    
    return (
      <Animated.View style={[
        buttonStyles.slideContainer,
        {
          width: buttonWidth,
          height,
          backgroundColor: 'transparent',
          borderRadius: height / 2,
          opacity: buttonOpacity,
          borderColor: disabled ? theme.colors.colorGrey400 : theme.colors.colorGrey200,
          borderWidth: 1,
        }
      ]}>
        {/* Fondo de progreso */}
        <Animated.View
          style={[
            buttonStyles.slideProgressBackground,
            progressStyle,
            {
              backgroundColor: thumbColor,
              borderRadius: height / 2,
              opacity: backgroundOpacity
            }
          ]}
        />
        
        {/* Texto del botón */}
        <Box
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="bodyLarge"
            color={theme.colors[disabled ? "colorGrey300" : "colorGrey100"]}
          >
            {label}
          </Typography>
        </Box>
        
        {/* Círculo deslizable */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            buttonStyles.slideThumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: disabled ? theme.colors.colorGrey500 : thumbColor,
              transform: [{ translateX: dragX }]
            }
          ]}
        >
          {leftIcon ? (
            renderIconContent(leftIcon, "colorBaseWhite", thumbSize * 0.5, iconWidth || 20, iconHeight || 12)
          ) : (
            <Icon 
              name="clear" 
              size={thumbSize * 0.5} 
              color={disabled ? "colorGrey300" : "colorBaseWhite"} 
            />
          )}
        </Animated.View>
      </Animated.View>
    );
  }

  // Para la variante iconOnly, renderizar solo un icono en el centro
  if (variant === 'centerIconOnly') {
    const iconToShow = centerIcon || leftIcon || rightIcon;
    
    if (!iconToShow) {
      return null;
    }
    
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.7}
        {...props}
      >
        <Box style={containerStyle} variant="clean">
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            variant="clean"
          >
            {renderIconContent(iconToShow, getIconColor(), 28, iconWidth || 20, iconHeight || 12)}
          </Box>
        </Box>
      </TouchableOpacity>
    );
  }

  // Para la variante transparent
  if (variant === 'transparent') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.7}
        {...props}
      >
        <Box style={containerStyle} variant="clean">
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            variant="clean"
            alignSelf="flex-start"
          >
            <Box
              flexDirection="row"
              alignItems="center"
              variant="clean"
            >
              {renderLeftIcon()}
              <Typography 
                variant="bodyRegular" 
                color={textColor ? theme.colors[textColor as keyof typeof theme.colors]:theme.colors.colorBaseWhite}
                style={[
                  { flexShrink: 1 }
                ]}
                numberOfLines={1}
                allowFontScaling={false}
              >
                {label}
              </Typography>
              {renderRightIcon()}
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    );
  }

  // Botón estándar con posibilidad de íconos izquierdo y derecho
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      {...props}
    >
      <Box style={buttonStyles.container} variant="clean">
        {renderLeftIcon()}
        <Box
          flex={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          variant="clean">
          {children || (
            <>
              {centerIcon ? renderCenterIcon() : (
                <Typography 
                  variant="button" 
                  color={theme.colors[buttonStyles.text.color as keyof typeof theme.colors]}
                  style={buttonStyles.text}
                >
                  {label}
                </Typography>
              )}
            </>
          )}
        </Box>
        {renderRightIcon()}
      </Box>
    </TouchableOpacity>
  );
};