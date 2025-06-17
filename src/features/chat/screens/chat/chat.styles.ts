import { StyleSheet } from 'react-native';

export const getChatStyles = StyleSheet.create({
    backgroundImageContainer: {
        position: 'absolute',
        top: -60,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    backgroundImage: {
        width: '100%',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    }
});