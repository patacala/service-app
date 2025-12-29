import React, { useState } from 'react';
import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Box } from '../../layout/Box';
import { Typography } from '../../foundation/Typography';
import images from "@/assets/images/images";
import { RateProps } from './types';
import { theme } from '@/design-system/theme';

export const Rate: React.FC<RateProps> = ({
  maxRating = 5,
  defaultRating = 0,
  size = 30,
  showLabel = true,
  onChange,
  disabled = false,
}) => {
  const [rating, setRating] = useState(defaultRating);
  const stars = Array.from({ length: maxRating }, (_, index) => index + 1);

  const handleRating = (value: number) => {
    if (disabled) return;
  
    const newRating = value === rating ? 0 : value;
    setRating(newRating);
    if (onChange) onChange(newRating);
  };
  const getRatingLabel = () => {
    if (rating === 0) return 'Rate';
    if (rating === 1) return 'Poor';
    if (rating === 2) return 'Fair';
    if (rating === 3) return 'Good';
    if (rating === 4) return 'Very Good';
    if (rating === 5) return 'Excellent';
    return '';
  };

  return (
    <Box  width="100%" alignItems="center" gap="md">
        <Box flexDirection="row" justifyContent="center" alignItems="center" gap="md">
          {stars.map((star) => {
            const icon = star <= rating ? images.starFilled : images.starOutline;

            return (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                disabled={disabled}
              >
                <Image
                  source={icon as ImageSourcePropType}
                  style={{
                    width: size,
                    height: size,
                    resizeMode: 'contain',
                    opacity: disabled ? 0.5 : 1,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </Box>

        {showLabel && (
          <Typography
            variant="bodyMedium"
            color={theme.colors.colorGrey100}
            style={{ marginLeft: 16 }}
          >
            {getRatingLabel()}
          </Typography>
        )}
    </Box>
  );
};
