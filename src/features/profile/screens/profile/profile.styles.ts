import { theme } from '@/design-system';
import { StyleSheet } from 'react-native';

export const getProfileStyles = StyleSheet.create({
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: "50%",
        overflow: "hidden"
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },
    prefix: {
        backgroundColor: theme.colors.colorGrey600, 
        width: 100, 
        height: 60,
        borderRadius: theme.border.radius.md,
        alignItems: 'center'
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
    profileImageAll: {
        width: 50,
        height: 50,
        borderRadius: "50%",
        overflow: "hidden"
    }
});