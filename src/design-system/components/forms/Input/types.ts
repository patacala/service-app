import {ReactNode} from 'react';
import {TextInputProps, ViewStyle} from 'react-native';
import {IconName} from '../../layout/Icon/types';

export type InputVariant = 'default' | 'search' | 'password' | 'numeric' | 'otp' | 'date' | 'textarea' | 'disabled' | 'chat';
export type DateMode = 'date' | 'time' | 'datetime';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  placeholder?: string;
  icon?: IconName | ReactNode;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  variant?: InputVariant;
  value?: string;
  onChangeValue?: (value: string) => void;
  onDateChange?: (date: Date) => void;
  onIconPress?: () => void; 
  format?: string;
  dateMode?: DateMode;
  numberOfLines?: number;
  maxLength?: number;
  expandable?: boolean;
  maxHeight?: number;
}