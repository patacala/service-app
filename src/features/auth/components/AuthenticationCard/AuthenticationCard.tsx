import React, { useEffect, useState } from 'react';
import { ImageSourcePropType, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import {
  Box,
  Typography,
  Button,
  StepIndicator,
  SafeContainer,
  theme
} from '@/design-system';
import { AuthenticationCardProps } from './types';
import { formatMultilineText } from '@/utils/text';
import { useTranslation } from 'react-i18next';
import images from '@/assets/images/images';

export const AuthenticationCard: React.FC<AuthenticationCardProps> = ({
  mainTitle = '',
  activeStepIndicator = false,
  currentStep = 0,
  totalSteps = 3,
  labels = [],
  title,
  subtitle = '',
  message = '',
  primaryButtonText,
  onPrimaryButtonPress,
  primaryButtonDisabled = false,
  secondaryButtonText,
  onSecondaryButtonPress,
  secondaryButtonLeftIcon = 'left-arrow',
  children,
}) => {
  const { t } = useTranslation('auth');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const defaultTitleText = title || t('signup.title');
  const defaultPrimaryButtonText =
    primaryButtonText || t('login.login-button');
  const defaultSecondaryButtonText =
    secondaryButtonText || t('login.back-button');

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeContainer
        fluid
        backgroundImage={images.backgroundImage as ImageSourcePropType}
        backgroundOpacity={0.3}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!keyboardVisible && (
            <Box flex={1} justifyContent="center">
              <Typography
                variant="headingPrimary"
                color="white"
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.75)',
                  textShadowRadius: 10,
                  fontSize: 50,
                  lineHeight: 60,
                  letterSpacing: 0,
                  padding: theme?.spacing.md,
                }}
              >
                {formatMultilineText(mainTitle)}
              </Typography>
            </Box>
          )}

          {activeStepIndicator && (
            <Box marginBottom="lg" justifyContent="center">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                labels={labels}
              />
            </Box>
          )}

          <Box variant="card" style={{ backgroundColor: 'transparent' }}>
            <Box>
              <Box paddingBottom="xs">
                <Typography variant="headingSecondary" color="white">
                  {formatMultilineText(defaultTitleText)}
                </Typography>
                <Typography variant="headingPrimary" color="white">
                  {formatMultilineText(subtitle)}
                </Typography>
                <Box marginTop="sm">
                  <Typography variant="bodyMedium" color="white">
                    {formatMultilineText(message)}
                  </Typography>
                </Box>
              </Box>

              <Box variant="form" paddingBottom="md">
                {children}
              </Box>
            </Box>
            <Box variant="footer">
              <Button
                variant="secondary"
                label={defaultPrimaryButtonText}
                onPress={onPrimaryButtonPress}
                disabled={primaryButtonDisabled}
              />
              {onSecondaryButtonPress && (
                <Button
                  variant="outlined"
                  label={defaultSecondaryButtonText}
                  leftIcon={secondaryButtonLeftIcon}
                  onPress={onSecondaryButtonPress}
                />
              )}
            </Box>
          </Box>
        </ScrollView>
      </SafeContainer>
    </TouchableWithoutFeedback>
  );
};