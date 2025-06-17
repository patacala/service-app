import { StyleSheet } from 'react-native';
import { theme } from '@/design-system';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%'
    },
    innerContainer: {
      width: '100%',
      backgroundColor: theme.colors.colorBaseBlack,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm
    },
    dragHeader: {
      height: 20,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 6,
      paddingBottom: 6,
    },
    dragHandle: {
      width: 36,
      height: 5,
      backgroundColor: '#666',
      borderRadius: 2.5,
    },
    closeButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 10,
      width: 25,
      height: 25,
      borderRadius: 18,
      backgroundColor: 'rgba(102, 102, 102, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
      width: '100%',
    },
    scrollViewContent: {
      paddingBottom: 30,
    },
    contentView: {
      width: '100%',
    }
});