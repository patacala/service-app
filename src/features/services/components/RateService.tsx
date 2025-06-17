import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, ImageSourcePropType } from "react-native";
import { Box, Typography, Rate, Button, BottomModal } from "@/design-system";
import images from "@/assets/images/images";

interface RateServiceProps {
  visible: boolean;
  onClose: () => void;
  onRate?: (ratingNum: number) => void;
}

export const RateService: React.FC<RateServiceProps> = ({
  visible,
  onClose,
  onRate = () => {},
}) => {
  const [ratingValue, setRatingValue] = useState(0);
  const [showOpinionText, setShowOpinionText] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const rateTextOpacity = useRef(new Animated.Value(1)).current;
  const thanksOpacity = useRef(new Animated.Value(0)).current;
  const opinionTextOpacity = useRef(new Animated.Value(0)).current;
  const rateComponentOpacity = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (visible) {
      // Pequeño delay para asegurar que el modal se renderice completamente
      setTimeout(() => resetState(), 50);
    } else {
      // Cuando el modal se oculta, resetear inmediatamente
      resetState();
    }
  }, [visible]);

  const resetState = () => {
    // Limpiar timeout existente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Detener cualquier animación en curso
    rateTextOpacity.stopAnimation();
    thanksOpacity.stopAnimation();
    opinionTextOpacity.stopAnimation();
    rateComponentOpacity.stopAnimation();
    buttonOpacity.stopAnimation();

    // Reset de estados booleanos
    setRatingValue(0);
    setShowOpinionText(false);
    setIsButtonVisible(false);

    // Reset inmediato de todas las opacidades sin animación
    rateTextOpacity.setValue(1);
    thanksOpacity.setValue(0);
    opinionTextOpacity.setValue(0);
    rateComponentOpacity.setValue(1);
    buttonOpacity.setValue(0);
  };

  const animateRateCompletion = () => {
    // Fase 1: Ocultar texto original, mostrar "Thanks!" y opinión
    Animated.parallel([
      Animated.timing(rateTextOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(thanksOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opinionTextOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowOpinionText(true);

      timeoutRef.current = setTimeout(() => {
        // Fase 2: Después de 3 segundos, mostrar botón de continuar
        Animated.parallel([
          Animated.timing(thanksOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rateTextOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rateComponentOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsButtonVisible(true);
        });
      }, 3000);
    });
  };

  const handleRate = (ratingNum: number) => {
    setRatingValue(ratingNum);
    onRate(ratingNum);
    animateRateCompletion();
  };

  const handleContinue = () => {
    resetState(); // Asegurar que todo esté limpio antes de cerrar
    onClose();
  };

  const modalHeight = ratingValue <= 0 ? 420 : isButtonVisible ? 520 : 500;

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      enableScroll={false}
      height={modalHeight}
    >
      <Box justifyContent="flex-start" gap="xl" paddingTop="sm">
        <Box alignItems="center">
          <Image
            source={images.withoutResult as ImageSourcePropType}
            resizeMode="contain"
          />
        </Box>

        <Box gap="xl" alignItems="center" width="100%">
          <Box position="relative" alignItems="center">
            <Animated.View 
              style={{ 
                opacity: rateTextOpacity, 
                alignItems: "center",
                position: "absolute",
                width: "100%"
              }}
            >
              <Typography variant="headingPrimary" color="white">
                Rate your Service
              </Typography>
            </Animated.View>
            
            <Animated.View 
              style={{ 
                opacity: thanksOpacity, 
                alignItems: "center",
                position: "absolute",
                width: "100%"
              }}
            >
              <Typography variant="headingPrimary" color="white">
                Thanks!
              </Typography>
            </Animated.View>
            
            {/* Spacer invisible para mantener la altura */}
            <Typography variant="headingPrimary" style={{ opacity: 0 }}>
              Rate your Service
            </Typography>
          </Box>

          {showOpinionText && (
            <Animated.View
              style={{
                opacity: opinionTextOpacity,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box width="100%" maxWidth={300} justifyContent="center" alignItems="center">
                <Typography style={{ textAlign: "center" }} variant="bodyMedium" color="white">
                  Your opinions will be taken into account for future recommendations
                </Typography>
              </Box>
            </Animated.View>
          )}

          <Box position="relative" alignItems="center" width="100%">
            <Animated.View 
              style={{ 
                opacity: rateComponentOpacity, 
                alignItems: "center",
                position: "absolute",
                width: "100%"
              }}
            >
              <Rate
                size={26}
                defaultRating={0}
                showLabel={false}
                onChange={handleRate}
              />
            </Animated.View>
            
            <Animated.View
              style={{
                opacity: buttonOpacity,
                width: "100%",
                position: "absolute",
                marginTop: "auto",
                paddingBottom: 20,
              }}
            >
              <Box width="100%">
                <Button
                  variant="secondary"
                  label="Continue"
                  onPress={handleContinue}
                />
              </Box>
            </Animated.View>
            
            {/* Spacer invisible para mantener la altura */}
            <Box style={{ opacity: 0, paddingBottom: 20 }}>
              <Button
                variant="secondary"
                label="Continue"
                onPress={() => {}}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </BottomModal>
  );
};