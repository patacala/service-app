import {Box, Typography, Button, SafeContainer, theme} from '@/design-system';
import backgroundImage from '@/assets/images/brand-background.jpg';
import logo from '@/assets/images/logo.png';
import {useTranslation} from 'react-i18next';
import {formatMultilineText} from '@/utils/text';
import {ImageSourcePropType, Image} from 'react-native';
import { useRouter } from 'expo-router';

export const IntroScreen = () => {
  const router = useRouter();
  const {t} = useTranslation('auth');

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <SafeContainer
      backgroundImage={backgroundImage as ImageSourcePropType}
      backgroundOpacity={0.3}>
      <Box flex={1} justifyContent="space-between">
        <Box flex={1} justifyContent="center" alignItems="center">
          <Image
            source={logo as ImageSourcePropType}
            resizeMode="contain"
            style={{
              width: '70%',
              maxHeight: '40%',
            }}
          />

          <Typography
            variant="headingPrimary"
            color="white"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowRadius: 10,
              fontSize: 45,
              lineHeight: 60,
              padding: theme?.spacing.md,
              textAlign: 'center',
            }}>
            {formatMultilineText(t('intro.title'))}
          </Typography>
        </Box>

        <Box gap="md">
          <Button
            variant="secondary"
            label={t('intro.login-button')}
            onPress={handleLogin}
          />
          {/* <Button
            variant="outlined"
            label={t('intro.signup-button')}
            onPress={handleSignUp}
          /> */}
        </Box>
      </Box>
    </SafeContainer>
  );
};
