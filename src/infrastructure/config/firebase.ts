import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import Constants from 'expo-constants';

// Verificar si Firebase ya está inicializado
if (!firebase.apps.length) {
  const firebaseConfig = Constants.expoConfig?.extra?.firebase;
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
export const auth = firebase.auth();