import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme';

const variantDefaultStyle = (theme?: Theme) => ({
  backgroundColor: theme?.colors.colorGrey600,
  borderRadius: theme?.border?.radius.md,
});

export const getOtpStyles = (theme?: Theme) => 
  StyleSheet.create({
    varianDefault: {
      ...variantDefaultStyle(theme)
    },
});