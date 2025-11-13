import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { TextInput, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { Box } from '../../layout/Box';
import { Typography } from '../../foundation/Typography';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import { Icon } from '../../layout/Icon';
import { getChatInputStyles } from './ChatInput.styles';
import { ChatInputProps } from './types';

export const ChatInput = forwardRef<TextInput, ChatInputProps>(({
  value = '',
  onChangeText,
  onIconPress,
  onSubmitEditing,
  onFocus,
  editable = true,
  placeholder = '',
  label = '',
  maxHeight = 120,
}, ref) => {
  const theme = useTheme<Theme>();
  const styles = getChatInputStyles(theme);
  const internalRef = useRef<TextInput>(null);
  
  const [isMultiline, setIsMultiline] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasText, setHasText] = useState(Boolean(value));
  const isDisabled = !editable;

  // Valores para la animación del label
  const normalTopPosition = styles.labelInput?.top as number;
  const focusedTopPosition = styles.labelFocused?.top as number;
  const normalFontSize = styles.labelText?.fontSize as number;
  const focusedFontSize = styles.labelTextFocused?.fontSize as number;

  const labelPositionY = useRef(new Animated.Value(hasText ? focusedTopPosition : normalTopPosition)).current;
  const labelFontSize = useRef(new Animated.Value(hasText ? focusedFontSize : normalFontSize)).current;

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(internalRef.current);
    }
  }, [ref]);

  useEffect(() => {
    if (value !== undefined) {
      setHasText(Boolean(value));
    }
  }, [value]);

  useEffect(() => {
    if (isFocused || hasText) {
      Animated.parallel([
        Animated.timing(labelPositionY, {
          toValue: focusedTopPosition,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(labelFontSize, {
          toValue: focusedFontSize,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(labelPositionY, {
          toValue: normalTopPosition,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(labelFontSize, {
          toValue: normalFontSize,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isFocused, hasText]);

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    
    if (height > 30 && !isMultiline) {
      setIsMultiline(true);
    } else if (height <= 30 && isMultiline && value.indexOf('\n') === -1) {
      setIsMultiline(false);
    }
  };

  const handleChangeText = (text: string) => {
    if (isDisabled) return;
    setHasText(text.length > 0);
    onChangeText?.(text);
  };

  const handleFocus = () => {
    if (isDisabled) return;
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const focusInput = () => {
    if (isDisabled) return;
    if (internalRef.current) {
      internalRef.current.focus();
    }
  };

  const handleSubmit = () => {
    if (isDisabled || !value.trim()) return;
    onIconPress?.();
  };

  const AnimatedLabel = () => {
    const labelVariant = (isFocused || hasText) ? "bodySmall" : "bodyLarge";

    return (
      <TouchableWithoutFeedback onPress={focusInput}>
        <Animated.View
          style={[
            styles.labelInput,
            { top: labelPositionY },
          ]}
        >
          <Typography  
            variant={labelVariant} 
            color={isDisabled ? theme?.colors?.colorGrey400 : theme?.colors?.colorGrey200}
          >
            {!isFocused && !hasText && placeholder ? placeholder : label}
          </Typography>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Box style={{position: 'relative'}}>
      {(label || placeholder) && <AnimatedLabel />}
      
      <TouchableWithoutFeedback onPress={isDisabled ? undefined : focusInput}>
        <Box
          flexDirection="row"
          alignItems={isMultiline ? "flex-start" : "center"}
          borderWidth={1}
          borderColor={isDisabled ? 'colorGrey500' : (isFocused ? 'colorGrey200' : 'colorGrey600')}
          style={[
            styles.container,
            { minHeight: 60 },
            isDisabled && styles.disabled
          ]}
        >
          <TextInput
            ref={internalRef}
            value={value}
            placeholder=""
            style={[
              styles.input,
              {
                maxHeight: maxHeight,
                textAlignVertical: isMultiline ? 'top' : 'center',
                minHeight: 40,
                height: 'auto',
              },
              isDisabled && { color: theme?.colors?.colorGrey400 }
            ]}
            placeholderTextColor={theme.colors.colorTextSecondary}
            onChangeText={handleChangeText}
            editable={!isDisabled}
            multiline={true}
            onContentSizeChange={handleContentSizeChange}
            returnKeyType="default"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={onSubmitEditing}
          />
          
          <Box 
            marginRight="sm" 
            marginTop={isMultiline ? "md" : undefined}
            style={isMultiline ? { alignSelf: 'flex-end', marginBottom: 15, marginRight: 10 } : undefined}
          >
            <TouchableOpacity 
              onPress={isDisabled ? undefined : handleSubmit} 
              disabled={isDisabled}
            >
              <Icon 
                name="send" 
                color={isDisabled ? "colorGrey400" : "colorBaseWhite"}
              />
            </TouchableOpacity>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  );
});