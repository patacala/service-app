import React, { useRef, useEffect, useState } from 'react';
import {
  Modal,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  Animated as RNAnimated
} from 'react-native';
import { Box } from '@/design-system/components/layout/Box';
import { Typography } from '@/design-system/components/foundation/Typography';
import { Icon } from '@/design-system/components/layout/Icon';
import { Button, StepIndicator, theme } from '@/design-system';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate
} from 'react-native-reanimated';
import { styles } from './BottomModal.styles';
import { BottomModalProps } from './types';

export const BottomModal = React.forwardRef<
  { closeWithAnimation: () => void },
  BottomModalProps
>(({
  visible,
  onClose,
  topText,
  title,
  subtitle,
  showCloseButton = true,
  children,
  height,
  enableScroll = true,
  draggable = true,
  activateSteps = false,
  currentStep = 1,
  totalSteps = 2,
  stepPosition = 'header',
  animationType = "none",
  primaryButtonText,
  secondaryButtonText,
  primaryButtonIcon,
  secondaryButtonIcon,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  showPrimaryButton = false,
  showSecondaryButton = false,
  primaryButtonVariant = 'secondary',
  secondaryButtonVariant = 'outlined',
  primaryButtonDisabled = false,
  secondaryButtonDisabled = false
}, ref) => {
  const { height: screenHeight } = Dimensions.get('window');

  const getModalHeight = (): number => {
    if (height === undefined || height === 0 || height === "0") {
      return screenHeight * 0.85;
    }
    if (typeof height === 'string' && height.includes('%')) {
      const percentage = parseInt(height) / 100;
      return screenHeight * percentage;
    }
    if (typeof height === 'number') {
      return height;
    }
    return parseFloat(height as string);
  };

  const prevStep = useRef(currentStep);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [internalVisible, setInternalVisible] = useState(visible);
  const prevHeight = useRef(getModalHeight());

  const translateY = useSharedValue(screenHeight);
  const opacity = useSharedValue(0);
  const animatedHeight = useSharedValue(getModalHeight());
  const keyboardAnim = useRef(new RNAnimated.Value(0)).current;

  const isClosing = useRef(false);
  const isStepChanging = useRef(false);
  const isFirstRender = useRef(true);
  const currentModalHeight = getModalHeight();

  useEffect(() => {
    if (!isFirstRender.current && internalVisible && !isClosing.current) {
      if (prevHeight.current !== currentModalHeight) {
        animatedHeight.value = withSpring(currentModalHeight, {
          damping: 20,
          stiffness: 120,
        });
      }
    }
    prevHeight.current = currentModalHeight;
    isFirstRender.current = false;
  }, [currentModalHeight, internalVisible]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardOpen(true);
        setKeyboardHeight(e.endCoordinates.height);
        RNAnimated.timing(keyboardAnim, {
          toValue: -Math.min(e.endCoordinates.height * 0.9, enableScroll ? 0 : 220),
          duration: Platform.OS === 'ios' ? 300 : 100,
          useNativeDriver: true
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardOpen(false);
        setKeyboardHeight(0);
        RNAnimated.timing(keyboardAnim, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 300 : 100,
          useNativeDriver: true
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [enableScroll]);

  useEffect(() => {
    if (prevStep.current !== currentStep && !isClosing.current && !isStepChanging.current) {
      animateStepChange();
    }
    prevStep.current = currentStep;
  }, [currentStep]);

  const animateStepChange = () => {
    if (isStepChanging.current) return;
    isStepChanging.current = true;

    translateY.value = withTiming(animatedHeight.value, {
      duration: 300,
    }, (finished) => {
      if (finished) {
        translateY.value = screenHeight;
        translateY.value = withSpring(0, {
          damping: 25,
          stiffness: 120,
        }, () => {
          runOnJS(completeStepChange)();
        });
      }
    });
  };

  const completeStepChange = () => {
    isStepChanging.current = false;
  };

  const closeWithAnimation = () => {
    if (isClosing.current) return;
    isClosing.current = true;
    Keyboard.dismiss();
    translateY.value = withTiming(animatedHeight.value, {
      duration: 300,
    }, (finished) => {
      if (finished) {
        opacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(finishClose)();
        });
      }
    });
  };

  const finishClose = () => {
    isClosing.current = false;
    setInternalVisible(false);
    onClose();
  };

  React.useImperativeHandle(ref, () => ({
    closeWithAnimation
  }));

  useEffect(() => {
    if (visible && !internalVisible) {
      setInternalVisible(true);
      isClosing.current = false;
      animatedHeight.value = currentModalHeight;
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 120,
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else if (!visible && internalVisible && !isClosing.current) {
      closeWithAnimation();
    }
  }, [visible, internalVisible]);

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .shouldCancelWhenOutside(true)
    .activeOffsetY([-5, 5])
    .failOffsetX([-20, 20])
    .onChange((event) => {
      'worklet';
      if (event.translationY > 0 && !keyboardOpen) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      'worklet';
      if (translateY.value > animatedHeight.value * 0.2) {
        translateY.value = withTiming(animatedHeight.value, {
          duration: 300,
        });
        opacity.value = withTiming(0, { duration: 200 });
        runOnJS(closeWithAnimation)();
      } else {
        translateY.value = withSpring(0, {
          damping: 25,
          stiffness: 120,
        });
      }
    });

  const modalGesture = draggable && !keyboardOpen
    ? Gesture.Simultaneous(panGesture)
    : Gesture.Tap().enabled(false);

  const animatedModalStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    transform: [{ translateY: translateY.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => {
    const opacityValue = interpolate(
      translateY.value,
      [0, animatedHeight.value],
      [0.7, 0]
    );
    return { opacity: opacityValue };
  });

  const handlePrimaryButtonPress = () => {
    Keyboard.dismiss();
    onPrimaryButtonPress ? onPrimaryButtonPress() : closeWithAnimation();
  };

  const handleSecondaryButtonPress = () => {
    Keyboard.dismiss();
    onSecondaryButtonPress ? onSecondaryButtonPress() : closeWithAnimation();
  };

  const shouldShowButtons = showPrimaryButton || showSecondaryButton;

  const renderButtons = () => {
    if (!shouldShowButtons) return null;
    return (
      <Box gap="md" paddingBottom="sm">
        {showPrimaryButton && (
          <Button
            variant={primaryButtonVariant}
            label={primaryButtonText || "Continue"}
            leftIcon={primaryButtonIcon}
            onPress={handlePrimaryButtonPress}
            disabled={primaryButtonDisabled}
          />
        )}
        {showSecondaryButton && (
          <Button
            variant={secondaryButtonVariant}
            label={secondaryButtonText || "Cancel"}
            leftIcon={secondaryButtonIcon}
            onPress={handleSecondaryButtonPress}
            disabled={secondaryButtonDisabled}
          />
        )}
      </Box>
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderContent = () => (
    <>
      <Box
        flexDirection={totalSteps > 2 ? "column" : "row"}
        justifyContent={totalSteps > 2 ? "flex-start" : "space-between"}
        alignItems={totalSteps > 2 ? "flex-start" : "center"}
        paddingBottom="md"
      >
        <Box>
          {topText && (
            <Box paddingBottom="sm">
              <Typography variant="bodyMedium" color={theme.colors.colorBaseWhite}>
                {topText}
              </Typography>
            </Box>
          )}

          {title && (
            <Box paddingBottom="sm" width="100%">
              <Typography variant="headingPrimary" color={theme.colors.colorBaseWhite}>
                {title}
              </Typography>
            </Box>
          )}
        </Box>

        {activateSteps && stepPosition === 'header' && (
          <Box>
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </Box>
        )}
      </Box>

      {activateSteps && stepPosition === 'belowTitle' && (
        <Box marginBottom="lg">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </Box>
      )}

      {subtitle && (
        <Box borderBottomWidth={1} borderColor="colorGrey300" width="100%" paddingBottom="md" marginBottom="sm">
          <Typography variant="bodyMedium" color={theme.colors.colorGrey200}>
            {subtitle}
          </Typography>
        </Box>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        {enableScroll ? (
          <View style={{ flex: 1 }}>
            {/* TouchableWithoutFeedback solo para las áreas que no son el ScrollView */}
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <View style={{ height: 0 }} />
            </TouchableWithoutFeedback>
            
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: keyboardOpen ? keyboardHeight * 0.5 : 0,
              }}
              showsVerticalScrollIndicator
              bounces={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none" // Cambiado de "interactive" a "none"
            >
              <View style={{ flex: 1 }}>
                {children}
                {renderButtons()}
              </View>
            </ScrollView>
          </View>
        ) : (
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={{
              flex: 1,
              paddingBottom: keyboardOpen ? keyboardHeight * 0.5 : 0,
            }}>
              {children}
              {renderButtons()}
            </View>
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </>
  );

  return (
    <Modal
      animationType={animationType}
      transparent
      visible={internalVisible}
      onRequestClose={closeWithAnimation}
    >
      <TouchableWithoutFeedback onPress={closeWithAnimation}>
        <Animated.View style={[styles.overlay, animatedOverlayStyle]} />
      </TouchableWithoutFeedback>

      <RNAnimated.View style={[styles.modalContainer, {
        transform: [{ translateY: keyboardAnim }]
      }]}>
        {draggable ? (
          <GestureDetector gesture={modalGesture}>
            <Animated.View style={[styles.innerContainer, animatedModalStyle]}>
              <Box style={styles.dragHeader}>
                <Box style={styles.dragHandle} />
              </Box>
              {renderContent()}
            </Animated.View>
          </GestureDetector>
        ) : (
          <Animated.View style={[styles.innerContainer, animatedModalStyle]}>
            {showCloseButton && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeWithAnimation}
                activeOpacity={0.7}
              >
                <Icon name="clear" size={15} color="colorBaseWhite" />
              </TouchableOpacity>
            )}
            {renderContent()}
          </Animated.View>
        )}
      </RNAnimated.View>
    </Modal>
  );
});

BottomModal.displayName = 'BottomModal';