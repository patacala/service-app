import { ViewStyle } from 'react-native';

export type OtpVariant = 'default';

export interface OtpProps {
  style?: ViewStyle;
  variant?: OtpVariant;
  qtyDigits?: number;
  onChangeValue?: (value: number) => void;
}

export interface OtpRef {
  clear: () => void;
  focusFirst: () => void;
}
