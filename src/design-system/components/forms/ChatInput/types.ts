import { TextInputProps } from 'react-native';

export interface ChatInputProps extends Omit<TextInputProps, 'editable'> {
  value?: string;
  onChangeText?: (text: string) => void;
  onIconPress?: () => void;
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  editable?: boolean;
  placeholder?: string;
  label?: string;
  maxHeight?: number;
}