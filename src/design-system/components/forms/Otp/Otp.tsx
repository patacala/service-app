import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Keyboard, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Box } from '../../layout/Box';
import { Input } from '@/design-system';
import { OtpProps, OtpRef } from './types';

export const Otp = forwardRef<OtpRef, OtpProps>(({
  style,
  qtyDigits = 4,
  onChangeValue,
}, ref) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(qtyDigits).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>(Array(qtyDigits).fill(null));

  // Exponer métodos
  useImperativeHandle(ref, () => ({
    clear: () => {
      setOtpValues(Array(qtyDigits).fill(''));
      inputRefs.current[0]?.focus();
    },
    focusFirst: () => {
      inputRefs.current[0]?.focus();
    },
  }));

  useEffect(() => {
    if (otpValues.every((val) => val !== '') && onChangeValue) {
      const completeOtp = otpValues.join('');
      onChangeValue(parseInt(completeOtp, 10));
      Keyboard.dismiss();
    }
  }, [otpValues, onChangeValue]);

  const handleChangeText = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(0, 1);
    const updatedOtp = [...otpValues];
    updatedOtp[index] = digit;
    setOtpValues(updatedOtp);

    if (digit && index < qtyDigits - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (digit && index === qtyDigits - 1) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View>
        <Box
          flexDirection="row"
          justifyContent="space-around"
          style={style}
        >
          {Array(qtyDigits).fill(0).map((_, index) => (
            <Box key={index} width={50} height={50} marginHorizontal="xs">
              <Input
                variant="otp"
                value={otpValues[index]}
                onChangeText={(text) => handleChangeText(text, index)}
                maxLength={1}
                keyboardType="numeric"
                onKeyPress={(e) => handleKeyPress(e, index)}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                onSubmitEditing={dismissKeyboard}
                submitBehavior="blurAndSubmit"
                style={{ height: 50 }}
              />
            </Box>
          ))}
        </Box>
      </View>
    </TouchableWithoutFeedback>
  );
});
