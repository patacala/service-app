import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Image, ImageSourcePropType } from "react-native";
import { Box, Typography, Rate, Button, BottomModal, Input } from "@/design-system";
import images from "@/assets/images/images";

interface RateServiceProps {
  visible: boolean;
  onClose: () => void;
  onRate?: (rating: number, title: string, comment: string) => Promise<void>;
  isLoading?: boolean;
}

export const RateService: React.FC<RateServiceProps> = ({
  visible,
  onClose,
  onRate = async () => {},
  isLoading = false,
}) => {
  const [ratingValue, setRatingValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const rateTextOpacity = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const rateComponentOpacity = useRef(new Animated.Value(1)).current;

  const resetState = useCallback(() => {
    rateTextOpacity.stopAnimation();
    formOpacity.stopAnimation();
    rateComponentOpacity.stopAnimation();

    setRatingValue(0);
    setShowForm(false);
    setTitle("");
    setComment("");

    rateTextOpacity.setValue(1);
    formOpacity.setValue(0);
    rateComponentOpacity.setValue(1);
  }, [rateTextOpacity, formOpacity, rateComponentOpacity]);
  
  useEffect(() => {
    if (visible) {
      setTimeout(() => resetState(), 50);
    } else {
      resetState();
    }
  }, [visible, resetState]);

  const animateToForm = () => {
    Animated.parallel([
      Animated.timing(rateTextOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rateComponentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowForm(true);
    });
  };

  const handleRate = (ratingNum: number) => {
    setRatingValue(ratingNum);
    animateToForm();
  };

  const handleSubmit = async () => {
    await onRate(ratingValue, title.trim(), comment.trim());
    resetState();
    onClose();
  };

  const modalHeight = !showForm ? 420 : 410;

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      enableScroll={false}
      height={modalHeight}
    >
      <Box justifyContent="flex-start" gap="xl" paddingTop="sm">
        {!showForm && (
          <Box alignItems="center">
            <Image
              source={images.withoutResult as ImageSourcePropType}
              resizeMode="contain"
            />
          </Box>
        )}

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
                opacity: formOpacity, 
                alignItems: "center",
                position: "absolute",
                width: "100%"
              }}
            >
              <Typography variant="headingPrimary" color="white">
                Tell us more
              </Typography>
            </Animated.View>
            
            <Typography variant="headingPrimary" style={{ opacity: 0 }}>
              Rate your Service
            </Typography>
          </Box>

          <Box position="relative" alignItems="center" width="100%">
            <Animated.View 
              style={{ 
                opacity: rateComponentOpacity, 
                alignItems: "center",
                position: "absolute",
                width: "100%",
                top: 0
              }}
            >
              <Rate
                size={26}
                defaultRating={0}
                showLabel={false}
                onChange={handleRate}
              />
            </Animated.View>

            {showForm && (
              <Animated.View
                style={{
                  opacity: formOpacity,
                  width: "100%",
                }}
              >
                <Box gap="md" width="100%">
                  <Input
                    label="Title"
                    placeholder="Enter a title for your review"
                    value={title}
                    onChangeValue={setTitle}
                    editable={!isLoading}
                  />

                  <Input
                    label="Comment"
                    placeholder="Share your experience..."
                    value={comment}
                    onChangeValue={setComment}
                    variant="textarea"
                    numberOfLines={4}
                    maxLength={500}
                    editable={!isLoading}
                  />
                  <Box width="100%" marginTop="md">
                    <Button
                      variant="secondary"
                      label={isLoading ? "Sending..." : "Rate Service"}
                      onPress={handleSubmit}
                      disabled={isLoading}
                    />
                  </Box>
                </Box>
              </Animated.View>
            )}
            
            {!showForm && (
              <Box style={{ opacity: 0, width: "100%" }}>
                <Rate size={26} defaultRating={0} showLabel={false} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </BottomModal>
  );
};