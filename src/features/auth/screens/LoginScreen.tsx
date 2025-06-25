import React, { useState, useEffect } from 'react';
import { Image, ImageSourcePropType, Platform, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Box, Input, theme, Typography } from '@/design-system';
import { AuthenticationCard } from '../components/AuthenticationCard/AuthenticationCard';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { Row } from '@/design-system/components/layout/Row/Row';
import { getLoginStyles } from './login/login.style';
import Toast from 'react-native-toast-message';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import images from '@/assets/images/images';
import { SessionManager } from '@/infrastructure/session';

interface LoginFormData {
  phoneNumber: string;
  password: string;
}

interface FormErrors {
  phoneNumber: string;
  password: string;
}

export const LoginScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { t } = useTranslation('auth');
  const styles = getLoginStyles(theme);
  
  const [inputValues, setInputValues] = useState<LoginFormData>({
    phoneNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    phoneNumber: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [msgError, setMsgError] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '343824714542-csdtgbqf7ff8n4hi40a4mka4811b80nl.apps.googleusercontent.com',
    });
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = { phoneNumber: '', password: '' };

    if (!inputValues.phoneNumber.trim()) {
      newErrors.phoneNumber = t('login.phone-required');
      isValid = false;
    } else if (inputValues.phoneNumber.length !== 10) {
      newErrors.phoneNumber = t('login.phone-invalid');
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please correct the highlighted fields.',
      });
    }
    return isValid;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const rawPhone = inputValues.phoneNumber.trim();
    const fullPhoneNumber = `+1${rawPhone}`;

    try {
      const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
      navigation.navigate('Otp', {
        confirmation,
        phoneNumber: fullPhoneNumber,
      });

      Toast.show({
        type: 'info',
        text1: 'Verification code sent',
        text2: `We sent a code to ${fullPhoneNumber}`,
      });
    } catch (err: any) {
      console.error('Phone login error:', err);
      setMsgError(err);

      let errorMessage = `${fullPhoneNumber} - ${err}`;
      
      // Manejar errores específicos de Firebase
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'The phone number format is invalid.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (err.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      }

      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const onGmailButtonPress = async () => {
    setGoogleLoading(true);
    try {
      const sessionManager = SessionManager.getInstance();
      await sessionManager.initialize();
      
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      
      // Validar que signInResult existe
      if (!signInResult || !signInResult.data) {
        throw new Error('No se pudo obtener la información del usuario.');
      }
      
      // Obtener tokens después del sign-in
      const tokens = await GoogleSignin.getTokens();
      const { idToken, accessToken } = tokens;
      
      // Validar idToken
      if (!idToken) {
        throw new Error('No se pudo obtener el idToken desde Google.');
      }

      // Crear credenciales con ambos tokens
      const googleCredential = auth.GoogleAuthProvider.credential(idToken, accessToken);
      await auth().signInWithCredential(googleCredential);
      await sessionManager.setSession(idToken);
      
      Toast.show({
        type: 'success',
        text1: '¡Éxito!',
        text2: 'Has iniciado sesión con Google.',
      });

      navigation.navigate('Main');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      // Manejo más específico de errores
      if (error.code === statusCodes.SIGN_IN_CANCELLED || error.code === '12501') {
        console.log('El usuario canceló el flujo de inicio de sesión con Google.');
        return;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Inicio de sesión en progreso...');
        return;
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Google Play Services no está disponible.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error de inicio de sesión',
          text2: error.message || 'No se pudo iniciar sesión con Google.',
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    let errorMessage = '';

    if (!inputValues.phoneNumber.trim()) {
      errorMessage = t('signupCompletion.number-required');
    } else if (inputValues.phoneNumber.length !== 10) {
      errorMessage = t('signupCompletion.number-invalid');
    }

    if (errorMessage) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: errorMessage,
      }));

      Toast.show({
        type: 'error',
        text1: 'Phone required',
        text2: errorMessage,
      });
      return;
    }

    navigation.navigate('ForgotPassword', {
      phonenumber: `+57${inputValues.phoneNumber}`,
    });
  };

  const handleGoBack = () => navigation.goBack();

  return (
    <AuthenticationCard
      mainTitle={t('login.title')}
      title={t('login.title')}
      subtitle={t('login.sub-title')}
      onPrimaryButtonPress={handleLogin}
      onSecondaryButtonPress={handleGoBack}
      primaryButtonDisabled={loading || googleLoading}
    >
      <Row justify="space-between">
        <Box style={styles.prefix} padding="md">
          <Typography variant="bodyRegular" colorVariant="secondary">
            +1
          </Typography>
        </Box>
        <Input
          label={t('signupCompletion.number')}
          placeholder={t('signupCompletion.text-input-number')}
          keyboardType="numeric"
          value={inputValues.phoneNumber}
          onChangeText={value =>
            handleInputChange(
              'phoneNumber',
              value.replace(/[^0-9]/g, '').slice(0, 10),
            )
          }
          error={errors.phoneNumber}
          style={{ width: 250 }}
        />
      </Row>

      <Box marginTop="lg">
        <Typography variant="bodyRegular" colorVariant="secondary">
          {msgError}
        </Typography>

        <Row justifyContent="center">
          <TouchableOpacity 
            onPress={onGmailButtonPress}
            activeOpacity={0.7}
          >
            <Image
              source={images.gmailLogo as ImageSourcePropType}
              resizeMode="contain"
              style={styles.logos}
            />
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity 
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <Image
                source={images.appleLogo as ImageSourcePropType}
                resizeMode="contain"
                style={styles.logos}
              />
            </TouchableOpacity>
          )}
        </Row>
      </Box>
    </AuthenticationCard>
  );
};