import { theme } from '@/design-system';
import { StyleSheet } from 'react-native';

export const getProvModeStyles = StyleSheet.create({
    backgroundImage: {
      position: 'absolute',
      top: -60,
      right: -70,
    },
    provCard: {
        position: 'relative',
        padding: theme.spacing.lg,
        width: "100%",
        height: 297,
        overflow: 'hidden',
    },
    images: {
        position: 'absolute',
    },
    linearGradientBlack: {
        position: 'absolute',
        bottom: 0,
        opacity: 0.9
    },
});