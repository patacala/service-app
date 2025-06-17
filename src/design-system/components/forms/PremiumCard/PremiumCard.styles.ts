import { theme } from '@/design-system';
import { StyleSheet } from 'react-native';

export const getPremiumCardStyles = StyleSheet.create({
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