import { TextInputProps } from 'react-native';

export interface ChatInputProps extends Omit<TextInputProps, 'editable'> {
  value?: string;
  onChangeText?: (text: string) => void;
  onIconPress?: (payload: { text: string; image: string | null }) => void;
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  onImageSelected?: () => void;
  editable?: boolean;
  placeholder?: string;
  label?: string;
  maxHeight?: number;
}