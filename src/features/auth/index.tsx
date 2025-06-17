import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Button} from '../../design-system/components/forms/Button';
import {Typography} from '../../design-system/components/foundation/Typography';
import {Icon} from '../../design-system/components/layout/Icon';
import {Box} from '../../design-system/components/layout/Box';

const Auth = () => {
  const {t, i18n} = useTranslation('auth');

  return (
    <View>
      <Box flexDirection="row" alignItems="center" gap="sm">
        <Icon name="user-circle" size={24} color="colorTextPrimary" />
        <Typography variant="headingPrimary">{t('login')}</Typography>
      </Box>
      <Typography variant="headingSecondary">{t('signup')}</Typography>
      <Typography variant="bodyLarge" color="colorGrey200">
        {t('welcome', {name: 'John'})}
      </Typography>

      <Button
        variant="primary"
        size="medium"
        label={t('login')}
        onPress={() => console.log('Login button pressed')}
      />

      <Button
        variant="secondary"
        size="medium"
        label={t('signup')}
        onPress={() => console.log('Signup button pressed')}
      />

      <Button
        variant="primary"
        size="small"
        label="Change to Español"
        onPress={() => i18n.changeLanguage('es')}
      />

      <Button
        variant="secondary"
        size="small"
        label="Change to English"
        onPress={() => i18n.changeLanguage('en')}
      />
    </View>
  );
};

export default Auth;
