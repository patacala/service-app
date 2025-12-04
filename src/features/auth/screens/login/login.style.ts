import { Theme } from '@/design-system/theme/theme';
import {StyleSheet} from 'react-native';

export const getLoginStyles = (theme: Theme) =>
  StyleSheet.create({
    prefix: {
      backgroundColor: theme?.colors.colorGrey600, 
      width: 100, 
      borderRadius: theme?.border.radius.md,
      alignItems: 'center'
    },
    logos: {
      width: 30,
      height: 30
    }
});
