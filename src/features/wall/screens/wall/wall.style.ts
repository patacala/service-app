import { StyleSheet } from 'react-native';

export const getWallStyles = StyleSheet.create({
    inputSearch: {
      height: 60
    },
    filterButton: {
      width: 66,
      height: 60,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 80,
      gap: 25,
    },
    withoutResult: {
      maxWidth: 291
    },
    textWithoutResult: {
      textAlign: "center"
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 100
    },
    loadingText: {
      marginTop: 12
    }
  });