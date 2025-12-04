import {ImageSourcePropType, TouchableOpacityProps} from 'react-native';
import {ReactNode} from 'react';
import type {Theme} from '../../../theme';
import {IconName} from '../../layout/Icon/types';

// Actualizar ButtonVariant para incluir la nueva variante 'slide'
export type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'ghost'
  | 'ghostWithout'
  | 'centerIconOnly'
  | 'transparent'
  | 'slide';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonStylesProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

export interface ButtonProps extends ButtonStylesProps, TouchableOpacityProps {
  label: string;
  onPress: () => void;
  children?: ReactNode;
  centerIcon?: IconName | ReactNode | ImageSourcePropType;
  leftIcon?: IconName | ReactNode | ImageSourcePropType;
  rightIcon?: IconName | ReactNode | ImageSourcePropType;
  iconSize?: number;
  iconWidth?: number;
  iconHeight?: number;
  slideBackgroundColor?: string;
  slideThumbColor?: string;
  width?: number;
  height?: number;
  textColor?: keyof Theme['colors'];
}