import { Theme } from '@/design-system/theme/theme';
import {StyleSheet} from 'react-native';

export const getRegisterCompletionStyles = (theme: Theme) =>
  StyleSheet.create({
    prefix: {
        backgroundColor: theme?.colors.colorGrey600, 
        width: 100, 
        borderRadius: theme?.border.radius.md,
        alignItems: 'center'
    }
});
