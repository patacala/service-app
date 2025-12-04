import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme';

export const getChatInputStyles = (theme?: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme?.colors.colorGrey600,
      borderRadius: theme?.border?.radius.md,
    },
    disabled: {
      backgroundColor: theme?.colors.colorGrey600,
      opacity: 0.7,
      borderColor: theme?.colors.colorGrey500,
    },
    input: {
      flex: 1,
      fontSize: 18,
      color: theme?.colors?.colorTextSecondary,
      padding: theme?.spacing?.md,
      borderWidth: 0,
    },
    labelInput: {
      position: 'absolute',
      top: 0,
      left: 30,
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
  });