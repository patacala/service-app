import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.base, { borderLeftColor: '#4CAF50' }]}
      contentContainerStyle={styles.container}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={[styles.base, { borderLeftColor: '#f44336' }]}
      contentContainerStyle={styles.container}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  base: {
    borderLeftWidth: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  container: {
    paddingHorizontal: 10,
  },
  text1: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  text2: {
    fontSize: 16,
    color: '#333',
  },
});
